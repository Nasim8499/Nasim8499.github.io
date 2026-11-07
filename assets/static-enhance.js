/* Small, dependency-free helper for the static export.
   The original app was a React SPA; these pages are plain HTML, so the
   few interactive bits the design needs are wired up here. No styling. */
(function () {
  "use strict";

  var LABEL_TARGETS = {
    incorporation: "/sg/incorporation/",
    accounting: "/sg/accounting-services-singapore/",
    secretary: "/sg/company-secretary-singapore/",
    "corporate secretary": "/sg/company-secretary-singapore/",
    resources: "/guides/",
    about: "/about-us/",
    pricing: "/sg/pricing/"
  };

  function labelOf(el) {
    return (el.textContent || "").trim().toLowerCase();
  }

  /* Header dropdown buttons have no panel in a static export, so they
     navigate straight to the section they describe. */
  document.querySelectorAll(".desktop-nav button.nav-link").forEach(function (btn) {
    var target = LABEL_TARGETS[labelOf(btn)];
    if (!target) return;
    btn.dataset.href = target;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = btn.dataset.href;
    });
    btn.style.cursor = "pointer";
  });

  /* Mobile menu: build a sheet from the footer navigation. */
  var menuBtn = document.querySelector(".mobile-menu-button");
  if (menuBtn) {
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      var open = document.querySelector(".static-mobile-menu");
      if (open) {
        open.remove();
        menuBtn.setAttribute("aria-expanded", "false");
        return;
      }
      var sheet = document.createElement("div");
      sheet.className = "static-mobile-menu";
      sheet.setAttribute(
        "style",
        "position:fixed;inset:80px 0 0 0;z-index:200;overflow:auto;padding:20px 22px 40px;" +
          "background:rgba(255,255,255,.94);backdrop-filter:blur(28px) saturate(190%);" +
          "-webkit-backdrop-filter:blur(28px) saturate(190%);"
      );
      var close = document.createElement("button");
      close.textContent = "Close";
      close.className = "button button-outline";
      close.style.marginBottom = "16px";
      close.addEventListener("click", function () {
        sheet.remove();
        menuBtn.setAttribute("aria-expanded", "false");
      });
      sheet.appendChild(close);

      var seen = {};
      document.querySelectorAll("footer a[href^='/']").forEach(function (a) {
        var href = a.getAttribute("href");
        if (seen[href]) return;
        seen[href] = 1;
        var row = document.createElement("a");
        row.href = href;
        row.textContent = a.textContent.trim();
        row.style.cssText =
          "display:block;padding:12px 0;font-size:17px;color:var(--ink);border-bottom:1px solid var(--line);";
        sheet.appendChild(row);
      });
      document.body.appendChild(sheet);
      menuBtn.setAttribute("aria-expanded", "true");
    });
  }

  /* Country picker buttons: keep them usable by sending people to the SG home. */
  document.querySelectorAll(".country-button").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "/sg/";
    });
  });

  /* Buttons that used to open a signup modal now go to the contact page. */
  document.querySelectorAll("button.button-primary").forEach(function (b) {
    if (b.classList.contains("nav-cta")) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "/contact/";
      });
    }
  });
})();

/* Scroll reveal: the original app animated these in with React. */
(function () {
  var items = [].slice.call(document.querySelectorAll('[style*="opacity:0"]'));
  if (!items.length) return;
  function show(el) {
    el.style.transition = "opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)";
    el.style.opacity = "1";
    el.style.transform = "none";
  }
  if (!("IntersectionObserver" in window)) {
    items.forEach(show);
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          show(en.target);
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
  );
  items.forEach(function (el) {
    io.observe(el);
  });
  /* Safety net: nothing stays invisible. */
  setTimeout(function () {
    items.forEach(show);
  }, 2500);
})();
