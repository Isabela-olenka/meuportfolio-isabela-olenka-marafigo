/*
 Isabela Olenka Marafigo RU: 5444394
 */

/* ====================================================
  Seleção de tema claro/escuro
   ==================================================== */
(function initTheme() {
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('themeToggle');
  const themeIcon    = document.getElementById('themeIcon');

  // Leitura da preferência salva
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  // Alternar tema ao clicar no botão
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateIcon(next);
  });

  // Altera o ícone de acordo com o tema 
  function updateIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀' : '🌙';
  }
})();


/* ====================================================
   2. Menu hambúrguer mobile
   ==================================================== */
(function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    // Acessibilidade para leitor de tela
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Fechar o menu ao clicar nos links de navegação (mobile)
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ====================================================
   Verifica qual seção do perfil está visível e destaca o link
   ==================================================== */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active de todos
        navLinks.forEach(l => l.classList.remove('active'));
        // Adiciona active no link correspondente
        const target = document.querySelector(
          `.nav-link[data-section="${entry.target.id}"]`
        );
        if (target) target.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();


/* ====================================================
   Animação para fluidez do site com [data-animate] 
   ==================================================== */
(function initAnimations() {
  const animEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

        // Delay antes de exibir a seção completa
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el); // Anima apenas uma vez
      }
    });
  }, { threshold: 0.15 });

  animEls.forEach(el => observer.observe(el));
})();


/* ====================================================
   Barras de habilidade de idiomas que mostram o progresso
   ==================================================== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const fill  = bar.querySelector('.skill-fill');
        const level = bar.dataset.level || '0';

        // Timeout de animação
        setTimeout(() => {
          fill.style.width = level + '%';
        }, 200);

        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ====================================================
   Envio de mensagens pelo formulário
   ==================================================== */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const inputNome = document.getElementById('nome');
  const inputMail = document.getElementById('email');
  const inputMsg  = document.getElementById('mensagem');

  // Referências às mensagens de erro
  const erroNome     = document.getElementById('erroNome');
  const erroEmail    = document.getElementById('erroEmail');
  const erroMensagem = document.getElementById('erroMensagem');

  // Validação dos campos e exibição de erros
  function validarCampo(input, erroEl, mensagem) {
    if (!input.value.trim()) {
      erroEl.textContent = mensagem;
      input.classList.add('error');
      return false;
    }
    erroEl.textContent = '';
    input.classList.remove('error');
    return true;
  }

  // Validação do formato do e-mail
  function validarEmail(email) {
    //Padrão: usuario@dominio.tld
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  // Remoção rápida do erro
  [inputNome, inputMail, inputMsg].forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.remove('error');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    let formValido = true;

    //Validação do nome
    if (!validarCampo(inputNome, erroNome, 'Por favor, informe seu nome.')) {
      formValido = false;
    }

    //Validação do e-mail
    if (!validarCampo(inputMail, erroEmail, 'Por favor, informe seu e-mail.')) {
      formValido = false;
    } else if (!validarEmail(inputMail.value)) {
      erroEmail.textContent = 'Informe um e-mail válido (ex: usuario@dominio.com).';
      inputMail.classList.add('error');
      formValido = false;
    }

    //Validação da mensagem 
    if (!validarCampo(inputMsg, erroMensagem, 'Por favor, escreva sua mensagem.')) {
      formValido = false;
    } else if (inputMsg.value.trim().length < 10) {
      erroMensagem.textContent = 'A mensagem deve ter pelo menos 10 caracteres.';
      inputMsg.classList.add('error');
      formValido = false;
    }

    // Se houver erros, foca no primeiro campo inválido e para
    if (!formValido) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
      return;
    }

    simularEnvio();
  });

  //Simulação do envio com modal
  function simularEnvio() {
    const btnText = form.querySelector('.btn-text');
    const btnEl   = form.querySelector('button[type="submit"]');
    btnEl.disabled   = true;
    btnText.textContent = 'Enviando...';

    //Timeout de envio
    setTimeout(() => {
      //Limpa o formulário
      form.reset();

      //Restaura o botão do envio para a próxima msg
      btnEl.disabled   = false;
      btnText.textContent = 'Enviar mensagem';

      //Exibe o modal de confirmação
      abrirModal();
    }, 1200);
  }
})();


/* ====================================================
   Modal de confirmação
   ==================================================== */
(function initModal() {
  const overlay   = document.getElementById('modalOverlay');
  const btnFechar = document.getElementById('modalClose');

  //Exibe o modal
  window.abrirModal = function () {
    overlay.hidden = false;
    //Foco no botão de fechar
    btnFechar.focus();
  };

  //Fecha o modal
  function fecharModal() {
    overlay.hidden = true;
    //Foco no formulário depois de fechar
    document.getElementById('contactForm').querySelector('input').focus();
  }

  btnFechar.addEventListener('click', fecharModal);

  //Fecha ao clicar fora do modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) fecharModal();
  });

  //Fecha com esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) fecharModal();
  });
})();
