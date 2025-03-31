const userType = "gerente"; // Mude para "gerente" "diretor" ou "atendente"

const users = {
  atendente: {
    nome: "Ana",
    menu: [
      { emoji: "🏠", label: "Início", link: "dashboard.html" },
      { emoji: "🧍", label: "Visitantes", link: "visitantes.html" },
      { emoji: "🔄", label: "Empréstimos", link: "emprestimos.html" },
      { emoji: "📰", label: "Notícias", link: "noticias.html" }
    ]
  },
  diretor: {
    nome: "Paulo",
    menu: [
      { emoji: "🏠", label: "Início", link: "dashboard.html" },
      { emoji: "📆", label: "Eventos", link: "eventos.html" },
      { emoji: "📰", label: "Notícias", link: "noticias.html" },
      { emoji: "🖼️", label: "Exposições", link: "exposicoes.html" }
    ]
  },
  gerente: {
    nome: "Thiago",
    menu: [
      { emoji: "🏠", label: "Início", link: "dashboard.html" },
      { emoji: "🗂️", label: "Itens", link: "itens.html" },
      { emoji: "🛠️", label: "Manutenções", link: "manutencoes.html" },
      { emoji: "💰", label: "Vendas", link: "vendas.html" },
      { emoji: "🎁", label: "Doações", link: "doacoes.html" },
      { emoji: "📄", label: "Contratos", link: "contratos.html" },
      { emoji: "⏰", label: "Horários", link: "horario.html" },
      { emoji: "👥", label: "Funcionários", link: "funcionarios.html" }
    ]
  }
};

// Gera o menu lateral
function renderSidebar() {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;

  const usuario = users[userType];
  if (!usuario) return;

  usuario.menu.forEach((item, index) => {
    const li = document.createElement("li");
    const active = window.location.pathname.includes(item.link) ? "active" : "";
    li.classList.add("nav-item");
    li.innerHTML = `
      <a href="${item.link}" class="nav-link ${active} text-dark d-flex align-items-center">
        <span class="emoji me-2">${item.emoji}</span> ${item.label}
      </a>
    `;
    menuList.appendChild(li);
  });

  // Atualiza saudação se existir
  const greeting = document.getElementById("user-greeting");
  if (greeting) greeting.textContent = `Bem vindo, ${usuario.nome}`;
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", renderSidebar);