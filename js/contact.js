/* =========================================================
   CONTACT PAGE — your details + a frozen window
   ---------------------------------------------------------
   ✏️  EDIT YOUR DETAILS HERE
   • Replace the email and the links with your own.
   • To remove a social network, delete its whole { ... } line.
   • To add one, copy a line and change name, handle and url.
   ========================================================= */
var CONTACT = {
  email: "sintija.kirsone12@gmail.com",

  socials: [
    { name: "Instagram", handle: "@spooksisreal", url: "https://www.instagram.com/spooksisreal/" },
    { name: "LinkedIn",  handle: "Sintija Kirsone", url: "https://www.linkedin.com/in/sintija-kirsone-8b04a1210/" },
    { name: "YouTube",     handle: "@SpooksIsReal2", url: "https://www.youtube.com/@SpooksIsReal2" }
  ],

  location: { en: "Riga, Latvia", lv: "Rīga, Latvija", zh: "" },

  intro: {
    en: "For exhibitions, collaborations and commissions, write to me:",
    lv: "Izstādēm, sadarbībām un pasūtījumiem raksti man:",
    zh: ""
  },

  // the word "written with a finger" into the window — only used if messages are turned off
  frostWord: { en: "hello", lv: "sveiki", zh: "你好" },

  // how fast wiped frost grows back (smaller = slower). 0 = never grows back
  regrowSpeed: 0.008,

  /* ---------- Drawn messages, sent to your Gmail ----------
     Uses a small Google Apps Script in your own Google account.
     Paste the "Web app URL" you get from Google below (it ends
     with /exec). Until then the Send button explains that
     sending is not set up yet.                                */
  messages: {
    enabled: true,
    scriptUrl: "https://script.google.com/macros/s/AKfycbz27YAHImc2ZNDTgPNgaoGj29p8ThrxBf_EAkry5TDvZRqSp5suESjZ0237iMjD5dXm/exec",
    waitBetweenMessages: 60   // seconds one visitor must wait before sending again
  }
};
/* ========================================================= */

