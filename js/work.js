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
  function currentWork() {
    var id = (location.hash || "").replace("#", "");
    return window.WORKS.filter(function (w) { return w.id === id; })[0];
  }

  /* YouTube / Vimeo: find the video id in any kind of link */
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
    var poster = w.images[1] || w.images[0] || "";
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
    var imgs = w.images.map(function (src, i) {
      return '<img src="' + esc(src) + '" alt="' + esc(w.title) + ' — ' + (i + 1) + '" loading="' + (i < 2 ? "eager" : "lazy") + '">';
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
      img.addEventListener("click", function () { openLightbox(img.src, img.alt); });
    });
    window.scrollTo(0, 0);
  }

  function openLightbox(src, alt) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", alt);
    box.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt) + '">';
    function close() { box.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    box.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(box);
  }

  document.addEventListener("DOMContentLoaded", function () {
    window.Site.buildChrome("works");
    render();
    window.addEventListener("hashchange", render);
    document.addEventListener("langchange", render);
    window.Site.startIdle();
  });
})();
