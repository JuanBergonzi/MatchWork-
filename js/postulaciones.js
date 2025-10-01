const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

if (!usuario || usuario.tipo !== "contratante") {
  window.location.href = "login.html";
}

const container = document.getElementById("postulacionesContainer");

const postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

// Filtramos las que corresponden al contratante actual
const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);

if (recibidas.length === 0) {
  container.innerHTML = "<p>No tenés postulaciones recibidas aún.</p>";
} else {
  recibidas.forEach(post => {
    // Buscar oferta original (por si no guardaste rubro/ubicacion en la postulación)
    const oferta = ofertas.find(o => o.id === post.ofertaId) || {};

    const div = document.createElement("div");
    div.classList.add("form-box");
    div.innerHTML = `
      <p><strong>Nombre del postulante:</strong> ${post.nombreTrabajador}</p>
      <p><strong>Rubro:</strong> ${post.rubro || oferta.rubro || "-"}</p>
      <p><strong>Ubicación:</strong> ${post.ubicacion || oferta.ubicacion || "-"}</p>
      <p><strong>Mensaje:</strong> ${post.mensaje}</p>
    `;
    container.appendChild(div);
  });
}
