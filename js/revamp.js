/* revamp.js — Bolum Victor Portfolio 2026 */

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getTheme() {
  try { return localStorage.getItem('theme') || 'dark'; } catch(e) { return 'dark'; }
}
function setTheme(t) {
  try { localStorage.setItem('theme', t); } catch(e) {}
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    setTheme(next);
  });
}

// ─── Year ─────────────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Cursor glow ──────────────────────────────────────────────────────────────
const glow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
}, { passive: true });

// ─── Sticky nav + back-to-top ─────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Mobile nav ───────────────────────────────────────────────────────────────
const toggle     = document.getElementById('navToggle');
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
toggle.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeNav() : openNav());
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

// ─── Active nav ───────────────────────────────────────────────────────────────
const navAnchors = document.querySelectorAll('[data-nav]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

// ─── Typewriter ───────────────────────────────────────────────────────────────
const phrases = ['& Full-Stack Dev', '& Systems Architect', '& .NET Specialist', '& Angular Enthusiast'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  const current = phrases[phraseIdx];
  tw.textContent = deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++);
  if (!deleting && charIdx === current.length + 1) { deleting = true; setTimeout(type, 2000); return; }
  if (deleting && charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
  setTimeout(type, deleting ? 45 : 80);
}
setTimeout(type, 1400);

// ─── Scroll reveal (below-fold sections) ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || 0));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i * 60;
  revealObserver.observe(el);
});

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS — animated particle network
// ═══════════════════════════════════════════════════════════════════════════════
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isMobile = window.innerWidth < 600;
  const COUNT = isMobile ? 30 : 70;
  const CONNECT_DIST = isMobile ? 100 : 160;
  let W, H, mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  function accentRgb() {
    return root.getAttribute('data-theme') === 'light' ? '9,105,218' : '88,166,255';
  }

  const dots = Array.from({ length: COUNT }, () => ({
    x: Math.random() * (typeof W !== 'undefined' ? W : window.innerWidth),
    y: Math.random() * (typeof H !== 'undefined' ? H : window.innerHeight),
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.5 + 0.8,
  }));

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const rgb = accentRgb();

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;

      // slight attraction toward cursor
      const dx = mouse.x - d.x, dy = mouse.y - d.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 200) {
        d.vx += dx * 0.00008;
        d.vy += dy * 0.00008;
      }
      // speed cap
      const speed = Math.sqrt(d.vx*d.vx + d.vy*d.vy);
      if (speed > 0.8) { d.vx = (d.vx/speed)*0.8; d.vy = (d.vy/speed)*0.8; }

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, 0.7)`;
      ctx.fill();
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - d/CONNECT_DIST) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

// ═══════════════════════════════════════════════════════════════════════════════
// GSAP — hero entrance + scroll animations
// ═══════════════════════════════════════════════════════════════════════════════
function onReady(fn) {
  if (document.readyState === 'complete') fn();
  else window.addEventListener('load', fn);
}

onReady(() => {
  document.body.classList.remove('loading');

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);

  // ── Hero name character split (desktop only) ───────────────────────────────
  const nameWord = document.querySelector('.hero__name-word');
  const nameText = 'Bolum Victor.';
  const mobile = window.innerWidth < 900;

  if (!mobile) {
    nameWord.style.whiteSpace = 'nowrap';
    nameWord.innerHTML = nameText.split('').map(ch => {
      if (ch === ' ') return '<span class="char" style="display:inline-block;width:0.3em">&nbsp;</span>';
      if (ch === '.') return '<span class="char" style="color:var(--accent)">.</span>';
      return `<span class="char">${ch}</span>`;
    }).join('');
  } else {
    nameWord.innerHTML = 'Bolum Victor<span style="color:var(--accent)">.</span>';
  }

  // ── Hero entrance — independent from() calls, nothing blocks anything ───────
  const E = 'power3.out';

  gsap.from('.hero__greeting',    { opacity: 0, y: 20, duration: 0.6, ease: E, delay: 0.1 });
  gsap.from('.hero__title',       { opacity: 0, y: 20, duration: 0.6, ease: E, delay: 0.45 });
  gsap.from('.hero__availability',{ opacity: 0, y: 16, duration: 0.5, ease: E, delay: 0.55 });
  gsap.from('.hero__bio',         { opacity: 0, y: 16, duration: 0.5, ease: E, delay: 0.65 });
  gsap.from('.hero__actions',     { opacity: 0, y: 16, duration: 0.5, ease: E, delay: 0.75 });
  gsap.from('.hero__socials',     { opacity: 0, y: 12, duration: 0.5, ease: E, delay: 0.85 });

  if (!mobile) {
    gsap.from('.hero__photo', { opacity: 0, x: 40, duration: 0.8, ease: E, delay: 0.2 });
    const chars = nameWord.querySelectorAll('.char');
    gsap.from(chars, {
      opacity: 0, y: 60, rotateX: -60,
      transformOrigin: '50% 100%',
      duration: 0.65, stagger: 0.04,
      ease: 'back.out(1.8)',
      delay: 0.25,
    });
  } else {
    gsap.from('.hero__photo', { opacity: 0, y: -20, duration: 0.6, ease: E, delay: 0.1 });
    gsap.from('.hero__name',  { opacity: 0, y: 24,  duration: 0.6, ease: E, delay: 0.25 });
  }

  // ── Safety fallback: if GSAP stalls, force hero visible after 2s ────────────
  setTimeout(() => {
    const heroSels = ['.hero__greeting','.hero__name','.hero__title',
      '.hero__availability','.hero__bio','.hero__actions','.hero__socials','.hero__photo'];
    heroSels.forEach(sel => {
      const el = document.querySelector(sel);
      if (el && parseFloat(getComputedStyle(el).opacity) < 0.5) {
        el.style.cssText += ';opacity:1!important;transform:none!important;';
      }
    });
  }, 2000);

  // ── Section title reveal on scroll ─────────────────────────────────────────
  document.querySelectorAll('.section__title').forEach(title => {
    // wrap inner text so we can clip it
    title.innerHTML = `<span class="title-inner">${title.innerHTML}</span>`;
    gsap.from(title.querySelector('.title-inner'), {
      scrollTrigger: { trigger: title, start: 'top 85%', once: true },
      x: -40,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    });
  });

  // ── Skill tags stagger ─────────────────────────────────────────────────────
  document.querySelectorAll('.skill-group').forEach(group => {
    const tags = group.querySelectorAll('.tag');
    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        tags.forEach((tag, i) => {
          setTimeout(() => tag.classList.add('tag-visible'), i * 60);
        });
      },
    });
  });

  // ── Detail cards stagger ───────────────────────────────────────────────────
  gsap.utils.toArray('.detail-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', once: true },
      y: 20, opacity: 0, duration: 0.5,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });

  // ── Social links stagger ───────────────────────────────────────────────────
  gsap.utils.toArray('.social-link').forEach((link, i) => {
    gsap.from(link, {
      scrollTrigger: { trigger: link, start: 'top 92%', once: true },
      x: -30, opacity: 0, duration: 0.5,
      delay: i * 0.1,
      ease: 'power2.out',
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAGNETIC BUTTONS
// ═══════════════════════════════════════════════════════════════════════════════
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => btn.style.transition = '', 400);
  });
  btn.addEventListener('mouseenter', () => {
    btn.style.transition = 'transform 0.1s ease';
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PHOTO 3-D TILT
// ═══════════════════════════════════════════════════════════════════════════════
const photoWrap = document.querySelector('.hero__photo');
const photoImg  = document.getElementById('heroPhoto');
if (photoWrap && photoImg) {
  photoWrap.addEventListener('mousemove', e => {
    const rect = photoWrap.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y = (e.clientY - rect.top)   / rect.height - 0.5;
    photoImg.style.transform =
      `perspective(700px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.05)`;
    photoImg.style.boxShadow =
      `${-x*20}px ${-y*20}px 60px rgba(0,0,0,0.5), 0 0 0 6px var(--surface)`;
  });
  photoWrap.addEventListener('mouseleave', () => {
    photoImg.style.transform = '';
    photoImg.style.boxShadow = '';
  });
}
