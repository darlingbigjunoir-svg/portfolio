(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  const header = document.querySelector(".site-header");
  const topArrow = document.querySelector(".top-arrow");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) {
      header.classList.toggle("is-scrolled", y > 8);
    }
    if (topArrow) {
      topArrow.classList.toggle("visible", y > 400);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var revealEls = document.querySelectorAll(
    ".hero, .about-card, .service-card, .process-card, .portfolio-card, .contact-layout"
  );
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
