# Camada `domain/` — Regras de negócio (funções puras)

O coração do sistema: **as regras que valem independentemente de banco, framework ou LLM**.
Tudo aqui são **funções puras** (sem acessar banco, rede ou relógio), o que torna os testes simples e
confiáveis.

## O que vai viver aqui (populado na FASE 3)
- `scoring.js` — cálculo determinístico do **score geral e do `triageStatus`** a partir das notas por
  dimensão, riscos e informações ausentes. (Hoje está em `api/_lib/scoring.js`; será movido para cá.)
- `deadline.js` — cálculo do **`prazoStatus`** (dentro do prazo / vence hoje / vencido) a partir de
  `prazoResposta` e da data de "hoje" (injetada). (Hoje está no frontend; será movido para cá.)
- `triage.js` — montagem do parecer/ação de triagem sobre o projeto.

## Regras
- **Nada de I/O aqui** (sem `fetch`, sem banco, sem `new Date()` sem parâmetro).
- É a camada mais testada do projeto (ver `docs/TESTING.md`).
- Não importa nada de `api/` nem de `infra/` — a dependência aponta só para dentro.
