/* =========================================================
   ICE — frost flowers drawn in code, freeze / melt
   animations, and synthesized freezing sounds.
   No image or sound files needed.
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

  /* ---------- palettes per background ---------- */
  var PALETTES = {
    grey: [
      { core: "rgba(238,245,252,", glow: "rgba(160,200,238,0.9)" },
      { core: "rgba(230,240,250,", glow: "rgba(150,190,235,0.85)" },
      { core: "rgba(150,188,240,", glow: "rgba(70,120,210,0.95)" }   // blue crystals
    ],
    white: [
      { core: "rgba(255,255,255,", glow: "rgba(95,120,145,0.8)" },
      { core: "rgba(250,252,255,", glow: "rgba(120,145,170,0.75)" },
      { core: "rgba(205,225,248,", glow: "rgba(70,105,160,0.8)" }
    ]
  };

  /* ---------- drawing ---------- */
  function strokeBranch(ctx, r, x, y, ang, len, width, depth, alpha) {
    var steps = Math.max(5, Math.round(len / 7));
    var stepLen = len / steps;
    var bend = between(r, -0.012, 0.012);
    var spawnEvery = depth >= 2 ? 4 : 3;
    var side = r() < 0.5 ? 1 : -1;
    for (var i = 0; i < steps; i++) {
      var t = i / steps;
      var nx = x + Math.cos(ang) * stepLen;
      var ny = y + Math.sin(ang) * stepLen;
      ctx.lineWidth = Math.max(0.45, width * (1 - t * 0.75));
      ctx.strokeStyle = ctx.__core + (alpha * (1 - t * 0.35)).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke();

      if (depth > 0 && i > 1 && i % spawnEvery === 0) {
        var subLen = len * (0.42 * (1 - t) + 0.05) * between(r, 0.7, 1.1);
        var spread = between(r, 0.85, 1.12);
        var both = depth >= 2 || r() < 0.85;
        strokeBranch(ctx, r, nx, ny, ang + side * spread, subLen, width * 0.62, depth - 1, alpha * 0.92);
        if (both) strokeBranch(ctx, r, nx, ny, ang - side * spread, subLen * between(r, 0.75, 1.05), width * 0.62, depth - 1, alpha * 0.92);
        side = -side;
      } else if (depth === 0 && i % 2 === 0 && t < 0.8) {
        // fine feathery barbs
        var bl = (1 - t) * between(r, 3, 7);
        ctx.lineWidth = 0.45;
        ctx.strokeStyle = ctx.__core + (alpha * 0.7).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(nx, ny); ctx.lineTo(nx + Math.cos(ang + 0.9) * bl, ny + Math.sin(ang + 0.9) * bl);
        ctx.moveTo(nx, ny); ctx.lineTo(nx + Math.cos(ang - 0.9) * bl, ny + Math.sin(ang - 0.9) * bl);
        ctx.stroke();
      }
      x = nx; y = ny; ang += bend;
    }
  }

  function finish(lines, W, H, glow) {
    var out = document.createElement("canvas");
    out.width = W; out.height = H;
    var o = out.getContext("2d");
    o.shadowColor = glow;
    o.shadowBlur = 7;
    o.drawImage(lines, 0, 0);
    o.shadowBlur = 0;
    o.drawImage(lines, 0, 0);
    return out.toDataURL("image/png");
  }

  // fern-like frost growing up from the bottom edge
  function makeFern(seed, pal) {
    var W = 440, H = 600, r = rng(seed);
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var ctx = c.getContext("2d");
    ctx.lineCap = "round";
    ctx.__core = pal.core;
    var stems = 2 + Math.floor(r() * 3);
    for (var s = 0; s < stems; s++) {
      var a = -Math.PI / 2 + between(r, -0.95, 0.95);
      var off = Math.abs(a + Math.PI / 2);
      var len = H * between(r, 0.5, 0.92) * (1 - off * 0.32);
      strokeBranch(ctx, r, W / 2 + between(r, -40, 40), H - 6, a, len, between(r, 1.8, 2.8), 2, between(r, 0.75, 0.95));
    }
    return finish(c, W, H, pal.glow);
  }

  // six-armed star crystal
  function makeStar(seed, pal) {
    var S = 360, r = rng(seed);
    var c = document.createElement("canvas");
    c.width = S; c.height = S;
    var ctx = c.getContext("2d");
    ctx.lineCap = "round";
    ctx.__core = pal.core;
    var armLen = S * between(r, 0.36, 0.46);
    var armSeed = Math.floor(r() * 1e9);
    var turn = r() * Math.PI;
    for (var k = 0; k < 6; k++) {
      var ar = rng(armSeed); // same arm 6 times = symmetric crystal
      strokeBranch(ctx, ar, S / 2, S / 2, turn + k * Math.PI / 3, armLen, 2.2, 2, 0.95);
    }
    return finish(c, S, S, pal.glow);
  }

  var cache = {};
  function sprites(bg) {
    bg = bg === "white" ? "white" : "grey";
    if (cache[bg]) return cache[bg];
    var pals = PALETTES[bg];
    var set = { ferns: [], stars: [] };
    for (var i = 0; i < 7; i++) set.ferns.push(makeFern(101 + i * 17, pals[i % 2]));
    for (var j = 0; j < 4; j++) set.stars.push(makeStar(707 + j * 31, pals[j % 2 === 0 ? 2 : 0]));
    cache[bg] = set;
    return set;
  }

  /* ---------- placing frost elements ---------- */
  function currentBg() { return document.documentElement.getAttribute("data-bg") || "grey"; }

  function addFrost(layer, opts) {
    var set = sprites(currentBg());
    var list = opts.kind === "star" ? set.stars : set.ferns;
    var idx = opts.idx % list.length;
    var el = document.createElement("div");
    el.className = "frost";
    el.dataset.kind = opts.kind;
    el.dataset.idx = idx;
    var img = document.createElement("img");
    img.alt = "";
    img.src = list[idx];
    el.appendChild(img);
    var aspect = opts.kind === "star" ? 1 : 600 / 440;
    el.style.width = opts.w + "px";
    el.style.left = opts.x + "px";
    el.style.top = (opts.y - opts.w * aspect) + "px";  // y = where the base sits
    el.style.setProperty("--base", "translateX(-50%) rotate(" + (opts.rot || 0) + "deg)");
    el.style.setProperty("--dur", (opts.dur || 2.6) + "s");
    el.style.setProperty("--delay", (opts.delay || 0) + "s");
    if (opts.origin) el.style.transformOrigin = opts.origin;
    layer.appendChild(el);
    el.classList.add("grow");
    return el;
  }

  // Bottom half freezes over (home page)
  function freezeBottom(layer) {
    clear(layer);
    var W = window.innerWidth, H = window.innerHeight;
    var r = rng(Date.now() & 0xffff);
    var mobile = W < 760;
    var n = Math.ceil(W / (mobile ? 80 : 120)) + 2;
    for (var i = 0; i < n; i++) {
      var x = (i / (n - 1)) * W + between(r, -30, 30);
      var w = between(r, 0.32, 0.5) * H * (mobile ? 0.62 : 0.78);
      addFrost(layer, {
        kind: "fern", idx: i, x: x, y: H + w * 0.06, w: w,
        rot: between(r, -14, 14), delay: between(r, 0, 1.4), dur: between(r, 2.2, 3.4)
      });
    }
    // a second, taller row behind for density
    for (var j = 0; j < Math.ceil(n * 0.4); j++) {
      var x2 = between(r, 0, W);
      var w2 = between(r, 0.42, 0.62) * H * (mobile ? 0.6 : 0.75);
      addFrost(layer, {
        kind: "fern", idx: j + 3, x: x2, y: H + w2 * 0.05, w: w2,
        rot: between(r, -22, 22), delay: between(r, 0.4, 1.9), dur: between(r, 2.6, 3.8)
      });
    }
    for (var k = 0; k < (mobile ? 2 : 4); k++) {
      var sw = between(r, 0.14, 0.24) * H;
      addFrost(layer, {
        kind: "star", idx: k, x: between(r, 0.1, 0.95) * W, y: between(r, 0.72, 0.95) * H + sw / 2, w: sw,
        rot: between(r, 0, 60), delay: between(r, 1.0, 2.2), dur: 2.2, origin: "50% 50%"
      });
    }
    sound.crackle(3.2);
  }

  // Gentle drifting (home page, after a while)
  function drift(layer) {
    var r = rng(4242);
    layer.querySelectorAll(".frost").forEach(function (el) {
      el.classList.remove("grow");
      el.style.setProperty("--sway", between(r, 7, 13).toFixed(1) + "s");
      el.style.setProperty("--dx1", between(r, -18, 18).toFixed(0) + "px");
      el.style.setProperty("--dy1", between(r, -12, 4).toFixed(0) + "px");
      el.style.setProperty("--dx2", between(r, -18, 18).toFixed(0) + "px");
      el.style.setProperty("--dy2", between(r, -8, 6).toFixed(0) + "px");
      el.style.setProperty("--r1", between(r, -4, 4).toFixed(1) + "deg");
      el.style.setProperty("--r2", between(r, -4, 4).toFixed(1) + "deg");
      el.style.animationDelay = (-between(r, 0, 6)).toFixed(1) + "s";
      el.classList.add("drift");
    });
  }

  function freezeTransform(el) {
    // stop animations but keep the current look
    var base = el.style.getPropertyValue("--base");
    el.classList.remove("grow", "drift");
    el.style.animation = "none";
    el.style.clipPath = "inset(0 0 0 0)";
    el.style.opacity = "1";
    el.style.transform = base + " scale(1)";
    void el.offsetWidth;
  }

  // Ice moves to the right corner, then melts away. Calls done() when gone.
  function toCornerAndMelt(layer, done) {
    var W = window.innerWidth, H = window.innerHeight;
    var r = rng(99);
    var items = Array.prototype.slice.call(layer.querySelectorAll(".frost"));
    items.forEach(function (el) {
      freezeTransform(el);
      el.classList.add("to-corner");
      el.style.left = (W * between(r, 0.7, 1.02)) + "px";
      el.style.top = (H * between(r, 0.38, 0.78)) + "px";
      el.style.transform = el.style.getPropertyValue("--base") + " scale(" + between(r, 0.38, 0.62).toFixed(2) + ")";
    });
    setTimeout(function () {
      sound.melt();
      items.forEach(function (el, i) {
        setTimeout(function () {
          el.classList.add("melt");
          el.style.transform = el.style.getPropertyValue("--base") + " translateY(40px) scale(0.35)";
        }, i * 25);
      });
    }, 1150);
    setTimeout(function () { clear(layer); if (done) done(); }, 1150 + items.length * 25 + 1900);
  }

  function clear(layer) { while (layer.firstChild) layer.removeChild(layer.firstChild); }

  // Whole screen freezes over (idle)
  function freezeFull(layer) {
    clear(layer);
    layer.classList.remove("is-melting");
    var glass = document.createElement("div");
    glass.className = "glass";
    layer.appendChild(glass);
    var W = window.innerWidth, H = window.innerHeight;
    var r = rng(Date.now() & 0xffff);
    var size = Math.max(W, H);
    var unit = Math.max(150, size / 7);
    var idx = 0;
    // from each edge inward
    var edges = [
      { n: Math.ceil(W / unit) + 1, pos: function (t) { return [t * W, H]; }, rot: 0 },
      { n: Math.ceil(W / unit) + 1, pos: function (t) { return [t * W, 0]; }, rot: 180 },
      { n: Math.ceil(H / unit) + 1, pos: function (t) { return [0, t * H]; }, rot: 90 },
      { n: Math.ceil(H / unit) + 1, pos: function (t) { return [W, t * H]; }, rot: -90 }
    ];
    edges.forEach(function (e) {
      for (var i = 0; i < e.n; i++) {
        var p = e.pos(i / (e.n - 1) + between(r, -0.04, 0.04));
        var w = unit * between(r, 1.3, 2.1);
        var aspect = 600 / 440;
        var el = addFrost(layer, {
          kind: "fern", idx: idx++, x: p[0], y: p[1], w: w,
          rot: e.rot + between(r, -25, 25), delay: between(r, 0, 0.9), dur: between(r, 2.4, 3.4)
        });
        // anchor the base on the edge point
        el.style.top = (p[1] - w * aspect) + "px";
      }
    });
    // fill the middle
    var mid = Math.ceil((W * H) / (unit * unit * 2.6));
    for (var m = 0; m < mid; m++) {
      var mx = between(r, 0.1, 0.9) * W, my = between(r, 0.15, 0.95) * H;
      var dist = Math.min(mx, W - mx, my, H - my) / (size / 2);
      addFrost(layer, {
        kind: r() < 0.22 ? "star" : "fern", idx: idx++, x: mx, y: my, w: unit * between(r, 1.0, 1.7),
        rot: between(r, -180, 180), delay: 0.6 + dist * 2.2 + between(r, 0, 0.6), dur: between(r, 2.4, 3.2),
        origin: "50% 100%"
      });
    }
    requestAnimationFrame(function () { layer.classList.add("is-frozen"); });
    sound.crackle(4);
  }

  function meltFull(layer) {
    if (!layer.classList.contains("is-frozen")) return;
    layer.classList.remove("is-frozen");
    layer.classList.add("is-melting");
    sound.melt();
    layer.querySelectorAll(".frost").forEach(function (el) {
      freezeTransform(el);
      el.classList.add("melt");
      el.style.transform = el.style.getPropertyValue("--base") + " translateY(30px) scale(0.92)";
    });
    setTimeout(function () {
      if (!layer.classList.contains("is-frozen")) { clear(layer); layer.classList.remove("is-melting"); }
    }, 1900);
  }

  // swap ice images when the background changes
  function retheme() {
    var set = sprites(currentBg());
    document.querySelectorAll(".frost").forEach(function (el) {
      var list = el.dataset.kind === "star" ? set.stars : set.ferns;
      el.firstChild.src = list[+el.dataset.idx % list.length];
    });
  }

  /* =========================================================
     SOUND — synthesized ice crackle and melting drips
     ========================================================= */
  var sound = (function () {
    var ctx = null, noise = null, enabled = false;
    function ensure() {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        var len = ctx.sampleRate * 2;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        var d = noise.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }
    function grain(at, dur, freq, q, gain, type) {
      var src = ctx.createBufferSource();
      src.buffer = noise;
      var f = ctx.createBiquadFilter();
      f.type = type || "bandpass"; f.frequency.value = freq; f.Q.value = q;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(gain, at + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      src.connect(f); f.connect(g); g.connect(ctx.destination);
      src.start(at, Math.random() * 1.5, dur + 0.02);
    }
    function crackle(duration) {
      if (!enabled || !ensure()) return;
      var now = ctx.currentTime + 0.05;
      var n = Math.round(duration * 45);
      for (var i = 0; i < n; i++) {
        var t = now + duration * Math.pow(Math.random(), 1.5);
        grain(t, 0.004 + Math.random() * 0.025, 2500 + Math.random() * 7000, 1 + Math.random() * 6, 0.04 + Math.random() * 0.22);
        if (Math.random() < 0.08) grain(t, 0.05 + Math.random() * 0.06, 500 + Math.random() * 900, 3, 0.18);
      }
      // faint frosty hiss
      var src = ctx.createBufferSource(); src.buffer = noise; src.loop = true;
      var hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6500;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.025, now + duration * 0.3);
      g.gain.linearRampToValueAtTime(0.0001, now + duration);
      src.connect(hp); hp.connect(g); g.connect(ctx.destination);
      src.start(now); src.stop(now + duration + 0.1);
    }
    function melt() {
      if (!enabled || !ensure()) return;
      var now = ctx.currentTime + 0.05;
      for (var i = 0; i < 7; i++) {
        var t = now + Math.random() * 1.6;
        var o = ctx.createOscillator(); o.type = "sine";
        var f0 = 900 + Math.random() * 900;
        o.frequency.setValueAtTime(f0, t);
        o.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.12);
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.25);
      }
    }
    return {
      crackle: crackle,
      melt: melt,
      setEnabled: function (on) { enabled = !!on; if (on) ensure(); },
      isEnabled: function () { return enabled; }
    };
  })();

  window.Ice = {
    sprites: sprites,
    freezeBottom: freezeBottom,
    drift: drift,
    toCornerAndMelt: toCornerAndMelt,
    freezeFull: freezeFull,
    meltFull: meltFull,
    clear: clear,
    retheme: retheme,
    sound: sound
  };
})();
