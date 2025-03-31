const login = async () => {
  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  try {
    const response = await fetch("http://localhost:4000/funcionarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        senha: password.value,
      }),
    });

    const data = await response.json();
    console.log(data);

    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    
  } catch (error) {
    console.error(error);
    alert("Erro ao fazer login");
  }
};
