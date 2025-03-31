const emprestimos = [
  { codigo: "EMP001", item: "ITM001", dataEmprestimo: "01/01/2021", dataDevolucao: "01/02/2021" },
  { codigo: "EMP002", item: "ITM002", dataEmprestimo: "02/01/2021", dataDevolucao: "02/02/2021" },
  { codigo: "EMP003", item: "ITM003", dataEmprestimo: "03/01/2021", dataDevolucao: "03/02/2021" },
  { codigo: "EMP004", item: "ITM004", dataEmprestimo: "04/01/2021", dataDevolucao: "04/02/2021" },
  { codigo: "EMP005", item: "ITM005", dataEmprestimo: "05/01/2021", dataDevolucao: "05/02/2021" }
];
const itensDisponiveis = [
  "ITM001", "ITM002", "ITM003", "ITM004", "ITM005"
];

function renderEmprestimos() {
  const tbody = document.getElementById("tabela-emprestimos");
  tbody.innerHTML = "";

  emprestimos.forEach((emp, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.codigo}</td>
      <td>${emp.item}</td>
      <td>${emp.dataEmprestimo}</td>
      <td>${emp.dataDevolucao}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="excluirEmprestimo(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function preencherItens() {
  const select = document.getElementById("emprestimo-item");
  itensDisponiveis.forEach(item => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

function cadastrarEmprestimo() {
  const codigo = document.getElementById("emprestimo-codigo").value.trim();
  const item = document.getElementById("emprestimo-item").value;
  const dataEmprestimo = document.getElementById("data-emprestimo").value;
  const dataDevolucao = document.getElementById("data-devolucao").value;

  if (!codigo || !item || !dataEmprestimo || !dataDevolucao) {
    alert("Preencha todos os campos.");
    return;
  }

  emprestimos.push({ codigo, item, dataEmprestimo, dataDevolucao });
  renderEmprestimos();

  bootstrap.Modal.getInstance(document.getElementById("modalNovoEmprestimo")).hide();
  limparCampos();
}

function limparCampos() {
  document.getElementById("emprestimo-codigo").value = "";
  document.getElementById("emprestimo-item").value = "";
  document.getElementById("data-emprestimo").value = "";
  document.getElementById("data-devolucao").value = "";
}

function excluirEmprestimo(index) {
  if (confirm("Deseja excluir este empréstimo?")) {
    emprestimos.splice(index, 1);
    renderEmprestimos();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  preencherItens();
  renderEmprestimos();
});
