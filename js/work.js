/* =========================================================
   WORK PAGE — reads the work id from the address (work.html#id)
   ========================================================= */
(function () {
  "use strict";

  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function techName(id) {
    var t = window.TECHNIQUES.filter(function (x) { return x.id === id; })[0];
    return t ? window.Site.t(t) : id;
  }
  function nextWork(w) {
    var idx = window.WORKS.indexOf(w);
    return window.WORKS[(idx + 1) % window.WORKS.length];
  }

  function currentWork() {
    var id = (location.hash || "").replace("#", "");
    return window.WORKS.filter(function (w) { return w.id === id; })[0];
  }

  /* YouTube / Vimeo: find the video id in any kind of link */
  /* ---------- labels (Latvian / English / Chinese) ---------- */
  var LABELS = {
    photo: { en: "Photo", lv: "Foto", zh: "" },
    video: { en: "Video", lv: "Video", zh: "" },
    prev:  { en: "Previous photo", lv: "Iepriekšējā bilde", zh: "" },
    next:  { en: "Next photo", lv: "Nākamā bilde", zh: "" },
    close: { en: "Close", lv: "Aizvērt", zh: "" },
    nextWork: { en: "Next work", lv: "Nākamais darbs", zh: "" },
    more:  { en: "more photos", lv: "vēl bildes", zh: "" }
  };

  /* ---------- styles for credits and the photo viewer ---------- */
  var css = document.createElement("style");
  css.textContent = [
    ".credits { margin-top: 18px; font-size: 13px; line-height: 1.6; color: var(--fg-dim); }",
    ".credits span { color: var(--fg); }",
    ".lightbox { display: block; padding: 0; cursor: default; user-select: none; }",
    ".lightbox .lb-stage { position: absolute; inset: 56px 72px 64px; display: grid; place-items: center; }",
    ".lightbox .lb-stage img { max-width: calc(100vw - 150px); max-height: calc(100vh - 128px); width: auto; height: auto; object-fit: contain; cursor: default; }",
    ".lightbox button { position: absolute; color: #f2f2ee; background: none; border: 0; cursor: pointer; padding: 12px; opacity: 0.8; transition: opacity .2s, color .2s; }",
    ".lightbox button:hover { opacity: 1; color: var(--accent); }",
    ".lightbox button svg { width: 34px; height: 34px; display: block; }",
    ".lightbox .lb-prev { left: 10px; top: 50%; transform: translateY(-50%); }",
    ".lightbox .lb-next { right: 10px; top: 50%; transform: translateY(-50%); }",
    ".lightbox .lb-close { right: 10px; top: 8px; }",
    ".lightbox .lb-close svg { width: 26px; height: 26px; }",
    ".lightbox .lb-next .lb-work { display: none; }",
    ".lightbox .lb-next.to-work { display: flex; align-items: center; gap: 10px; flex-direction: row-reverse; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; text-align: right; }",
    ".lightbox .lb-next.to-work .lb-work { display: block; max-width: 12em; line-height: 1.4; }",
    ".lightbox .lb-next.to-work .lb-work small { display: block; opacity: 0.6; font-size: 10px; }",
    ".shot { position: relative; display: block; }",
    ".shot .more { position: absolute; right: 12px; bottom: 12px; padding: 4px 9px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; color: #fff; background: rgba(0,0,0,0.55); pointer-events: none; }",
    "@media (max-width: 760px) { .lightbox .lb-next.to-work .lb-work { max-width: 8em; } }",
    ".lightbox .lb-bar { position: absolute; left: 0; right: 0; bottom: 18px; display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; padding: 0 16px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.08em; color: #d8d8d2; }",
    "@media (max-width: 760px) { .lightbox .lb-stage { inset: 52px 8px 60px; } .lightbox .lb-stage img { max-width: calc(100vw - 16px); max-height: calc(100vh - 120px); } .lightbox .lb-prev, .lightbox .lb-next { top: auto; bottom: 6px; transform: none; } }"
  ].join("\n");
  document.head.appendChild(css);

  var ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4l-8 8 8 8"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4l8 8-8 8"/></svg>';
  var CROSS   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

  // credits can be one name ("Anna Ozola") or several (["Anna Ozola", "Jānis Bērziņš"])
  function names(v) {
    if (!v) return "";
    return (Array.isArray(v) ? v : [v]).filter(Boolean).join(", ");
  }
  function creditsHtml(w) {
    var c = w.credits || {};
    var t = window.Site.t, rows = "";
    if (names(c.photo)) rows += '<div>' + esc(t(LABELS.photo)) + ': <span>' + esc(names(c.photo)) + '</span></div>';
    if (names(c.video) && w.video) rows += '<div>' + esc(t(LABELS.video)) + ': <span>' + esc(names(c.video)) + '</span></div>';
    return rows ? '<div class="credits">' + rows + '</div>' : "";
  }

  function youtubeId(url) {
    var m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/.exec(url || "");
    return m ? m[1] : null;
  }
  function vimeoId(url) {
    var m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url || "");
    return m ? m[1] : null;
  }

  // shows the YouTube thumbnail; the video itself loads only when clicked
  function youtubeHtml(id, title) {
    return '<button type="button" class="video-box yt" style="width:100%;cursor:pointer" data-yt="' + esc(id) + '" aria-label="' + esc(title) + ' video">' +
      '<img src="https://i.ytimg.com/vi/' + esc(id) + '/maxresdefault.jpg" alt="" style="opacity:1" ' +
      'onload="if(this.naturalWidth<200)this.src=\'https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg\'" ' +
      'onerror="this.onerror=null;this.src=\'https://i.ytimg.com/vi/' + esc(id) + '/hqdefault.jpg\'">' +
      '<span class="play">' + PLAY + '</span></button>';
  }

  function playYoutube(box) {
    var id = box.getAttribute("data-yt");
    var wrap = document.createElement("div");
    wrap.className = "video-box";
    wrap.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0&playsinline=1" title="YouTube video" frameborder="0" ' +
      'allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen ' +
      'style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>';
    box.parentNode.replaceChild(wrap, box);
  }

  function videoHtml(w) {
    var v = w.video;
    if (!v) return "";
    var poster = w.images[1] || w.images[0] || w.cutout || "";
    if (v.src) {
      return '<video controls preload="metadata" playsinline poster="' + esc(poster) + '" src="' + esc(v.src) + '"></video>';
    }
    var yt = youtubeId(v.link), vm = vimeoId(v.link);
    if (yt) return youtubeHtml(yt, w.title);
    if (vm) {
      return '<div class="video-box"><iframe src="https://player.vimeo.com/video/' + esc(vm) + '?dnt=1" title="Vimeo video" ' +
        'frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen ' +
        'style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe></div>';
    }
    if (v.link) {
      return '<a class="video-box" href="' + esc(v.link) + '" target="_blank" rel="noopener">' +
        '<img src="' + esc(poster) + '" alt=""><span class="play">' + PLAY + '</span>' +
        '<span class="soon">' + esc(window.Site.t(window.UI.playVideo)) + '</span></a>';
    }
    return '<div class="video-box"><img src="' + esc(poster) + '" alt=""><span class="play">' + PLAY + '</span>' +
      '<span class="soon">' + esc(window.Site.t(window.UI.videoSoon)) + '</span></div>';
  }

  function render() {
    var w = currentWork();
    var page = document.getElementById("work-page");
    if (!w) { location.replace("index.html#works"); return; }
    document.title = w.title + " — Sintija Kirsone";

    var t = window.Site.t;
    var text = t(w.text).split(/\n\s*\n/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var pubs = "";
    if (w.publications && w.publications.length) {
      pubs = '<div class="pubs"><h2>' + esc(t(window.UI.publications)) + '</h2><ul>' +
        w.publications.map(function (p) {
          return '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' +
            (p.source ? ' <span class="src">— ' + esc(p.source) + '</span>' : "") + '</li>';
        }).join("") + '</ul></div>';
    }
    // the page shows the first 3 photos; the viewer shows them all
    var shown = w.images.slice(0, 3), extra = w.images.length - shown.length;
    var imgs = shown.map(function (src, i) {
      var tag = '<img src="' + esc(src) + '" data-i="' + i + '" alt="' + esc(w.title) + ' — ' + (i + 1) + '">';
      if (i === shown.length - 1 && extra > 0) {
        tag = '<span class="shot">' + tag + '<span class="more">+' + extra + ' ' + esc(t(LABELS.more)) + '</span></span>';
      }
      return tag;
    });

    // neighbours for "next work"
    var idx = window.WORKS.indexOf(w);
    var next = window.WORKS[(idx + 1) % window.WORKS.length];

    page.innerHTML =
      '<div class="work-grid">' +
        '<div class="work-info">' +
          '<h1>' + esc(w.title) + '</h1>' +
          '<div class="facts">' +
            '<div>' + esc(w.year) + '</div>' +
            '<div>' + esc(t(w.materials)) + '</div>' +
            '<div class="tech-tags">' + w.techniques.map(function (x) { return esc(techName(x)); }).join(" / ") + '</div>' +
            creditsHtml(w) +
          '</div>' +
          '<div class="work-text">' + text + '</div>' +
          pubs +
          '<div class="media" style="margin-top:36px">' + (imgs[0] || "") + '</div>' +
        '</div>' +
        '<div class="media">' + videoHtml(w) + imgs.slice(1).join("") + '</div>' +
      '</div>' +
      '<nav class="work-nav">' +
        '<a href="index.html#all">← ' + esc(t(window.UI.back)) + '</a>' +
        '<a href="work.html#' + next.id + '">' + esc(t(window.UI.next)) + ' →</a>' +
      '</nav>';

    page.querySelectorAll(".video-box.yt").forEach(function (b) {
      b.addEventListener("click", function () { playYoutube(b); });
    });
    page.querySelectorAll(".media img").forEach(function (img) {
      if (img.closest(".video-box")) return;
      img.addEventListener("click", function () { openGallery(w, +img.getAttribute("data-i") || 0); });
    });
    window.scrollTo(0, 0);
  }

  /* ---------- photo viewer: arrows, keyboard and swiping ---------- */
  function openGallery(w, start) {
    var list = w.images, i = start, t = window.Site.t;
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", w.title);
    var many = list.length > 1;
    box.innerHTML =
      '<div class="lb-stage"><img alt=""></div>' +
      (many ? '<button type="button" class="lb-prev" aria-label="' + esc(t(LABELS.prev)) + '">' + ARROW_L + '</button>' : '') +
      '<button type="button" class="lb-next" aria-label="' + esc(t(LABELS.next)) + '">' + ARROW_R +
        '<span class="lb-work"><small>' + esc(t(LABELS.nextWork)) + '</small>' + esc(nextWork(w).title) + '</span></button>' +
      '<button type="button" class="lb-close" aria-label="' + esc(t(LABELS.close)) + '">' + CROSS + '</button>' +
      '<div class="lb-bar"><span class="lb-count"></span><span class="lb-credit"></span></div>';
    var img = box.querySelector(".lb-stage img");
    var c = w.credits || {};
    var nb = null;
    function atEnd() { return i === list.length - 1; }
    function goNextWork() {
      close();
      location.hash = nextWork(w).id;
    }
    function forward() { if (atEnd()) goNextWork(); else show(i + 1); }
    function show(n) {
      i = Math.max(0, Math.min(list.length - 1, n));
      nb = box.querySelector(".lb-next");
      nb.classList.toggle("to-work", atEnd());
      nb.setAttribute("aria-label", atEnd() ? t(LABELS.nextWork) + ": " + nextWork(w).title : t(LABELS.next));
      img.src = list[i];
      img.alt = w.title + " — " + (i + 1);
      box.querySelector(".lb-count").textContent = many ? (i + 1) + " / " + list.length : "";
      box.querySelector(".lb-credit").textContent = names(c.photo) ? t(LABELS.photo) + ": " + names(c.photo) : "";
      // load the neighbours early so switching is instant
      [i + 1, i - 1].forEach(function (k) { var p = new Image(); p.src = list[(k + list.length) % list.length]; });
    }
    function close() {
      box.remove();
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") forward();
      else if (e.key === "ArrowLeft" && many) show(i === 0 ? list.length - 1 : i - 1);
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b && b.classList.contains("lb-prev")) show(i === 0 ? list.length - 1 : i - 1);
      else if (b && b.classList.contains("lb-next")) forward();
      else if (b && b.classList.contains("lb-close")) close();
      else if (!e.target.closest(".lb-stage img")) close();   // click beside the photo closes
    });
    // swipe left / right on phones
    var x0 = null;
    box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { if (dx < 0) forward(); else show(i === 0 ? list.length - 1 : i - 1); }
    });
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(box);
    show(i);
    box.querySelector(".lb-next").focus();
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.Site.buildChrome("works");
    render();
    window.addEventListener("hashchange", render);
    document.addEventListener("langchange", render);
    window.Site.startIdle();
  });
})();
