if (usuario.cargo !== "atendente" && usuario.cargo !== "gerente") {
  window.location.href = "/paginas/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let visitantes = [];
let visitantesFiltrados = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarVisitantes() {
  visitantes = await fetch("http://localhost:4000/visitantes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  visitantesFiltrados = visitantes;
  atualizarTabelaEPaginacao();
}

let visitanteSelecionado = null;
function selecionarVisitante(visitante) {
  visitanteSelecionado = visitante;

  const form = document.getElementById("form-editar");
  form.telefone.value = visitantes.find(
    (vis) => vis.id === visitante
  ).telefone;
  form.email.value = visitantes.find(
    (vis) => vis.id === visitante
  ).email;
  form.endereco.value = visitantes.find(
    (vis) => vis.id === visitante
  ).endereco;
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaVisitantes() {
  const tabela = document.getElementById("tabela-visitantes");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const visitantesPagina = visitantesFiltrados.slice(inicio, fim);

  visitantesPagina.forEach((vis) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${vis.cpf ? "Pessoa Física" : "Pessoa Jurídica"}</td>
      <td>${vis.pessoafisica_nome || vis.pessoajuridica_razao_social}</td>
      <td>${vis.cpf || vis.cnpj}</td>
      <td>${vis.email}</td>
      <td>${vis.telefone}</td>
      <td style="max-width:150px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${vis.endereco}</td>
      <td class="text-end">
        <button onclick="selecionarVisitante(${
          vis.id
        })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
        <button onclick="excluir(${
          vis.id
        })" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function cadastrar() {
  window.event.preventDefault();
  const form = document.getElementById("form-cadastro");

  const email = form.email.value;
  const telefone = form.telefone.value;
  const endereco = form.endereco.value;
  const tipodepessoa = form.tipodepessoa.value;
  let cpf = null,
    cnpj = null,
    razao_social = null,
    nome = null;
  if (tipodepessoa === "pessoafisica") {
    cpf = form.cpf.value;
    nome = form.nome.value;
  } else {
    razao_social = form.nome_fantasia.value;
    cnpj = form.cnpj.value;
  }

  await fetch("http://localhost:4000/visitantes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tipodepessoa,
      cpf: cpf,
      cnpj: cnpj,
      nome: nome,
      razao_social: razao_social,
      email,
      telefone,
      endereco,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Visitante cadastrado com sucesso!");

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
  const email = form.email.value;
  const telefone = form.telefone.value;
  const endereco = form.endereco.value;

  await fetch(`http://localhost:4000/visitantes/${visitanteSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      telefone,
      endereco
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Visitante editado com sucesso!");

      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir este visitante?")) {
    return;
  }

  await fetch(`http://localhost:4000/visitantes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Visitante excluído com sucesso!");
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
  visitantesFiltrados = visitantes.filter((vis) => {
    return (vis.pessoafisica_nome || vis.pessoajuridica_razao_social)
      .toLowerCase()
      .includes(termo);
  });

  // Reseta para a primeira página ao fazer uma nova busca
  paginaAtual = 1;

  // Atualiza tanto a tabela quanto a paginação
  atualizarTabelaEPaginacao();
});

// Renderiza a paginação - FUNÇÃO CORRIGIDA
async function renderPaginacao() {
  const paginacao = document.querySelector(".pagination");
  paginacao.innerHTML = "";

  // Usa visitantesFiltrados.length em vez de visitantes.length
  const totalPaginas = Math.ceil(visitantesFiltrados.length / itensPorPagina);

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
  renderTabelaVisitantes();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarVisitantes();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
