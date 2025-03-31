const visitantes = [];

function renderVisitantes() {
  const tbody = document.getElementById("tabela-visitantes");
  tbody.innerHTML = "";

  visitantes.forEach((v, index) => {
    const nome = v.tipo === "fisica" ? v.nome : v.nomeFantasia;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${v.tipo === "fisica" ? "Física" : "Jurídica"}</td>
      <td>${nome}</td>
      <td>${v.email}</td>
      <td>${v.data}</td>
      <td>${v.hora}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="excluirVisitante(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function alternarCampos() {
  const tipo = document.getElementById("tipo-visitante").value;
  document.getElementById("campos-fisica").classList.toggle("d-none", tipo !== "fisica");
  document.getElementById("campos-juridica").classList.toggle("d-none", tipo !== "juridica");
}

function cadastrarVisitante() {
  const tipo = document.getElementById("tipo-visitante").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;

  let visitante = { tipo, data, hora, email, telefone, endereco };

  if (tipo === "fisica") {
    visitante.cpf = document.getElementById("cpf").value;
    visitante.nome = document.getElementById("nome").value;
  } else {
    visitante.cnpj = document.getElementById("cnpj").value;
    visitante.nomeFantasia = document.getElementById("nomeFantasia").value;
  }

  visitantes.push(visitante);
  renderVisitantes();

  bootstrap.Modal.getInstance(document.getElementById("modalNovoVisitante")).hide();
  limparCampos();
}

function limparCampos() {
  document.querySelectorAll("#modalNovoVisitante input").forEach(input => input.value = "");
}

function excluirVisitante(index) {
  if (confirm("Deseja excluir este visitante?")) {
    visitantes.splice(index, 1);
    renderVisitantes();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  renderVisitantes();
});
