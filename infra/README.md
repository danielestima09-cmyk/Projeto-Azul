# Camada `infra/` — Adaptadores para o mundo externo

Tudo que fala com **banco, rede ou serviços externos** vive aqui, atrás de "portas" (interfaces) que
o domínio consome. Trocar a tecnologia por baixo **não afeta as regras de negócio**.

## O que vai viver aqui (populado na FASE 3)
- `repository/` — acesso a dados via padrão **Repository**. `SqliteProjetoRepository` hoje;
  `PostgresProjetoRepository` amanhã, sem mexer no domínio.
- `llm/` — **adapter** do provedor de IA. `OpenRouterClient` (lê `OPENROUTER_API_KEY` e
  `OPENROUTER_MODEL` do ambiente). Trocar de provedor = novo adapter.
- `config/` — leitura e validação das variáveis de ambiente/secrets (falha cedo se faltar chave).

## Regras
- Nenhum segredo em código; tudo vem de variável de ambiente (secret do Codespaces).
- O domínio depende de **interfaces**, não destas implementações concretas.
