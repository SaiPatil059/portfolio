/**
 * bg.js — Warm particle mesh background
 * Draws connected nodes on a fixed canvas, evoking FEA meshes
 * and computational graphs. All colours stay in the warm dark palette.
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // ---- Config ----
  const CONFIG = {
    count:       55,          // number of particles
    speed:       0.28,        // max speed
    linkDist:    160,         // max distance to draw a link
    nodeRadius:  1.4,         // circle radius
    nodeColor:   'rgba(175, 168, 155, 0.55)',
    linkColor:   'rgba(175, 168, 155, ',  // alpha appended dynamically
    bgColor:     '#1a1917',
    mouseRadius: 120,         // attraction radius for mouse
    mouseStrength: 0.018,
  };

  let W, H, particles, mouse = { x: -999, y: -999 };

  // ---- Particle ----
  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = CONFIG.nodeRadius + Math.random() * 0.8;
      this.opacity = 0.3 + Math.random() * 0.5;
    }

    update() {
      // Gentle mouse attraction
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        this.vx += (dx / dist) * force * CONFIG.mouseStrength;
        this.vy += (dy / dist) * force * CONFIG.mouseStrength;
      }

      // Dampen velocity
      this.vx *= 0.998;
      this.vy *= 0.998;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges softly
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.nodeColor;
      ctx.fill();
    }
  }

  // ---- Init ----
  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  // ---- Draw links between nearby particles ----
  function drawLinks() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDist) {
          const alpha = (1 - dist / CONFIG.linkDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = CONFIG.linkColor + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  // ---- Animate ----
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLinks();
    requestAnimationFrame(animate);
  }

  // ---- Mouse tracking ----
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  // ---- Resize ----
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      init();
    }, 150);
  });

  // ---- Start ----
  init();
  animate();
})();
