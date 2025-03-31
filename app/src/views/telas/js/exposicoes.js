let exposicoes = [
    {
      titulo: "Arte Moderna Brasileira",
      dias: "Seg a Dom",
      descricao: "Exposição com foco nos movimentos modernistas do Brasil."
    },
    {
      titulo: "Fotografia Antiga",
      dias: "Qua a Sáb",
      descricao: "Mostra de fotografias históricas do século XIX e XX."
    }
  ];
  
  let exposicaoEditando = null;
  
  function renderExposicoes() {
    const tbody = document.getElementById("tabela-exposicoes");
    tbody.innerHTML = "";
  
    exposicoes.forEach((exp, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${exp.titulo}</td>
        <td>${exp.dias}</td>
        <td>${exp.descricao}</td>
        <td class="text-end">
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">⋯</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" onclick="editarExposicao(${index})">✏️ Editar</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="excluirExposicao(${index})">🗑️ Excluir</a></li>
            </ul>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function cadastrarExposicao() {
    const titulo = document.getElementById("nova-titulo").value.trim();
    const dias = document.getElementById("nova-dias").value.trim();
    const descricao = document.getElementById("nova-descricao").value.trim();
  
    if (!titulo || !dias || !descricao) {
      alert("Preencha todos os campos!");
      return;
    }
  
    exposicoes.push({ titulo, dias, descricao });
    renderExposicoes();
  
    document.getElementById("nova-titulo").value = "";
    document.getElementById("nova-dias").value = "";
    document.getElementById("nova-descricao").value = "";
  
    bootstrap.Modal.getInstance(document.getElementById("modalNovaExposicao")).hide();
  }
  
  function editarExposicao(index) {
    exposicaoEditando = index;
    const expo = exposicoes[index];
  
    document.getElementById("edit-titulo").value = expo.titulo;
    document.getElementById("edit-dias").value = expo.dias;
    document.getElementById("edit-descricao").value = expo.descricao;
  
    new bootstrap.Modal(document.getElementById("modalEditarExposicao")).show();
  }
  
  function salvarEdicaoExposicao() {
    const titulo = document.getElementById("edit-titulo").value.trim();
    const dias = document.getElementById("edit-dias").value.trim();
    const descricao = document.getElementById("edit-descricao").value.trim();
  
    if (exposicaoEditando === null || !titulo || !dias || !descricao) return;
  
    exposicoes[exposicaoEditando] = { titulo, dias, descricao };
    renderExposicoes();
  
    bootstrap.Modal.getInstance(document.getElementById("modalEditarExposicao")).hide();
    exposicaoEditando = null;
  }
  
  function excluirExposicao(index) {
    if (confirm("Deseja excluir esta exposição?")) {
      exposicoes.splice(index, 1);
      renderExposicoes();
    }
  }
  
  window.addEventListener("DOMContentLoaded", renderExposicoes);
  