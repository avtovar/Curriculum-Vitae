document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const msg = document.getElementById("formMessage");
    const btn = form.querySelector('button[type="submit"]');

    // Preparar datos
    const formData = new FormData(form);
    
    // Deshabilitar botón mientras envía
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        msg.style.color = "var(--gold)";
        msg.textContent = "¡Gracias! Tu mensaje ha sido enviado directamente a Ali.";
        form.reset();
      } else {
        const data = await response.json();
        if (Object.hasOwn(data, 'errors')) {
          msg.textContent = data["errors"].map(error => error["message"]).join(", ");
        } else {
          msg.textContent = "Ups! Hubo un problema al enviar el formulario.";
        }
        msg.style.color = "#ef4444";
      }
    } catch (error) {
      msg.style.color = "#ef4444";
      msg.textContent = "Hubo un error de conexión. Inténtalo de nuevo.";
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar mensaje";
    }
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
});

