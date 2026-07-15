# Camada `api/` — Rotas HTTP

Responsável por **receber requisições HTTP, validar a entrada e traduzir para o domínio**.
**Não contém regra de negócio** — delega para `domain/` e usa `infra/` para I/O.

## O que vive aqui
- `chat.js` — endpoint `POST /api/chat` do chatbot (proxy ao OpenRouter; a chave fica no servidor).
- `_lib/` — utilitários atuais do chatbot: `validation.js` (validação da entrada), `rateLimit.js`
  (limite por IP), `prompts.js` (system prompt + contexto) e `scoring.js` (função determinística de
  score — será movida para `domain/` na FASE 3).

## Regras
- Todo dado externo é validado **aqui**, antes de chegar ao domínio (mensagens do chat, datas, ids).
- Nenhum segredo neste código; a `OPENROUTER_API_KEY` é lida de variável de ambiente.
- Na FASE 3, `api/chat.js` vira uma rota Express e entra `api/projects` (listar/obter projetos).
