/* ============================================
   JavaScript — Interactions & Animations
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const scrollThreshold = 20;

window.addEventListener('scroll', () => {
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
}, { passive: true });

// ---- Active nav link on scroll ----
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop <= 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ---- Hamburger mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  // Animate hamburger lines
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- Scroll reveal ----
const revealElements = document.querySelectorAll(
  '.section-heading, .body-text, .project-featured, .project-card, .skill-group, .timeline-item, .contact-link-card, .about-meta, .hero-stats, .profile-card, .education-card, .languages-block'
);

revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger the animation for siblings
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---- Stagger reveal for grids ----
function staggerReveal(parentSelector, childSelector, delay = 100) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, i * delay);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(parent);
  });
}

staggerReveal('.projects-grid', '.project-card', 120);
staggerReveal('.skills-grid', '.skill-group', 100);
staggerReveal('.contact-links', '.contact-link-card', 80);

// ---- Skill bar animation ----
const skillBars = document.querySelectorAll('.skill-fill');
skillBars.forEach(bar => {
  const finalWidth = bar.style.width;
  bar.style.width = '0%';

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.width = finalWidth;
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(bar);
});

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Terminal typing animation ----
function typeText(el, text, speed = 40) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// Trigger terminal animation when in view
const terminalWindow = document.querySelector('.terminal-window');
if (terminalWindow) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        terminalWindow.style.opacity = '0';
        setTimeout(() => {
          terminalWindow.style.transition = 'opacity 0.5s ease';
          terminalWindow.style.opacity = '1';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(terminalWindow);
}

// ---- Add subtle parallax to hero grid ----
const heroGrid = document.querySelector('.hero-grid');
if (heroGrid) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

// ---- Cursor glow effect (subtle) ----
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;
  document.body.style.backgroundImage = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(174, 160, 140, 0.03), transparent 60%)`;
}, { passive: true });
