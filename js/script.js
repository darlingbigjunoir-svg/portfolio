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

  // ============================================================
  //  UPDATED setupForm — now sends data to your real backend!
  // ============================================================
  function setupForm() {
    if (!contactForm) return;

    var nameInput    = contactForm.querySelector("#contact-name");
    var emailInput   = contactForm.querySelector("#contact-email");
    var messageInput = contactForm.querySelector("#contact-message");
    var submitBtn    = contactForm.querySelector("button[type='submit']");
    var note         = contactForm.querySelector(".form-note");

    function showMessage(text, isError) {
      if (!note) return;
      note.textContent = text;
      note.style.color = isError ? "#dc2626" : "#16a34a";
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the page from reloading

      var nameVal    = nameInput    ? nameInput.value.trim()    : "";
      var emailVal   = emailInput   ? emailInput.value.trim()   : "";
      var messageVal = messageInput ? messageInput.value.trim() : "";
      var emailOk    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      // Validate on the frontend first (quick check before hitting the server)
      if (!nameVal || !emailVal || !messageVal || !emailOk) {
        showMessage("Please fill all fields with a valid email address.", true);
        return;
      }

      // Disable the button and show loading text so they don't click twice
      if (submitBtn) {
        submitBtn.disabled    = true;
        submitBtn.textContent = "Sending...";
      }
      showMessage("", false); // clear any old message

      // Send the data to our backend server using fetch()
      // fetch() is a built-in browser tool for talking to a server
      fetch("/send-email", {
        method:  "POST",                              // POST = sending data
        headers: { "Content-Type": "application/json" }, // tell server we're sending JSON
        body: JSON.stringify({                        // convert data to JSON text
          name:    nameVal,
          email:   emailVal,
          message: messageVal,
        }),
      })
        .then(function (response) {
          // .then() runs when the server replies
          return response.json(); // read the reply as JSON
        })
        .then(function (data) {
          // data is what the server sent back
          if (data.success) {
            // It worked! 🎉
            showMessage(data.message, false);
            contactForm.reset(); // clear the form fields
          } else {
            // Server replied but said something went wrong
            showMessage(data.message || "Something went wrong. Please try again.", true);
          }
        })
        .catch(function (error) {
          // .catch() runs if the server is unreachable (e.g. server not running)
          console.error("Network error:", error);
          showMessage("Could not reach the server. Make sure it is running.", true);
        })
        .finally(function () {
          // .finally() always runs — re-enable the button either way
          if (submitBtn) {
            submitBtn.disabled    = false;
            submitBtn.textContent = "Send message";
          }
        });
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


(function () {
  'use strict';

  const track  = document.getElementById('testimonialsTrack');
  const dots   = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !dots.length) return;

  const total = dots.length;
  let current = 0;
  let autoTimer = null;

  /* ── Core: move to slide ── */
  function goTo(index) {
    // Clamp with wrap-around
    current = (index + total) % total;

    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle('dot--active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  /* ── Auto-advance every 5 s ── */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* ── Dot clicks ── */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.index));
      stopAuto();
      startAuto(); // restart timer after manual interaction
    });
  });

  /* ── Arrow clicks ── */
  prevBtn.addEventListener('click', () => {
    goTo(current - 1);
    stopAuto();
    startAuto();
  });

  nextBtn.addEventListener('click', () => {
    goTo(current + 1);
    stopAuto();
    startAuto();
  });

  /* ── Keyboard support (left / right arrows) ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); stopAuto(); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); startAuto(); }
  });

  /* ── Touch / swipe support ── */
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return; // ignore tiny swipes
    goTo(delta < 0 ? current + 1 : current - 1);
    stopAuto();
    startAuto();
  }, { passive: true });

  /* ── Pause auto-play when tab is hidden ── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  /* ── Init ── */
  goTo(0);
  startAuto();

})();