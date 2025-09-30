document.getElementById('registroForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const tipo = document.getElementById('tipoUsuario').value;
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const rubro = document.getElementById('rubro').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const mensaje = document.getElementById('mensaje');

  if (!tipo || !nombre || !email || !password || !ubicacion || (tipo === 'trabajador' && !rubro)) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Por favor, completá todos los campos.';
    return;
  }

  if (password.length < 6) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    return;
  }

  const nuevoUsuario = {
    tipo,
    nombre,
    email,
    password,
    rubro: tipo === 'trabajador' ? rubro : '',
    ubicacion
  };

  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
  const yaExiste = usuariosGuardados.some(u => u.email === email);
  if (yaExiste) {
    mensaje.style.color = 'red';
    mensaje.textContent = 'Este correo ya está registrado.';
    return;
  }

  usuariosGuardados.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
  localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));

  mensaje.style.color = 'green';
  mensaje.textContent = '¡Registro exitoso! Redirigiendo...';

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1500);
});

const tipoUsuarioSelect = document.getElementById('tipoUsuario');
const labelRubro = document.getElementById('labelRubro');
const inputRubro = document.getElementById('rubro');

tipoUsuarioSelect.addEventListener('change', () => {
  if (tipoUsuarioSelect.value === 'contratante') {
    labelRubro.style.display = 'none';
    inputRubro.style.display = 'none';
  } else {
    labelRubro.style.display = 'block';
    inputRubro.style.display = 'block';
  }
});
