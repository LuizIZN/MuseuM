const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
  window.location.href = "/paginas/login";
}

const userType = usuario.cargo; // Mude para "gerente" "diretor" ou "atendente"

const users = {
  atendente: {
    menu: [
      { emoji: "🏠", label: "Início", link: "/paginas/dashboard" },
      { emoji: "🧍", label: "Visitantes", link: "/paginas/visitantes" },
      { emoji: "🔄", label: "Empréstimos", link: "/paginas/emprestimos" },
      { emoji: "📰", label: "Notícias", link: "/paginas/noticias" },
    ],
  },
  diretor: {
    menu: [
      { emoji: "🏠", label: "Início", link: "/paginas/dashboard" },
      { emoji: "📆", label: "Eventos", link: "/paginas/eventos" },
      { emoji: "📰", label: "Notícias", link: "/paginas/noticias" },
      { emoji: "🖼️", label: "Exposições", link: "/paginas/exposicoes" },
    ],
  },
  gerente: {
    menu: [
      { emoji: "🏠", label: "Início", link: "/paginas/dashboard" },
      { emoji: "🗂️", label: "Itens", link: "/paginas/itens" },
      { emoji: "🛠️", label: "Manutenções", link: "/paginas/manutencoes" },
      { emoji: "💰", label: "Vendas", link: "/paginas/vendas" },
      { emoji: "🎁", label: "Doações", link: "/paginas/doacoes" },
      { emoji: "📄", label: "Contratos", link: "/paginas/contratos" },
      { emoji: "⏰", label: "Horários", link: "/paginas/horarios" },
      { emoji: "👥", label: "Funcionários", link: "/paginas/funcionarios" },
      { emoji: "🧍", label: "Visitantes", link: "/paginas/visitantes" },
      { emoji: "📰", label: "Notícias", link: "/paginas/noticias" },
    ],
  },
};

// Gera o menu lateral
function renderSidebar() {
  const menuList = document.getElementById("menu-list");
  if (!menuList) return;

  if (userType === "gerente") {
    users.gerente.menu.forEach((item, index) => {
      const li = document.createElement("li");
      const active = window.location.pathname.includes(item.link)
        ? "active"
        : "";
      li.classList.add("nav-item");
      li.innerHTML = `
      <a href="${item.link}" class="nav-link ${active} text-dark d-flex align-items-center">
        <span class="emoji me-2">${item.emoji}</span> ${item.label}
      </a>
    `;
      menuList.appendChild(li);
    });
  } else if (userType === "diretor") {
    users.diretor.menu.forEach((item, index) => {
      const li = document.createElement("li");
      const active = window.location.pathname.includes(item.link)
        ? "active"
        : "";
      li.classList.add("nav-item");
      li.innerHTML = `
        <a href="${item.link}" class="nav-link ${active} text-dark d-flex align-items-center">
          <span class="emoji me-2">${item.emoji}</span> ${item.label}
        </a>
      `;
      menuList.appendChild(li);
    });
  } else if (userType === "atendente") {
    users.atendente.menu.forEach((item, index) => {
      const li = document.createElement("li");
      const active = window.location.pathname.includes(item.link)
        ? "active"
        : "";
      li.classList.add("nav-item");
      li.innerHTML = `
          <a href="${item.link}" class="nav-link ${active} text-dark d-flex align-items-center">
            <span class="emoji me-2">${item.emoji}</span> ${item.label}
          </a>
        `;
      menuList.appendChild(li);
    });
  }

  // Atualiza saudação se existir
  const greeting = document.getElementById("user-greeting");
  if (greeting) greeting.textContent = `Bem vindo, ${usuario.nome}`;
}

async function sair() {
  await fetch("http://localhost:4000/logout", {
    method: "POST",
  })
    .then(() => {
      alert("Usuário deslogado com sucesso!");

      localStorage.removeItem("usuario");
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/paginas/login";
    })
    .catch(() => {
      alert("Erro ao deslogar usuário!");
    });
}

// Executa ao carregar a página
window.addEventListener("DOMContentLoaded", renderSidebar);
