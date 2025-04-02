if (usuario.cargo !== "gerente") {
  window.location.href = "/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let manutencoes = [];
let manutencoesFiltrados = [];
let itens = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarManutencoes() {
  manutencoes = await fetch("http://localhost:4000/manutencoes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);

  itens = await fetch("http://localhost:4000/itens", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => {
      console.error(error);
    });

  const selectItem = document.getElementById("manutencao-item");
  selectItem.innerHTML = "";
  itens.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.nome;
    selectItem.appendChild(option);
  });

  manutencoesFiltrados = manutencoes;
  atualizarTabelaEPaginacao();
}

let manutencaoSelecionado = null;
function selecionarManutencao(manutencao) {
  manutencaoSelecionado = manutencao;

  const form = document.getElementById("form-editar");
  form.numIdTecnico.value = manutencoes.find(
    (m) => m.id === manutencao
  ).numidtecnico;
  form.nomeTecnico.value = manutencoes.find(
    (m) => m.id === manutencao
  ).nometecnico;
  const data = manutencoes.find(
    (m) => m.id === manutencao
  ).data;
  form.data.value = new Date(data).toISOString().split("T")[0];
  form.valor.value = manutencoes.find(
    (m) => m.id === manutencao
  ).valor;
  form.descricao.value = manutencoes.find(
    (m) => m.id === manutencao
  ).descricao;
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaManutencoes() {
  const tabela = document.getElementById("tabela-manutencoes");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const manutencoesPagina = manutencoesFiltrados.slice(inicio, fim);

  manutencoesPagina.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.numidtecnico}</td>
      <td>${m.nome}</td>
      <td>${m.nometecnico}</td>
      <td>${new Date(m.data).toLocaleDateString("pt-BR")}</td>
      <td>R$${m.valor}</td>
      <td style="max-width:150px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${
        m.descricao
      }</td>
      <td class="text-end">
        <button onclick="selecionarManutencao(${
          m.id
        })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
        <button onclick="excluir(${
          m.id
        })" class="btn btn-sm btn-outline-secondary">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function cadastrar() {
  window.event.preventDefault();
  const form = document.getElementById("form-cadastro");
  const numIdTecnico = form.numIdTecnico.value;
  const nomeTecnico = form.nomeTecnico.value;
  const data = form.data.value;
  const valor = form.valor.value;
  const descricao = form.descricao.value;
  const itemId = form.itemId.value;

  await fetch("http://localhost:4000/manutencoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeTecnico,
      numIdTecnico,
      data,
      valor,
      descricao,
      itemId,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Manutenção cadastrada com sucesso!");

      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function editar() {
  window.event.preventDefault();
  const form = document.getElementById("form-editar");
  const numIdTecnico = form.numIdTecnico.value;
  const nomeTecnico = form.nomeTecnico.value;
  const data = form.data.value;
  const valor = form.valor.value;
  const descricao = form.descricao.value;

  await fetch(`http://localhost:4000/manutencoes/${manutencaoSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeTecnico,
      numIdTecnico,
      data,
      valor,
      descricao,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Manutenção editada com sucesso!");

      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir este funcionário?")) {
    return;
  }

  await fetch(`http://localhost:4000/manutencoes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Manutenção excluída com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

const busca = document.getElementById("input-busca");
busca.addEventListener("keyup", async () => {
  const termo = busca.value.toLowerCase();

  // Atualiza o array filtrado global
  manutencoesFiltrados = manutencoes.filter((m) =>
    m.nome.toLowerCase().includes(termo)
  );

  // Reseta para a primeira página ao fazer uma nova busca
  paginaAtual = 1;

  // Atualiza tanto a tabela quanto a paginação
  atualizarTabelaEPaginacao();
});

// Renderiza a paginação - FUNÇÃO CORRIGIDA
async function renderPaginacao() {
  const paginacao = document.querySelector(".pagination");
  paginacao.innerHTML = "";

  // Usa manutencoesFiltrados.length em vez de manutencoes.length
  const totalPaginas = Math.ceil(manutencoesFiltrados.length / itensPorPagina);

  // Restante do código da paginação permanece o mesmo...
  // Botão "Anterior"
  const liAnterior = document.createElement("li");
  liAnterior.classList.add("page-item");
  if (paginaAtual === 1) liAnterior.classList.add("disabled");
  liAnterior.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
  liAnterior.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaAtual > 1) {
      paginaAtual--;
      atualizarTabelaEPaginacao();
    }
  });
  paginacao.appendChild(liAnterior);

  // Páginas (limitado a 5 páginas visíveis)
  const maxPaginasVisiveis = 5;
  let inicioPaginas = Math.max(1, paginaAtual - 2);
  let fimPaginas = Math.min(
    totalPaginas,
    inicioPaginas + maxPaginasVisiveis - 1
  );

  // Ajusta se não houver páginas suficientes no início
  if (fimPaginas - inicioPaginas + 1 < maxPaginasVisiveis) {
    inicioPaginas = Math.max(1, fimPaginas - maxPaginasVisiveis + 1);
  }

  // Adiciona páginas
  for (let i = inicioPaginas; i <= fimPaginas; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    if (i === paginaAtual) li.classList.add("active");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      paginaAtual = i;
      atualizarTabelaEPaginacao();
    });
    paginacao.appendChild(li);
  }

  // Botão "Próximo"
  const liProxima = document.createElement("li");
  liProxima.classList.add("page-item");
  if (paginaAtual === totalPaginas) liProxima.classList.add("disabled");
  liProxima.innerHTML = `<a class="page-link" href="#">Próxima</a>`;
  liProxima.addEventListener("click", (e) => {
    e.preventDefault();
    if (paginaAtual < totalPaginas) {
      paginaAtual++;
      atualizarTabelaEPaginacao();
    }
  });
  paginacao.appendChild(liProxima);
}

// Atualiza a tabela e a paginação
function atualizarTabelaEPaginacao() {
  renderTabelaManutencoes();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarManutencoes();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
