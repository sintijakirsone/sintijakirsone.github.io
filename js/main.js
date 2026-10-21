/* =========================================================
   MAIN PAGE — home (ice), works pile, ALL list, about, contact
   ========================================================= */
(function () {
  "use strict";

  var HOVER_DELAY = 500;   // ms of hovering a title before the work moves to the center
  var DRIFT_AFTER = 10000;  // ms on the home page before the ice starts drifting

  var $ = function (s) { return document.querySelector(s); };
  var iceLayer, panel, pile, viewAll, viewAbout, viewContact;
  var route = null;
  var activeTech = null;
  var pileItems = {};       // id -> { el, img, x, y, w, rot, z }
  var centeredId = null;
  var hoverTimer = null;
  var driftTimer = null;
  var iceState = "none";    // none | frozen | melting

  function worksByYear() {
    var years = {};
    window.WORKS.forEach(function (w) { (years[w.year] = years[w.year] || []).push(w); });
    return Object.keys(years).sort(function (a, b) { return b - a; }).map(function (y) {
      return { year: y, works: years[y] };
    });
  }
  function techName(id) {
    var t = window.TECHNIQUES.filter(function (x) { return x.id === id; })[0];
    return t ? window.Site.t(t) : id;
  }
  function matches(work) { return !activeTech || work.techniques.indexOf(activeTech) !== -1; }

  /* ---------- works list ---------- */
  function buildPanel() {
    var html = '<div class="tech-bar" role="group" aria-label="Techniques">';
    window.TECHNIQUES.forEach(function (tq, i) {
      if (i) html += '<span class="sep" aria-hidden="true">/</span>';
      html += '<button type="button" data-tech="' + tq.id + '"></button>';
    });
    html += '</div>';
    worksByYear().forEach(function (g) {
      html += '<div class="year-group"><div class="year-label">' + g.year + '</div><ul>';
      g.works.forEach(function (w) {
        html += '<li><a class="work-link" href="work.html#' + w.id + '" data-id="' + w.id + '">' + w.title + '</a></li>';
      });
      html += '</ul></div>';
    });
    html += '<a class="all-link" href="#all" data-ui="all"></a>';
    panel.innerHTML = html;

    panel.querySelectorAll(".tech-bar button").forEach(function (b) {
      b.addEventListener("click", function () {
        activeTech = activeTech === b.dataset.tech ? null : b.dataset.tech;
        if (route !== "works") location.hash = "works"; else applyFilter();
      });
    });
    panel.querySelectorAll(".work-link").forEach(function (a) {
      a.addEventListener("mouseenter", function () {
        if (window.Site.isMobile() || route !== "works") return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { centerWork(a.dataset.id); }, HOVER_DELAY);
      });
      a.addEventListener("mouseleave", function () { clearTimeout(hoverTimer); });
    });
    paintPanelText();
  }

  function paintPanelText() {
    panel.querySelectorAll(".tech-bar button").forEach(function (b) {
      b.textContent = techName(b.dataset.tech);
    });
    var all = panel.querySelector(".all-link");
    all.textContent = window.Site.t(window.UI.all);
  }

  function applyFilter() {
    panel.querySelectorAll(".tech-bar button").forEach(function (b) {
      var on = b.dataset.tech === activeTech;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    window.WORKS.forEach(function (w) {
      var link = panel.querySelector('.work-link[data-id="' + w.id + '"]');
      link.classList.toggle("is-match", !!activeTech && matches(w));
      var item = pileItems[w.id];
      if (item) item.el.classList.toggle("is-hidden", !matches(w) || route !== "works");
    });
    if (centeredId && !matches(byId(centeredId))) returnToPile(centeredId);
    panel.querySelector(".all-link").classList.toggle("is-active", route === "all");
  }

  function byId(id) { return window.WORKS.filter(function (w) { return w.id === id; })[0]; }

  /* ---------- pile ---------- */
  function preload() {
    return Promise.all(window.WORKS.map(function (w) {
      return new Promise(function (res) {
        var img = new Image();
        img.onload = function () { res({ id: w.id, img: img, ar: (img.naturalHeight || 1) / (img.naturalWidth || 1) }); };
        img.onerror = function () { res({ id: w.id, img: img, ar: 1 }); };
        img.alt = w.title;
        img.src = w.cutout;
      });
    }));
  }

  var preloaded = null;
  function pileZone() {
    var W = window.innerWidth, H = window.innerHeight;
    if (window.Site.isMobile()) {
      var top = panel.offsetTop + panel.offsetHeight + 28;
      var h = Math.max(520, W * 1.7);
      pile.style.position = "absolute";
      pile.style.top = top + "px";
      pile.style.height = (h + 90) + "px";
      pile.style.left = "0"; pile.style.right = "0";
      return { x0: W * 0.04, x1: W * 0.96, y0: 0, y1: h, minW: W * 0.26, maxW: W * 0.38 };
    }
    pile.removeAttribute("style");
    var pr = panel.getBoundingClientRect();
    var x0 = Math.max(W * 0.42, pr.right + 30);
    return { x0: x0, x1: W * 0.985, y0: H * 0.2, y1: H * 0.985, minW: W * 0.12, maxW: W * 0.19 };
  }

  function layoutPile(entering) {
    var z = pileZone();
    var placed = [];
    preloaded.forEach(function (p, i) {
      var item = pileItems[p.id];
      var w = z.minW + Math.random() * (z.maxW - z.minW);
      if (p.ar > 1.6) w *= 0.6;           // tall pieces a bit narrower
      if (p.ar < 0.6) w *= 1.25;          // wide pieces a bit wider
      var h = w * p.ar;
      if (h > (z.y1 - z.y0) * 0.6) { h = (z.y1 - z.y0) * 0.6; w = h / p.ar; }
      var best = null, bestScore = -1;
      for (var k = 0; k < 30; k++) {
        var cx = z.x0 + w / 2 + Math.random() * Math.max(1, (z.x1 - z.x0 - w));
        var cy = z.y0 + h / 2 + Math.random() * Math.max(1, (z.y1 - z.y0 - h));
        var score = Infinity;
        placed.forEach(function (q) { score = Math.min(score, Math.hypot(cx - q.cx, cy - q.cy)); });
        if (score > bestScore) { bestScore = score; best = { cx: cx, cy: cy }; }
      }
      placed.push(best);
      item.x = best.cx - w / 2;
      item.y = best.cy - h / 2;
      item.w = w;
      item.rot = (Math.random() * 14 - 7).toFixed(1);
      item.z = 1 + Math.floor(Math.random() * 20);
      if (centeredId !== p.id) placeItem(item, entering ? i : -1);
    });
    if (centeredId) centerWork(centeredId, true);
  }

  function placeItem(item, enterIndex) {
    var el = item.el;
    el.classList.remove("is-center");
    el.style.zIndex = item.z;
    el.style.width = item.w + "px";
    el.style.left = item.x + "px";
    el.style.top = item.y + "px";
    el.style.transform = "rotate(" + item.rot + "deg)";
    if (enterIndex >= 0) {
      // drop in from slightly below, one after another
      el.style.transition = "none";
      el.style.transform = "translateY(60px) rotate(" + item.rot + "deg) scale(0.9)";
      el.classList.remove("is-in");
      void el.offsetWidth;
      el.style.transition = "";
      setTimeout(function () {
        el.style.transform = "rotate(" + item.rot + "deg)";
        el.classList.add("is-in");
      }, enterIndex * 90);
    } else {
      el.classList.add("is-in");
    }
  }

  function buildPile(delay) {
    pile.innerHTML = "";
    pileItems = {};
    centeredId = null;
    preloaded.forEach(function (p) {
      var w = byId(p.id);
      var el = document.createElement("a");
      el.className = "pile-item";
      el.href = "work.html#" + p.id;
      el.setAttribute("aria-label", w.title);
      el.appendChild(p.img.cloneNode());
      el.addEventListener("mouseenter", function () { hoverLink(p.id, true); });
      el.addEventListener("mouseleave", function () { hoverLink(p.id, false); });
      pile.appendChild(el);
      pileItems[p.id] = { el: el };
    });
    setTimeout(function () {
      if (route !== "works") return;
      layoutPile(true);
      applyFilter();
    }, delay || 0);
  }

  function hoverLink(id, on) {
    var link = panel.querySelector('.work-link[data-id="' + id + '"]');
    if (link) link.classList.toggle("is-hover", on);
  }

  function centerWork(id, instant) {
    if (!matches(byId(id))) return;
    if (centeredId && centeredId !== id) returnToPile(centeredId);
    var item = pileItems[id];
    if (!item) return;
    centeredId = id;
    var W = window.innerWidth, H = window.innerHeight;
    var p = preloaded.filter(function (x) { return x.id === id; })[0];
    var tw = Math.min(W * 0.34, (H * 0.6) / p.ar);
    var th = tw * p.ar;
    var pr = panel.getBoundingClientRect();
    var cx = Math.max(W * 0.5, pr.right + tw / 2 + 40);
    var cy = H * 0.57;
    var el = item.el;
    el.classList.add("is-center");
    el.style.zIndex = 50;
    el.style.width = tw + "px";
    el.style.left = (cx - tw / 2) + "px";
    el.style.top = (cy - th / 2) + "px";
    el.style.transform = "rotate(0deg)";
  }

  function returnToPile(id) {
    var item = pileItems[id];
    if (!item) return;
    placeItem(item, -1);
    if (centeredId === id) centeredId = null;
  }

  function hidePile() {
    Object.keys(pileItems).forEach(function (id) { pileItems[id].el.classList.add("is-hidden"); });
  }

  /* ---------- ALL (scroll list) ---------- */
  function buildAll() {
    var html = "";
    worksByYear().forEach(function (g) {
      html += '<h2 class="all-year">' + g.year + '</h2><div class="all-grid">';
      g.works.forEach(function (w) {
        html += '<a class="all-card" href="work.html#' + w.id + '">' +
          '<div class="thumb"><img src="' + w.cutout + '" alt="" loading="lazy"></div>' +
          '<div class="title">' + w.title + '</div>' +
          '<div class="meta">' + w.techniques.map(techName).join(" / ") + '</div></a>';
      });
      html += '</div>';
    });
    viewAll.innerHTML = html;
  }

  /* ---------- About: the escaping portrait ---------- */
  var portrait = { el: null, rest: null, mx: -9999, my: -9999, ox: 0, oy: 0, s: 1, raf: 0 };
  function measurePortrait() {
    var el = portrait.el;
    var prev = el.style.transform;
    el.style.transform = "none";
    var b = el.getBoundingClientRect();
    // when the photo is limited by screen height, it is narrower than its box: measure the visible picture
    var img = el.querySelector("img");
    var w = b.width;
    if (img && img.naturalWidth && img.naturalHeight) {
      w = Math.min(b.width, b.height * img.naturalWidth / img.naturalHeight);
    }
    var left = b.left + (b.width - w) / 2;
    portrait.rest = { left: left, right: left + w, top: b.top, bottom: b.bottom, width: w, height: b.height };
    el.style.transform = prev;
  }
  function portraitLoop() {
    var P = portrait, r = P.rest;
    if (!r || route !== "about" || window.Site.isMobile()) { P.raf = 0; return; }
    var ESCAPE_ZONE = 180;   // px: how close the mouse must come before the photo runs away
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var dx = cx - P.mx, dy = cy - P.my;
    var d = Math.hypot(dx, dy) || 1;
    // distance from the mouse to the photo's edge (0 when the mouse is on the photo)
    var ex = Math.max(r.left - P.mx, 0, P.mx - r.right);
    var ey = Math.max(r.top - P.my, 0, P.my - r.bottom);
    var edge = Math.hypot(ex, ey);
    var tx = 0, ty = 0, ts = 1;
    if (edge < ESCAPE_ZONE) {
      var push = 1 - edge / ESCAPE_ZONE;       // 0 far … 1 on top of it
      ts = 1 - 0.7 * push;
      var dist = push * r.width * 0.6;
      tx = (dx / d) * dist;
      ty = (dy / d) * dist * 0.4;
      var W = window.innerWidth, H = window.innerHeight;
      tx = Math.min(W - r.right + r.width * (1 - ts) / 2, Math.max(-r.left + 20, tx));
      ty = Math.min(H - r.bottom, Math.max(-r.top + 110, ty));
    }
    P.ox += (tx - P.ox) * 0.09;
    P.oy += (ty - P.oy) * 0.09;
    P.s += (ts - P.s) * 0.09;
    P.el.style.transform = "translate(" + P.ox.toFixed(1) + "px," + P.oy.toFixed(1) + "px) scale(" + P.s.toFixed(3) + ")";
    P.raf = requestAnimationFrame(portraitLoop);
  }
  function startPortrait() {
    if (window.Site.isMobile()) { portrait.el.style.transform = ""; return; }
    measurePortrait();
    if (!portrait.raf) portrait.raf = requestAnimationFrame(portraitLoop);
  }

  function paintAbout() {
    viewAbout.querySelector(".about-text p").textContent = window.Site.t(window.ABOUT.text);
  }

  /* ---------- routing ---------- */
  function show(view) {
    [viewAll, viewAbout, viewContact].forEach(function (v) { v.classList.toggle("is-visible", v === view); });
  }

  function go() {
    var next = (location.hash || "").replace("#", "");
    if (["works", "all", "about", "contact"].indexOf(next) === -1) next = "";
    var prev = route;
    route = next;
    clearTimeout(driftTimer);
    clearTimeout(hoverTimer);
    window.scrollTo(0, 0);

    if (next === "") {
      window.Site.setActiveNav(null);
      panel.classList.remove("is-open");
      hidePile();
      show(null);
      if (iceState !== "frozen") {
        window.Ice.freezeBottom(iceLayer);
        iceState = "frozen";
      }
      driftTimer = setTimeout(function () {
        if (route === "" && iceState === "frozen") window.Ice.drift(iceLayer);
      }, DRIFT_AFTER);
      return;
    }

    window.Site.setActiveNav(next === "all" ? "works" : next);

    if (next === "works" || next === "all") {
      panel.classList.add("is-open");
      var meltDelay = 0;
      if (iceState === "frozen" && prev === "") {
        iceState = "melting";
        window.Ice.toCornerAndMelt(iceLayer, function () { iceState = "none"; });
        meltDelay = 700;   // the pile appears while the ice moves away
      } else if (iceState !== "none") {
        window.Ice.clear(iceLayer); iceState = "none";
      }
      if (next === "works") {
        show(null);
        var exists = Object.keys(pileItems).length && prev === "all";
        if (exists) { applyFilter(); }
        else buildPile(meltDelay);
      } else {
        hidePile();
        show(viewAll);
        viewAll.classList.toggle("with-list", window.Site.isMobile());
        if (window.Site.isMobile()) viewAll.style.paddingTop = (panel.offsetTop + panel.offsetHeight + 40) + "px";
        else viewAll.style.paddingTop = "";
        applyFilter();
      }
      return;
    }

    // about / contact: just change the page
    if (iceState !== "none") { window.Ice.clear(iceLayer); iceState = "none"; }
    panel.classList.remove("is-open");
    hidePile();
    if (next === "about") { show(viewAbout); paintAbout(); setTimeout(startPortrait, 50); }
    else show(viewContact);
  }

  /* ---------- start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    iceLayer = $("#ice-layer");
    panel = $("#works-panel");
    pile = $("#pile");
    viewAll = $("#view-all");
    viewAbout = $("#view-about");
    viewContact = $("#view-contact");
    portrait.el = $("#portrait");
    portrait.el.querySelector("img").src = window.ABOUT.photo;

    window.Site.buildChrome(null);
    buildPanel();
    buildAll();
    paintAbout();

    // idle freeze everywhere except the very first screen
    window.Site.startIdle(function () { return route !== ""; });

    window.addEventListener("mousemove", function (e) { portrait.mx = e.clientX; portrait.my = e.clientY; }, { passive: true });
    document.addEventListener("mouseleave", function () { portrait.mx = -9999; portrait.my = -9999; });

    document.addEventListener("langchange", function () { paintPanelText(); buildAll(); paintAbout(); });

    var resizeT;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () {
        if (route === "works" && preloaded) { layoutPile(false); applyFilter(); }
        if (route === "about") { portrait.ox = portrait.oy = 0; portrait.s = 1; startPortrait(); }
      }, 250);
    });

    preload().then(function (p) {
      preloaded = p;
      window.addEventListener("hashchange", go);
      go();
    });
  });
})();
