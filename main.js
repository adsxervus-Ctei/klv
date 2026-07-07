(function () {
  "use strict";
  var B = window.__BRAND__ || {};
  function safe(fn, n) { try { fn(); } catch (e) { console.warn("[init]" + n, e); } }

  /* Splash */
  function initSplash() {
    var s = document.getElementById("splash"); if (!s) return;
    var hide = function () { s.classList.add("hidden"); };
    window.addEventListener("load", function () { setTimeout(hide, 900); });
    setTimeout(hide, 4500);
  }

  /* Nav solidify */
  function initNav() {
    var nav = document.getElementById("nav");
    var on = function () { if (window.scrollY > 40) nav.classList.add("solid"); else nav.classList.remove("solid"); };
    window.addEventListener("scroll", on, { passive: true }); on();
  }

  /* Hero background video: reveal only if it can play; else animated fallback stays */
  function initHeroVideo() {
    var v = document.getElementById("heroVideo"); if (!v) return;
    v.addEventListener("playing", function () { v.classList.add("on"); });
    v.addEventListener("loadeddata", function () { if (v.readyState >= 2) { try { v.play(); } catch (e) {} } });
    var p = v.play && v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* Reveal */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 60 + "ms"; io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add("in"); }); }, 6000);
  }

  /* Global links: WhatsApp + PDF */
  function initLinks() {
    document.querySelectorAll("[data-pdf]").forEach(function (a) {
      a.setAttribute("href", B.pdf || "#"); a.setAttribute("download", ""); a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener");
    });
    var wa = "https://wa.me/" + (B.whatsapp || "") + "?text=" + encodeURIComponent("Hola " + (B.manager || "") + ", quisiera coordinar una presentación de K-LIBRE VALLENATO.");
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.setAttribute("href", wa); });
  }

  /* Floating video modal (mismo efecto que la galería) */
  function initVideoModal() {
    var lb = document.getElementById("videoLb");
    var vid = document.getElementById("vlbVideo");
    var closeBtn = document.getElementById("vlbClose");
    if (!lb || !vid) return;
    var open = function (e) {
      if (e) e.preventDefault();
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      var p = vid.play && vid.play(); if (p && p.catch) p.catch(function () {});
    };
    var close = function () {
      lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
      try { vid.pause(); } catch (e) {}
    };
    document.querySelectorAll("[data-video]").forEach(function (btn) { btn.addEventListener("click", open); });
    closeBtn && closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && lb.classList.contains("open")) close(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    safe(initSplash, "splash");
    safe(initNav, "nav");
    safe(initHeroVideo, "hero");
    safe(initReveal, "reveal");
    safe(initLinks, "links");
    safe(initVideoModal, "videoModal");
  });
})();
