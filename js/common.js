/* =========================================================
   COMMON — header, language, background, sound, idle freeze.
   Used by every page.
   ========================================================= */
(function () {
  "use strict";

  var IDLE_SECONDS = 15;   // freeze after this many seconds without movement

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- language ---------- */
  var lang = store("sk-lang") || "en";
  function t(obj) {
    if (!obj) return "";
    return obj[lang] || obj.en || "";
  }
  function setLang(l) {
    lang = l;
    store("sk-lang", l);
    document.documentElement.lang = l === "zh" ? "zh" : l;
    document.querySelectorAll("[data-ui]").forEach(function (el) {
      el.textContent = t(window.UI[el.getAttribute("data-ui")]);
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.lang === l);
      b.setAttribute("aria-pressed", b.dataset.lang === l);
    });
    document.dispatchEvent(new CustomEvent("langchange"));
  }

  /* ---------- background ---------- */
  function setBg(bg) {
    document.documentElement.setAttribute("data-bg", bg);
    store("sk-bg", bg);
    var b = document.getElementById("bg-toggle");
    if (b) b.setAttribute("aria-pressed", bg === "white");
    if (window.Ice) window.Ice.retheme();
  }
  // apply saved background immediately (before paint)
  document.documentElement.setAttribute("data-bg", store("sk-bg") || "grey");

  /* ---------- icons ---------- */
  var ICON_SOUND_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  var ICON_SOUND_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  var ICON_BG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>';

  /* ---------- build header + corner controls ---------- */
  function buildChrome(active) {
    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<nav class="main-nav" aria-label="Main">' +
        '<a href="index.html#works" data-nav="works" data-ui="works"></a>' +
        '<a href="index.html#about" data-nav="about" data-ui="about"></a>' +
        '<a href="index.html#contact" data-nav="contact" data-ui="contact"></a>' +
      '</nav>' +
      '<a class="site-name" href="index.html">Sintija Kirsone</a>';
    document.body.prepend(header);

    var corner = document.createElement("div");
    corner.className = "corner-controls";
    corner.innerHTML =
      '<div class="lang-switch" role="group" aria-label="Language">' +
        '<button type="button" data-lang="lv">LV</button><span>/</span>' +
        '<button type="button" data-lang="en">ENG</button><span>/</span>' +
        '<button type="button" data-lang="zh">中文</button>' +
      '</div>' +
      '<button type="button" class="icon-btn" id="sound-toggle" aria-pressed="false" title="Sound"></button>' +
      '<button type="button" class="icon-btn" id="bg-toggle" aria-pressed="false" title="Background">' + ICON_BG + '</button>';
    document.body.appendChild(corner);

    corner.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.dataset.lang); });
    });
    document.getElementById("bg-toggle").addEventListener("click", function () {
      setBg(document.documentElement.getAttribute("data-bg") === "white" ? "grey" : "white");
    });

    // sound: off by default; remembered choice is re-enabled on first click/tap
    var soundBtn = document.getElementById("sound-toggle");
    function paintSound(on) {
      soundBtn.innerHTML = on ? ICON_SOUND_ON : ICON_SOUND_OFF;
      soundBtn.setAttribute("aria-pressed", on);
      soundBtn.setAttribute("aria-label", on ? "Sound on" : "Sound off");
    }
    var wantSound = store("sk-sound") === "on";
    paintSound(wantSound);
    soundBtn.addEventListener("click", function () {
      var on = !window.Ice.sound.isEnabled();
      window.Ice.sound.setEnabled(on);
      store("sk-sound", on ? "on" : "off");
      paintSound(on);
      if (on) window.Ice.sound.crackle(0.8);
    });
    if (wantSound) {
      var unlock = function () {
        window.Ice.sound.setEnabled(true);
        window.removeEventListener("pointerdown", unlock, true);
        window.removeEventListener("keydown", unlock, true);
      };
      window.addEventListener("pointerdown", unlock, true);
      window.addEventListener("keydown", unlock, true);
    }

    setActiveNav(active);
    setLang(lang);
    setBg(document.documentElement.getAttribute("data-bg"));
  }

  function setActiveNav(name) {
    document.querySelectorAll(".main-nav a").forEach(function (a) {
      var on = a.dataset.nav === name;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* ---------- idle freeze ---------- */
  var idleLayer, idleTimer, idleEnabledFn = function () { return true; };
  function resetIdle() {
    if (idleLayer && idleLayer.classList.contains("is-frozen")) window.Ice.meltFull(idleLayer);
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (idleEnabledFn() && !document.hidden) window.Ice.freezeFull(idleLayer);
    }, IDLE_SECONDS * 1000);
  }
  function startIdle(enabledFn) {
    idleEnabledFn = enabledFn || idleEnabledFn;
    idleLayer = document.createElement("div");
    idleLayer.className = "idle-ice";
    idleLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(idleLayer);
    ["mousemove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach(function (ev) {
      window.addEventListener(ev, resetIdle, { passive: true });
    });
    resetIdle();
  }

  function isMobile() {
    return window.matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1024px)").matches;
  }

  window.Site = {
    t: t,
    lang: function () { return lang; },
    buildChrome: buildChrome,
    setActiveNav: setActiveNav,
    startIdle: startIdle,
    resetIdle: resetIdle,
    isMobile: isMobile
  };
})();
