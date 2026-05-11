/* ============================================================
   pro-additions.js — Kaku Awuah Portfolio
   Skills animation, Back-to-top, Scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. SKILL BARS — animate fill width when scrolled into view ── */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar   = entry.target;
        const level = bar.dataset.level || '0';
        const fill  = bar.querySelector('.skill-bar__fill');
        if (fill) fill.style.width = level + '%';
        observer.unobserve(bar);          // animate once
      });
    }, { threshold: 0.3 });

    bars.forEach((bar) => observer.observe(bar));
  }

  /* ── 2. BACK TO TOP — show after scrolling 400 px ── */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. SCROLL REVEAL — fade + rise elements with class .reveal ── */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach((el) => observer.observe(el));
  }

  /* ── 4. FAQ — close other open items when one opens ── */
  function initFaqAccordion() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach((other) => {
            if (other !== item && other.open) other.removeAttribute('open');
          });
        }
      });
    });
  }

  /* ── 5. AUTO-ADD .reveal to key sections (optional helper) ──
     If you don't want to add .reveal manually to every element,
     this targets headings and cards automatically. Remove if unneeded. */
  function autoReveal() {
    const selectors = [
      '.skills__header',
      '.skill-bar',
      '.tool-chip',
      '.faq__header',
      '.faq__item',
    ];

    selectors.forEach((sel, sectionIndex) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        // Stagger delay within the same selector group
        const delay = Math.min(i, 4);
        if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
      });
    });
  }

  /* ── Init everything on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', () => {
    autoReveal();          // auto-tag elements (must run before initScrollReveal)
    initScrollReveal();
    initSkillBars();
    initBackToTop();
    initFaqAccordion();
  });

})();