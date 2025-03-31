const vendas = [];

const visitantes = [
  { nome: "Carlos Henrique" },
  { nome: "Ana Paula" },
  { nome: "Empresa XYZ Ltda." }
];

const itens = [
  { codigo: "ITM001", nome: "Vaso Grego" },
  { codigo: "ITM002", nome: "Quadro Modernista" },
  { codigo: "ITM003", nome: "Escultura Romana" }
];

function renderVendas() {
  const tabela = document.getElementById("tabela-vendas");
  tabela.innerHTML = "";

  vendas.forEach((venda, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>R$ ${venda.valor}</td>
      <td>${venda.data}</td>
      <td>${venda.visitante}</td>
      <td>${venda.item}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-danger" onclick="excluirVenda(${index})">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

function preencherSelects() {
  const visitanteSelect = document.getElementById("visitante");
  visitantes.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.nome;
    opt.textContent = v.nome;
    visitanteSelect.appendChild(opt);
  });

  const itemSelect = document.getElementById("item");
  itens.forEach(i => {
    const opt = document.createElement("option");
    opt.value = i.nome;
    opt.textContent = `${i.codigo} - ${i.nome}`;
    itemSelect.appendChild(opt);
  });
}

function registrarVenda() {
  const valor = document.getElementById("valor").value;
  const data = document.getElementById("data").value;
  const visitante = document.getElementById("visitante").value;
  const item = document.getElementById("item").value;

  if (!valor || !data || !visitante || !item) {
    alert("Preencha todos os campos!");
    return;
  }

  vendas.push({ valor, data, visitante, item });
  renderVendas();

  bootstrap.Modal.getInstance(document.getElementById("modalNovaVenda")).hide();

  document.getElementById("valor").value = "";
  document.getElementById("data").value = "";
  document.getElementById("visitante").value = "";
  document.getElementById("item").value = "";
}

function excluirVenda(index) {
  if (confirm("Deseja excluir esta venda?")) {
    vendas.splice(index, 1);
    renderVendas();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  preencherSelects();
  renderVendas();
});
