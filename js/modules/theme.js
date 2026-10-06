// ===================== THEME MODULE =====================
import { getTranslation } from './i18n.js';

export function initTheme() {
  const toggleBtn = document.getElementById("darkToggle");

  function setTheme(dark) {
    document.documentElement.classList.toggle("dark-mode", dark);
    if (toggleBtn) {
      toggleBtn.textContent = dark ? "☀️" : "🌙";
      toggleBtn.setAttribute('aria-label', getTranslation('dark.aria'));
      toggleBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }
  }

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
    } catch(e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (toggleBtn) {
    const initialDark = getPreferredTheme();
    setTheme(initialDark);
    toggleBtn.addEventListener("click", function () {
      const newDark = !document.documentElement.classList.contains("dark-mode");
      setTheme(newDark);
      try { localStorage.setItem("theme", newDark ? "dark" : "light"); } catch(e) {}
    });
  }
}
