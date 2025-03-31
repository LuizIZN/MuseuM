const doacoes = [];

const visitantes = [
  { nome: "Carlos Henrique" },
  { nome: "Ana Paula" },
  { nome: "Fundação Cultural XYZ" }
];

function renderDoacoes() {
  const tabela = document.getElementById("tabela-doacoes");
  tabela.innerHTML = "";

  doacoes.forEach((doacao, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>R$ ${doacao.valor}</td>
      <td>${doacao.data}</td>
      <td>${doacao.visitante}</td>
      <td>${doacao.item.nome}</td>
      <td>${doacao.item.classificacao}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="excluirDoacao(${index})">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function preencherVisitantes() {
  const select = document.getElementById("doacao-visitante");
  visitantes.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.nome;
    opt.textContent = v.nome;
    select.appendChild(opt);
  });
}

function registrarDoacao() {
  const valor = document.getElementById("doacao-valor").value;
  const data = document.getElementById("doacao-data").value;
  const visitante = document.getElementById("doacao-visitante").value;

  const codigo = document.getElementById("item-codigo").value;
  const nome = document.getElementById("item-nome").value;
  const estado = document.getElementById("item-estado").value;
  const classificacao = document.getElementById("item-classificacao").value;

  if (!valor || !data || !visitante || !codigo || !nome || !estado || !classificacao) {
    alert("Preencha todos os campos.");
    return;
  }

  const item = { codigo, nome, estado, classificacao };
  doacoes.push({ valor, data, visitante, item });

  renderDoacoes();
  bootstrap.Modal.getInstance(document.getElementById("modalNovaDoacao")).hide();
  limparCampos();
}

function limparCampos() {
  ["doacao-valor", "doacao-data", "doacao-visitante", "item-codigo", "item-nome", "item-estado", "item-classificacao"]
    .forEach(id => document.getElementById(id).value = "");
}

function excluirDoacao(index) {
  if (confirm("Deseja excluir esta doação?")) {
    doacoes.splice(index, 1);
    renderDoacoes();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  preencherVisitantes();
  renderDoacoes();
});
