<script>
  // Botón modo oscuro
  const toggleBtn = document.getElementById('darkModeToggle');
  toggleBtn.onclick = function () {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  };

  // Validación y mensaje de éxito en el formulario
  document.getElementById('contactForm').onsubmit = function (e) {
    e.preventDefault();
    // Validación básica
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    let valid = true;

    // Reset estilos previos
    [nombre, email, mensaje].forEach(input => input.style.borderColor = '');

    // Validar nombre
    if (nombre.value.trim().length < 2) {
      nombre.style.borderColor = 'red';
      valid = false;
    }
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      email.style.borderColor = 'red';
      valid = false;
    }
    // Validar mensaje
    if (mensaje.value.trim().length < 5) {
      mensaje.style.borderColor = 'red';
      valid = false;
    }

    if (!valid) {
      return;
    }

    // Si todo es válido, mostrar mensaje de éxito
    const msg = document.getElementById('form-success');
    msg.style.display = 'block';
    setTimeout(() => {
      msg.style.display = 'none';
      this.reset();
    }, 2000);
  };
</script>