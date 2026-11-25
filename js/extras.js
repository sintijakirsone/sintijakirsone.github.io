/* =========================================================
   EXTRAS — smooth scrolling + "back to top" button
   ---------------------------------------------------------
   Works on its own: add ONE line to index.html and work.html,
   after the other <script> lines:
       <script src="js/extras.js"></script>

   Settings you can change:
   ========================================================= */
var SMOOTH_SCROLL = true;      // false = normal browser scrolling
var SCROLL_SMOOTHNESS = 0.08;  // smaller = softer and slower (try 0.05–0.15)
var SHOW_TOP_BUTTON_AFTER = 400; // px scrolled down before "back to top" appears
/* ========================================================= */

(function () {
  "use strict";

  var LENIS_URL = "https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js";
  var lenis = null;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- styles for the button (kept here so style.css stays untouched) ---------- */
  var css =
    "html.lenis, html.lenis body { height: auto; }" +
    ".lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }" +
    ".lenis.lenis-stopped { overflow: clip; }" +
    ".to-top {" +
    "  position: fixed; z-index: 60;" +
    "  right: calc(max(16px, env(safe-area-inset-right, 0px)) + 2vw);" +
    "  bottom: calc(env(safe-area-inset-bottom, 0px) + 22px);" +
    "  display: inline-flex; align-items: center; gap: 8px;" +
    "  height: 30px; padding: 0 12px;" +
    "  border: 1px solid var(--line); background: var(--panel); color: var(--fg);" +
    "  backdrop-filter: blur(4px);" +
    "  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;" +
    "  cursor: pointer;" +
    "  opacity: 0; transform: translateY(10px); pointer-events: none;" +
    "  transition: opacity 0.4s ease, transform 0.4s ease, color 0.25s ease, border-color 0.25s ease;" +
    "}" +
    ".to-top.is-visible { opacity: 1; transform: none; pointer-events: auto; }" +
    ".to-top:hover { color: var(--accent); border-color: var(--accent); }" +
    ".to-top svg { width: 14px; height: 14px; }" +
    "@media (max-width: 760px) { .to-top .label { display: none; } .to-top { width: 34px; height: 34px; padding: 0; justify-content: center; } }";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- helpers ---------- */
  function scrollToTop(instant) {
    if (lenis) {
      lenis.scrollTo(0, instant ? { immediate: true, force: true } : { duration: 1.2, force: true });
    } else {
      try { window.scrollTo({ top: 0, behavior: instant || reduceMotion ? "auto" : "smooth" }); }
      catch (e) { window.scrollTo(0, 0); }
    }
  }

  function label() {
    var txt = { en: "Back to top", lv: "Uz augšu", zh: "" };
    if (window.UI && window.UI.toTop) txt = window.UI.toTop;
    return window.Site ? window.Site.t(txt) : txt.en;
  }

  /* ---------- smooth scrolling ---------- */
  function startSmooth() {
    if (!SMOOTH_SCROLL || reduceMotion || !window.Lenis) return;
    lenis = new window.Lenis({ lerp: SCROLL_SMOOTHNESS, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // the works list has its own scrolling; leave it alone
    var panel = document.getElementById("works-panel");
    if (panel) panel.setAttribute("data-lenis-prevent", "");

    // switching pages (Works / ALL / About, or the next work) jumps to the top
    window.addEventListener("hashchange", function () { scrollToTop(true); });

    // pause scrolling while a photo is open full screen
    new MutationObserver(function () {
      if (document.querySelector(".lightbox")) lenis.stop(); else lenis.start();
    }).observe(document.body, { childList: true });
  }

  function loadLenis() {
    if (!SMOOTH_SCROLL || reduceMotion) return;
    var s = document.createElement("script");
    s.src = LENIS_URL;
    s.onload = startSmooth;
    s.onerror = function () { /* no internet to the library: normal scrolling still works */ };
    document.head.appendChild(s);
  }

  /* ---------- back to top button (work pages) ---------- */
  function addTopButton() {
    if (!document.getElementById("work-page")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "to-top";
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' +
      '<span class="label"></span>';
    function paint() {
      btn.querySelector(".label").textContent = label();
      btn.setAttribute("aria-label", label());
    }
    paint();
    document.addEventListener("langchange", paint);
    btn.addEventListener("click", function () { scrollToTop(false); });
    document.body.appendChild(btn);

    function update() {
      btn.classList.toggle("is-visible", window.scrollY > SHOW_TOP_BUTTON_AFTER);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", function () { setTimeout(update, 50); });
    update();
  }

  /* =========================================================
     PAGE TRANSITIONS — a frost screen covers the page while a
     work page and its photos load, and when moving between pages.
     ========================================================= */
  var COVER_MIN = 450;      // ms the cover stays at least, so it never just flickers
  var COVER_MAX = 6000;     // ms at most, even if a photo is very slow
  var cover = null, shownAt = 0;

  css = [
    ".page-cover { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center;",
    "  background-color: var(--bg); background-image: var(--texture); background-attachment: fixed;",
    "  opacity: 1; transition: opacity 0.45s ease; }",
    ".page-cover.is-hidden { opacity: 0; pointer-events: none; }",
    ".page-cover canvas { width: 120px; height: 120px; animation: cover-spin 9s linear infinite, cover-breathe 2.4s ease-in-out infinite alternate; }",
    "@keyframes cover-spin { to { rotate: 360deg; } }",
    "@keyframes cover-breathe { from { scale: 0.82; opacity: 0.55; } to { scale: 1; opacity: 1; } }",
    "@media (prefers-reduced-motion: reduce) { .page-cover canvas { animation: none; } .page-cover { transition-duration: 0.01s; } }"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function makeCover(visible) {
    cover = document.createElement("div");
    cover.className = "page-cover" + (visible ? "" : " is-hidden");
    cover.setAttribute("aria-hidden", "true");
    try {
      var bg = document.documentElement.getAttribute("data-bg") || "grey";
      var fl = window.Ice && window.Ice.drawFlower ? window.Ice.drawFlower(100, bg, 11) : null;
      if (fl) cover.appendChild(fl);
    } catch (e) {}
    document.body.appendChild(cover);
    shownAt = Date.now();
  }
  function showCover(instant) {
    if (!cover) makeCover(false);
    if (instant) cover.style.transition = "none";
    void cover.offsetWidth;
    cover.classList.remove("is-hidden");
    void cover.offsetWidth;
    cover.style.transition = "";
    shownAt = Date.now();
  }
  function hideCover() {
    if (!cover) return;
    var wait = Math.max(0, COVER_MIN - (Date.now() - shownAt));
    setTimeout(function () { cover.classList.add("is-hidden"); }, wait);
  }

  // wait until the visible photos on a work page have loaded
  function whenPhotosReady(done) {
    var page = document.getElementById("work-page");
    var finished = false;
    function finish() { if (!finished) { finished = true; done(); } }
    setTimeout(finish, COVER_MAX);
    var imgs = page ? Array.prototype.slice.call(page.querySelectorAll("img")) : [];
    var left = imgs.length;
    if (!left) { finish(); return; }
    imgs.forEach(function (im) {
      if (im.complete) { if (--left === 0) finish(); return; }
      var one = function () { im.removeEventListener("load", one); im.removeEventListener("error", one); if (--left === 0) finish(); };
      im.addEventListener("load", one); im.addEventListener("error", one);
    });
  }

  var isWorkPage = !!document.getElementById("work-page");

  // arriving on a page
  makeCover(true);
  function arrived() {
    if (isWorkPage) whenPhotosReady(hideCover);
    else hideCover();
  }

  // the browser "back" button can show a page from memory, still covered
  window.addEventListener("pageshow", function (e) { if (e.persisted && cover) cover.classList.add("is-hidden"); });

  // on a work page, switching to another work (next work, or from the photo viewer)
  if (isWorkPage) {
    window.addEventListener("hashchange", function () {
      showCover(true);
      setTimeout(function () { whenPhotosReady(hideCover); }, 30);
    });
  }

  // leaving for another page: fade the cover in first, then go
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var url;
    try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return;      // same page: its own animations handle it
    e.preventDefault();
    showCover();
    setTimeout(function () { location.href = url.href; }, 380);
  }, false);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { addTopButton(); loadLenis(); arrived(); });
  } else {
    addTopButton(); loadLenis(); arrived();
  }
})();
