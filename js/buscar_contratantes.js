document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "trabajador") {
    window.location.href = "login.html";
    return;
  }

  const container = document.getElementById("contratantesContainer");
  let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
  let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

  // Filtrar ofertas disponibles (a las que el trabajador aún no se postuló)
  function obtenerOfertasDisponibles() {
    return ofertas.filter(oferta => {
      return !postulaciones.some(p =>
        p.emailTrabajador === usuario.email &&
        p.ofertaId === oferta.id
      );
    });
  }

  function renderizarTarjetas() {
    container.innerHTML = "";
    const disponibles = obtenerOfertasDisponibles();

    if (disponibles.length === 0) {
      container.innerHTML = "<p class='no-ofertas'>No hay ofertas disponibles por el momento.</p>";
      return;
    }

    disponibles.forEach(oferta => {
      const card = document.createElement("div");
      card.className = "contratante-card";
      card.innerHTML = `
        <p><strong>Rubro:</strong> ${oferta.rubro}</p>
        <p><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
        <p><strong>Descripción:</strong> ${oferta.descripcion}</p>
        <p><strong>Observación:</strong> ${oferta.observaciones || '-'}</p>
        <p><strong>Publicado por:</strong> ${oferta.nombreContratante} (${oferta.emailContratante})</p>
        <form class="postulacion-form">
          <label for="mensaje">Mensaje para el contratante:</label>
          <textarea name="mensaje" rows="3" placeholder="Escribe tu mensaje..." required></textarea>
          <button type="submit" class="btn btn-postular">Postularme</button>
        </form>
      `;

      const form = card.querySelector(".postulacion-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const mensaje = form.querySelector("textarea").value.trim();
        if (!mensaje) return;

        const nuevaPostulacion = {
          emailContratante: oferta.emailContratante,
          nombreContratante: oferta.nombreContratante,
          emailTrabajador: usuario.email,
          nombreTrabajador: usuario.nombre,
          rubro: usuario.rubro,
          ubicacion: usuario.ubicacion,
          mensaje,
          estado: "pendiente",
          ofertaId: oferta.id // <-- relacionamos la postulación con la oferta
        };

        postulaciones.push(nuevaPostulacion);
        localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
        alert("✅ ¡Postulación enviada con éxito!");
        renderizarTarjetas(); // actualizamos las ofertas disponibles
      });

      container.appendChild(card);
    });
  }

  renderizarTarjetas();
});
document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "trabajador") {
    window.location.href = "login.html";
    return;
  }

  const container = document.getElementById("contratantesContainer");
  let ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
  let postulaciones = JSON.parse(localStorage.getItem("postulaciones")) || [];

  // Filtrar ofertas disponibles (a las que el trabajador aún no se postuló)
  function obtenerOfertasDisponibles() {
    return ofertas.filter(oferta => {
      return !postulaciones.some(p =>
        p.emailTrabajador === usuario.email &&
        p.ofertaId === oferta.id
      );
    });
  }

  function renderizarTarjetas() {
    container.innerHTML = "";
    const disponibles = obtenerOfertasDisponibles();

    if (disponibles.length === 0) {
      container.innerHTML = "<p class='no-ofertas'>No hay ofertas disponibles por el momento.</p>";
      return;
    }

    disponibles.forEach(oferta => {
      const card = document.createElement("div");
      card.className = "contratante-card";
      card.innerHTML = `
        <p><strong>Rubro:</strong> ${oferta.rubro}</p>
        <p><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
        <p><strong>Descripción:</strong> ${oferta.descripcion}</p>
        <p><strong>Observación:</strong> ${oferta.observaciones || '-'}</p>
        <p><strong>Publicado por:</strong> ${oferta.nombreContratante} (${oferta.emailContratante})</p>
        <form class="postulacion-form">
          <label for="mensaje">Mensaje para el contratante:</label>
          <textarea name="mensaje" rows="3" placeholder="Escribe tu mensaje..." required></textarea>
          <button type="submit" class="btn btn-postular">Postularme</button>
        </form>
      `;

      const form = card.querySelector(".postulacion-form");
      form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mensaje = form.querySelector("textarea").value.trim();
  if (!mensaje) return;

const nuevaPostulacion = {
  emailContratante: oferta.emailContratante,
  nombreContratante: oferta.nombreContratante,
  emailTrabajador: usuario.email,
  nombreTrabajador: usuario.nombre,
  rubro: oferta.rubro,
  ubicacion: oferta.ubicacion,
  mensaje,
  estado: "pendiente",
  ofertaId: oferta.id // <-- clave para el chat
};


  postulaciones.push(nuevaPostulacion);
  localStorage.setItem("postulaciones", JSON.stringify(postulaciones));
  alert("✅ ¡Postulación enviada con éxito!");
  renderizarTarjetas(); // actualizamos las ofertas disponibles
});


      container.appendChild(card);
    });
  }

  renderizarTarjetas();
});
