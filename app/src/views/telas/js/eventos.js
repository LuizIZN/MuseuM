const eventos = [
    {
      cod: "EVT001",
      diretor: "Paulo",
      titulo: "Exposição de Arte Moderna",
      data: "10/03/2025",
      horario: "15:00",
      coordenador: "Marcos Lima",
      duracao: "3h",
      descricao: "Exposição com obras de artistas contemporâneos"
    },
    {
      cod: "EVT002",
      diretor: "Paulo",
      titulo: "Palestra: História da Moeda",
      data: "15/03/2025",
      horario: "16:00",
      coordenador: "Ana Meirelles",
      duracao: "2h",
      descricao: "Palestra sobre a evolução das moedas ao longo da história"
    },
    {
      cod: "EVT003",
      diretor: "Paulo",
      titulo: "Workshop de Restauração",
      data: "20/03/2025",
      horario: "09:00",
      coordenador: "Bruno Reis",
      duracao: "3h",
      descricao: "Aprenda técnicas básicas de restauração de pinturas"
    }
  ];
  
  function renderEventos() {
    const tabela = document.getElementById("tabela-eventos");
    tabela.innerHTML = "";
  
    eventos.forEach((evt, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${evt.cod}</td>
        <td>${evt.titulo}</td>
        <td>${evt.data}</td>
        <td>${evt.horario}</td>
        <td>${evt.duracao}</td>
        <td>${evt.descricao}</td>
        <td class="text-end">
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
              ⋯
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" onclick="editarEvento(${index})">✏️ Editar</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="excluirEvento(${index})">🗑️ Excluir</a></li>
            </ul>
          </div>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }
  
  function excluirEvento(index) {
    if (confirm("Deseja excluir este evento?")) {
      eventos.splice(index, 1);
      renderEventos();
    }
  }
  
  let eventoEditandoIndex = null;
  
  function editarEvento(index) {
    const evt = eventos[index];
    eventoEditandoIndex = index;
  
    document.getElementById("edit-cod").value = evt.cod;
    document.getElementById("edit-diretor").value = evt.diretor;
    document.getElementById("edit-titulo").value = evt.titulo;
    document.getElementById("edit-data").value = evt.data;
    document.getElementById("edit-horario").value = evt.horario;
    document.getElementById("edit-coordenador").value = evt.coordenador;
    document.getElementById("edit-duracao").value = evt.duracao;
    document.getElementById("edit-descricao").value = evt.descricao;
  
    new bootstrap.Modal(document.getElementById("modalEditarEvento")).show();
  }
  
  function salvarEdicaoEvento() {
    if (eventoEditandoIndex === null) return;
  
    eventos[eventoEditandoIndex] = {
      cod: document.getElementById("edit-cod").value,
      diretor: document.getElementById("edit-diretor").value,
      titulo: document.getElementById("edit-titulo").value,
      data: document.getElementById("edit-data").value,
      horario: document.getElementById("edit-horario").value,
      coordenador: document.getElementById("edit-coordenador").value,
      duracao: document.getElementById("edit-duracao").value,
      descricao: document.getElementById("edit-descricao").value
    };
  
    renderEventos();
    bootstrap.Modal.getInstance(document.getElementById("modalEditarEvento")).hide();
  }
  
  function salvarNovoEvento() {
    const novo = {
      cod: document.getElementById("new-cod").value,
      diretor: document.getElementById("new-diretor").value,
      titulo: document.getElementById("new-titulo").value,
      data: document.getElementById("new-data").value,
      horario: document.getElementById("new-horario").value,
      coordenador: document.getElementById("new-coordenador").value,
      duracao: document.getElementById("new-duracao").value,
      descricao: document.getElementById("new-descricao").value
    };
  
    eventos.push(novo);
    renderEventos();
  
    bootstrap.Modal.getInstance(document.getElementById("modalCadastrarEvento")).hide();
  
    ["new-cod", "new-diretor", "new-titulo", "new-data", "new-horario", "new-coordenador", "new-duracao", "new-descricao"].forEach(id => {
      document.getElementById(id).value = "";
    });
  }
  
  window.addEventListener("DOMContentLoaded", renderEventos);
  