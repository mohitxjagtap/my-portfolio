/* ═══════════════════════════════════════════
   MOHIT JAGTAP — PORTFOLIO  |  script.js
═══════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. 3D CANVAS PARTICLE BACKGROUND
────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, mouse = { x: -9999, y: -9999 };
  let particles = [];
  let lines     = [];
  let animId;

  const PARTICLE_COUNT = 90;
  const LINE_DIST      = 130;
  const COLORS         = ['#00e5ff', '#7b2fff', '#ff6b6b'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.z  = Math.random() * 2 + 0.3;          // pseudo-depth
      this.vx = (Math.random() - 0.5) * 0.45 * this.z;
      this.vy = (Math.random() - 0.5) * 0.45 * this.z;
      this.r  = Math.random() * 1.8 + 0.6;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha  = Math.random() * 0.5 + 0.2;
      this.pulse  = Math.random() * Math.PI * 2;
    }

    update() {
      this.pulse += 0.025;
      const dx = (mouse.x - this.x) * 0.00012 * this.z;
      const dy = (mouse.y - this.y) * 0.00012 * this.z;
      this.vx += dx;
      this.vy += dy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset();
    }

    draw() {
      const r = this.r * this.z;
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.floor(a * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const alpha = (1 - dist / LINE_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  resize();
  buildParticles();
  animate();
})();


/* ──────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let rx = 0, ry = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.querySelectorAll('a, button, [role="button"]').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
})();


/* ──────────────────────────────────────────
   3. NAVBAR — SCROLL + HAMBURGER
────────────────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────────
   4. DARK / LIGHT MODE TOGGLE
────────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const root = document.documentElement;

  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('portfolio-theme', next);
  });
})();


/* ──────────────────────────────────────────
   5. TYPING ANIMATION
────────────────────────────────────────── */
(function initTyping() {
  const el     = document.getElementById('typingText');
  if (!el) return;
  const words  = [
    'Passionate Programmer',
    'Tech Learner',
    'Web Dev Enthusiast',
    'Problem Solver',
    'Future Engineer'
  ];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word    = words[wi];
    const display = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    el.textContent = display;

    let speed = deleting ? 60 : 100;
    if (!deleting && ci === word.length + 1) {
      speed = 1800; deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      speed = 350;
    }
    setTimeout(type, speed);
  }
  type();
})();


/* ──────────────────────────────────────────
   6. SCROLL REVEAL
────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings in same parent
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
          : [];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();


/* ──────────────────────────────────────────
   7. SKILL BAR ANIMATION (scroll-triggered)
────────────────────────────────────────── */
(function initSkills() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const pcts = document.querySelectorAll('.skill-pct');

  function animateCounter(el, target) {
    let current = 0;
    const step  = target / 60;
    const tick  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + '%';
      if (current >= target) clearInterval(tick);
    }, 20);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const w    = fill.dataset.width;
        fill.style.width = w + '%';
        const pct  = fill.closest('.skill-card').querySelector('.skill-pct');
        if (pct) animateCounter(pct, parseInt(w));
        io.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(b => io.observe(b));
})();


/* ──────────────────────────────────────────
   8. STAT COUNTER ANIMATION
────────────────────────────────────────── */
(function initStats() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const tick   = setInterval(() => {
          current++;
          el.textContent = current;
          if (current >= target) clearInterval(tick);
        }, 120);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
})();


/* ──────────────────────────────────────────
   9. CERTIFICATE MODAL
────────────────────────────────────────── */
(function initCerts() {
  const modal       = document.getElementById('certModal');
  const closeBtn    = document.getElementById('modalClose');
  const modalContent = document.getElementById('modalContent');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const thumb = card.querySelector('.cert-thumb').cloneNode(true);
      thumb.style.width  = '400px';
      thumb.style.maxWidth = '80vw';
      thumb.style.height = 'auto';
      thumb.style.borderRadius = '12px';
      modalContent.innerHTML = '';
      modalContent.appendChild(thumb);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();


/* ──────────────────────────────────────────
   10. PARALLAX HERO ON MOUSE MOVE
────────────────────────────────────────── */
(function initParallax() {
  const hero    = document.getElementById('hero');
  const visual  = document.querySelector('.hero-visual');
  const content = document.querySelector('.hero-content');

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = (e.clientX - cx) / cx;
    const ry = (e.clientY - cy) / cy;

    if (visual) {
      visual.style.transform = `translate(${rx * 12}px, ${ry * 8}px)`;
    }
    if (content) {
      content.style.transform = `translate(${rx * -4}px, ${ry * -3}px)`;
    }
  });
})();


/* ──────────────────────────────────────────
   11. ACTIVE NAV LINK ON SCROLL
────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));

  // Style active link
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--text); }
  .nav-link.active::after { width: 100%; }`;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────
   12. PROJECT CARD 3D TILT
────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
