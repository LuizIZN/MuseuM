const contratos = [];

const visitantes = [
  { nome: "Carlos Henrique" },
  { nome: "Ana Paula" },
  { nome: "Fundação XYZ" }
];

function renderContratos() {
  const tabela = document.getElementById("tabela-contratos");
  tabela.innerHTML = "";

  contratos.forEach((c, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>R$ ${c.valor}</td>
      <td>${c.descricao}</td>
      <td>${c.visitante}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-danger" onclick="excluirContrato(${index})">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function preencherVisitantes() {
  const select = document.getElementById("contrato-visitante");
  visitantes.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.nome;
    opt.textContent = v.nome;
    select.appendChild(opt);
  });
}

function registrarContrato() {
  const valor = document.getElementById("contrato-valor").value.trim();
  const descricao = document.getElementById("contrato-descricao").value.trim();
  const visitante = document.getElementById("contrato-visitante").value;

  if (!valor || !descricao || !visitante) {
    alert("Preencha todos os campos.");
    return;
  }

  contratos.push({ valor, descricao, visitante });
  renderContratos();

  bootstrap.Modal.getInstance(document.getElementById("modalNovoContrato")).hide();
  limparCampos();
}

function limparCampos() {
  document.getElementById("contrato-valor").value = "";
  document.getElementById("contrato-descricao").value = "";
  document.getElementById("contrato-visitante").value = "";
}

function excluirContrato(index) {
  if (confirm("Deseja excluir este contrato?")) {
    contratos.splice(index, 1);
    renderContratos();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  preencherVisitantes();
  renderContratos();
});
