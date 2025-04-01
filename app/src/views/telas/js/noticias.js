// Troque para "diretor" se necessário
const userRole = "diretor"; // ou "atendente"

const noticias = [
  {
    titulo: "Exposição de Arte Moderna",
    diretor: "Paulo",
    tags: "arte, moderna",
    conteudo: "<p>Explore a nova exposição de arte moderna no MuseuM.</p>",
  },
  {
    titulo: "Oficina de Restauração",
    diretor: "Paulo",
    tags: "oficina, restauração",
    conteudo: "<p>Participe da oficina de restauração de peças históricas.</p>",
  },
];

let quill;
let editandoIndex = null;

window.addEventListener("DOMContentLoaded", () => {
  quill = new Quill("#quill-editor", {
    theme: "snow",
  });

  if (userRole === "atendente") {
    document.getElementById("btnNovaNoticia").classList.add("d-none");
    document.getElementById("secao-editor").classList.add("d-none");
  }

  renderNoticias();
});

function renderNoticias() {
  const tbody = document.getElementById("tabela-noticias");
  tbody.innerHTML = "";

  noticias.forEach((noticia, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${noticia.titulo}</td>
      <td>${noticia.diretor}</td>
      <td>${noticia.tags}</td>
      <td class="text-end">
        ${
          userRole === "diretor"
            ? `
          <button class="btn btn-sm btn-outline-secondary me-1" onclick="editarNoticia(${index})">✏️</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirNoticia(${index})">🗑️</button>
        `
            : `
          <button class="btn btn-sm btn-outline-primary" onclick="lerNoticia(${index})">👁️ Ler</button>
        `
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

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
  editandoIndex = null;
}

function salvarNoticia() {
  const titulo = document.getElementById("noticia-titulo").value.trim();
  const tags = document.getElementById("noticia-tags").value.trim();
  const conteudo = quill.root.innerHTML;

  if (!titulo || !conteudo) {
    alert("Preencha o título e o conteúdo.");
    return;
  }

  const nova = {
    titulo,
    diretor: "Paulo",
    tags,
    conteudo,
  };

  if (editandoIndex !== null) {
    noticias[editandoIndex] = nova;
  } else {
    noticias.push(nova);
  }

  fecharEditor();
  renderNoticias();
}

function editarNoticia(index) {
  const noticia = noticias[index];
  editandoIndex = index;

  document.getElementById("noticia-titulo").value = noticia.titulo;
  document.getElementById("noticia-tags").value = noticia.tags;
  quill.root.innerHTML = noticia.conteudo;

  document.getElementById("secao-lista").classList.add("d-none");
  document.getElementById("secao-editor").classList.remove("d-none");
}

function excluirNoticia(index) {
  if (confirm("Deseja excluir esta notícia?")) {
    noticias.splice(index, 1);
    renderNoticias();
  }
}

function lerNoticia(index) {
  const noticia = noticias[index];
  document.getElementById("lerTitulo").textContent = noticia.titulo;
  document.getElementById("lerConteudo").innerHTML = noticia.conteudo;

  new bootstrap.Modal(document.getElementById("modalLerNoticia")).show();
}
