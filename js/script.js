/* ============================================================
   script.js — navbar scroll, active links, theme toggle,
                mobile menu, scroll-reveal, form handling
   ============================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. UTILITY — throttle (limits rapid-fire scroll events)
   ---------------------------------------------------------------- */
function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ----------------------------------------------------------------
   2. DOM REFERENCES
   ---------------------------------------------------------------- */
const html        = document.documentElement;
const navbar      = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const navLinks    = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');
const revealEls   = document.querySelectorAll('.reveal');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

/* Sections used for active-link detection */
const sections = document.querySelectorAll('section[id]');


/* ================================================================
   3. NAVBAR — scroll shadow + "is-scrolled" class
   ================================================================ */
function handleNavbarScroll() {
  if (window.scrollY > 12) {
    navbar.classList.add('is-scrolled');
  } else {
    navbar.classList.remove('is-scrolled');
  }
}

window.addEventListener('scroll', throttle(handleNavbarScroll, 80), { passive: true });
handleNavbarScroll(); // run once on load


/* ================================================================
   4. ACTIVE NAV LINK — highlight current section while scrolling
   ================================================================ */
function updateActiveLink() {
  let currentId = '';
  const offset  = navbar.offsetHeight + 24; // navbar height + buffer

  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= offset) {
      currentId = section.id;
    }
  });

  navLinks.forEach(link => {
    const section = link.dataset.section;
    link.classList.toggle('is-active', section === currentId);
  });
}

window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
updateActiveLink();


/* ================================================================
   5. THEME TOGGLE — light ↔ dark mode, persisted to localStorage
   ================================================================ */
(function initTheme() {
  // Restore saved preference, or default to 'dark'
  const saved = localStorage.getItem('mc-theme') || 'dark';
  html.dataset.theme = saved;
})();

themeToggle.addEventListener('click', () => {
  const isDark   = html.dataset.theme === 'dark';
  const newTheme = isDark ? 'light' : 'dark';

  html.dataset.theme = newTheme;
  localStorage.setItem('mc-theme', newTheme);
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'dark' : 'light'} mode`);
});


/* ================================================================
   6. MOBILE MENU — hamburger open / close
   ================================================================ */
function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('is-open');
  isOpen ? closeMobileMenu() : openMobileMenu();
});

// Close menu when a mobile link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    closeMobileMenu();
    hamburger.focus();
  }
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (
    mobileMenu.classList.contains('is-open') &&
    !navbar.contains(e.target)
  ) {
    closeMobileMenu();
  }
});


/* ================================================================
   7. SCROLL REVEAL — IntersectionObserver for .reveal elements
   ================================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once revealed, stop observing (no re-animation)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold:  0.12,  // trigger when 12% of element is visible
    rootMargin: '0px 0px -48px 0px' // slight bottom offset
  }
);

revealEls.forEach(el => revealObserver.observe(el));


/* ================================================================
   8. SMOOTH SCROLL — override anchor clicks for offset compensation
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // bare hash, skip

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH   = navbar.offsetHeight;
    const top    = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ================================================================
   9. CONTACT FORM — client-side validation + success state
   ================================================================ */
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fname   = contactForm.querySelector('#fname');
    const lname   = contactForm.querySelector('#lname');
    const cemail  = contactForm.querySelector('#cemail');
    let   isValid = true;

    // --- Simple inline validation ---
    [fname, lname, cemail].forEach(field => {
      if (!field.value.trim()) {
        markInvalid(field);
        isValid = false;
      } else {
        markValid(field);
      }
    });

    // Email format check
    if (cemail.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cemail.value)) {
      markInvalid(cemail, 'Please enter a valid email address.');
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn  = contactForm.querySelector('.btn--submit');
    const btnText    = submitBtn.querySelector('.btn-text');
    const btnOriginal = btnText.textContent;

    submitBtn.disabled  = true;
    btnText.textContent = 'Sending…';

    formSuccess.hidden = true;
    formError.hidden = true;

    try {
      const payload = Object.fromEntries(new FormData(contactForm).entries());
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your message.');
      }

      contactForm.reset();
      formSuccess.hidden = false;
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    } catch (error) {
      formError.querySelector('p').textContent =
        error.message || 'Sorry, your message could not be sent right now. Please try again or email me directly.';
      formError.hidden = false;
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = btnOriginal;
    }
  });

  // Clear errors on input
  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => markValid(field));
  });
}

function markInvalid(field, msg) {
  field.style.borderColor = '#FF4D4D';
  field.style.boxShadow   = '0 0 0 3px rgba(255, 77, 77, 0.15)';
  field.setAttribute('aria-invalid', 'true');
}

function markValid(field) {
  field.style.borderColor = '';
  field.style.boxShadow   = '';
  field.removeAttribute('aria-invalid');
}


/* ================================================================
   10. SERVICE CARDS — subtle parallax tilt on mouse move
   ================================================================ */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect   = this.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);

    // Clamp tilt to ±6°
    const tiltX  = Math.max(-6, Math.min(6, dy * 6));
    const tiltY  = Math.max(-6, Math.min(6, dx * -6));

    this.style.transform = `
      translateY(-6px)
      scale(1.01)
      perspective(600px)
      rotateX(${tiltX}deg)
      rotateY(${tiltY}deg)
    `;
  });

  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
  });
});

const logoMark = document.querySelector(".logo-mark");

function updateLogoForTheme() {
  if (!logoMark) return;

  const theme = document.documentElement.dataset.theme;
  logoMark.src =
    theme === "light"
      ? logoMark.dataset.lightLogo
      : logoMark.dataset.darkLogo;
}

updateLogoForTheme();

themeToggle?.addEventListener("click", () => {
  setTimeout(updateLogoForTheme, 0);
});

/* ================================================================
   11. HERO NAME HOVER — scramble effect on .hero-name
   ================================================================ */
   /* 
const heroName    = document.querySelector('.hero-name');
const CHARS       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890';
let   scrambleId  = null;
let   iterationCount = 0;

function scrambleText(el, originalText) {
  clearInterval(scrambleId);
  iterationCount = 0;

  scrambleId = setInterval(() => {
    el.innerText = originalText
      .split('')
      .map((char, i) => {
        if (char === '\n' || char === ' ') return char;
        if (i < iterationCount) return originalText[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    if (iterationCount >= originalText.length) {
      clearInterval(scrambleId);
      el.innerText = originalText;
    }
    iterationCount += 1.4;
  }, 40);
} 

if (heroName) {
  // Store clean text (strip child element structure to plain string for effect)
  const first = heroName.querySelector('.hero-name-first');
  const last  = heroName.querySelector('.hero-name-last');

  heroName.addEventListener('mouseenter', () => {
    if (first) scrambleText(first, 'KELVIN');
    // Small delay for the second word
    setTimeout(() => {
      if (last) scrambleText(last, 'COLE');
    }, 120);
  });
}
*/
