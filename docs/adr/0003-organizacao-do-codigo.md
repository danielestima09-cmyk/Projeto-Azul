# ADR 0003 — Organização do código em camadas

**Status:** Aceita

## Contexto
Regra inviolável: **regras de negócio separadas de infraestrutura**. Precisamos que score, prazo e
triagem sejam fáceis de testar e que trocar banco ou modelo de LLM não afete a lógica.

## Decisão
Organizar em três camadas, com a dependência sempre apontando **para dentro** (o domínio não depende
de ninguém):

```
api/     → rotas HTTP, validação de entrada, tradução HTTP ↔ domínio (sem regra de negócio)
domain/  → regras de negócio como funções puras (score, prazo, triagem) — sem I/O
infra/   → adaptadores: repositório de banco, cliente de LLM, config/secrets
```

> Função pura (em uma frase): dado o mesmo input, devolve sempre o mesmo output e não acessa
> banco/rede/relógio — por isso é trivial de testar.

## Alternativas
- **Tudo numa pasta só:** mais rápido de começar, mas mistura regra com infra e vira difícil de
  testar e evoluir.
- **Microserviços:** exagero para um grupo pequeno e prazo curto.

## Consequências
- ➕ Domínio testável isoladamente (sem banco/rede); trocar infra não mexe nas regras.
- ➕ Onde cada coisa vive fica óbvio: endpoint do chatbot em `api/`, score e prazo em `domain/`,
  banco e LLM em `infra/`.
- ➖ Um pouco mais de estrutura inicial — compensado pela testabilidade e pela evolução sem reescrita.