(function () {
  "use strict";

  var TXT = {
    heading:  { en: "Contact", lv: "Kontakti", zh: "" },
    email:    { en: "E-mail", lv: "E-pasts", zh: "" },
    follow:   { en: "Follow", lv: "Seko", zh: "" },
    copy:     { en: "Copy", lv: "Kopēt", zh: "" },
    copied:   { en: "Copied", lv: "Nokopēts", zh: "" },
    hint:     { en: "Wipe the frost", lv: "Notīri sarmu", zh: "" },
    drawBtn:  { en: "Draw me a message", lv: "Uzzīmē man ziņu", zh: "" },
    title:    { en: "Write/draw me a message", lv: "Uzraksti/uzzīmē man ziņu", zh: "" },
    emailPh:  { en: "Your email (optional)", lv: "Tavs e-pasts (nav obligāts)", zh: "" },
    clear:    { en: "Clear", lv: "Notīrīt", zh: "" },
    send:     { en: "Send", lv: "Sūtīt", zh: "" },
    note:     { en: "Anonymous, unless you add your email. I only use it to reply.",
                lv: "Anonīmi, ja vien neieraksti savu e-pastu. To izmantošu tikai, lai atbildētu.", zh: "" },
    sending:  { en: "Sending…", lv: "Sūta…", zh: "" },
    sent:     { en: "Sent. Thank you!", lv: "Nosūtīts. Paldies!", zh: "" },
    empty:    { en: "Draw or write something first.", lv: "Vispirms uzzīmē vai uzraksti kaut ko.", zh: "" },
    textPh:   { en: "Your message (optional)", lv: "Tava ziņa (nav obligāta)", zh: "" },
    badEmail: { en: "Check your email address, or leave it empty.", lv: "Pārbaudi e-pasta adresi vai atstāj to tukšu.", zh: "" },
    wait:     { en: "Please wait a minute before sending another.", lv: "Lūdzu, pagaidi minūti pirms nākamās ziņas.", zh: "" },
    fail:     { en: "Couldn't send. Try again, or write to ", lv: "Neizdevās nosūtīt. Mēģini vēlreiz vai raksti uz ", zh: "" },
    notSetup: { en: "Sending isn't set up yet.", lv: "Sūtīšana vēl nav iestatīta.", zh: "" }
  };
  function t(o) { return window.Site ? window.Site.t(o) : (o.en || ""); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  var MSG = CONTACT.messages || { enabled: false };

  /* ---------- styles (kept here, so style.css stays untouched) ---------- */
  var css = [
    ".contact-page.is-visible { position: fixed; inset: 0; z-index: 20; overflow: hidden; }",
    ".contact-info {",
    "  position: absolute; z-index: 2;",
    "  top: calc(var(--top) + 90px);",
    "  left: calc(var(--gutter) + 2vw + 1.5vw);",
    "  width: min(440px, 38vw);",
    "  display: flex; flex-direction: column; gap: 34px;",
    "}",
    ".contact-info h1 { font-family: var(--font-mono); font-weight: 500; font-size: 15px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0; }",
    ".contact-info .intro { margin: 0; font-size: 15px; line-height: 1.6; max-width: 40ch; color: var(--fg); }",
    ".contact-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim); margin: 0 0 10px; }",
    ".contact-email-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px 16px; }",
    ".contact-email {",
    "  font-family: var(--font-mono); font-weight: 500;",
    "  font-size: clamp(17px, 1.7vw, 24px); letter-spacing: 0.02em;",
    "  overflow-wrap: anywhere; transition: color 0.25s ease;",
    "}",
    ".contact-email:hover { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }",
    ".copy-btn, .fbtn {",
    "  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;",
    "  border: 1px solid var(--line); padding: 3px 8px; color: var(--fg-dim);",
    "  transition: color 0.25s ease, border-color 0.25s ease;",
    "}",
    ".copy-btn:hover, .copy-btn.is-done, .fbtn:hover { color: var(--accent); border-color: var(--accent); }",
    ".social-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }",
    ".social-list a {",
    "  display: grid; grid-template-columns: 9.5em minmax(0, 1fr) auto; gap: 12px; align-items: baseline;",
    "  padding: 9px 0; border-bottom: 1px solid var(--line);",
    "  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em;",
    "  transition: color 0.25s ease, border-color 0.25s ease;",
    "}",
    ".social-list li:first-child a { border-top: 1px solid var(--line); }",
    ".social-list .net { text-transform: uppercase; }",
    ".social-list .handle { color: var(--fg-dim); overflow-wrap: anywhere; transition: color 0.25s ease; }",
    ".social-list .arrow { transition: transform 0.3s ease; }",
    ".social-list a:hover { color: var(--accent); border-bottom-color: var(--accent); }",
    ".social-list a:hover .handle { color: var(--accent); }",
    ".social-list a:hover .arrow { transform: translate(3px, -3px); }",
    ".contact-location { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em; color: var(--fg-dim); text-transform: uppercase; }",
    /* frozen window + its control bar */
    ".frost-area {",
    "  position: absolute; z-index: 1;",
    "  top: calc(var(--top) + 90px);",
    "  right: calc(var(--gutter-r) + 2vw);",
    "  bottom: calc(env(safe-area-inset-bottom, 0px) + 40px);",
    "  left: max(50vw, calc(var(--gutter) + 2vw + min(440px, 38vw) + 6vw));",
    "  display: flex; flex-direction: column; gap: 12px;",
    "}",
    ".frost-head { flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }",
    ".frost-head .fbtn { color: var(--fg); background: var(--panel); padding: 6px 11px; }",
    ".frost-title { margin: 0; font-family: var(--font-mono); font-weight: 500; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg); }",
    ".frost-window { position: relative; flex: 1 1 auto; min-height: 0; border: 1px solid var(--line); cursor: crosshair; touch-action: pan-y; }",
    ".frost-area.is-drawing .frost-window { touch-action: none; border-color: var(--accent); }",
    ".frost-window canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }",
    ".frost-bar {",
    "  flex: 0 0 auto; min-height: 84px;",
    "  display: flex; flex-wrap: wrap; align-content: flex-start; align-items: center; gap: 10px 10px;",
    "  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-dim);",
    "}",
    ".frost-bar .grow { flex: 1 1 auto; }",
    ".frost-bar .fbtn { color: var(--fg); background: var(--panel); padding: 6px 11px; }",
    ".frost-bar .fbtn.primary { border-color: var(--accent); color: var(--accent); }",
    ".frost-bar .fbtn.primary:hover { background: var(--accent); color: var(--bg); }",
    ".frost-bar .fbtn:disabled { opacity: 0.5; cursor: default; }",
    ".frost-email {",
    "  flex: 1 1 210px; min-width: 0;",
    "  font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em;",
    "  background: transparent; color: var(--fg);",
    "  border: 0; border-bottom: 1px solid var(--line); border-radius: 0; padding: 6px 2px;",
    "}",
    ".frost-email::placeholder, .frost-text::placeholder { color: var(--fg-dim); }",
    ".frost-text {",
    "  flex: 1 1 100%; min-width: 0; height: 4.6em; resize: none;",
    "  font-family: var(--font-mono); font-size: 12px; line-height: 1.5; letter-spacing: 0.02em;",
    "  background: transparent; color: var(--fg);",
    "  border: 1px solid var(--line); border-radius: 0; padding: 8px 10px;",
    "}",
    ".frost-text:focus { outline: none; border-color: var(--accent); }",
    ".frost-email:focus { outline: none; border-bottom-color: var(--accent); }",
    ".frost-note, .frost-status { width: 100%; text-transform: none; letter-spacing: 0.03em; font-size: 11px; }",
    ".frost-status { color: var(--accent); min-height: 1.3em; }",
    ".frost-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }",
    "@media (max-width: 760px), (pointer: coarse) and (max-width: 1024px) {",
    "  .contact-page.is-visible { position: static; overflow: visible; }",
    "  .contact-info { position: static; width: auto; padding: calc(var(--top) + 100px) var(--gutter-r) 0 var(--gutter); gap: 28px; }",
    "  .frost-area { position: relative; inset: auto; margin: 36px var(--gutter-r) 110px var(--gutter); }",
    "  .frost-window { flex: none; height: 58vh; }",
    "  .frost-bar { min-height: 0; }",
    "  .frost-bar .fbtn { padding: 9px 12px; }",
    "  .social-list a { grid-template-columns: 7.5em minmax(0, 1fr) auto; padding: 12px 0; }",
    "}"
  ].join("\n");
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- contact details ---------- */
  var view, frost, area;

  function renderInfo() {
    var socials = (CONTACT.socials || []).map(function (s) {
      return '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
        '<span class="net">' + esc(s.name) + '</span>' +
        '<span class="handle">' + esc(s.handle || "") + '</span>' +
        '<span class="arrow" aria-hidden="true">↗</span></a></li>';
    }).join("");

    var info = view.querySelector(".contact-info");
    info.innerHTML =
      '<h1>' + esc(t(TXT.heading)) + '</h1>' +
      '<p class="intro">' + esc(t(CONTACT.intro)) + '</p>' +
      '<div><p class="contact-label">' + esc(t(TXT.email)) + '</p>' +
        '<div class="contact-email-row">' +
          '<a class="contact-email" href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.email) + '</a>' +
          '<button type="button" class="copy-btn">' + esc(t(TXT.copy)) + '</button>' +
        '</div></div>' +
      (socials ? '<div><p class="contact-label">' + esc(t(TXT.follow)) + '</p><ul class="social-list">' + socials + '</ul></div>' : "") +
      '<div class="contact-location">' + esc(t(CONTACT.location)) + '</div>';

    var btn = info.querySelector(".copy-btn");
    btn.addEventListener("click", function () {
      function done() {
        btn.textContent = t(TXT.copied);
        btn.classList.add("is-done");
        setTimeout(function () { btn.textContent = t(TXT.copy); btn.classList.remove("is-done"); }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(CONTACT.email).then(done, selectEmail);
      } else selectEmail();
      function selectEmail() {
        var r = document.createRange();
        r.selectNodeContents(info.querySelector(".contact-email"));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
    });
  }

  /* ---------- control bar under the window ---------- */
  var drawing = false, statusTimer = 0;

  function renderBar() {
    var bar = area.querySelector(".frost-bar");
    var keepEmail = bar.querySelector(".frost-email") ? bar.querySelector(".frost-email").value : "";
    var keepText = bar.querySelector(".frost-text") ? bar.querySelector(".frost-text").value : "";
    var status = bar.querySelector(".frost-status") ? bar.querySelector(".frost-status").textContent : "";
    if (!drawing) {
      bar.innerHTML =
        '<span class="grow">' + esc(t(TXT.hint)) + '</span>' +
        (MSG.enabled ? '<button type="button" class="fbtn primary" data-act="draw">' + esc(t(TXT.drawBtn)) + ' →</button>' : "") +
        '<div class="frost-status" role="status" aria-live="polite"></div>';
    } else {
      bar.innerHTML =
        '<textarea class="frost-text" id="frost-text" maxlength="2000" rows="3" ' +
          'placeholder="' + esc(t(TXT.textPh)) + '" aria-label="' + esc(t(TXT.textPh)) + '"></textarea>' +
        '<input class="frost-email" id="frost-email" type="email" autocomplete="email" inputmode="email" ' +
          'placeholder="' + esc(t(TXT.emailPh)) + '" aria-label="' + esc(t(TXT.emailPh)) + '">' +
        '<label class="frost-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>' +
        '<button type="button" class="fbtn primary" data-act="send">' + esc(t(TXT.send)) + ' →</button>' +
        '<div class="frost-note">' + esc(t(TXT.note)) + '</div>' +
        '<div class="frost-status" role="status" aria-live="polite"></div>';
      bar.querySelector(".frost-email").value = keepEmail;
      bar.querySelector(".frost-text").value = keepText;
    }
    bar.querySelector(".frost-status").textContent = status;
  }

  function setStatus(msg, keepMs) {
    var el = area.querySelector(".frost-status");
    if (!el) return;
    el.textContent = msg;
    clearTimeout(statusTimer);
    if (keepMs) statusTimer = setTimeout(function () {
      var e2 = area.querySelector(".frost-status"); if (e2) e2.textContent = "";
    }, keepMs);
  }

  function enterDrawing() {
    drawing = true;
    area.classList.add("is-drawing");
    frost.setMode("draw");
    renderBar();
    setStatus("");
  }
  function leaveDrawing() {
    drawing = false;
    area.classList.remove("is-drawing");
    frost.setMode("wipe");
    renderBar();
  }

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }
  var lastSentMemory = 0;

  function send() {
    var bar = area.querySelector(".frost-bar");
    var emailInput = bar.querySelector(".frost-email");
    var honeypot = bar.querySelector(".frost-hp input");
    var email = (emailInput.value || "").trim();

    var textBox = bar.querySelector(".frost-text");
    var text = textBox ? textBox.value.trim() : "";
    if (!frost.hasDrawing() && !text) { setStatus(t(TXT.empty), 3000); return; }
    if (email && !emailInput.checkValidity()) { setStatus(t(TXT.badEmail), 4000); emailInput.focus(); return; }

    var wait = (MSG.waitBetweenMessages || 60) * 1000;
    var last = Math.max(lastSentMemory, +(store("sk-msg-sent") || 0));
    if (Date.now() - last < wait) { setStatus(t(TXT.wait), 4000); return; }

    // bots fill in the hidden field: pretend it worked, send nothing
    if (honeypot && honeypot.value) { afterSent(); return; }

    var notSet = !/^https:\/\/script\.google\.com\//.test(MSG.scriptUrl || "");
    if (notSet) { setStatus(t(TXT.notSetup), 4000); return; }

    var sendBtn = bar.querySelector('[data-act="send"]');
    sendBtn.disabled = true;
    setStatus(t(TXT.sending));

    var payload = {
      drawing: frost.hasDrawing() ? frost.exportImage() : "",
      message: text,
      email: email,
      language: window.Site ? window.Site.lang() : "en"
    };

    // sent as plain text so Google accepts it straight from the browser
    fetch(MSG.scriptUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (answer) {
      if (!answer || !answer.ok) throw new Error(answer && answer.error ? answer.error : "not sent");
      lastSentMemory = Date.now();
      store("sk-msg-sent", String(lastSentMemory));
      afterSent();
    }).catch(function (err) {
      if (window.console) console.warn("Message not sent:", err);
      var b = area.querySelector('[data-act="send"]'); if (b) b.disabled = false;
      setStatus(t(TXT.fail) + CONTACT.email);
    });
  }

  function afterSent() {
    frost.refreezeMessage();
    renderBar();
    var em = area.querySelector(".frost-email"); if (em) em.value = "";
    var tx = area.querySelector(".frost-text"); if (tx) tx.value = "";
    setStatus(t(TXT.sent), 5000);
  }

  /* =========================================================
     FROZEN WINDOW — frost drawn from the same ice flowers as
     the rest of the site. A word is "written" into it, and the
     mouse (or a finger) wipes the frost, which slowly grows back.
     In message mode, visitors draw a message that stays until
     it is sent, cleared or cancelled.
     ========================================================= */
  function FrostWindow(box) {
    var self = this;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canvas = document.createElement("canvas");
    box.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var frostC = document.createElement("canvas");   // the frost itself
    var wordC = document.createElement("canvas");    // the written word
    var wipeC = document.createElement("canvas");    // mouse wipes (grow back)
    var msgC = document.createElement("canvas");     // the visitor's message (stays)
    var revealC = document.createElement("canvas");  // helper for the writing animation
    var W = 0, H = 0, dpr = 1, running = false, raf = 0;
    var writeProgress = 0, grow = 0, wordAlpha = 1, last = null, images = null, built = false;
    var mode = "wipe", strokes = [], current = null, inkLength = 0, boostUntil = 0;
    var MSG_LINE = 9;   // px, thickness of message lines

    function loadSprites(cb) {
      var bg = document.documentElement.getAttribute("data-bg") || "grey";
      var set = window.Ice.sprites(bg);
      var urls = set.ferns.concat(set.stars);
      var imgs = [], left = urls.length;
      if (!left) { cb({ ferns: [], stars: [] }); return; }   // new frost is drawn directly, nothing to load
      urls.forEach(function (u, i) {
        var im = new Image();
        im.onload = im.onerror = function () { if (--left === 0) cb({ ferns: imgs.slice(0, set.ferns.length), stars: imgs.slice(set.ferns.length) }); };
        im.src = u; imgs[i] = im;
      });
    }

    function seeded(seed) {
      var s = seed >>> 0;
      return function () {
        s += 0x6D2B79F5; var x = s;
        x = Math.imul(x ^ (x >>> 15), x | 1);
        x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
      };
    }

    function size() {
      var r = box.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      [canvas, frostC, wordC, wipeC, msgC, revealC].forEach(function (c) { c.width = W; c.height = H; });
    }

    function paintFrost() {
      var f = frostC.getContext("2d");
      var white = document.documentElement.getAttribute("data-bg") === "white";
      f.clearRect(0, 0, W, H);
      // misty glass
      var g = f.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, white ? "rgba(168,188,206,0.55)" : "rgba(200,216,230,0.16)");
      g.addColorStop(1, white ? "rgba(150,174,196,0.72)" : "rgba(210,226,240,0.30)");
      f.fillStyle = g; f.fillRect(0, 0, W, H);
      if (window.Ice.paintWindow) {   // blue window frost with rosette clusters
        f.save(); f.lineCap = "round";
        window.Ice.paintWindow(f, W, H, { bg: white ? "white" : "grey", seed: 2026, scale: dpr });
        f.restore();
        return;
      }
      var r = seeded(2026);
      // new window frost: frosted glass with packed rosettes, light above and dark below
      var set = window.Ice.sprites(document.documentElement.getAttribute("data-bg") || "grey");
      if (window.Ice.paintCrust && set.darkIdx) {
        f.save(); f.lineCap = "round";
        window.Ice.paintCrust(f, W, H, { bg: white ? "white" : "grey", seed: 2026, scale: dpr });
        f.restore();
        var size = Math.max(70 * dpr, Math.min(W, H) / 4.2);
        var step = size * 0.62;
        var holes = [];
        for (var row = 0; row * step < H + size; row++) {
          for (var col = 0; col * step < W + size; col++) {
            var x = (col + (row % 2) * 0.5) * step + (r() - 0.5) * step * 0.6;
            var y = H - row * step + (r() - 0.5) * step * 0.6;
            var depth = Math.max(0, Math.min(1, y / H));
            var dark = r() < Math.max(0, Math.min(0.85, (depth - 0.35) * 1.6));
            var list = dark ? set.darkIdx : set.lightIdx;
            var img = images.stars[list[Math.floor(r() * list.length)]];
            var w = size * Math.pow(0.55 + r() * 0.7, 1.4);
            f.save(); f.translate(x, y); f.rotate(r() * Math.PI * 2);
            f.drawImage(img, -w / 2, -w / 2, w, w);
            f.restore();
            holes.push({ x: x, y: y, r: w * 0.42 });
          }
        }
        if (window.Ice.paintVeil) {   // white frost between and over the rosettes
          var veil = document.createElement("canvas");
          veil.width = W; veil.height = H;
          var vc = veil.getContext("2d"); vc.lineCap = "round";
          window.Ice.paintVeil(vc, W, H, { bg: white ? "white" : "grey", seed: 2026, scale: dpr, holes: holes });
          f.drawImage(veil, 0, 0);
        }
        return;
      }
      var unit = Math.max(W, H) / 5.5;
      function put(img, x, y, w, rot) {
        var h = w * img.height / img.width;
        f.save(); f.translate(x, y); f.rotate(rot); f.drawImage(img, -w / 2, -h, w, h); f.restore();
      }
      // frost grows in from every edge of the window
      var sides = [
        { n: Math.ceil(W / unit) + 2, p: function (s) { return [s * W, H]; }, a: 0 },
        { n: Math.ceil(W / unit) + 2, p: function (s) { return [s * W, 0]; }, a: Math.PI },
        { n: Math.ceil(H / unit) + 2, p: function (s) { return [0, s * H]; }, a: Math.PI / 2 },
        { n: Math.ceil(H / unit) + 2, p: function (s) { return [W, s * H]; }, a: -Math.PI / 2 }
      ];
      var k = 0;
      for (var pass = 0; pass < 2; pass++) {
        sides.forEach(function (sd) {
          for (var i = 0; i < sd.n; i++) {
            var pt = sd.p(i / (sd.n - 1) + (r() - 0.5) * 0.08);
            put(images.ferns[k++ % images.ferns.length], pt[0], pt[1], unit * (1.1 + r() * 0.9), sd.a + (r() - 0.5) * 0.9);
          }
        });
      }
      // a lighter layer over the middle
      var mid = Math.round((W * H) / (unit * unit) * 1.1);
      for (var m = 0; m < mid; m++) {
        var useStar = r() < 0.18;
        var img = useStar ? images.stars[m % images.stars.length] : images.ferns[m % images.ferns.length];
        f.globalAlpha = useStar ? 0.9 : 0.55 + r() * 0.35;
        put(img, r() * W, r() * H, unit * (useStar ? 0.5 + r() * 0.4 : 0.8 + r() * 0.8), r() * Math.PI * 2);
      }
      f.globalAlpha = 1;
    }

    function paintWord() {
      var w = wordC.getContext("2d");
      w.clearRect(0, 0, W, H);
      var word = t(CONTACT.frostWord) || CONTACT.frostWord.en;
      var fs = Math.min(H * 0.3, (W * 0.72) / Math.max(3, word.length * 0.55));
      w.font = "400 " + fs + "px 'Inria Sans', 'Helvetica Neue', Arial, sans-serif";
      w.textAlign = "center"; w.textBaseline = "middle";
      w.lineJoin = "round"; w.lineCap = "round";
      w.lineWidth = fs * 0.045;
      w.strokeStyle = "#000"; w.fillStyle = "#000";
      w.save(); w.translate(W / 2, H * 0.46); w.rotate(-0.06);
      w.strokeText(word, 0, 0); w.fillText(word, 0, 0);
      // a few drips running down from the letters
      var r = seeded(word.length * 97);
      var tw = w.measureText(word).width;
      for (var i = 0; i < 3; i++) {
        var x = -tw / 2 + r() * tw, y = fs * 0.28, len = fs * (0.2 + r() * 0.5);
        w.lineWidth = fs * (0.02 + r() * 0.02);
        w.beginPath(); w.moveTo(x, y); w.lineTo(x + r() * 3, y + len); w.stroke();
        w.beginPath(); w.arc(x + 2, y + len, w.lineWidth * 0.9, 0, Math.PI * 2); w.fill();
      }
      w.restore();
    }

    // draw the recorded message strokes onto any canvas
    function paintStrokes(c2, cw, ch, lineW, color) {
      c2.strokeStyle = color; c2.fillStyle = color;
      c2.lineCap = "round"; c2.lineJoin = "round"; c2.lineWidth = lineW;
      strokes.forEach(function (s) {
        if (!s.length) return;
        c2.beginPath();
        if (s.length === 1) {
          c2.arc(s[0][0] * cw, s[0][1] * ch, lineW / 2, 0, Math.PI * 2); c2.fill();
          return;
        }
        c2.moveTo(s[0][0] * cw, s[0][1] * ch);
        for (var i = 1; i < s.length; i++) c2.lineTo(s[i][0] * cw, s[i][1] * ch);
        c2.stroke();
      });
    }
    function repaintMessage() {
      var m = msgC.getContext("2d");
      m.clearRect(0, 0, W, H);
      paintStrokes(m, W, H, MSG_LINE * dpr, "#000");
    }

    function frame() {
      if (!running) return;
      if (grow < 1) grow = Math.min(1, grow + (reduce ? 1 : 0.018));
      if (mode === "wipe") {
        wordAlpha = Math.min(1, wordAlpha + 0.03);
        if (grow >= 0.6 && writeProgress < 1) writeProgress = Math.min(1, writeProgress + (reduce ? 1 : 0.012));
      } else {
        wordAlpha = Math.max(0, wordAlpha - 0.04);   // the word freezes over
      }
      // wiped frost grows back (fast while drawing or just after sending)
      var heal = mode === "draw" || Date.now() < boostUntil ? 0.045 : CONTACT.regrowSpeed;
      if (heal > 0) {
        var wc = wipeC.getContext("2d");
        wc.globalCompositeOperation = "destination-out";
        wc.fillStyle = "rgba(0,0,0," + heal + ")";
        wc.fillRect(0, 0, W, H);
        wc.globalCompositeOperation = "source-over";
      }
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = grow;
      // frost appears from the edges inward
      var reach = Math.max(W, H) * (0.15 + grow * 0.9);
      ctx.save();
      if (grow < 1) {
        var m = Math.max(0, Math.min(W, H) / 2 - reach / 2);
        ctx.beginPath();
        ctx.rect(0, 0, W, H);
        ctx.rect(m, m, W - 2 * m, H - 2 * m);
        ctx.clip("evenodd");
      }
      ctx.drawImage(frostC, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
      if (wordAlpha > 0 && writeProgress > 0) {
        ctx.globalAlpha = wordAlpha;
        if (writeProgress >= 1) {
          ctx.drawImage(wordC, 0, 0);
        } else {
          // the word appears from left to right with a soft edge, like a finger moving
          var feather = W * 0.08;
          var pw = W * 0.12 + writeProgress * (W * 0.88 + feather);
          var tc = revealC.getContext("2d");
          tc.globalCompositeOperation = "source-over";
          tc.clearRect(0, 0, W, H);
          tc.drawImage(wordC, 0, 0);
          tc.globalCompositeOperation = "destination-in";
          var lg = tc.createLinearGradient(pw - feather, 0, pw, 0);
          lg.addColorStop(0, "rgba(0,0,0,1)");
          lg.addColorStop(1, "rgba(0,0,0,0)");
          tc.fillStyle = lg;
          tc.fillRect(0, 0, W, H);
          ctx.drawImage(revealC, 0, 0);
        }
        ctx.globalAlpha = 1;
      }
      ctx.drawImage(wipeC, 0, 0);
      ctx.drawImage(msgC, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    }

    function point(e) {
      var r = box.getBoundingClientRect();
      return [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr];
    }

    function wipe(e) {
      var p = point(e);
      var wc = wipeC.getContext("2d");
      wc.strokeStyle = "#000"; wc.fillStyle = "#000";
      wc.lineCap = "round"; wc.lineJoin = "round";
      wc.lineWidth = 30 * dpr;
      wc.beginPath();
      if (last) { wc.moveTo(last[0], last[1]); wc.lineTo(p[0], p[1]); wc.stroke(); }
      else { wc.arc(p[0], p[1], 15 * dpr, 0, Math.PI * 2); wc.fill(); }
      last = p;
    }

    function drawTo(e) {
      var p = point(e);
      var m = msgC.getContext("2d");
      m.strokeStyle = "#000"; m.fillStyle = "#000";
      m.lineCap = "round"; m.lineJoin = "round";
      m.lineWidth = MSG_LINE * dpr;
      m.beginPath();
      if (last) {
        m.moveTo(last[0], last[1]); m.lineTo(p[0], p[1]); m.stroke();
        inkLength += Math.hypot(p[0] - last[0], p[1] - last[1]) / dpr;
      } else {
        m.arc(p[0], p[1], MSG_LINE * dpr / 2, 0, Math.PI * 2); m.fill();
        inkLength += 2;
      }
      last = p;
      if (current) current.push([p[0] / W, p[1] / H]);
    }

    box.addEventListener("pointerdown", function (e) {
      last = null;
      if (mode === "draw") {
        e.preventDefault();
        try { box.setPointerCapture(e.pointerId); } catch (err) {}
        current = []; strokes.push(current);
        drawTo(e);
      } else wipe(e);
    });
    box.addEventListener("pointermove", function (e) {
      if (mode === "draw") { if (current) drawTo(e); }
      else wipe(e);
    });
    function endStroke() { current = null; last = null; }
    box.addEventListener("pointerup", endStroke);
    box.addEventListener("pointercancel", endStroke);
    box.addEventListener("pointerleave", function () { if (mode !== "draw") last = null; });

    function build(cb) {
      size();
      loadSprites(function (imgs) {
        images = imgs;
        paintFrost(); paintWord(); repaintMessage();
        built = true;
        if (cb) cb();
        if (document.fonts && document.fonts.load) {
          document.fonts.load("400 40px 'Inria Sans'").then(function () { paintWord(); }, function () {});
        }
      });
    }

    self.start = function () {
      if (running) return;
      running = true;
      grow = 0; writeProgress = 0; wordAlpha = mode === "wipe" ? 1 : 0;
      var go = function () {
        wipeC.getContext("2d").clearRect(0, 0, W, H);
        cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
      };
      build(go);
    };
    self.stop = function () { running = false; cancelAnimationFrame(raf); };
    self.redrawWord = function () { if (built) paintWord(); };
    self.rebuild = function () { if (running) build(); };

    self.setMode = function (m) {
      mode = m;
      if (m === "draw") { strokes = []; inkLength = 0; repaintMessage(); }
      else {
        strokes = []; inkLength = 0;
        // the cancelled drawing melts away instead of vanishing
        wipeC.getContext("2d").drawImage(msgC, 0, 0);
        repaintMessage();
        boostUntil = Date.now() + 1800;
        writeProgress = 0;
      }
    };
    self.clearMessage = function () {
      wipeC.getContext("2d").drawImage(msgC, 0, 0);
      strokes = []; inkLength = 0; repaintMessage();
    };
    self.hasDrawing = function () { return inkLength > 60; };

    // after sending: the message freezes over, then the greeting comes back
    self.refreezeMessage = function () {
      // the sent drawing freezes over, and the window is ready for the next message
      wipeC.getContext("2d").drawImage(msgC, 0, 0);
      strokes = []; inkLength = 0; repaintMessage();
      boostUntil = Date.now() + 2200;
    };

    // the image that is emailed: dark lines on frosty paper
    self.exportImage = function () {
      var targetW = 1200, url = "";
      for (var attempt = 0; attempt < 6; attempt++) {
        var ew = Math.round(targetW), eh = Math.round(targetW * H / W);
        if (eh > targetW) { eh = Math.round(targetW); ew = Math.round(targetW * W / H); }
        var c = document.createElement("canvas");
        c.width = ew; c.height = eh;
        var x = c.getContext("2d");
        x.fillStyle = "#e3eaf0"; x.fillRect(0, 0, ew, eh);
        var lineW = Math.max(2, MSG_LINE * ew / (W / dpr));
        paintStrokes(x, ew, eh, lineW, "#1f2a33");
        x.fillStyle = "#8a99a6";
        x.font = Math.max(10, Math.round(ew / 70)) + "px monospace";
        x.fillText("sintija kirsone · frozen window · " + new Date().toLocaleDateString("lv-LV"), Math.round(ew * 0.02), eh - Math.round(eh * 0.025));
        url = c.toDataURL("image/png");
        if (url.length < 1500000) break;
        targetW *= 0.78;
      }
      return url;
    };

    var rt;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(function () { if (running) build(); }, 250);
    }
    if (window.ResizeObserver) new ResizeObserver(onResize).observe(box);
    else window.addEventListener("resize", onResize);
  }

  function paintTitle() {
    var h = area && area.querySelector(".frost-title");
    if (h) h.textContent = t(TXT.title);
    var c = area && area.querySelector('.frost-head [data-act="clear"]');
    if (c) c.textContent = t(TXT.clear);
  }

  /* ---------- start ---------- */
  function init() {
    view = document.getElementById("view-contact");
    if (!view) return;
    view.innerHTML =
      '<div class="contact-info"></div>' +
      '<div class="frost-area">' +
        (MSG.enabled ? '<div class="frost-head"><h2 class="frost-title"></h2>' +
          '<button type="button" class="fbtn" data-act="clear"></button></div>' : '') +
        '<div class="frost-window"></div>' +
        '<div class="frost-bar"></div>' +
      '</div>';
    area = view.querySelector(".frost-area");
    renderInfo();
    renderBar();
    frost = new FrostWindow(view.querySelector(".frost-window"));
    if (MSG.enabled) {
      // the page opens ready to draw
      drawing = true;
      area.classList.add("is-drawing");
      frost.setMode("draw");
      renderBar();
    }
    paintTitle();

    area.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "draw") enterDrawing();
      else if (act === "clear") { frost.clearMessage(); setStatus(""); }
      else if (act === "send") send();
    });
    area.querySelector(".frost-bar").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.classList.contains("frost-email")) { e.preventDefault(); send(); }
    });

    function check() {
      if (view.classList.contains("is-visible")) frost.start(); else frost.stop();
    }
    new MutationObserver(check).observe(view, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(function () { frost.rebuild(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-bg"] });
    document.addEventListener("langchange", function () { renderInfo(); renderBar(); paintTitle(); frost.redrawWord(); });
    check();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
