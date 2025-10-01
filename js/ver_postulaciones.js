document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "contratante") {
    window.location.href = "login.html";
    return;
  }

  const contenedor = document.getElementById("postulacionesContainer");
  let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
  let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  // Busca la oferta asociada a una postulación intentando varios identificadores
  function findOfertaForPostulacion(postul) {
    ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
    if (!ofertas.length) return null;

    // intentos comunes (ajusta nombres si tu estructura es distinta)
    if (postul.ofertaId) {
      const byId = ofertas.find(o => o.id === postul.ofertaId || String(o.id) === String(postul.ofertaId));
      if (byId) return byId;
    }
    if (postul.idOferta) {
      const byId2 = ofertas.find(o => o.id === postul.idOferta || String(o.id) === String(postul.idOferta));
      if (byId2) return byId2;
    }
    if (typeof postul.ofertaIndex !== "undefined") {
      const idx = Number(postul.ofertaIndex);
      if (!Number.isNaN(idx) && ofertas[idx]) return ofertas[idx];
    }

    // heurística: coincidencia por email del contratante + texto
    const byEmailAndRubro = ofertas.find(o =>
      o.emailContratante === postul.emailContratante &&
      (o.rubro === postul.rubro || (postul.descripcion && o.descripcion && o.descripcion.includes(postul.descripcion)))
    );
    if (byEmailAndRubro) return byEmailAndRubro;

    // fallback: primer oferta del mismo contratante
    const firstByContratante = ofertas.find(o => o.emailContratante === postul.emailContratante);
    if (firstByContratante) return firstByContratante;

    return null;
  }

  function capitalizar(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}


  function renderizarPostulaciones() {
    // recarga arrays desde localStorage para mantener sincronía
    postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
    ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];

    contenedor.innerHTML = "";
    const recibidas = postulaciones
      .map((p, idx) => ({ p, idx })) // guardamos el índice real
      .filter(item => item.p.emailContratante === usuario.email);

    if (recibidas.length === 0) {
      contenedor.innerHTML = "<p class='no-postulaciones'>No recibiste postulaciones aún.</p>";
      return;
    }

    recibidas.forEach(({ p, idx }) => {
      const oferta = findOfertaForPostulacion(p);
      const rubro = capitalizar(oferta?.rubro || p.rubro || "No especificado");
      const ubicacion = capitalizar(oferta?.ubicacion || p.ubicacion || "-");

      const descripcionEmpleo = oferta?.descripcion || p.descripcion || "Sin descripción";

      const estado = p.estado || "pendiente";
      const div = document.createElement("div");
      div.className = "form-box";

      div.innerHTML = `
        <h3>${rubro} - ${ubicacion}</h3>
        <p><strong>Descripción del empleo:</strong> ${descripcionEmpleo}</p>
        <hr>
        <p><strong>Nombre del trabajador:</strong> ${p.nombreTrabajador || '-'}</p>
        <p><strong>Email:</strong> ${p.emailTrabajador || '-'}</p>
        <p><strong>Mensaje:</strong> ${p.mensaje || 'Sin mensaje'}</p>
        <p class="estado"><strong>Estado actual:</strong> <span class="${estado}">${estado}</span></p>
        <div class="btn-group">
          <button class="btn btn-contratar" data-index="${idx}">Contratar</button>
          <button class="btn btn-eliminar" data-index="${idx}">Eliminar</button>
          ${estado === "contratado" ? `<button class="btn btn-chat" data-index="${idx}">Iniciar chat</button>` : ""}
        </div>
      `;
      contenedor.appendChild(div);
    });
  }

  // event delegation: un solo listener para todo el contenedor
  contenedor.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const indexReal = Number(btn.dataset.index);
    if (btn.classList.contains("btn-contratar")) {
      actualizarEstado(indexReal, "contratado");
    } else if (btn.classList.contains("btn-eliminar")) {
      eliminarPostulacion(indexReal);
    } else if (btn.classList.contains("btn-chat")) {
      if (Number.isNaN(indexReal) || !postulaciones[indexReal]) {
        mostrarToast("No se encontró la postulación para iniciar chat.");
        return;
      }
      const postulacion = postulaciones[indexReal];
      const chatId = `chat_${postulacion.ofertaId}_${postulacion.emailContratante}_${postulacion.emailTrabajador}`;
      localStorage.setItem("chatActivo", chatId);
      window.location.href = "chat.html";
    }
  });

  function actualizarEstado(indexReal, nuevoEstado) {
    postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
    if (indexReal < 0 || indexReal >= postulaciones.length) {
      mostrarToast("❌ No se pudo actualizar: postulación no encontrada.");
      return;
    }
    postulaciones[indexReal].estado = nuevoEstado;
    localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    mostrarToast(`✅ Estado actualizado a "${nuevoEstado}"`);
    renderizarPostulaciones();
  }

  function eliminarPostulacion(indexReal) {
    if (!confirm("¿Estás seguro de eliminar esta postulación?")) return;
    postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];
    if (indexReal < 0 || indexReal >= postulaciones.length) {
      mostrarToast("❌ No se pudo eliminar: postulación no encontrada.");
      return;
    }
    postulaciones.splice(indexReal, 1);
    localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
    mostrarToast("✅ Postulación eliminada");
    renderizarPostulaciones();
  }

  // primer render
  renderizarPostulaciones();
});
