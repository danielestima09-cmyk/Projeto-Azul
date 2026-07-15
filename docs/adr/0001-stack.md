# ADR 0001 — Stack: Node.js + Express + SQLite

**Status:** Aceita

## Contexto
Projeto acadêmico, grupo pequeno, prazo curto, executado e demonstrado no GitHub Codespaces.
Já existe código em JavaScript (o widget do chatbot, a função de score, a validação e o protótipo).
O sistema precisa integrar o chatbot e a feature de prazo e crescer sem reescrita.

## Decisão
Backend em **Node.js (ESM)** com **Express** (framework HTTP minimalista) e banco **SQLite**
(via `better-sqlite3`). Frontend continua em HTML/CSS/JS. Uma única linguagem no front e no back.

## Alternativas
- **Python + FastAPI + Postgres:** ótimo para dados/ML, mas exigiria reescrever o chatbot e o
  cálculo de score em Python, e usaria duas linguagens — retrabalho incompatível com o prazo.
- **Next.js/React (full-stack):** mais poderoso, mas exigiria reescrever o protótipo (HTML/JS puro)
  em React — risco alto, sem ganho para a demonstração.

## Consequências
- ➕ Reaproveita praticamente todo o código existente; uma linguagem só; sobe com um comando.
- ➕ SQLite é um arquivo único, sem servidor separado — ideal para a demo no Codespaces.
- ➖ Express é minimalista; a validação de entrada é feita explicitamente (biblioteca de schema).
- ➖ SQLite não é para alta concorrência; a troca por Postgres é isolada pelo padrão Repository
  (ver [ADR 0002](0002-banco-de-dados.md)).
