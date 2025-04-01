const usuario = JSON.parse(localStorage.getItem("usuario"));
if (usuario.cargo !== "gerente") {
  window.location.href = "/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let funcionarios = [];
let funcionariosFiltrados = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarFuncionarios() {
  funcionarios = await fetch("http://localhost:4000/funcionarios", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  funcionariosFiltrados = funcionarios;
  atualizarTabelaEPaginacao();
}

let funcionarioSelecionado = null;
function selecionarFuncionario(funcionario) {
  funcionarioSelecionado = funcionario;

  const form = document.getElementById("form-editar");
  form.nome.value = funcionarios.find(
    (func) => func.funcionario_id === funcionario
  ).nome;
  form.email.value = funcionarios.find(
    (func) => func.funcionario_id === funcionario
  ).email;
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaFuncionarios() {
  const tabela = document.getElementById("tabela-funcionarios");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const funcionariosPagina = funcionariosFiltrados.slice(inicio, fim);

  funcionariosPagina.forEach((func) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${func.funcionario_id}</td>
      <td>${func.nome}</td>
      <td>${func.email}</td>
      <td>${func.cargo.toUpperCase()}</td>
      <td class="text-end">
        <button onclick="selecionarFuncionario(${
          func.funcionario_id
        })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
        <button onclick="excluir(${
          func.funcionario_id
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
  const email = form.email.value;
  const senha = form.senha.value;
  const confirmarSenha = form.confirmarSenha.value;
  const funcao = form.funcao.value;

  await fetch("http://localhost:4000/funcionarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
      confirmar_senha: confirmarSenha,
      cargo: funcao,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Funcionário cadastrado com sucesso!");

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
  const nome = form.nome.value;
  const email = form.email.value;

  await fetch(`http://localhost:4000/funcionarios/${funcionarioSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Funcionário editado com sucesso!");

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

  await fetch(`http://localhost:4000/funcionarios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Funcionário excluído com sucesso!");
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
  funcionariosFiltrados = funcionarios.filter((func) =>
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

  // Usa funcionariosFiltrados.length em vez de funcionarios.length
  const totalPaginas = Math.ceil(funcionariosFiltrados.length / itensPorPagina);

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
  renderTabelaFuncionarios();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarFuncionarios();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
