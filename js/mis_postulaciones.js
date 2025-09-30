document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "trabajador") {
    window.location.href = "login.html";
    return;
  }

  const container = document.getElementById("misPostulacionesContainer");
  let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
  const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

  // Filtrar solo las postulaciones del trabajador
  const misPostulaciones = postulaciones.filter(p => p.emailTrabajador === usuario.email);

  if (misPostulaciones.length === 0) {
    container.innerHTML = "<p class='no-postulaciones'>No realizaste ninguna postulación todavía.</p>";
    return;
  }

  function render() {
    container.innerHTML = "";

    misPostulaciones.forEach((p, index) => {
      const estado = p.estado || "pendiente";

      // Buscar la oferta asociada a esta postulación
      const oferta = ofertas.find(o => 
        o.emailContratante === p.emailContratante && 
        o.titulo === p.titulo
      ) || {};

      const div = document.createElement("div");
      div.classList.add("postulacion-card");

      div.innerHTML = `
        <div class="card-header">
          <span class="estado-badge ${estado}">${estado}</span>
        </div>
        <p><strong>Rubro:</strong> ${oferta.rubro || "-"}</p>
        <p><strong>Ubicación:</strong> ${oferta.ubicacion || "-"}</p>
        <p><strong>Descripción:</strong> ${oferta.descripcion || "-"}</p>
        <p><strong>Observación:</strong> ${oferta.observaciones || "-"}</p>
        <p><strong>Contratante:</strong> ${oferta.nombreContratante || p.emailContratante}</p>
        <p><strong>Mensaje enviado:</strong><br>${p.mensaje}</p>
        <div class="card-buttons">
          <button class="btn btn-eliminar" data-index="${index}">Eliminar</button>
          ${estado === "contratado" ? `<button class="btn btn-chat" data-index="${index}">Iniciar chat</button>` : ""}
        </div>
      `;

      container.appendChild(div);
    });

    // Delegación de eventos para botones
    container.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (confirm("¿Deseas eliminar esta postulación?")) {
          const eliminada = misPostulaciones.splice(index, 1)[0];
          // Eliminar también de la lista general de postulaciones
          const globalIndex = postulaciones.findIndex(pst => 
            pst.emailTrabajador === eliminada.emailTrabajador && 
            pst.titulo === eliminada.titulo &&
            pst.emailContratante === eliminada.emailContratante
          );
          if (globalIndex !== -1) postulaciones.splice(globalIndex, 1);

          localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
          render();
        }
      });
    });

    container.querySelectorAll(".btn-chat").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        const postulacion = misPostulaciones[index];
        const chatId = `chat_${postulacion.emailContratante}_${postulacion.emailTrabajador}`;
        localStorage.setItem("chatActivo", chatId);
        window.location.href = "chat.html";
      });
    });
  }

  render();
});
