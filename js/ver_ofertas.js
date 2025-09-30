document.addEventListener("DOMContentLoaded", () => {
  const listaOfertas = document.getElementById("listaOfertas");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "contratante") {
    window.location.href = "login.html";
    return;
  }

  let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  function renderizarOfertas() {
    listaOfertas.innerHTML = "";
    const recibidas = ofertas.filter(oferta => oferta.emailContratante === usuario.email);

    if (recibidas.length === 0) {
      listaOfertas.innerHTML = "<p class='no-ofertas'>No hay ofertas publicadas aún.</p>";
      return;
    }

    recibidas.forEach((oferta, index) => {
      const card = document.createElement("div");
      card.className = "oferta-card";
      card.innerHTML = `
        <h3><strong>Rubro:</strong> ${oferta.rubro}</h3>
        <p><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
        <p><strong>Descripción:</strong> ${oferta.descripcion}</p>
        <p><strong>Observación:</strong> ${oferta.observaciones || '-'}</p>
        <div class="card-buttons">
          <button class="btn btn-eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;
      listaOfertas.appendChild(card);
    });
  }

  renderizarOfertas();

  listaOfertas.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const index = e.target.dataset.index;
      if (confirm("¿Deseas eliminar esta oferta?")) {
        ofertas.splice(index, 1);
        localStorage.setItem("ofertas", JSON.stringify(ofertas));
        mostrarToast("✅ Oferta eliminada");
        renderizarOfertas();
      }
    }
  });
});
