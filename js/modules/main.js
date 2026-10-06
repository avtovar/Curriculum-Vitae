// ===================== MAIN MODULE =====================
import { setLanguage, updateExperienceDisplay, updateCopyright, getCurrentLang } from './i18n.js';
import { initTheme } from './theme.js';
import { initTabs } from './tabs.js';
import { initForm } from './form.js';

document.addEventListener("DOMContentLoaded", function () {
  // Initialize form
  initForm();

  // Initialize tabs
  initTabs();

  // Initialize theme
  initTheme();

  // Collapsible "All Certificates" section
  const allCertsToggle = document.getElementById('allCertsToggle');
  const allCertsContent = document.getElementById('allCertsContent');

  if (allCertsToggle && allCertsContent) {
    allCertsToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      allCertsContent.hidden = isExpanded;

      const textSpan = this.querySelector('span');
      if (textSpan) {
        textSpan.textContent = isExpanded ? 'Ver todos los certificados' : 'Ocultar todos los certificados';
      }

      const icon = this.querySelector('.toggle-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  }

  // Dynamic year in footer
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Language toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const newLang = getCurrentLang() === 'es' ? 'en' : 'es';
      setLanguage(newLang);
    });
  }

  // Initialize language
  setLanguage(getCurrentLang());

  // Fade-in animations
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('fade-in');
      fadeInObserver.observe(section);
    });

    document.querySelectorAll('.project-card').forEach(card => {
      card.classList.add('fade-in');
      fadeInObserver.observe(card);
    });

    document.querySelectorAll('.experience-item').forEach(item => {
      item.classList.add('fade-in');
      fadeInObserver.observe(item);
    });

    document.querySelectorAll('.diploma-item').forEach(item => {
      item.classList.add('fade-in');
      fadeInObserver.observe(item);
    });
  } else {
    document.querySelectorAll('.fade-in, section, .project-card, .experience-item, .diploma-item').forEach(el => {
      el.classList.add('visible');
    });
  }

  // Active nav highlight
  const navLinks = document.querySelectorAll('.sticky-nav .nav-list a');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length && sections.length && !prefersReducedMotion) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopBtn.hidden = false;
        requestAnimationFrame(() => {
          backToTopBtn.classList.add('show');
        });
      } else {
        backToTopBtn.classList.remove('show');
        setTimeout(() => {
          if (window.scrollY <= 300) {
            backToTopBtn.hidden = true;
          }
        }, 300);
      }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    toggleBackToTop();
  }
});
