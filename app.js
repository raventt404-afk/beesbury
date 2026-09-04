/* ─────────────────────────────────────────────────────────────
   RAVEN404 Portfolio — app.js
───────────────────────────────────────────────────────────── */

'use strict';

/* ── NAV SCROLL EFFECT ──────────────────────────────────────── */
const nav = document.getElementById('nav');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE BURGER MENU ─────────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  // animate burger icon
  burger.classList.toggle('active', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('active');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.classList.remove('active');
  }
});

/* ── ACTIVE NAV LINK HIGHLIGHTING ───────────────────────────── */
const sections     = document.querySelectorAll('section[id]');
const navLinkItems = navLinks.querySelectorAll('a[href^="#"]');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinkItems.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

/* ── SCROLL REVEAL ANIMATIONS ───────────────────────────────── */
const revealEls = document.querySelectorAll(
  '.service-card, .project-card--featured, .why-card, .module-item, ' +
  '.process-step, .contact-info-card, .tool-feature, .about__text, ' +
  '.why-grid, .hero__badge, .hero__title, .hero__sub, .hero__actions, ' +
  '.hero__stats, .section__header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── STAGGERED CARD ANIMATIONS ──────────────────────────────── */
const staggerGroups = [
  '.services__grid .service-card',
  '.why-grid .why-card',
  '.tool-feature__modules .module-item',
  '.process__steps .process-step',
];

staggerGroups.forEach(selector => {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
});

/* ── COPY BUTTON ─────────────────────────────────────────────── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      const original = btn.innerHTML;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--clr-accent)"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => { btn.innerHTML = original; }, 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  });
});

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── ANIMATED COUNTER FOR STATS ─────────────────────────────── */
const statNums = document.querySelectorAll('.stat__num');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const raw   = el.textContent;
  const num   = parseFloat(raw);
  const suffix = raw.replace(/[\d.]/g, '');

  if (isNaN(num)) return;

  const duration = 1200;
  const steps    = 40;
  const increment = num / steps;
  let current = 0;
  let step    = 0;

  const timer = setInterval(() => {
    step++;
    current = step >= steps ? num : current + increment;
    const display = Number.isInteger(num) ? Math.round(current) : current.toFixed(1);
    el.textContent = display + suffix;
    if (step >= steps) clearInterval(timer);
  }, duration / steps);
}
