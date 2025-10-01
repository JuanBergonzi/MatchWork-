document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  if (!usuario || usuario.tipo !== "contratante") {
    window.location.href = "login.html";
    return;
  }

  const form = document.getElementById("ofertaForm");

  function mostrarToast(mensaje) {
    const toast = document.getElementById("toast");
    toast.textContent = mensaje;
    toast.className = "toast show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, 3000);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const rubro = document.getElementById("rubro").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const observaciones = document.getElementById("observaciones").value.trim();

    if (!rubro || !descripcion || !ubicacion) {
      mostrarToast("⚠️ Complete los campos obligatorios.");
      return;
    }

const nuevaOferta = {
  id: Date.now(), // ID único
  rubro,
  descripcion,
  ubicacion,
  observaciones: observaciones || null,
  emailContratante: usuario.email,
  nombreContratante: usuario.nombre
};


    const ofertas = JSON.parse(localStorage.getItem("ofertas")) || [];
    ofertas.push(nuevaOferta);
    localStorage.setItem("ofertas", JSON.stringify(ofertas));

    mostrarToast("✅ Oferta publicada con éxito");
    form.reset();

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  });
});