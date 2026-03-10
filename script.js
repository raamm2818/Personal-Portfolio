/* ============================================================
   script.js — Alex Rivera Portfolio
   Handles: dark/light mode, sticky nav, mobile menu,
            scroll reveal, form submission
   ============================================================ */

/* ---- 1. DOM REFERENCES ---- */
const html         = document.documentElement;         // <html data-theme="…">
const navbar       = document.getElementById('navbar');
const themeToggle  = document.getElementById('theme-toggle');
const hamburger    = document.getElementById('hamburger');
const navLinks     = document.getElementById('nav-links');
const contactForm  = document.getElementById('contact-form');
const formSuccess  = document.getElementById('form-success');

/* ============================================================
   2. DARK / LIGHT MODE TOGGLE
   ============================================================ */

// Load saved preference from localStorage (or keep default "dark")
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  // Flip between dark and light
  const current  = html.getAttribute('data-theme');
  const next     = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);   // persist choice
});

/* ============================================================
   3. STICKY NAVBAR — add "scrolled" class after 60px scroll
   ============================================================ */
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });  // passive = better scroll performance

/* ============================================================
   4. MOBILE MENU — hamburger toggle
   ============================================================ */
hamburger.addEventListener('click', () => {
  // Toggle "active" on the button (triggers CSS X animation)
  hamburger.classList.toggle('active');
  // Toggle "open" on nav links to show/hide the fullscreen menu
  navLinks.classList.toggle('open');

  // Prevent body from scrolling while menu is open
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   5. SCROLL REVEAL — Intersection Observer
   Watches .reveal elements and adds .visible when in viewport
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing (animation is one-time)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,   // trigger when 10% of element is visible
    rootMargin: '0px 0px -40px 0px'  // slight offset from bottom
  }
);

// Observe every element with class "reveal"
document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   6. CONTACT FORM — simple client-side submission handler
   ============================================================ */
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();  // prevent actual page reload

    // Basic validation — check all fields are filled
    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formSuccess.style.color = '#f87171';  // red hint
      formSuccess.textContent = 'Please fill in all fields.';
      return;
    }

    // Simulate async send (replace with real API call / EmailJS / Formspree)
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    setTimeout(() => {
      // Reset form after "sending"
      contactForm.reset();
      submitBtn.disabled    = false;
      submitBtn.innerHTML   = 'Send Message <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      formSuccess.style.color = '';  // reset to CSS default (accent-2 green)
      formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';

      // Clear success message after 5 seconds
      setTimeout(() => { formSuccess.textContent = ''; }, 5000);
    }, 1200);
  });
}

/* ============================================================
   7. SMOOTH SCROLLING — polyfill for older browsers
   (Modern browsers support scroll-behavior: smooth in CSS,
   but this JS fallback handles edge cases with hash links)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;  // skip bare hash

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   8. ACTIVE NAV LINK — highlight the current section link
   Uses IntersectionObserver to detect which section is in view
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          // Remove active from all, then add to matching link
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--text)';
          }
        });
      }
    });
  },
  {
    threshold: 0.4  // section must be 40% visible to be "active"
  }
);

sections.forEach(section => sectionObserver.observe(section));
