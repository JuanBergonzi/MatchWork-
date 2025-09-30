const usuario = JSON.parse(localStorage.getItem('usuarioActual'));

if (!usuario) {
  window.location.href = 'login.html';
} else {
  document.getElementById('userEmail').textContent = usuario.email;

  // Si es empleador, mostramos el botón
  if (usuario.tipo === "contratante") {
    const opciones = document.getElementById('opcionesEmpleador');
    if (opciones) {
      opciones.style.display = "flex";
    }
  }
}

if (usuario.tipo === "trabajador") {
  const opcionesTrabajador = document.getElementById("opcionesTrabajador");
  if (opcionesTrabajador) {
    opcionesTrabajador.style.display = "flex";
  }
}


function logout() {
  localStorage.removeItem('usuarioActual');
  window.location.href = 'login.html';
}
