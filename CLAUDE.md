# Projeto Azul — guia rápido para agentes

App interno da Azul onde as vertentes desenvolvem projetos junto ao Marketing.
Inclui um **chatbot de triagem** (Azul Brand Operating System) que avalia
submissões contra bases de conhecimento autorizadas via OpenRouter.

## Comandos do dia a dia

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o sistema (dev server em `http://localhost:3000`, serve os protótipos e o endpoint `POST /api/chat`). Comando único de demonstração no Codespaces. |
| `npm test` | Roda todos os testes (`node --test`, runner nativo — sem dependências). |

- Respostas **reais** do modelo exigem `OPENROUTER_API_KEY`. Defina em
  `chatbot/.env.local` (git-ignored) ou como secret do Codespaces. Sem a chave, o
  protótipo cai para a simulação offline.
- Porta configurável: `PORT=3210 npm start`.

## Onde ficam as coisas

- `prototipos/` — protótipos navegáveis (`base.html`, `enriquecido.html`, `index.html`).
- `api/chat.js` — endpoint do chatbot (proxy ao OpenRouter; a chave fica no servidor).
- `api/_lib/` — `prompts.js` (system prompt + guardrails), `knowledgeBase.js`
  (bases de conhecimento), `scoring.js` (score determinístico), `validation.js`, `rateLimit.js`.
- `domain/bases/` — **bases de conhecimento** em Markdown (ver abaixo).
- `test/` — testes (`scoring.test.mjs`, `knowledge.test.mjs`).
- `docs/adr/` — decisões de arquitetura.

## Bases de conhecimento do chatbot

Ficam no backend e são **injetadas como material de referência** na chamada ao
OpenRouter (sem RAG/embeddings — o volume é pequeno). Carregamento com cache por
`mtime`; arquivo ausente/vazio faz o chatbot **declarar a limitação** em vez de inventar.

Mapeamento base → dimensões avaliadas (fonte da verdade: `KNOWLEDGE_BASES` em `api/_lib/knowledgeBase.js`):

| Arquivo | Dimensões cobertas |
|---|---|
| `domain/bases/base-corporativa.md` | Branding, Comunicação, Visual, Compliance |
| `domain/bases/banco-de-dados.md` | Marketing Estratégico, Inteligência Organizacional |

Para **atualizar uma base**, edite só o `.md` — a lógica do endpoint não muda.
Para **mudar o mapeamento** ou adicionar/remover uma base, edite só o array
`KNOWLEDGE_BASES`.
