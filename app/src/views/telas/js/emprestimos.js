if (usuario.cargo !== "atendente") {
  window.location.href = "/paginas/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let emprestimos = [];
let emprestimosFiltrados = [];
let itens = [];
let visitantes = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarEmprestimos() {
  emprestimos = await fetch("http://localhost:4000/emprestimos", {
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

  console.log(itens);

  visitantes = await fetch("http://localhost:4000/visitantes", {
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

  const selectItem = document.getElementById("emprestimo-item");
  selectItem.innerHTML = "";
  itens.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.nome;
    selectItem.appendChild(option);
  });

  const selectVisitante = document.getElementById("emprestimo-visitante");
  selectVisitante.innerHTML = "";
  visitantes.forEach((visitante) => {
    const option = document.createElement("option");
    option.value = visitante.id;
    option.innerText =
      visitante.pessoafisica_nome || visitante.pessoajuridica_razao_social;
    selectVisitante.appendChild(option);
  });

  emprestimosFiltrados = emprestimos;
  atualizarTabelaEPaginacao();
}

let emprestimoSelecionado = null;
function selecionarEmprestimo(emprestimo) {
  emprestimoSelecionado = emprestimo;

  const form = document.getElementById("form-editar");
  const dataD = emprestimos.find((emp) => emp.id === emprestimo).data_devolucao;
  const dataE = emprestimos.find(
    (emp) => emp.id === emprestimo
  ).data_emprestimo;
  form.data_devolucao.value = new Date(dataD).toISOString().split("T")[0];
  form.data_emprestimo.value = new Date(dataE).toISOString().split("T")[0];
  form.codigo.value = emprestimos.find(
    (emp) => emp.id === emprestimo
  ).cod_emprestimo;
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaEmprestimos() {
  const tabela = document.getElementById("tabela-emprestimos");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const emprestimosPagina = emprestimosFiltrados.slice(inicio, fim);

  emprestimosPagina.forEach((emp) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.cod_emprestimo}</td>
      <td>${emp.item}</td>
      <td>${new Date(emp.data_emprestimo).toLocaleDateString("pt-BR")}</td>
      <td>${new Date(emp.data_devolucao).toLocaleDateString("pt-BR")}</td>
      <td>${emp.visitante_nome}</td>
      <td class="text-end">
      <button onclick="selecionarEmprestimo(${
        emp.id
      })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
      <button onclick="excluir(${
        emp.id
      })" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function cadastrar() {
  window.event.preventDefault();
  const form = document.getElementById("form-cadastro");

  const codigo = form.codigo.value;
  const itemId = form.item.value;
  const dataEmprestimo = form.data_emprestimo.value;
  const dataDevolucao = form.data_devolucao.value;
  const visitanteId = form.visitante.value;

  await fetch("http://localhost:4000/emprestimos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codigo,
      dataEmprestimo,
      dataDevolucao,
      itemId,
      visitanteId,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Empréstimo cadastrado com sucesso!");

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
  const dataEmprestimo = form.data_emprestimo.value;
  const dataDevolucao = form.data_devolucao.value;
  const codigo = form.codigo.value;

  await fetch(`http://localhost:4000/emprestimos/${emprestimoSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataEmprestimo,
      dataDevolucao,
      codigo,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Empréstimo editado com sucesso!");

      form.reset();
      window.location.reload();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir este emprestimo?")) {
    return;
  }

  await fetch(`http://localhost:4000/emprestimos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Empréstimo excluído com sucesso!");
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
  emprestimosFiltrados = emprestimos.filter((emp) => {
    return emp.item.toLowerCase().includes(termo);
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

  // Usa emprestimosFiltrados.length em vez de emprestimos.length
  const totalPaginas = Math.ceil(emprestimosFiltrados.length / itensPorPagina);

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

  // Páginas (limitado a 5 páginas empíveis)
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
  renderTabelaEmprestimos();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarEmprestimos();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
