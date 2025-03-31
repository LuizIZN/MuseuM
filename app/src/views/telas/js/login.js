if (localStorage.getItem('usuario')) {
  window.location.href = '/dashboard';
}

const login = async () => {
  window.event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await fetch('http://localhost:4000/funcionarios/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha: password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.erros) {
        alert(data.erros[0]);
      } else {
        alert('Login efetuado com sucesso!');
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        window.location.href = '/paginas/dashboard';
      }
    });
}