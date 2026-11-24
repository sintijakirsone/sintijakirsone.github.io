/* =========================================================
   ICE — frost flowers drawn in code, freeze / melt
   animations. No image files needed.
   Look: big see-through frost bursts of fine needles.
   Grey background: white frost. White background: white frost
   on a pale grey frosted glass ("daylight window").
   ========================================================= */
(function () {
  "use strict";

  /* ---------- small seeded random ---------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s += 0x6D2B79F5;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function between(r, a, b) { return a + r() * (b - a); }

  /* ---------- animation styles (kept here, so style.css stays untouched) ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".frost.flower { transform-origin: 50% 50%; }" +
    ".frost.flower canvas { display: block; width: 100%; height: 100%; }" +
    ".frost.bloom { animation: frost-bloom var(--dur, 2s) cubic-bezier(.2,.7,.25,1) var(--delay, 0s) both; }" +
    "@keyframes frost-bloom { 0% { transform: var(--base) scale(0.08); opacity: 0; } 35% { opacity: 1; } 100% { transform: var(--base) scale(1); opacity: 1; } }" +
    ".frost.crust { transform: none !important; left: 0; top: 0; width: 100%; height: 100%; }" +
    ".frost.crust canvas { display: block; width: 100%; height: 100%; }" +
    ".frost.crust.rise { animation: frost-rise var(--dur, 3s) cubic-bezier(.3,.6,.3,1) var(--delay, 0s) both; }" +
    "@keyframes frost-rise { 0% { clip-path: inset(100% 0 0 0); } 100% { clip-path: inset(0 0 0 0); } }" +
    ".frost.crust.fadein { animation: frost-fadein var(--dur, 2s) ease var(--delay, 0s) both; }" +
    "@keyframes frost-fadein { 0% { opacity: 0; } 100% { opacity: 1; } }" +
    ".frost.crust.melt { transition: opacity 1.4s ease !important; opacity: 0 !important; filter: none !important; }" +
    "@media (prefers-reduced-motion: reduce) { .frost.bloom, .frost.crust.rise, .frost.crust.fadein { animation: none; } }";
  document.head.appendChild(css);

  /* =========================================================
     COLOURS
     ink:   colour of the needles      glow: soft light / shadow around them
     boost: makes needles stronger     tint: frosted glass colour (null = none)
     ========================================================= */
  var PALETTES = {
    grey:  { ink: "rgba(238,242,246,", glow: "rgba(205,215,225,0.8)", boost: 1,    frost: "rgba(238,242,246,", tint: null },
    white: { ink: "rgba(255,255,255,", glow: "rgba(88,94,102,0.75)",  boost: 1.25, frost: "rgba(255,255,255,", tint: "rgba(172,177,184," }
  };
  function pal(bg) { return PALETTES[bg === "white" ? "white" : "grey"]; }
  function currentBg() { return document.documentElement.getAttribute("data-bg") || "grey"; }

  function line(c, P, x1, y1, x2, y2, w, a) {
    c.strokeStyle = P.ink + Math.min(1, a * P.boost).toFixed(3) + ")";
    c.lineWidth = w;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }

  /* =========================================================
     FROST FLOWER — fine needles from one centre, in petals of
     different lengths and brightness, with fluffy tips and a glow.
     Returns a square canvas, R = radius in canvas pixels.
     ========================================================= */
  function drawFlower(R, P, seed, density) {
    var S = Math.ceil(R * 2.3);
    var cv = document.createElement("canvas"); cv.width = cv.height = S;
    var c = cv.getContext("2d"); c.lineCap = "round";
    var r = rng(seed), cx = S / 2, cy = S / 2;
    var petals = [], a = 0;
    while (a < 6.283) {
      var pw = between(r, 0.12, 0.42);
      petals.push({ from: a, to: Math.min(6.283, a + pw), len: between(r, 0.55, 1), glow: between(r, 0.45, 1) });
      a += pw;
    }
    var count = Math.round(6.283 * R * 0.6 * (density || 1));
    for (var i = 0; i < count; i++) {
      var ang = r() * 6.283, pet = petals[0];
      for (var k = 0; k < petals.length; k++) if (ang >= petals[k].from && ang <= petals[k].to) { pet = petals[k]; break; }
      var mid = (ang - pet.from) / Math.max(0.001, pet.to - pet.from);
      var L = R * pet.len * (0.82 + 0.18 * Math.sin(mid * Math.PI)) * between(r, 0.72, 1.04);
      var r0 = R * Math.pow(r(), 1.6) * 0.32, ca = Math.cos(ang), sa = Math.sin(ang), pa = pet.glow;
      var xm = cx + ca * L * 0.55, ym = cy + sa * L * 0.55;
      line(c, P, cx + ca * r0, cy + sa * r0, xm, ym, between(r, 0.45, 0.85), between(r, 0.14, 0.34) * pa);
      line(c, P, xm, ym, cx + ca * L, cy + sa * L, between(r, 0.35, 0.75), between(r, 0.4, 0.85) * pa);
      if (r() < 0.55) {   // fluffy tips
        var tb = L * between(r, 0.06, 0.14), bx = cx + ca * L * 0.9, by = cy + sa * L * 0.9;
        line(c, P, bx, by, bx + Math.cos(ang + 0.32) * tb, by + Math.sin(ang + 0.32) * tb, 0.45, 0.6);
        line(c, P, bx, by, bx + Math.cos(ang - 0.32) * tb, by + Math.sin(ang - 0.32) * tb, 0.45, 0.6);
      }
    }
    var g = c.createRadialGradient(cx, cy, 0, cx, cy, R * 0.45);
    g.addColorStop(0, P.ink + "0.22)"); g.addColorStop(1, P.ink + "0)");
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 0.45, 0, 6.283); c.fill();
    // glow (light on grey, soft shadow on white)
    var out = document.createElement("canvas"); out.width = out.height = S;
    var o = out.getContext("2d");
    o.shadowColor = P.glow; o.shadowBlur = R / 30 + 4;
    o.drawImage(cv, 0, 0); o.shadowBlur = 0; o.drawImage(cv, 0, 0);
    return out;
  }

  /* =========================================================
     THE GLASS between the flowers: pale frosted glass (white
     background only), soft mist, fine feathery frost and drips.
     full = covers the whole screen (idle freeze, Contact window)
     ========================================================= */
  function paintGlass(c, W, H, bg, seed, full, scale) {
    var P = pal(bg), r = rng(seed), k = scale || 1, top = full ? 0 : H * 0.18;
    c.save(); c.lineCap = "round";
    if (P.tint) {
      var tg = c.createLinearGradient(0, top, 0, H);
      tg.addColorStop(0, P.tint + (full ? "0.5)" : "0)"));
      tg.addColorStop(0.35, P.tint + (full ? "0.65)" : "0.55)"));
      tg.addColorStop(1, P.tint + "0.85)");
      c.fillStyle = tg; c.fillRect(0, 0, W, H);
    }
    var ink = P.frost, strong = bg !== "white" || !!P.tint;
    var g = c.createLinearGradient(0, top, 0, H);
    g.addColorStop(0, ink + (full ? "0.03)" : "0)")); g.addColorStop(1, ink + "0.08)");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // misty patches, lower down
    for (var m = 0; m < 40; m++) {
      var mx = r() * W, my = full ? r() * H : H * 0.5 + r() * H * 0.6, mr = between(r, 90, 220) * k;
      var gg = c.createRadialGradient(mx, my, 0, mx, my, mr);
      gg.addColorStop(0, ink + between(r, 0.04, 0.09).toFixed(3) + ")"); gg.addColorStop(1, ink + "0)");
      c.fillStyle = gg; c.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
    }
    // fine feathery frost crystals, denser towards the bottom
    var n = Math.round(4200 * (W * H) / (1440 * 860 * k * k));
    for (var i = 0; i < n; i++) {
      var px = r() * W, py = top + Math.pow(r(), 0.55) * (H - top) * 1.05;
      if (!full && r() > (py - top) / (H - top) + 0.1) continue;
      var L = between(r, 5, 20) * k, arms = 3 + Math.floor(r() * 4), t0 = r() * 6.28, a0 = strong ? between(r, 0.08, 0.2) : between(r, 0.1, 0.24);
      for (var j = 0; j < arms; j++) {
        var a = t0 + j * 6.28 / arms + between(r, -0.3, 0.3), ll = L * between(r, 0.5, 1);
        var ex = px + Math.cos(a) * ll, ey = py + Math.sin(a) * ll;
        line(c, P, px, py, ex, ey, 0.55 * k, a0);
        for (var q = 1; q < 4; q++) {
          var t = q / 4, bx = px + (ex - px) * t, by = py + (ey - py) * t, bl = ll * 0.25 * (1 - t);
          line(c, P, bx, by, bx + Math.cos(a + 0.7) * bl, by + Math.sin(a + 0.7) * bl, 0.4 * k, a0 * 0.8);
          line(c, P, bx, by, bx + Math.cos(a - 0.7) * bl, by + Math.sin(a - 0.7) * bl, 0.4 * k, a0 * 0.8);
        }
      }
    }
    // drips
    for (var d = 0; d < 60; d++) {
      var dx = r() * W, y0 = between(r, H * 0.45, H * 0.9), len = (H - y0) * between(r, 0.3, 1);
      var lg = c.createLinearGradient(0, y0, 0, y0 + len);
      lg.addColorStop(0, ink + "0)"); lg.addColorStop(0.4, ink + between(r, 0.04, 0.1).toFixed(3) + ")"); lg.addColorStop(1, ink + "0)");
      c.fillStyle = lg; c.fillRect(dx, y0, between(r, 1, 3) * k, len);
    }
    c.restore();
  }

  /* =========================================================
     WHERE THE FLOWERS GO — 9 big ones in different sizes, close
     together in the lower part (some partly off-screen), and a
     few small ones. Designed on a 1440 × 860 screen, then scaled.
     ========================================================= */
  var HOME_BIG = [[90,690,270],[380,780,190],[600,560,240],[880,760,280],[1150,590,200],[1400,780,250],[230,430,170],[1330,380,150],[790,350,130]];
  var HOME_SMALL = [[470,400],[1040,420],[20,240],[1210,820]];
  var FULL_BIG = [[110,140,230],[520,90,180],[930,170,260],[1340,110,200],[300,460,250],[760,480,210],[1190,470,270],[60,780,220],[560,800,260],[1000,820,200],[1420,760,240]];
  var FULL_SMALL = [[700,250],[1100,330],[420,640],[1300,600],[210,300]];

  function layout(W, H, seed, full) {
    var r = rng(seed), sx = W / 1440, sy = H / 860;
    var ks = Math.max(0.45, Math.min(sx, sy) * 1.05);     // flower size scale (keeps them big on phones)
    var out = [];
    (full ? FULL_BIG : HOME_BIG).forEach(function (p, i) {
      out.push({ x: (p[0] + between(r, -20, 20)) * sx, y: (p[1] + between(r, -20, 20)) * sy, R: p[2] * between(r, 0.92, 1.08) * ks, seed: seed * 31 + i, density: 1 });
    });
    (full ? FULL_SMALL : HOME_SMALL).forEach(function (p, i) {
      out.push({ x: (p[0] + between(r, -20, 20)) * sx, y: (p[1] + between(r, -20, 20)) * sy, R: between(r, 50, 80) * ks, seed: seed * 31 + 50 + i, density: 1.3 });
    });
    out.sort(function (a, b) { return a.y - b.y; });
    return out;
  }

  /* ---------- one picture with glass + flowers (Contact page window) ---------- */
  function paintScene(c, W, H, opts) {
    opts = opts || {};
    var bg = opts.bg === "white" ? "white" : "grey", P = pal(bg), seed = opts.seed || 7;
    var k = opts.scale || 1;
    paintGlass(c, W, H, bg, seed, true, k);
    var r = rng(seed + 9);
    layout(W / k, H / k, seed, true).forEach(function (f) {
      var fl = drawFlower(f.R * k * 0.8, P, f.seed, f.density);
      c.save(); c.translate(f.x * k, f.y * k); c.rotate(r() * 6.28);
      c.drawImage(fl, -fl.width / 2, -fl.height / 2); c.restore();
    });
  }
  function paintWindow(c, W, H, opts) { paintScene(c, W, H, opts); }

  /* =========================================================
     PLACING FROST ON THE PAGE
     ========================================================= */
  function spriteScale() { return Math.min(1.5, window.devicePixelRatio || 1); }

  function addFlower(layer, f, rot, delay, dur) {
    var k = spriteScale();
    var el = document.createElement("div");
    el.className = "frost flower";
    var cv = drawFlower(f.R * k, pal(currentBg()), f.seed, f.density);
    el.appendChild(cv);
    var size = cv.width / k;
    el.style.width = size + "px"; el.style.height = size + "px";
    el.style.left = f.x + "px"; el.style.top = f.y + "px";
    el.style.setProperty("--base", "translate(-50%,-50%) rotate(" + rot.toFixed(1) + "deg)");
    el.style.setProperty("--delay", delay.toFixed(2) + "s");
    el.style.setProperty("--dur", dur.toFixed(2) + "s");
    el.__flower = f;
    layer.appendChild(el);
    el.classList.add("bloom");
    return el;
  }

  function addGlass(layer, W, H, seed, full, anim, delay, dur) {
    var el = document.createElement("div");
    el.className = "frost crust";
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var c = document.createElement("canvas");
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    el.appendChild(c);
    el.__paint = function () {
      var ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      paintGlass(ctx, W, H, currentBg(), seed, full, 1);
    };
    el.__paint();
    el.style.setProperty("--delay", (delay || 0) + "s");
    el.style.setProperty("--dur", (dur || 3) + "s");
    layer.insertBefore(el, layer.firstChild);
    el.classList.add(anim || "rise");
    return el;
  }

  /* ---------- home page: big frost flowers grow from the bottom up ---------- */
  function freezeBottom(layer) {
    clear(layer);
    var W = window.innerWidth, H = window.innerHeight;
    var seed = Date.now() & 0xffff, r = rng(seed + 3);
    addGlass(layer, W, H, seed, false, "fadein", 0, 2.6);   // background frost softly fades in
    layout(W, H, seed, false).forEach(function (f) {
      var fromBottom = 1 - Math.max(0, Math.min(1, f.y / H));
      addFlower(layer, f, between(r, 0, 360), 0.3 + fromBottom * 2 + between(r, 0, 0.3), between(r, 1.6, 2.4));
    });
  }

  // Gentle drifting (home page, after a while)
  function drift(layer) {
    var r = rng(4242);
    layer.querySelectorAll(".frost").forEach(function (el) {
      if (el.classList.contains("crust")) return;
      el.classList.remove("grow", "bloom");
      el.style.setProperty("--sway", between(r, 9, 15).toFixed(1) + "s");
      el.style.setProperty("--dx1", between(r, -8, 8).toFixed(0) + "px");
      el.style.setProperty("--dy1", between(r, -6, 2).toFixed(0) + "px");
      el.style.setProperty("--dx2", between(r, -8, 8).toFixed(0) + "px");
      el.style.setProperty("--dy2", between(r, -4, 4).toFixed(0) + "px");
      el.style.setProperty("--r1", between(r, -5, 5).toFixed(1) + "deg");
      el.style.setProperty("--r2", between(r, -5, 5).toFixed(1) + "deg");
      el.style.animationDelay = (-between(r, 0, 6)).toFixed(1) + "s";
      el.classList.add("drift");
    });
  }

  function freezeTransform(el) {
    // stop animations but keep the current look
    var base = el.style.getPropertyValue("--base");
    el.classList.remove("grow", "drift", "bloom", "rise", "fadein");
    el.style.animation = "none";
    el.style.clipPath = "inset(0 0 0 0)";
    el.style.opacity = "1";
    if (!el.classList.contains("crust")) el.style.transform = base + " scale(1)";
    void el.offsetWidth;
  }

  // Ice moves to the right corner, then melts away. Calls done() when gone.
  function toCornerAndMelt(layer, done) {
    var W = window.innerWidth, H = window.innerHeight;
    var r = rng(99);
    var items = Array.prototype.slice.call(layer.querySelectorAll(".frost"));
    var moving = [];
    items.forEach(function (el) {
      freezeTransform(el);
      if (el.classList.contains("crust")) { el.classList.add("melt"); return; }  // the glass just thaws
      moving.push(el);
      el.classList.add("to-corner");
      el.style.left = (W * between(r, 0.72, 1.02)) + "px";
      el.style.top = (H * between(r, 0.45, 0.85)) + "px";
      el.style.transform = el.style.getPropertyValue("--base") + " scale(" + between(r, 0.3, 0.5).toFixed(2) + ")";
    });
    setTimeout(function () {
      moving.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add("melt");
          el.style.transform = el.style.getPropertyValue("--base") + " translateY(40px) scale(0.2)";
        }, i * 40);
      });
    }, 1150);
    setTimeout(function () { clear(layer); if (done) done(); }, 1150 + moving.length * 40 + 1900);
  }

  function clear(layer) { while (layer.firstChild) layer.removeChild(layer.firstChild); }

  /* ---------- whole screen freezes over (after 15 s without movement) ---------- */
  function freezeFull(layer) {
    clear(layer);
    layer.classList.remove("is-melting");
    var W = window.innerWidth, H = window.innerHeight;
    var seed = Date.now() & 0xffff, r = rng(seed + 3);
    addGlass(layer, W, H, seed, true, "fadein", 0, 2.2);
    layout(W, H, seed, true).forEach(function (f) {
      // frost creeps in from the edges of the screen towards the middle
      var fromEdge = Math.min(f.x, W - f.x, f.y, H - f.y) / (Math.min(W, H) / 2);
      addFlower(layer, f, between(r, 0, 360), 0.3 + Math.max(0, fromEdge) * 1.8 + between(r, 0, 0.3), between(r, 1.5, 2.2));
    });
    requestAnimationFrame(function () { layer.classList.add("is-frozen"); });
  }

  function meltFull(layer) {
    if (!layer.classList.contains("is-frozen")) return;
    layer.classList.remove("is-frozen");
    layer.classList.add("is-melting");
    layer.querySelectorAll(".frost").forEach(function (el) {
      freezeTransform(el);
      el.classList.add("melt");
      if (!el.classList.contains("crust")) el.style.transform = el.style.getPropertyValue("--base") + " translateY(30px) scale(0.92)";
    });
    setTimeout(function () {
      if (!layer.classList.contains("is-frozen")) { clear(layer); layer.classList.remove("is-melting"); }
    }, 1900);
  }

  // repaint the ice in the other colours when the background changes
  function retheme() {
    var P = pal(currentBg()), k = spriteScale();
    document.querySelectorAll(".frost").forEach(function (el) {
      if (el.classList.contains("crust")) { if (el.__paint) el.__paint(); return; }
      if (el.__flower) {
        var cv = drawFlower(el.__flower.R * k, P, el.__flower.seed, el.__flower.density);
        el.replaceChild(cv, el.firstChild);
      }
    });
  }

  // kept so the Contact page code keeps working
  function sprites() { return { ferns: [], stars: [], lightIdx: [], darkIdx: [] }; }
  function paintCrust(c, W, H, opts) { opts = opts || {}; paintGlass(c, W, H, opts.bg, opts.seed || 7, true, opts.scale || 1); }


  window.Ice = {
    sprites: sprites,
    paintCrust: paintCrust,
    paintWindow: paintWindow,
    freezeBottom: freezeBottom,
    drift: drift,
    toCornerAndMelt: toCornerAndMelt,
    freezeFull: freezeFull,
    meltFull: meltFull,
    clear: clear,
    retheme: retheme
  };
})();
