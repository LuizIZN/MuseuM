let paginaAtual = 1; // Página inicial
const noticiasPorPagina = 10; // Número de funcionários por página

let noticias = [];
let noticiasFiltrados = [];

// Lista mock de funcionários (pode ser substituída por API futuramente)
async function carregarNoticias() {
  noticias = await fetch("http://localhost:4000/noticias", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  noticiasFiltrados = noticias;
  atualizarTabelaEPaginacao();
}

let noticiaSelecionado = null;

// Renderiza a tabela com os dados
// Renderiza a tabela com os dados
async function renderTabelaNoticias() {
  const tabela = document.getElementById("tabela-noticias");
  tabela.innerHTML = "";

  // Calcula os índices de início e fim com base na página atual e no número de noticias por página
  const inicio = (paginaAtual - 1) * noticiasPorPagina;
  const fim = inicio + noticiasPorPagina;

  // Obtém apenas os funcionários da página atual
  const noticiasPagina = noticiasFiltrados.slice(inicio, fim);

  noticiasPagina.forEach((noticia) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${noticia.titulo}</td>
    <td>${noticia.diretor_nome}</td>
    <td>${noticia.palavraschave}</td>
    <td class="text-end">
      ${
        usuario.cargo === "diretor"
          ? `
        <button class="btn btn-sm btn-outline-secondary me-1" onclick="editar(${noticia.id})">✏️</button>
        <button class="btn btn-sm btn-outline-danger" onclick="excluir(${noticia.id})">🗑️</button>
      `
          : `
        <button class="btn btn-sm btn-outline-primary" onclick="lerNoticia(${noticia.id})">👁️ Ler</button>
      `
      }
    </td>`;
    tabela.appendChild(tr);
  });
}

async function excluir(id) {
  window.event.preventDefault();

  if (!confirm("Deseja realmente excluir esta noticia?")) {
    return;
  }

  await fetch(`http://localhost:4000/noticias/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw await response.json();
      }
      alert("Noticia excluído com sucesso!");
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
  noticiasFiltrados = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(termo)
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

  // Usa noticiasFiltrados.length em vez de noticias.length
  const totalPaginas = Math.ceil(noticiasFiltrados.length / noticiasPorPagina);

  // Restante do código da paginação permanece o mesmo...
  // Botão "Anterior"
  const liAnterior = document.createElement("li");
  liAnterior.classList.add("page-noticia");
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
    li.classList.add("page-noticia");
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
  liProxima.classList.add("page-noticia");
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
  renderTabelaNoticias();
  renderPaginacao();
}

// Inicializa a página
async function inicializar() {
  await carregarNoticias();
  atualizarTabelaEPaginacao();
}


let quill;
let editandoIndex = null;

window.addEventListener("DOMContentLoaded", () => {
  quill = new Quill("#quill-editor", {
    theme: "snow",
  });

  if (usuario.cargo === "atendente") {
    document.getElementById("btnNovaNoticia").classList.add("d-none");
    document.getElementById("secao-editor").classList.add("d-none");
  }

  inicializar();
});

function abrirEditor() {
  editandoIndex = null;
  document.getElementById("secao-lista").classList.add("d-none");
  document.getElementById("secao-editor").classList.remove("d-none");

  document.getElementById("noticia-titulo").value = "";
  document.getElementById("noticia-tags").value = "";
  quill.root.innerHTML = "";
}

function fecharEditor() {
  document.getElementById("secao-editor").classList.add("d-none");
  document.getElementById("secao-lista").classList.remove("d-none");
  noticiaSelecionado = null;
}

async function salvarNoticia() {
  const titulo = document.getElementById("noticia-titulo").value.trim();
  const palavrasChave = document
    .getElementById("noticia-tags")
    .value.split(",")
    .map((word) => word.trim());
  const texto = quill.root.innerHTML;

  if (noticiaSelecionado !== null) {
    await fetch(
      `http://localhost:4000/noticias/${noticiaSelecionado}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          palavrasChave,
          texto,
        }),
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        alert("Notícia editada com sucesso!");

        fecharEditor();
        noticiaSelecionado = null;
        window.location.reload();
      })
      .catch((error) => {
        alert(error.erros[0]);
      });
  } else {
    await fetch("http://localhost:4000/noticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo,
        palavrasChave,
        texto,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        alert("Notícia cadastrada com sucesso!");

        fecharEditor();
        window.location.reload();
      })
      .catch((error) => {
        alert(error.erros[0]);
      });
  }
}

function editar(index) {
  noticiaSelecionado = index;
  const noticia = noticias.find((n) => n.id === noticiaSelecionado);


  document.getElementById("noticia-titulo").value = noticia.titulo;
  document.getElementById("noticia-tags").value = noticia.palavraschave;
  quill.root.innerHTML = noticia.texto;

  document.getElementById("secao-lista").classList.add("d-none");
  document.getElementById("secao-editor").classList.remove("d-none");
}

function lerNoticia(index) {
  const noticia = noticias[index];
  document.getElementById("lerTitulo").textContent = noticia.titulo;
  document.getElementById("lerConteudo").innerHTML = noticia.texto;

  new bootstrap.Modal(document.getElementById("modalLerNoticia")).show();
}