const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-counter]');

// Theme handling
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let activeTheme = root.getAttribute('data-theme') || (systemPrefersDark ? 'dark' : 'light');
root.setAttribute('data-theme', activeTheme);

const updateThemeLabel = () => {
  if (!themeToggle) return;
  const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
};

updateThemeLabel();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', activeTheme);
    updateThemeLabel();
  });
}

// Mobile navigation
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
    mobileMenu.classList.toggle('is-open', !isOpen);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.hidden = true;
      mobileMenu.classList.remove('is-open');
    });
  });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((item) => observer.observe(item));

// Counter animation
const animateCounter = (el) => {
  const target = Number(el.getAttribute('data-target')) || 0;
  if (!target) return;
  let current = 0;
  const duration = 900;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(progress * target);
    el.textContent = target >= 10 ? `${current}+` : String(current);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

counters.forEach((counter) => {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(counter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.6 });
  counterObserver.observe(counter);
});
