/* chatbot.js — Assistente de Avaliação (Azul Brand Operating System)
 *
 * Widget de chat modular e isolado (classes .abos-*). Não depende de bibliotecas.
 *
 * Integração:
 *   1) <link rel="stylesheet" href="/chatbot.css">
 *   2) <script src="/chatbot.js" defer></script>
 *   3) (opcional) <div id="abos-chatbot-root" data-endpoint="/api/chat"></div> antes de </body>
 *
 * API pública (window.AbosChatbot):
 *   .open() .close() .toggle() .minimize()
 *   .setEvaluation(evaluationObject)  -> informa a avaliação atual do projeto
 *   .reset()                          -> limpa a conversa
 *
 * Transporte: por padrão faz POST no endpoint (/api/chat). Para testes offline,
 * defina window.ABOS_CHAT_TRANSPORT = async ({messages, projectEvaluation}) => ({reply}).
 */
(function () {
  'use strict';

  var GREETING =
    'Olá, tripulante! Posso ajudar a explicar a avaliação do seu projeto, os critérios analisados, os riscos encontrados e os ajustes necessários.';

  var state = {
    open: false,
    minimized: false,
    sending: false,
    evaluation: null,
    history: [], // [{ role: 'user' | 'assistant', content: string }]
  };

  var el = {}; // referências aos nós
  var endpoint = '/api/chat';

  /* ---------------- utilidades ---------------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function scrollToBottom() {
    if (el.body) el.body.scrollTop = el.body.scrollHeight;
  }

  /* ---------------- construção do DOM ---------------- */
  function build() {
    var root = document.getElementById('abos-chatbot-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'abos-chatbot-root';
      document.body.appendChild(root);
    }
    endpoint = root.getAttribute('data-endpoint') || window.ABOS_CHAT_ENDPOINT || '/api/chat';

    root.className = 'abos-chatbot';
    root.setAttribute('data-open', 'false');
    root.setAttribute('data-minimized', 'false');

    root.innerHTML =
      '<button class="abos-fab" type="button" aria-label="Abrir o Assistente de Avaliação" aria-expanded="false" aria-controls="abos-window">' +
        '<span aria-hidden="true">💬</span>' +
      '</button>' +
      '<section class="abos-window" id="abos-window" role="dialog" aria-modal="false" aria-label="Assistente de Avaliação" hidden>' +
        '<header class="abos-header">' +
          '<div class="abos-avatar" aria-hidden="true">🛫</div>' +
          '<div class="abos-title"><strong>Assistente de Avaliação</strong><span>Triagem de projetos · Azul Brand OS</span></div>' +
          '<button class="abos-header-btn abos-min" type="button" aria-label="Minimizar janela do chat"><span aria-hidden="true">—</span></button>' +
          '<button class="abos-header-btn abos-close" type="button" aria-label="Fechar janela do chat"><span aria-hidden="true">✕</span></button>' +
        '</header>' +
        '<div class="abos-body" role="log" aria-live="polite" aria-relevant="additions" aria-label="Histórico de mensagens"></div>' +
        '<form class="abos-composer">' +
          '<label class="abos-sr-only" for="abos-input">Escreva sua mensagem para o Assistente de Avaliação</label>' +
          '<textarea class="abos-input" id="abos-input" rows="1" placeholder="Escreva sua mensagem, tripulante…" autocomplete="off"></textarea>' +
          '<button class="abos-send" type="submit" aria-label="Enviar mensagem"><span aria-hidden="true">➤</span></button>' +
        '</form>' +
        '<div class="abos-disclaimer">Triagem inicial por IA. A decisão final é das equipes humanas responsáveis.</div>' +
      '</section>';

    el.root = root;
    el.fab = root.querySelector('.abos-fab');
    el.window = root.querySelector('.abos-window');
    el.body = root.querySelector('.abos-body');
    el.form = root.querySelector('.abos-composer');
    el.input = root.querySelector('.abos-input');
    el.send = root.querySelector('.abos-send');
    el.min = root.querySelector('.abos-min');
    el.close = root.querySelector('.abos-close');

    bindEvents();
    // Mensagem inicial (exibida; também compõe o histórico enviado ao backend).
    addMessage('bot', GREETING);
    state.history.push({ role: 'assistant', content: GREETING });
  }

  function bindEvents() {
    el.fab.addEventListener('click', toggle);
    el.close.addEventListener('click', close);
    el.min.addEventListener('click', minimize);
    el.form.addEventListener('submit', onSubmit);

    // Enter envia; Shift+Enter quebra linha.
    el.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    });
    // Auto-resize do textarea.
    el.input.addEventListener('input', function () {
      el.input.style.height = 'auto';
      el.input.style.height = Math.min(el.input.scrollHeight, 120) + 'px';
    });
    // Esc fecha a janela.
    el.window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); el.fab.focus(); }
    });
  }

  /* ---------------- render de mensagens ---------------- */
  function addMessage(kind, text) {
    var div = document.createElement('div');
    if (kind === 'user') div.className = 'abos-msg abos-msg-user';
    else if (kind === 'error') div.className = 'abos-msg abos-msg-error';
    else div.className = 'abos-msg abos-msg-bot';
    div.innerHTML = esc(text);
    el.body.appendChild(div);
    scrollToBottom();
    return div;
  }

  function showTyping() {
    var t = document.createElement('div');
    t.className = 'abos-typing';
    t.setAttribute('aria-label', 'Assistente está digitando');
    t.innerHTML = '<i></i><i></i><i></i>';
    el.body.appendChild(t);
    scrollToBottom();
    return t;
  }

  /* ---------------- estados da janela ---------------- */
  function open() {
    state.open = true;
    state.minimized = false;
    el.root.setAttribute('data-open', 'true');
    el.root.setAttribute('data-minimized', 'false');
    el.window.hidden = false;
    el.fab.setAttribute('aria-expanded', 'true');
    el.fab.setAttribute('aria-label', 'Fechar o Assistente de Avaliação');
    setTimeout(function () { el.input && el.input.focus(); }, 60);
    scrollToBottom();
  }
  function close() {
    state.open = false;
    el.root.setAttribute('data-open', 'false');
    el.window.hidden = true;
    el.fab.setAttribute('aria-expanded', 'false');
    el.fab.setAttribute('aria-label', 'Abrir o Assistente de Avaliação');
  }
  function toggle() { state.open ? close() : open(); }
  function minimize() {
    state.minimized = !state.minimized;
    el.root.setAttribute('data-minimized', state.minimized ? 'true' : 'false');
    el.min.setAttribute('aria-label', state.minimized ? 'Restaurar janela do chat' : 'Minimizar janela do chat');
    if (!state.minimized) { el.input.focus(); scrollToBottom(); }
  }

  /* ---------------- envio ---------------- */
  function onSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (state.sending) return;

    var text = (el.input.value || '').trim();
    if (!text) return;

    addMessage('user', text);
    state.history.push({ role: 'user', content: text });
    el.input.value = '';
    el.input.style.height = 'auto';

    send();
  }

  function setSending(v) {
    state.sending = v;
    el.send.disabled = v;
    el.input.disabled = v;
  }

  async function send() {
    setSending(true);
    var typing = showTyping();
    try {
      var payload = {
        messages: state.history.slice(-20),
        projectEvaluation: state.evaluation || null,
      };
      var transport = window.ABOS_CHAT_TRANSPORT || defaultTransport;
      var result = await transport({ messages: payload.messages, projectEvaluation: payload.projectEvaluation, endpoint: endpoint });
      typing.remove();

      var reply = result && result.reply ? result.reply : 'Tripulante, não consegui gerar uma resposta agora. Pode tentar novamente?';
      addMessage('bot', reply);
      state.history.push({ role: 'assistant', content: reply });
    } catch (err) {
      typing.remove();
      var msg = (err && err.userMessage) ? err.userMessage
        : 'Tripulante, tive um problema para concluir a avaliação agora. Verifique sua conexão e tente novamente em instantes.';
      addMessage('error', msg);
    } finally {
      setSending(false);
      el.input.focus();
    }
  }

  async function defaultTransport(opts) {
    var res = await fetch(opts.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: opts.messages, projectEvaluation: opts.projectEvaluation }),
    });
    var data = null;
    try { data = await res.json(); } catch (e) { /* resposta sem corpo válido */ }
    if (!res.ok) {
      var e2 = new Error('HTTP ' + res.status);
      e2.userMessage = (data && data.error) ? data.error
        : 'Tripulante, o serviço de avaliação está indisponível no momento. Tente novamente em instantes.';
      throw e2;
    }
    return data || {};
  }

  /* ---------------- API pública ---------------- */
  window.AbosChatbot = {
    open: open,
    close: close,
    toggle: toggle,
    minimize: minimize,
    /** Informa a avaliação atual do projeto (objeto projectEvaluation). */
    setEvaluation: function (evaluation) { state.evaluation = evaluation || null; },
    /** Limpa a conversa e recomeça pela saudação. */
    reset: function () {
      state.history = [];
      if (el.body) el.body.innerHTML = '';
      addMessage('bot', GREETING);
      state.history.push({ role: 'assistant', content: GREETING });
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
