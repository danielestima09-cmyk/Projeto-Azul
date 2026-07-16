# ADR 0005 — LLM via OpenRouter com proxy no backend

**Status:** Aceita

## Contexto
O chatbot de triagem precisa de um modelo de linguagem. Regras invioláveis: **a chave nunca pode ir
ao frontend** e **trocar o modelo de LLM não pode exigir reescrita**. A demo roda no Codespaces (não
na Vercel).

## Decisão
- Uma rota do **nosso backend** (`POST /api/chat`) faz **proxy** ao OpenRouter.
- A `OPENROUTER_API_KEY` vive apenas como **secret do Codespaces** (env var no servidor); o navegador
  chama a nossa rota, nunca o OpenRouter diretamente.
- O modelo vem de `OPENROUTER_MODEL` (slug confirmado em uso: `google/gemini-3-flash-preview`).
- O **score e o status são calculados por função determinística no backend** — o modelo apenas gera
  notas por critério, justificativas, riscos e recomendações; ele não decide o resultado.
- Um **adapter** isola o provedor (trocar OpenRouter por outro = nova implementação do adapter).
- As **bases de conhecimento** (`domain/bases/*.md`) são carregadas no backend (`api/_lib/knowledgeBase.js`,
  cache por `mtime`) e injetadas como **material de referência delimitado** — dado, não instrução, sem
  sobrepor o system prompt. **Sem RAG/embeddings**: o volume é pequeno, então o conteúdo inteiro entra
  no contexto. Mapeamento: `base-corporativa.md` → Branding/Comunicação/Visual/Compliance;
  `banco-de-dados.md` → Marketing Estratégico/Inteligência Organizacional. Base ausente/vazia faz o
  agente declarar a limitação em vez de inventar.

> Proxy (em uma frase): o navegador fala com o nosso servidor, e o servidor fala com o OpenRouter —
> assim a chave fica só no servidor.

## Alternativas
- **Chamar o OpenRouter direto do frontend:** exporia a chave no navegador — inaceitável.
- **Modelo rodando localmente:** pesado e fora do escopo do trabalho.

## Consequências
- ➕ Chave protegida; provedor/modelo trocáveis por variável de ambiente; entrada do chat validada;
  resultado (score/status) não forjável pelo cliente.
- ➖ Depende de rede e de crédito no OpenRouter (mitigado com `max_tokens` e timeout na chamada).
- ➖ O código atual (`api/chat.js`) foi escrito no formato de função da Vercel; será adaptado para
  uma rota Express na FASE 3 (a lógica de negócio permanece).
