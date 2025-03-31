const itens = [
    { codigo: "ITM001", doacao: "DOA123", nome: "Noite Estrelada", estado: "Bom", classificacao: "Pintura (Arte Moderna)" },
    { codigo: "ITM002", doacao: "DOA124", nome: "Escultura de David", estado: "Regular", classificacao: "Escultura (Renascimento)" },
    { codigo: "ITM003", doacao: "DOA125", nome: "Manuscrito de 1800", estado: "Excelente", classificacao: "Manuscrito (Histórico)" },
    { codigo: "ITM004", doacao: "DOA126", nome: "Cadeira Colonial", estado: "Ruim", classificacao: "Móvel (Época Colonial)" },
    { codigo: "ITM005", doacao: "DOA127", nome: "Foto da Inauguração", estado: "Restaurado", classificacao: "Fotografia (Documental)" },
    { codigo: "ITM006", doacao: "DOA128", nome: "Vaso Grego Antigo", estado: "Bom", classificacao: "Artefato (Arqueologia)" },
    { codigo: "ITM007", doacao: "DOA129", nome: "Vestido Vitoriano", estado: "Regular", classificacao: "Roupas (Moda Antiga)" },
    { codigo: "ITM008", doacao: "DOA130", nome: "Moeda Romana", estado: "Excelente", classificacao: "Moeda (Numismática)" }
  ];
  
  function renderTabelaItens() {
    const tabela = document.getElementById("tabela-itens");
    tabela.innerHTML = "";
  
    itens.forEach(item => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.codigo}</td>
        <td>${item.doacao}</td>
        <td>${item.nome}</td>
        <td>${item.estado}</td>
        <td>${item.classificacao}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalEditarItem">✏️</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  }
  
  window.addEventListener("DOMContentLoaded", renderTabelaItens);  