# ADR 0006 — Modelagem de prazo e datas

**Status:** Aceita

## Contexto
Cada projeto enviado ao marketing tem um **prazo de resposta**. Na aba "Meus Projetos" do marketing,
o projeto mostra o estado do prazo: **dentro do prazo**, **vence hoje** ou **vencido**. Datas são
entrada externa (não confiável) e o cálculo precisa ser confiável e testável. Hoje esse cálculo vive
no frontend (`prototipos/base.html`), com a data de "hoje" fixa.

## Decisão
- O `Projeto` guarda `dataBase` (quando entrou em análise) e `prazoResposta` (data-limite), ambas em
  **ISO 8601** (`YYYY-MM-DD`).
- `prazoStatus` **não é guardado** — é **calculado** por uma função pura no domínio
  (`domain/deadline`), a partir de `prazoResposta` e da data de "hoje".
- A data de **"hoje" é injetada** na função (parâmetro), em vez de a função ler o relógio — assim os
  testes são determinísticos.
- **Toda data é validada** (formato ISO válido, não-`NaN`, intervalo plausível) antes do cálculo.
- Visibilidade: o prazo aparece para **toda a equipe de marketing** (decisão do grupo). O campo de
  atribuição individual (`atribuidoA`) fica reservado para evolução futura.

## Alternativas
- **Guardar o status calculado:** ficaria desatualizado (um projeto "no prazo" viraria "vencido" com
  o passar do tempo sem ninguém atualizar).
- **Calcular no frontend (como hoje):** não é testável nem confiável e mistura regra com interface.

## Consequências
- ➕ Cálculo único, no domínio, testável nos três casos (dentro do prazo / vence hoje / vencido).
- ➕ "Hoje" injetável torna os testes estáveis.
- ➖ Exige migrar o cálculo do frontend para o domínio (FASE 3); o frontend passa a só exibir.
