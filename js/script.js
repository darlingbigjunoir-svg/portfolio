(function () {
  "use strict";

  var doc = document;
  var menuToggle = doc.getElementById("menu-toggle");
  var nav = doc.getElementById("site-nav");
  var header = doc.querySelector(".site-header");
  var topArrow = doc.querySelector(".top-arrow");
  var navLinks = nav ? nav.querySelectorAll("a[href^='#']") : [];
  var contactForm = doc.querySelector(".contact-form");

  function isMobileMenuOpen() {
    return !!(nav && nav.classList.contains("is-open"));
  }

  function closeMobileMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function openMobileMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function setupMenu() {
    if (!menuToggle || !nav) return;

    menuToggle.addEventListener("click", function () {
      if (isMobileMenuOpen()) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeMobileMenu();
      });
    });

    doc.addEventListener("click", function (event) {
      if (!isMobileMenuOpen()) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMobileMenu();
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isMobileMenuOpen()) {
        closeMobileMenu();
      }
    });
  }

  function updateOnScroll() {
    var y = window.scrollY || doc.documentElement.scrollTop;
    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }
    if (topArrow) {
      topArrow.classList.toggle("visible", y > 400);
    }
  }

  function setupActiveSectionTracking() {
    var sectionIds = [];
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var section = doc.querySelector(href);
      if (!section) return;
      sectionIds.push({ id: href, link: link, section: section });
    });

    if (!sectionIds.length) return;

    function setActiveLink() {
      var fromTop = (window.scrollY || doc.documentElement.scrollTop) + 120;
      var current = sectionIds[0];

      sectionIds.forEach(function (item) {
        if (item.section.offsetTop <= fromTop) {
          current = item;
        }
      });

      sectionIds.forEach(function (item) {
        var isActive = item === current;
        item.link.classList.toggle("is-active", isActive);
        if (isActive) {
          item.link.setAttribute("aria-current", "page");
        } else {
          item.link.removeAttribute("aria-current");
        }
      });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
  }

  function setupRevealAnimations() {
    var revealEls = doc.querySelectorAll(
      ".hero, .about-card, .service-card, .process-card, .portfolio-card, .contact-layout"
    );

    if (!("IntersectionObserver" in window) || !revealEls.length) return;

    revealEls.forEach(function (el, index) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(index * 40, 260) + "ms";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupForm() {
    if (!contactForm) return;

    var nameInput = contactForm.querySelector("#contact-name");
    var emailInput = contactForm.querySelector("#contact-email");
    var messageInput = contactForm.querySelector("#contact-message");
    var submitBtn = contactForm.querySelector("button[type='submit']");

    function showMessage(text, isError) {
      var note = contactForm.querySelector(".form-note");
      if (!note) return;
      note.textContent = text;
      note.style.color = isError ? "#dc2626" : "#16a34a";
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var nameVal = nameInput ? nameInput.value.trim() : "";
      var emailVal = emailInput ? emailInput.value.trim() : "";
      var messageVal = messageInput ? messageInput.value.trim() : "";
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      if (!nameVal || !emailVal || !messageVal || !emailOk) {
        showMessage("Please fill all fields with a valid email address.", true);
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      window.setTimeout(function () {
        contactForm.reset();
        showMessage("Thank you. Your message has been captured successfully.", false);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        }
      }, 650);
    });
  }

  function init() {
    setupMenu();
    setupRevealAnimations();
    setupActiveSectionTracking();
    setupForm();
    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
  }

  init();
})();
