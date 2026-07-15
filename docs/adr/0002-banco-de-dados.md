# ADR 0002 — Banco de dados: SQLite atrás de um Repository

**Status:** Aceita

## Contexto
Precisamos persistir `Projeto` (núcleo + avaliação + prazo), `Usuario` e `Vertical`. A demo roda no
Codespaces e uma regra inviolável do projeto é: **trocar de banco não pode exigir reescrever o
sistema**.

## Decisão
Usar **SQLite** (arquivo local) acessado por meio do padrão **Repository** — uma interface única
(ex.: `ProjetoRepository`) que o domínio consome, sem saber qual banco está por trás.

> Repository (em uma frase): uma "porta" única para o banco; as regras de negócio falam com a porta,
> não com o SQLite — então dá para trocar o banco mudando só a implementação da porta.

## Alternativas
- **PostgreSQL:** robusto e adequado a produção, mas exige um serviço separado (mais setup de Docker)
  — desnecessário para a demo.
- **Arquivo JSON:** simples, mas sem consultas, sem integridade e frágil com escrita concorrente.

## Consequências
- ➕ Zero configuração, rápido, um arquivo versionável de schema; perfeito para o Codespaces.
- ➕ O domínio não conhece o banco; migrar para Postgres em produção = nova implementação do
  repositório, sem tocar nas regras de negócio.
- ➖ SQLite tem limites de concorrência de escrita — aceitável para a demo; documentado como ponto
  de evolução em `docs/ARCHITECTURE.md`.
