# ADR 0004 — Autenticação: seed + login simples + persona de demo

**Status:** Aceita

## Contexto
Demo acadêmica. O discovery previa login próprio (email/senha) e o sistema tem papéis (cargos) que
mudam a interface. Também queremos manter o **seletor de persona** que facilita demonstrar cada papel
rapidamente.

## Decisão
- **Usuários semeados (seed)** no banco, cada um com um cargo (funcionário de vertente, diretor,
  membro do marketing, coordenador do marketing, administrador).
- **Login por email/senha** com a senha guardada como **hash** (nunca em texto), e **sessão simples**
  por cookie assinado.
- O **seletor de persona** continua disponível como atalho de demonstração.

## Alternativas
- **Sem login (só persona):** rápido, mas pouco realista e sem base para proteger rotas.
- **OAuth/SSO completo:** mais seguro, porém fora do escopo e do prazo do trabalho.

## Consequências
- ➕ Realista o suficiente para a apresentação, com senha protegida por hash.
- ➕ Base para proteger rotas por cargo (autorização) sem complexidade de OAuth.
- ➖ As senhas dos usuários de seed são conhecidas (documentadas apenas para a demo) — não usar em
  produção. Migrar para SSO fica registrado como evolução futura.
