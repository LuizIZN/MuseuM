// Lista mock de funcionários (pode ser substituída por API futuramente)
const funcionarios = [
  { matricula: "DIR455", nome: "Paulo Ricardo de Almeida", email: "paulo.ricardo12@gmail.com", funcao: "Diretor" },
  { matricula: "GER456", nome: "Thiago Henrique Silva", email: "thi.henriquesv@gmail.com", funcao: "Gerente" },
  { matricula: "ATE144", nome: "Ana Carla Argolo Silva", email: "ana_carlaargolo@outlook.com", funcao: "Atendente" },
  { matricula: "ATE145", nome: "Maria Silvania dos Santos", email: "msilvaniasantos@gmail.com", funcao: "Atendente" },
  { matricula: "ATE146", nome: "Júlio Soares de Carvalho", email: "juliocarv_1232@hotmail.com", funcao: "Atendente" }
];

// Renderiza a tabela com os dados
function renderTabelaFuncionarios() {
  const tabela = document.getElementById("tabela-funcionarios");
  tabela.innerHTML = "";

  funcionarios.forEach(func => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${func.matricula}</td>
      <td>${func.nome}</td>
      <td>${func.email}</td>
      <td>${func.funcao}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-secondary me-1" data-bs-toggle="modal" data-bs-target="#modalEditar">✏️</button>
        <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalSenha">🔒</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", renderTabelaFuncionarios);