document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const msg = document.getElementById("formMessage");
    if (!msg) return;

    const nombre  = document.getElementById("nombre").value.trim();
    const email   = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const honeypot = document.getElementById("honeypot").value;

    // Honeypot check
    if (honeypot) {
      console.warn("Spam detected");
      return;
    }

    // Reset mensaje
    msg.textContent = "";
    msg.style.color = "#ef4444"; // Rojo por defecto para errores

    // Validación manual
    if (!nombre || !email || !mensaje) {
      msg.textContent = "Por favor, completa todos los campos.";
      return;
    }

    // Regex para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      msg.textContent = "Por favor, ingresa un correo electrónico válido.";
      return;
    }

    if (mensaje.length < 10) {
      msg.textContent = "El mensaje debe tener al menos 10 caracteres.";
      return;
    }

    // Si todo es válido, enviar con EmailJS
    msg.style.color = "var(--gold)";
    msg.textContent = "Enviando mensaje...";
    
    const serviceID = 'service_hd0dofi'; 
    const templateID = 'template_8lvjn7n'; 

    const templateParams = {
      name: nombre,
      from_email: email,
      message: mensaje,
      title: `Consulta desde el CV de ${nombre}`
    };

    emailjs.send(serviceID, templateID, templateParams)
      .then(() => {
        msg.style.color = "var(--gold)";
        msg.textContent = "¡Mensaje enviado con éxito! Me pondré en contacto pronto.";
        form.reset();
      }, (err) => {
        msg.style.color = "#ef4444";
        msg.textContent = "Error al enviar el mensaje. Por favor, intenta de nuevo.";
        console.error('EmailJS Error:', err);
      });
  });

  // Tabs functionality for diplomas
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", function () {
      const tabName = this.dataset.tab;

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      const activeContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
      if (activeContent) {
        activeContent.classList.add("active");
      }
    });
  });

  // Dynamic experience calculation
  function calculateExperience(startDate) {
    const start = new Date(startDate);
    const now = new Date();
    
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    let result = "";
    if (years > 0) {
      result += years + (years === 1 ? " año" : " años");
    }
    if (months > 0) {
      if (result !== "") result += " y ";
      result += months + (months === 1 ? " mes" : " meses");
    }
    
    return result || "0 meses";
  }

  const expElement = document.getElementById("brubank-experience");
  if (expElement) {
    // Fecha de inicio: 1 de abril de 2021
    expElement.textContent = calculateExperience("2021-04-01");
  }

  // Click to copy functionality
  const copyElements = document.querySelectorAll(".contact-email, .contact-phone");
  copyElements.forEach(el => {
    el.addEventListener("click", function(e) {
      // Solo copiar si es un click normal, no click derecho o con teclas especiales
      if (e.button !== 0) return;
      
      const textToCopy = this.href.replace("mailto:", "").replace("tel:", "");
      
      // Intentar copiar al portapapeles
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.innerHTML;
        const successSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        
        this.innerHTML = successSvg + " Copiado";
        this.style.filter = "brightness(1.3)";
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.style.filter = "";
        }, 2000);
      }).catch(err => {
        console.error("Error al copiar: ", err);
      });
      
      // Opcional: prevenir el comportamiento por defecto si prefieres que no se abra el mailer/tel
      // e.preventDefault();
    });
  });
});

