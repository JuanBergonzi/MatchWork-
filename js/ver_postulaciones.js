document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "contratante") {
    window.location.href = "login.html";
    return;
  }

  const contenedor = document.getElementById("postulacionesContainer");
  let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  function renderizarPostulaciones() {
    contenedor.innerHTML = "";
    const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);

    if (recibidas.length === 0) {
      contenedor.innerHTML = "<p class='no-postulaciones'>No recibiste postulaciones aún.</p>";
      return;
    }

    recibidas.forEach((p, indexVisible) => {
      const estado = p.estado || "pendiente";
      const div = document.createElement("div");
      div.className = "form-box";

      div.innerHTML = `
        <h3>${p.rubro} - ${p.ubicacion}</h3>
        <p><strong>Descripción del empleo:</strong> ${p.descripcion || 'Sin descripción'}</p>
        <hr>
        <p><strong>Nombre del trabajador:</strong> ${p.nombreTrabajador}</p>
        <p><strong>Email:</strong> ${p.emailTrabajador}</p>
        <p><strong>Mensaje:</strong><br>${p.mensaje || 'Sin mensaje'}</p>
        <p class="estado"><strong>Estado actual:</strong> <span class="${estado}">${estado}</span></p>
        <div class="btn-group">
          <button class="btn btn-contratar" data-index="${indexVisible}">Contratar</button>
          <button class="btn btn-eliminar" data-index="${indexVisible}">Eliminar</button>
          ${estado === "contratado" ? `<button class="btn btn-chat" data-index="${indexVisible}">Iniciar chat</button>` : ""}
        </div>
      `;

      contenedor.appendChild(div);
    });

    // Eventos contratar
    contenedor.querySelectorAll(".btn-contratar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        actualizarEstado(index, "contratado");
      });
    });

    // Eventos eliminar
    contenedor.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        eliminarPostulacion(index);
      });
    });

    // Eventos chat
    contenedor.querySelectorAll(".btn-chat").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);
        const postulacion = recibidas[index];
        const chatId = `chat_${postulacion.emailContratante}_${postulacion.emailTrabajador}`;
        localStorage.setItem("chatActivo", chatId);
        window.location.href = "chat.html";
      });
    });
  }

  function actualizarEstado(indexVisible, nuevoEstado) {
    const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);
    const postulacion = recibidas[indexVisible];

    const indexReal = postulaciones.findIndex(p =>
      p.emailContratante === postulacion.emailContratante &&
      p.emailTrabajador === postulacion.emailTrabajador &&
      p.mensaje === postulacion.mensaje
    );

    if (indexReal !== -1) {
      postulaciones[indexReal].estado = nuevoEstado;
      localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
      mostrarToast(`✅ Estado actualizado a "${nuevoEstado}"`);
      renderizarPostulaciones();
    }
  }

  function eliminarPostulacion(indexVisible) {
    if (!confirm("¿Estás seguro de eliminar esta postulación?")) return;

    const recibidas = postulaciones.filter(p => p.emailContratante === usuario.email);
    const postulacion = recibidas[indexVisible];

    const indexReal = postulaciones.findIndex(p =>
      p.emailContratante === postulacion.emailContratante &&
      p.emailTrabajador === postulacion.emailTrabajador &&
      p.mensaje === postulacion.mensaje
    );

    if (indexReal !== -1) {
      postulaciones.splice(indexReal, 1);
      localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
      mostrarToast("✅ Postulación eliminada");
      renderizarPostulaciones();
    }
  }

  renderizarPostulaciones();
});
