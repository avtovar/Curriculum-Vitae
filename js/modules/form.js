// ===================== FORM MODULE =====================
import { getTranslation } from './i18n.js';

export function initForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = document.getElementById("formMessage");
    const submitBtn = document.getElementById("submitBtn");
    if (!msg) return;

    const nombre  = document.getElementById("nombre").value.trim();
    const email   = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const honeypot = document.getElementById("honeypot").value;

    if (honeypot) {
      console.warn("Spam detected");
      return;
    }

    msg.textContent = "";
    msg.style.color = "#f87171";

    if (!nombre || !email || !mensaje) {
      msg.textContent = getTranslation('footer.form.required');
      if (!nombre) {
        const el = document.getElementById('nombre');
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', 'formMessage');
      }
      if (!email) {
        const el = document.getElementById('email');
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', 'formMessage');
      }
      if (!mensaje) {
        const el = document.getElementById('mensaje');
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', 'formMessage');
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.textContent = getTranslation('footer.form.invalid_email');
      const el = document.getElementById('email');
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', 'formMessage');
      return;
    }

    if (mensaje.length < 10) {
      msg.textContent = getTranslation('footer.form.short_msg');
      const el = document.getElementById('mensaje');
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', 'formMessage');
      return;
    }

    ['nombre', 'email', 'mensaje'].forEach(id => {
      document.getElementById(id).removeAttribute('aria-invalid');
    });

    msg.style.color = "var(--accent-light)";
    msg.textContent = getTranslation('footer.form.sending_msg');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = getTranslation('footer.form.sending');
      submitBtn.setAttribute('aria-busy', 'true');
    }

    const serviceID = '__EMAILJS_SERVICE_ID__';
    const templateID = '__EMAILJS_TEMPLATE_ID__';

    const templateParams = {
      name: nombre,
      from_email: email,
      message: mensaje,
      title: `Consulta desde el CV de ${nombre}`
    };

    emailjs.send(serviceID, templateID, templateParams)
      .then(() => {
        msg.style.color = "var(--accent-light)";
        msg.textContent = getTranslation('footer.form.success');
        form.reset();
        ['nombre', 'email', 'mensaje'].forEach(id => {
          document.getElementById(id).removeAttribute('aria-invalid');
        });
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = getTranslation('footer.form.submit');
          submitBtn.removeAttribute('aria-busy');
        }
      }, (err) => {
        msg.style.color = "#f87171";
        msg.textContent = getTranslation('footer.form.error');
        console.error('EmailJS Error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = getTranslation('footer.form.submit');
          submitBtn.removeAttribute('aria-busy');
        }
      });
  });
}
