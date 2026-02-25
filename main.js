/* ============================================================
   NEXUS AI — Main JavaScript
   Handles: Nav, Scroll Reveal, Counters, Modal, Form Validation
   ============================================================ */

'use strict';

// ── DOM Ready ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCounters();
  initModal();
  initContactForm();
  setActiveNavLink();
  initProjectFilter();
});

// ── Navbar ───────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

// ── Active Nav Link ──────────────────────────────────────
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Scroll Reveal ────────────────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// ── Animated Counters ────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── Project Modal ────────────────────────────────────────
function initModal() {
  const overlay = document.getElementById('projectModal');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  const closeBtn = overlay.querySelector('.modal-close');

  // Open modal
  document.querySelectorAll('.project-card[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-modal');
      populateModal(id);
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ── Project Data ─────────────────────────────────────────
const projectData = {
  'resume-ai': {
    emoji: '🧠',
    category: 'AI / Machine Learning',
    title: 'ResumeIQ — AI Resume Analyzer',
    desc: 'An advanced NLP-powered platform that parses resumes, matches candidates to job descriptions using semantic similarity, and provides actionable feedback. Reduced recruiter screening time by 70% and improved candidate placement accuracy by 45%.',
    tech: ['Python', 'BERT', 'FastAPI', 'React', 'PostgreSQL', 'Docker', 'Redis'],
    demo: '#',
    github: '#',
  },
  'cyberwatch': {
    emoji: '🛡️',
    category: 'Cybersecurity',
    title: 'CyberWatch — Threat Intelligence Platform',
    desc: 'Real-time network monitoring and anomaly detection system leveraging ML algorithms to identify zero-day threats and unusual behavioral patterns. Deployed across 12 enterprise clients with 99.97% uptime.',
    tech: ['Python', 'TensorFlow', 'Kafka', 'ELK Stack', 'Kubernetes', 'Grafana'],
    demo: '#',
    github: '#',
  },
  'recengine': {
    emoji: '⚡',
    category: 'Recommendation Engine',
    title: 'PulseRec — Intelligent Recommendation Engine',
    desc: 'Collaborative + content-based hybrid recommendation system serving 2M+ daily requests for a SaaS platform. Increased user engagement by 38% and average session duration by 52%.',
    tech: ['Python', 'PyTorch', 'Apache Spark', 'Redis', 'gRPC', 'AWS'],
    demo: '#',
    github: '#',
  },
  'autoflow': {
    emoji: '🤖',
    category: 'Web Automation',
    title: 'AutoFlow — Intelligent Web Automation Suite',
    desc: 'Enterprise-grade browser automation platform with AI-powered selectors that adapt to UI changes. Features visual regression testing, self-healing scripts, and natural language test case generation.',
    tech: ['Node.js', 'Playwright', 'OpenAI API', 'PostgreSQL', 'Vue.js', 'Docker'],
    demo: '#',
    github: '#',
  },
  'ethicai': {
    emoji: '⚖️',
    category: 'Ethical AI',
    title: 'EthicAI — Bias Detection & Fairness Toolkit',
    desc: 'Open-source toolkit for detecting and mitigating bias in ML models. Supports 12 fairness metrics, automated debiasing pipelines, and generates audit reports for regulatory compliance.',
    tech: ['Python', 'scikit-learn', 'Fairlearn', 'FastAPI', 'React', 'Chart.js'],
    demo: '#',
    github: '#',
  },
  'dashpro': {
    emoji: '📊',
    category: 'Web Development',
    title: 'DashPro — Real-Time Analytics Dashboard',
    desc: 'High-performance analytics dashboard with WebSocket-powered live updates, interactive D3.js visualizations, and AI-generated insights. Handles 50K concurrent connections with sub-100ms latency.',
    tech: ['React', 'D3.js', 'Node.js', 'WebSockets', 'InfluxDB', 'nginx'],
    demo: '#',
    github: '#',
  },
};

function populateModal(id) {
  const data = projectData[id];
  if (!data) return;

  const modal = document.querySelector('.modal');
  modal.querySelector('.modal-emoji').textContent = data.emoji;
  modal.querySelector('.modal-title').textContent = data.title;
  modal.querySelector('.modal-cat').textContent = data.category;
  modal.querySelector('.modal-desc').textContent = data.desc;

  const tagsContainer = modal.querySelector('.modal-tags');
  tagsContainer.innerHTML = data.tech.map(t => `<span class="tag">${t}</span>`).join('');

  modal.querySelector('.btn-demo').href = data.demo;
  modal.querySelector('.btn-github').href = data.github;
}

// ── Contact Form Validation ──────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate each field
    ['name', 'email', 'subject', 'message'].forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) return;

      const group = input.closest('.form-group');
      const value = input.value.trim();

      clearError(group);

      if (!value) {
        showError(group, `This field is required.`);
        valid = false;
      } else if (fieldName === 'email' && !isValidEmail(value)) {
        showError(group, 'Please enter a valid email address.');
        valid = false;
      } else if (fieldName === 'message' && value.length < 20) {
        showError(group, 'Message must be at least 20 characters.');
        valid = false;
      }
    });

    if (valid) {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.classList.add('show');
      }
    }
  });

  // Real-time validation on blur
  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      const name = input.getAttribute('name');
      const value = input.value.trim();

      clearError(group);
      if (!value) return;

      if (name === 'email' && !isValidEmail(value)) {
        showError(group, 'Please enter a valid email address.');
      }
    });
  });
}

function showError(group, msg) {
  group.classList.add('has-error');
  const input = group.querySelector('input, textarea');
  if (input) input.classList.add('error');
  const errEl = group.querySelector('.error-msg');
  if (errEl) errEl.textContent = msg;
}

function clearError(group) {
  group.classList.remove('has-error');
  const input = group.querySelector('input, textarea');
  if (input) input.classList.remove('error');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Project Filter ───────────────────────────────────────
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
