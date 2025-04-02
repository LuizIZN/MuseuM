let horario = {
  horaInicio: "09:00",
  horaFim: "17:00",
  diasComerciais: [],
};

async function carregarHorario() {
  try {
    console.log("Iniciando requisição para carregar o último horário...");
    const response = await fetch("http://localhost:4000/horarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API:", errorData);
      throw new Error(`Erro na API: ${errorData.erros?.[0] || response.statusText}`);
    }

    const data = await response.json();
    console.log("Dados recebidos da API (último horário):", data);

    // Verifica se os dados retornados são válidos
    if (!data || !data.horaInicio) {
      console.warn("Nenhum horário encontrado ou dados inválidos.");
      document.getElementById("horario-inicio").textContent = "—";
      document.getElementById("horario-fim").textContent = "—";
      document.getElementById("horario-dias").textContent = "—";
      alert("Nenhum horário encontrado.");
      return;
    }

    // Atualiza os dados do horário
    horario = data;

    // Atualiza os campos de entrada com os valores do horário
    document.getElementById("input-inicio").value = horario.horaInicio || "";
    document.getElementById("input-fim").value = horario.horaFim || "";
    document.getElementById("input-dias").value = horario.diasComerciais.join(
      ", "
    );

    // Atualiza os campos visíveis na página (horário atual)
    document.getElementById("horario-inicio").textContent =
      horario.horaInicio || "—";
    document.getElementById("horario-fim").textContent =
      horario.horaFim || "—";
    document.getElementById("horario-dias").textContent =
      horario.diasComerciais.join(", ") || "—";
  } catch (error) {
    console.error("Erro ao carregar horário:", error);
    alert(error.message || "Erro ao carregar o horário. Verifique a conexão com a API.");
  }
}

async function salvarHorario() {
  const dias = document
    .getElementById("input-dias")
    .value.split(",")
    .map((dia) => dia.trim());
  const inicio = document.getElementById("input-inicio").value;
  const fim = document.getElementById("input-fim").value;

  console.log("Dados enviados para o backend:", {
    diasComerciais: dias,
    horaInicio: inicio,
    horaFim: fim,
  });

  if (!dias.length || !inicio || !fim) {
    alert("Preencha todos os campos.");
    return;
  }

  // Validação: Certifique-se de que horaInicio é menor que horaFim
  if (inicio >= fim) {
    alert("A hora de início deve ser menor que a hora de fim.");
    return;
  }

  const novoHorario = {
    diasComerciais: dias, // Envia como array de strings
    horaInicio: inicio,
    horaFim: fim,
  };

  try {
    const response = await fetch("http://localhost:4000/horarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoHorario),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.erros?.[0] || "Erro ao salvar horário.");
    }

    console.log("Horário salvo com sucesso!");
    await carregarHorario();
    alert("Horário atualizado com sucesso!");

    // Reseta o formulário
    document.getElementById("form-horario").reset();
  } catch (error) {
    console.error("Erro ao salvar horário:", error);
    alert(error.message || "Erro ao salvar o horário.");
  }
}

// Inicializa a página
async function inicializar() {
  await carregarHorario();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar);