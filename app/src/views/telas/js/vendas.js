if (usuario.cargo !== "gerente") {
  window.location.href = "/dashboard";
}

let paginaAtual = 1; // Página inicial
const itensPorPagina = 10; // Número de funcionários por página

let vendas = [];
let vendasFiltrados = [];
let itens = [];
let visitantes = [];

// Variáveis globais (no topo do arquivo)
let itensAdicionados = [];
let itensAdicionadosEditar = [];

// 2. Função corrigida para adicionar itens
function adicionarItem() {
  const selectItem = document.getElementById("venda-item");
  
  // Verifica se o select existe e tem valor
  if (!selectItem || !selectItem.value) {
    alert("Selecione um item válido");
    return;
  }

  // Converte o valor para número
  const itemId = parseInt(selectItem.value);
  
  // Encontra o item completo na lista
  const itemSelecionado = itens.find(item => item.id === itemId);
  
  if (!itemSelecionado) {
    alert("Item não encontrado na lista");
    return;
  }

  // Verifica se o item já foi adicionado (comparação por ID)
  const jaAdicionado = itensAdicionados.some(item => item.id === itemId);
  
  if (jaAdicionado) {
    alert("Este item já foi adicionado");
    return;
  }

  // Adiciona o item e atualiza a exibição
  itensAdicionados.push(itemSelecionado);
  exibirItensAdicionados();
  
  // Limpa o select (opcional)
  selectItem.value = "";
}

// 3. Função para exibir os itens adicionados
function exibirItensAdicionados() {
  const container = document.getElementById("itensAdicionados");
  container.innerHTML = "";

  itensAdicionados.forEach(item => {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary me-2 mb-2";
    badge.style.cursor = "pointer";
    badge.textContent = item.nome;
    
    badge.onclick = () => {
      itensAdicionados = itensAdicionados.filter(i => i.id !== item.id);
      exibirItensAdicionados();
    };
    
    container.appendChild(badge);
  });
}

function removerItemEditar(id) {
  itensAdicionadosEditar = itensAdicionadosEditar.filter((item) => item.id !== id);
  exibirItensAdicionadosEditar();
}

function removerItem(id) {
  itensAdicionados = itensAdicionados.filter((item) => item.id !== id);
  exibirItensAdicionados();
}

function adicionarItemEditar() {
  const selectItem = document.getElementById("editar-item");
  const itemId = parseInt(selectItem.value);
  
  // Verifica se o item é válido
  if (!itemId) {
    alert("Selecione um item válido");
    return;
  }

  // Busca o item completo na lista
  const itemSelecionado = itens.find(item => item.id === itemId);
  
  if (!itemSelecionado) {
    alert("Item não encontrado");
    return;
  }

  // Verifica se já foi adicionado
  const jaAdicionado = itensAdicionadosEditar.some(item => item.id === itemId);
  
  if (jaAdicionado) {
    alert("Este item já foi adicionado");
    return;
  }

  // Adiciona o item e atualiza a exibição
  itensAdicionadosEditar.push(itemSelecionado);
  exibirItensAdicionadosEditar();
  
  // Limpa o select (opcional)
  selectItem.value = "";
}

function exibirItensAdicionadosEditar() {
  const container = document.getElementById("itensAdicionadosEditar");
  container.innerHTML = "";

  itensAdicionadosEditar.forEach(item => {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary me-2 mb-2";
    badge.style.cursor = "pointer";
    badge.textContent = item.nome;
    
    badge.onclick = () => {
      itensAdicionadosEditar = itensAdicionadosEditar.filter(i => i.id !== item.id);
      exibirItensAdicionadosEditar();
    };
    
    container.appendChild(badge);
  });
}

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarVendas() {
  vendas = await fetch("http://localhost:4000/vendas", {
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

  const selectItemCadastro = document.getElementById("venda-item");
  selectItemCadastro.innerHTML = "";
  itens.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.nome;
    selectItemCadastro.appendChild(option);
  });

  const selectVisitanteCadastro = document.getElementById("venda-visitante");
  selectVisitanteCadastro.innerHTML = "";
  visitantes.forEach((visitante) => {
    const option = document.createElement("option");
    option.value = visitante.id;
    option.innerText =
      visitante.pessoafisica_nome || visitante.pessoajuridica_razao_social;
    selectVisitanteCadastro.appendChild(option);
  });

  const selectItemEdicao = document.getElementById("editar-item");
  selectItemEdicao.innerHTML = "";
  itens.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.nome;
    selectItemEdicao.appendChild(option);
  });

  const selectVisitanteEdicao = document.getElementById("editar-visitante");
  selectVisitanteEdicao.innerHTML = "";
  visitantes.forEach((visitante) => {
    const option = document.createElement("option");
    option.value = visitante.id;
    option.innerText =
      visitante.pessoafisica_nome || visitante.pessoajuridica_razao_social;
    selectVisitanteEdicao.appendChild(option);
  });

  
  vendasFiltrados = vendas;
  atualizarTabelaEPaginacao();
}

let vendaSelecionado = null;

function selecionarVenda(vendaId) {
  vendaSelecionado = vendaId;

  const venda = vendas.find((v) => v.id === vendaId);
  if (!venda) {
    alert("Venda não encontrada.");
    return;
  }

  const form = document.getElementById("form-editar");
  const divItensAdicionadosEditar = document.getElementById("itensAdicionadosEditar");
  
  form.valor.value = venda.valor;
  form.data.value = new Date(venda.data).toISOString().split("T")[0];
  form.visitante.value = venda.visitante_id; // Usar o ID do visitante, não o nome
  
  // Limpar e repopular os itens adicionados para edição
  itensAdicionadosEditar = [...venda.itens]; // Copiar os itens da venda
  exibirItensAdicionadosEditar();
}

function exibirItensAdicionadosEditar() {
  const divItensAdicionadosEditar = document.getElementById("itensAdicionadosEditar");
  divItensAdicionadosEditar.innerHTML = "";

  itensAdicionadosEditar.forEach((item) => {
    const divItem = document.createElement("div");
    divItem.textContent = item.nome;
    divItem.onclick = () => {
      itensAdicionadosEditar = itensAdicionadosEditar.filter((i) => i.id !== item.id);
      exibirItensAdicionadosEditar();
    };
    divItem.classList.add("badge", "bg-secondary", "me-1");
    divItensAdicionadosEditar.appendChild(divItem);
  });
}

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaVendas() {
  const tabela = document.getElementById("tabela-vendas");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de itens por página
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  // Obtém apenas os funcionários da página atual
  const vendasPagina = vendasFiltrados.slice(inicio, fim);

  vendasPagina.forEach((v) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>R$${v.valor}</td>
      <td>${new Date(v.data).toLocaleDateString("pt-BR")}</td>
      <td>${v.nome_comprador}</td>
      <td  style="max-width:400px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${v.itens.map((item) => {
        return (" " + item.nome);
      })}</td>
      <td class="text-end">
      <button onclick="selecionarVenda(${
        v.id
      })" class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
      <button onclick="excluir(${
        v.id
      })" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal">🗑️</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

async function cadastrar() {
  window.event.preventDefault();
  const form = document.getElementById("form-cadastro");

  const valor = form.valor.value;
  const data = form.data.value;
  const visitante = parseInt(form.visitante.value);

  await fetch("http://localhost:4000/vendas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor,
      data,
      visitante_id: visitante,
      itens: itensAdicionados && itensAdicionados.map((item) => item.id),
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Venda cadastrada com sucesso!");

      form.reset();
      window.location.reload();

      itensAdicionados = [];
      exibirItensAdicionados();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function editar() {
  window.event.preventDefault();
  const form = document.getElementById("form-editar");

  const valor = form.valor.value;
  const data = form.data.value;
  const visitante = parseInt(form.visitante.value);

  await fetch(`http://localhost:4000/vendas/${vendaSelecionado}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      valor,
      data,
      visitante_id: visitante,
      itens: itensAdicionadosEditar && itensAdicionadosEditar.map((item) => item.id),
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Venda editada com sucesso!");

      form.reset();
      window.location.reload();

      itensAdicionadosEditar = [];
      exibirItensAdicionadosEditar();
    })
    .catch((error) => {
      alert(error.erros[0]);
    });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir esta venda?")) {
    return;
  }

  await fetch(`http://localhost:4000/vendas/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Venda excluída com sucesso!");
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
  vendasFiltrados = vendas.filter((v) => {
    return v.nome_comprador.toLowerCase().includes(termo);
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

  // Usa vendasFiltrados.length em vez de vendas.length
  const totalPaginas = Math.ceil(vendasFiltrados.length / itensPorPagina);

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
  renderTabelaVendas();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarVendas();
  atualizarTabelaEPaginacao();
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", inicializar());
