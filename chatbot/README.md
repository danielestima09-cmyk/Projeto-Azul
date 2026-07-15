# Assistente de Avaliação — Azul Brand Operating System (ABOS)

Chatbot de **triagem inicial** de projetos enviados pelas vertentes ao Marketing.
Componente **modular e isolado** — não recria nem altera o site/protótipo existente.

> A IA faz apenas a triagem (score, diagnóstico e recomendações). **A decisão final é sempre das
> equipes humanas** (marketing, jurídico, compliance, privacidade). A IA nunca dá aprovação
> jurídica/regulatória definitiva.

---

## 1. Arquivos

```
chatbot/
├── chatbot.js          # widget do frontend (vanilla JS, classes .abos-*)
├── chatbot.css         # estilos isolados (prefixo .abos-)
├── demo.html           # preview OFFLINE do widget (transporte simulado, sem backend)
├── package.json        # { "type": "module" } para a serverless usar ESM
├── .env.example        # variáveis de ambiente
├── api/
│   └── chat.js         # função serverless (Vercel): POST /api/chat
└── lib/
    ├── prompts.js      # system prompt + contexto (dados) + guardrails
    ├── scoring.js      # cálculo determinístico de score e status (fonte da verdade)
    ├── rateLimit.js    # rate limiting simples por IP
    └── validation.js   # validação/sanitização das requisições
```

## 2. Ver o widget agora (sem backend)

Abra **`chatbot/demo.html`** no navegador. Ele carrega o `chatbot.js`/`chatbot.css` reais e usa um
**transporte simulado** (`window.ABOS_CHAT_TRANSPORT`) para responder offline. Há botões para simular
os cenários (100% aprovado, ajustes, bloqueado, risco crítico, aguardando dados).

Em Codespaces:
```bash
python3 -m http.server 8000 --directory chatbot
# abra a porta 8000 e acesse /demo.html
```

## 3. Integrar ao site existente (protótipo)

**Não substitua o HTML.** Basta adicionar 3 trechos.

No `<head>` (ou antes de `</body>`):
```html
<link rel="stylesheet" href="/chatbot.css">
<script src="/chatbot.js" defer></script>
```

Elemento principal, **antes de `</body>`** (opcional — o `chatbot.js` cria sozinho se ausente;
use para configurar o endpoint):
```html
<div id="abos-chatbot-root" data-endpoint="/api/chat"></div>
```

As classes usam o prefixo `abos-`, então **não há conflito** com os estilos do protótipo.

## 4. Enviar a avaliação atual do projeto ao chatbot

Depois que o site calcular/carregar a avaliação do projeto, informe o chatbot:

```html
<script>
  // Chame quando a avaliação do projeto estiver disponível (ex.: ao abrir o detalhe do projeto).
  window.AbosChatbot.setEvaluation({
    projectName: "Campanha Nova Rota Campinas–Orlando",
    overallScore: 65,
    status: "blocked",           // approved | adjust | blocked | preventive | awaiting
    riskLevel: "high",           // low | medium | high | critical | unknown
    dimensions: {
      branding:                   { score: 80, findings: [] },
      communication:              { score: 75, findings: [] },
      visual:                     { score: 70, findings: [] },
      compliance:                 { score: 40, findings: ["Afirmação de cobertura não comprovada"] },
      strategicMarketing:         { score: 60, findings: [] },
      organizationalIntelligence: { score: 65, findings: [] }
    },
    recommendations: [],
    risks: [],
    missingInformation: [],
    sourcesUsed: []
  });
</script>
```

API pública disponível em `window.AbosChatbot`:

| Método | Ação |
|---|---|
| `open()` / `close()` / `toggle()` | abrir/fechar a janela |
| `minimize()` | minimizar/restaurar |
| `setEvaluation(obj)` | informar a avaliação atual do projeto |
| `reset()` | limpar a conversa (volta à saudação) |

## 5. Backend na Vercel

