if (usuario.cargo !== "gerente") {
  window.location.href = "/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let itens = [];
let itensFiltrados = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarItens() {
  itens = await fetch("http://localhost:4000/itens", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  itensFiltrados = itens;
  atualizarTabelaEPaginacao();
}

let itemSelecionado = null;
function selecionarItem(item) {
  itemSelecionado = item;

  const form = document.getElementById("form-editar");
  const itemEncontrado = itens.find((i) => i.id === item);

  if (!itemEncontrado) {
    console.error("Item não encontrado:", item);
    return;
  }

  form.codigo.value = itemEncontrado.cod_item || "";
  form.nome.value = itemEncontrado.nome || "";
  form.estado_conservacao.value = itemEncontrado.estadoconservacao || "";
  form.classificacao.value = itemEncontrado.classificacao || "";

  console.log("Item selecionado:", itemEncontrado);
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaItens() {
  const tabela = document.getElementById("tabela-itens");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const itensPagina = itensFiltrados.slice(inicio, fim);

  itensPagina.forEach((i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i.cod_item}</td>
      <td>${i.doacao_id || "-"}</td>
      <td>${i.nome}</td>
      <td>${
        i.estadoconservacao === "Otimo"
          ? "Ótimo"
          : i.estadoconservacao === "Pessimo"
          ? "Péssimo"
          : i.estadoconservacao
      }</td>
      <td>${
        i.classificacao === "Patrimonio"
          ? "Patrimônio"
          : i.classificacao === "Comercio"
          ? "Comércio"
          : i.classificacao
      }</td>
      <td class="text-end">
        <button onclick="selecionarItem(${
          i.id
        })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
        <button onclick="excluir(${
          i.id
        })" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function cadastrar() {
  window.event.preventDefault();
  const form = document.getElementById("form-cadastro");
  const nome = form.nome.value;
  const codigo = form.codigo.value;
  const estado_conservacao = form.estado_conservacao.value;
  const classificacao = form.classificacao.value;

  await fetch("http://localhost:4000/itens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      codigo,
      estado_conservacao,
      classificacao,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Item cadastrado com sucesso!");
      window.location.reload();

      form.reset();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function editar() {
  window.event.preventDefault();
  const form = document.getElementById("form-editar");
  const codigo = form.codigo.value;
  const nome = form.nome.value;
  const estado_conservacao = form.estado_conservacao.value;
  const classificacao = form.classificacao.value;

  await fetch(`http://localhost:4000/itens/${itemSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codigo,
      nome,
      estado_conservacao,
      classificacao,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Item editado com sucesso!");

      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir este item?")) {
    return;
  }

  await fetch(`http://localhost:4000/itens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Item excluído com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });

  form.reset();
}

const busca = document.getElementById("input-busca");
busca.addEventListener("keyup", async () => {
  const termo = busca.value.toLowerCase();

  // Atualiza o array filtrado global
  itensFiltrados = itens.filter((func) =>
    func.nome.toLowerCase().includes(termo)
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

  // Usa itensFiltrados.length em vez de itens.length
  const totalPaginas = Math.ceil(itensFiltrados.length / itensPorPagina);

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
  renderTabelaItens();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarItens();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
