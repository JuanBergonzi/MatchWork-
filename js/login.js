document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
  
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);
  
    if (usuarioEncontrado) {
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('error-msg').textContent = 'Correo o contraseña incorrectos';
    }
  });
  