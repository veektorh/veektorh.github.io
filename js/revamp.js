/* revamp.js — Bolum Victor Portfolio 2026 */

// Theme toggle
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Page load fade-in
window.addEventListener('load', () => document.body.classList.remove('loading'));

// Cursor glow
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
}, { passive: true });

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Sticky nav
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Mobile nav toggle
const toggle   = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function openNav() {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  toggle.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}
function closeNav() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

toggle.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeNav() : openNav();
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || (i * 80);
      setTimeout(() => el.classList.add('visible'), parseInt(delay));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i * 60;
  revealObserver.observe(el);
});

// Typewriter
const phrases = ['& Full-Stack Dev', '& Systems Architect', '& .NET Specialist', '& Angular Enthusiast'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIdx];
  tw.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);

  if (!deleting && charIdx === current.length + 1) {
    deleting = true;
    setTimeout(type, 2000);
    return;
  }
  if (deleting && charIdx < 0) {
    deleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(type, 400);
    return;
  }
  setTimeout(type, deleting ? 45 : 80);
}
setTimeout(type, 800);

// Active nav highlight
const navAnchors = document.querySelectorAll('[data-nav]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
