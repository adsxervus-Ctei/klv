(function () {
  "use strict";
  var B = window.__BRAND__ || {};

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[init] " + name + " falló:", e); }
  }

  /* ---------- Splash ---------- */
  function initSplash() {
    var s = document.getElementById("splash");
    if (!s) return;
    var hide = function () { s.classList.add("hidden"); };
    window.addEventListener("load", function () { setTimeout(hide, 900); });
    setTimeout(hide, 4500); // red de seguridad
  }

  /* ---------- Nav ---------- */
  function initNav() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("solid");
      else nav.classList.remove("solid");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toggle && links) {
      toggle.addEventListener("click", function () { links.classList.toggle("open"); });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(el); });
    // red de seguridad: revela todo tras 6s
    setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 6000);
  }

  /* ---------- Count-up ---------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    var run = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var start = null, dur = 1400;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.round(target * (0.5 - Math.cos(Math.PI * p) / 2));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------- Tilt 3D ---------- */
  function initTilt() {
    if (matchMedia("(hover:none)").matches) return;
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(800px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Video player ---------- */
  function initPlayer() {
    var overlay = document.getElementById("playerOverlay");
    var btn = document.getElementById("playBtn");
    var video = document.getElementById("klVideo");
    var frame = document.querySelector(".player-frame");
    if (!overlay || !frame) return;

    function useYouTube(id) {
      var ifr = document.createElement("iframe");
      ifr.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
      ifr.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      ifr.setAttribute("allowfullscreen", "");
      if (video) video.remove();
      frame.insertBefore(ifr, overlay);
      overlay.classList.add("gone");
    }

    var play = function () {
      if (B.youtubeId) { useYouTube(B.youtubeId); return; }
      if (video) {
        video.setAttribute("controls", "");
        var p = video.play();
        overlay.classList.add("gone");
        if (p && p.catch) p.catch(function () { overlay.classList.remove("gone"); });
      }
    };
    btn && btn.addEventListener("click", play);
    overlay.addEventListener("click", play);
  }

  /* ---------- PDF + WhatsApp links ---------- */
  function initLinks() {
    // PDF
    document.querySelectorAll("[data-pdf]").forEach(function (a) {
      a.setAttribute("href", B.pdf || "#");
      a.setAttribute("download", "");
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
    // WhatsApp
    var wa = "https://wa.me/" + (B.whatsapp || "") +
      "?text=" + encodeURIComponent("Hola " + (B.manager || "") + ", quisiera coordinar una presentación de K LIBRE VALLENATO.");
    ["ccWa", "waBig"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("href", wa);
    });
    var num = document.getElementById("ccWaNum");
    if (num && B.whatsappDisplay) num.textContent = B.whatsappDisplay;
    var mgr = document.getElementById("ccManager");
    if (mgr && B.manager) mgr.textContent = B.manager;
    var yr = document.getElementById("year");
    if (yr) yr.textContent = new Date().getFullYear();
  }

  /* ---------- Anchor smooth (nativo, robusto) ---------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id === "#" || id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initReveal, "reveal");
    safe(initCounters, "counters");
    safe(initTilt, "tilt");
    safe(initPlayer, "player");
    safe(initLinks, "links");
    safe(initAnchors, "anchors");
  });
})();
