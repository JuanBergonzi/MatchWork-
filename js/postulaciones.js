const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

if (!usuario || usuario.tipo !== "contratante") {
  window.location.href = "login.html";
}

const container = document.getElementById("postulacionesContainer");

// Obtenemos las postulaciones guardadas
const postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

// Filtramos las que corresponden al contratante actual
const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);

if (recibidas.length === 0) {
  container.innerHTML = "<p>No tenés postulaciones recibidas aún.</p>";
} else {
  recibidas.forEach(post => {
    const div = document.createElement("div");
    div.classList.add("form-box");
    div.innerHTML = `
      <p><strong>Nombre del postulante:</strong> ${post.nombreTrabajador}</p>
      <p><strong>Rubro:</strong> ${post.rubro}</p>
      <p><strong>Ubicación:</strong> ${post.ubicacion}</p>
      <p><strong>Mensaje:</strong> ${post.mensaje}</p>
    `;
    container.appendChild(div);
  });
}
z