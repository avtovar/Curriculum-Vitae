document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("mensaje").value;

    const subject = `Consulta desde el CV de ${nombre}`;
    const body = `Nombre: ${nombre}%0ACorreo: ${email}%0AMensaje: ${mensaje}`;

    window.location.href = `mailto:ali.v.tovar@gmail.com?subject=${subject}&body=${body}`;
  });
});
