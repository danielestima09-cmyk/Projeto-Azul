# Camada `api/` — Rotas HTTP

Responsável por **receber requisições HTTP, validar a entrada e traduzir para o domínio**.
**Não contém regra de negócio** — delega para `domain/` e usa `infra/` para I/O.

## O que vive aqui
- `chat.js` — endpoint `POST /api/chat` do chatbot (proxy ao OpenRouter; a chave fica no servidor).
- `_lib/` — utilitários atuais do chatbot: `validation.js` (validação da entrada), `rateLimit.js`
  (limite por IP), `prompts.js` (system prompt + contexto), `knowledgeBase.js` (bases de
  conhecimento) e `scoring.js` (função determinística de score — será movida para `domain/` na FASE 3).

## Bases de conhecimento (`knowledgeBase.js`)
- Lê as bases em `domain/bases/*.md` (cache por `mtime`) e as injeta na chamada ao OpenRouter como
  **material de REFERÊNCIA claramente delimitado** — dado, nunca instrução; não sobrepõe o system prompt.
- Mapeamento base → dimensões (fonte da verdade em `KNOWLEDGE_BASES`):
  `base-corporativa.md` → Branding, Comunicação, Visual, Compliance;
  `banco-de-dados.md` → Marketing Estratégico, Inteligência Organizacional.
- Atualizar um `.md` **não** exige mexer no endpoint. Base ausente/vazia → o chatbot declara a
  limitação em vez de inventar.

## Regras
- Todo dado externo é validado **aqui**, antes de chegar ao domínio (mensagens do chat, datas, ids).
- Nenhum segredo neste código; a `OPENROUTER_API_KEY` é lida de variável de ambiente.
- Na FASE 3, `api/chat.js` vira uma rota Express e entra `api/projects` (listar/obter projetos).