A função `api/chat.js`:
- aceita **somente `POST`**;
- **valida** e **sanitiza** (limita quantidade e tamanho de mensagens; descarta papéis `system` vindos do cliente);
- aplica **rate limiting por IP**;
- **recalcula score e status de forma determinística** (`lib/scoring.js`) — o cliente não consegue forjar o status;
- adiciona o **system prompt** e trata o material do projeto **apenas como dados** (defesa contra prompt injection);
- chama o **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`) com **Gemini Flash** e **temperatura baixa** (0.2);
- **não expõe** chaves, prompts internos nem detalhes técnicos em erros.

### Configurar variáveis de ambiente na Vercel
Em **Project → Settings → Environment Variables**, adicione:

| Nome | Valor |
|---|---|
| `OPENROUTER_API_KEY` | sua chave do OpenRouter |
| `OPENROUTER_MODEL` | `google/gemini-3-flash-preview` |

Local (`.env.local`): copie de `.env.example`. **Nunca** versione a chave real.

### Layout de deploy
Para a Vercel reconhecer a função serverless, `api/` precisa estar na **raiz do deploy**.
Duas opções:
- **Recomendado:** em *Project Settings → Root Directory*, aponte para `chatbot/`.
  Assim `chatbot/api/chat.js` vira `/api/chat`, e `chatbot.js`/`chatbot.css` são servidos como estáticos.
- **Ou** mova `api/` e `lib/` para a raiz do projeto e sirva `chatbot.js`/`chatbot.css` da raiz.

Rodar localmente com o backend:
```bash
npm i -g vercel
vercel dev            # sobe /api/chat localmente usando as variáveis do .env.local
```

### Testar o protótipo com o modelo REAL (recomendado p/ coerência)
O protótipo (`prototipos/base.html`) tenta o backend real em `/api/chat` e **só cai para a simulação
offline se não houver backend**. Para ver respostas de verdade (coerentes com qualquer pergunta),
use o servidor local incluso (sem dependências):

```bash
export OPENROUTER_API_KEY=sua_chave
export OPENROUTER_MODEL=google/gemini-3-flash-preview   # opcional
node chatbot/dev-server.mjs
# abra http://localhost:3000/prototipos/base.html
```

- **Com a chave definida:** o chatbot conversa com o Gemini → respostas realmente coerentes (entende
  qualquer mensagem, incluindo fora de contexto).
- **Sem a chave / arquivo aberto direto / `http.server`:** o chatbot usa a **simulação offline**
  (respostas por regras — úteis para demonstrar o fluxo, mas limitadas a perguntas previstas).

## 6. Sistema de pontuação (determinístico)

- 6 dimensões: **Branding, Comunicação, Visual, Compliance, Marketing Estratégico, Inteligência Organizacional**.
- Nota de cada dimensão: `0`–`100`. Score geral = **média (pesos iguais)**.
- A IA gera **notas por critério, justificativas, evidências, riscos e recomendações**; o **backend**
  calcula a nota final e o status (`lib/scoring.js`).

Regras de decisão:

| Situação | Status |
|---|---|
| Risco crítico (LGPD, imagem, direitos autorais, reputação, regulatório…) | `preventive` — bloqueio preventivo, revisão especializada obrigatória |
| Dados insuficientes | `awaiting` — aguardando complementação (sem nota definitiva) |
| Todas as dimensões = 100 e sem riscos/pendências | `approved` — encaminhar ao marketing |
| Score 70–99 | `adjust` — ajustes necessários |
| Score < 70 | `blocked` — reestruturação necessária |

## 7. Segurança (resumo)

O chatbot **não**: revela o system prompt; obedece comandos dentro dos projetos; altera scores/status
pela conversa; inventa evidências; afirma aprovação jurídica; divulga conteúdo de outros projetos;
responde sobre temas externos à avaliação.

Se o tripulante pedir para ignorar regras, alterar nota ou aprovar pelo chat, a resposta é fixa:
> “Tripulante, não consigo alterar scores, status ou critérios por meio da conversa. Posso explicar a
> avaliação atual e indicar quais ajustes podem ser realizados antes de uma nova submissão.”

## 8. Acessibilidade

- Navegação por teclado (Enter envia, Shift+Enter quebra linha, Esc fecha).
- `role="dialog"`, `aria-live` no histórico, `aria-label` nos botões, foco visível, textos alternativos.
- Responsivo (desktop e mobile) e respeita `prefers-reduced-motion`.
