/**
 * motion.js — Lightweight motion graphics
 * Draws a flowing particle mesh that responds to scroll position,
 * creating a living, breathing background texture.
 */

(function () {
  const canvas = document.getElementById('motion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ---- Config ----
  const CONFIG = {
    particleCount: 45,
    maxSpeed: 0.3,
    linkDistance: 140,
    particleRadius: 1.2,
    particleColor: 'rgba(37, 99, 235, 0.25)',
    linkBaseColor: [37, 99, 235],
    linkMaxAlpha: 0.08,
    mouseRadius: 150,
    mouseStrength: 0.015,
    scrollInfluence: 0.0003,
  };

  let W, H, particles = [];
  let mouse = { x: -9999, y: -9999 };
  let scrollY = 0;
  let animId;

  // ---- Particle ----
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.baseVx = (Math.random() - 0.5) * CONFIG.maxSpeed;
      this.baseVy = (Math.random() - 0.5) * CONFIG.maxSpeed;
      this.vx = this.baseVx;
      this.vy = this.baseVy;
      this.r = CONFIG.particleRadius + Math.random() * 0.6;
      this.opacity = 0.3 + Math.random() * 0.4;
      this.phase = Math.random() * Math.PI * 2;
    }

    update(time) {
      // Gentle sinusoidal wobble
      const wobble = Math.sin(time * 0.001 + this.phase) * 0.05;
      this.vx = this.baseVx + wobble;
      this.vy = this.baseVy + Math.cos(time * 0.0008 + this.phase) * 0.04;

      // Scroll influence — particles drift based on scroll
      this.vy += scrollY * CONFIG.scrollInfluence;

      // Mouse interaction — gentle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        this.vx -= (dx / dist) * force * CONFIG.mouseStrength;
        this.vy -= (dy / dist) * force * CONFIG.mouseStrength;
      }

      // Damping
      this.vx *= 0.995;
      this.vy *= 0.995;

      this.x += this.vx;
      this.y += this.vy;

      // Soft wrap
      if (this.x < -30) this.x = W + 30;
      if (this.x > W + 30) this.x = -30;
      if (this.y < -30) this.y = H + 30;
      if (this.y > H + 30) this.y = -30;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.particleColor;
      ctx.fill();
    }
  }

  // ---- Initialize ----
  function init() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: CONFIG.particleCount }, () => new Particle());
  }

  // ---- Draw links ----
  function drawLinks() {
    const [r, g, b] = CONFIG.linkBaseColor;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const bP = particles[j];
        const dx = a.x - bP.x;
        const dy = a.y - bP.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDistance) {
          const alpha = (1 - dist / CONFIG.linkDistance) * CONFIG.linkMaxAlpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bP.x, bP.y);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  // ---- Animation loop ----
  function animate(time) {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.update(time);
      p.draw();
    });

    drawLinks();
    animId = requestAnimationFrame(animate);
  }

  // ---- Event listeners ----
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // Resize — debounced
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      init();
    }, 200);
  });

  // ---- Start ----
  init();
  animate(0);
})();
