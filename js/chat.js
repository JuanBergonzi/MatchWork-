const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
if (!usuario) {
  window.location.href = "login.html";
}

const chatId = localStorage.getItem("chatActivo");
if (!chatId) {
  alert("No hay un chat activo");
  window.location.href = "dashboard.html";
}

const chatMensajes = document.getElementById("chatMensajes");
const form = document.getElementById("formChat");
const input = document.getElementById("mensajeInput");

let mensajes = JSON.parse(localStorage.getItem(chatId)) || [];

// Formato de hora (hh:mm)
function formatearHora(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function mostrarMensajes() {
  chatMensajes.innerHTML = "";
  mensajes.forEach(m => {
    const div = document.createElement("div");
    div.className = m.remitente === usuario.nombre ? "mensaje propio" : "mensaje ajeno";

    div.innerHTML = `
      <strong>${m.remitente}</strong><br>
      ${m.texto}
      <span class="hora">${formatearHora(m.fecha)}</span>
    `;

    chatMensajes.appendChild(div);
  });
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const texto = input.value.trim();
  if (texto === "") return;

  const nuevoMensaje = {
    remitente: usuario.nombre, // se guarda el nombre, no el email
    texto,
    fecha: new Date().toISOString()
  };

  mensajes.push(nuevoMensaje);
  localStorage.setItem(chatId, JSON.stringify(mensajes));
  input.value = "";
  mostrarMensajes();
});

mostrarMensajes();
