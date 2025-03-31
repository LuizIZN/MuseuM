const manutencoes = [
    { id: "TEC001", item: "ITM001", tecnico: "João Silva", data: "15/02/2025", valor: "500,00", descricao: "Restauração da moldura da pintura" },
    { id: "TEC002", item: "ITM002", tecnico: "Maria Oliveira", data: "10/01/2025", valor: "1200,00", descricao: "Limpeza e reparo estrutural da escultura" },
    { id: "TEC003", item: "ITM003", tecnico: "Carlos Mendes", data: "05/02/2025", valor: "300,00", descricao: "Conservação preventiva do manuscrito" },
    { id: "TEC004", item: "ITM004", tecnico: "Ana Paula Souza", data: "20/02/2025", valor: "700,00", descricao: "Reparo na madeira e tratamento anti-cupim" },
    { id: "TEC005", item: "ITM005", tecnico: "Fernando Almeida", data: "18/02/2025", valor: "150,00", descricao: "Restauração de foto antiga" },
    { id: "TEC006", item: "ITM006", tecnico: "Bruna Carvalho", data: "18/02/2025", valor: "800,00", descricao: "Limpeza e estabilização do vaso grego" }
  ];
  
  function renderTabelaManutencoes() {
    const tabela = document.getElementById("tabela-manutencoes");
    tabela.innerHTML = "";
  
    manutencoes.forEach((manut, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${manut.id}</td>
        <td>${manut.item}</td>
        <td>${manut.tecnico}</td>
        <td>${manut.data}</td>
        <td>${manut.valor}</td>
        <td>${manut.descricao}</td>
        <td class="text-end">
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
              ⋯
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" onclick="editarManutencao(${index})">✏️ Editar</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="excluirManutencao(${index})">🗑️ Excluir</a></li>
            </ul>
          </div>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }
  
  function excluirManutencao(index) {
    if (confirm("Deseja excluir esta manutenção?")) {
      manutencoes.splice(index, 1);
      renderTabelaManutencoes();
    }
  }
  
  let manutencaoEditandoIndex = null;
  
  function editarManutencao(index) {
    const manut = manutencoes[index];
    manutencaoEditandoIndex = index;
  
    document.getElementById("edit-id").value = manut.id;
    document.getElementById("edit-item").value = manut.item;
    document.getElementById("edit-tecnico").value = manut.tecnico;
    document.getElementById("edit-data").value = manut.data;
    document.getElementById("edit-valor").value = manut.valor;
    document.getElementById("edit-descricao").value = manut.descricao;
  
    const modal = new bootstrap.Modal(document.getElementById("modalEditarManutencao"));
    modal.show();
  }
  
  function salvarEdicao() {
    if (manutencaoEditandoIndex === null) return;
  
    manutencoes[manutencaoEditandoIndex] = {
      id: document.getElementById("edit-id").value,
      item: document.getElementById("edit-item").value,
      tecnico: document.getElementById("edit-tecnico").value,
      data: document.getElementById("edit-data").value,
      valor: document.getElementById("edit-valor").value,
      descricao: document.getElementById("edit-descricao").value
    };
  
    renderTabelaManutencoes();
    bootstrap.Modal.getInstance(document.getElementById("modalEditarManutencao")).hide();
  }
  
  function salvarNovaManutencao() {
    const nova = {
      id: document.getElementById("new-id").value,
      item: document.getElementById("new-item").value,
      tecnico: document.getElementById("new-tecnico").value,
      data: document.getElementById("new-data").value,
      valor: document.getElementById("new-valor").value,
      descricao: document.getElementById("new-descricao").value
    };
  
    manutencoes.push(nova);
    renderTabelaManutencoes();
  
    bootstrap.Modal.getInstance(document.getElementById("modalCadastrarManutencao")).hide();
  
    // Limpa os campos
    ["new-id", "new-item", "new-tecnico", "new-data", "new-valor", "new-descricao"].forEach(id => {
      document.getElementById(id).value = "";
    });
  }
  
  window.addEventListener("DOMContentLoaded", renderTabelaManutencoes);
  