# Projeto Azul — Resumo da Sessão de Definição

> **Objetivo deste documento:** consolidar tudo que foi decidido e o que ainda está em aberto,
> para discussão em grupo. Após a decisão do grupo, seguimos para o fechamento da **Especificação
> Funcional** e a **Especificação Técnica**.
>
> **Data da sessão:** 14–15/07/2026 · **Status:** aguardando decisões do grupo sobre os itens em aberto.

---

## 1. O que é o Projeto Azul (relembrando)

App corporativo interno da Azul Linhas Aéreas onde as **vertentes** (departamentos) desenvolvem
projetos **junto com o Marketing desde a concepção** — invertendo o fluxo atual em que projetos
chegavam ao Marketing já "prontos" e geravam **retrabalho de readequação**.

Cobre o ciclo completo: **concepção → revisão → análise → aprovação → divulgação → conclusão**,
com colaboração, aprovações hierárquicas, reuniões, notificações e dashboard para a diretoria.

---

## 2. ✅ Decisões FECHADAS nesta sessão

| Tema | Decisão | Observação |
|---|---|---|
| **Escopo do MVP** | Completo — Módulos **M1 a M5** | Gestão de Projetos, Colaboração, Aprovações/Reuniões, Dashboard, Notificações |
| **Plataforma** | Aplicação **web desktop-first**, responsiva para mobile | Não é app de loja (iOS/Android nativo) |
| **Autenticação** | **Login próprio** (email + senha) | Arquitetura preparada para SSO corporativo no futuro |
| **Emails** | Envio **real via SendGrid** | Para testar de verdade; sem integração com sistemas da Azul |
| **Reuniões** | Agendamento **interno ao app** | Sem sincronizar com Outlook/Google Calendar |
| **RN-03 — Edição de projeto** | Editável **só em Rascunho** | Após submissão, só edita se for devolvido (desbloqueio) |
| **RN-04 — Visibilidade de comentários** | Flag por comentário: **Interno (Marketing)** vs **Público (visível à vertente)** | Funcionário de Vertente só cria comentários públicos; Presidente vê tudo |

### Premissas confirmadas pelo usuário
1. Haverá um papel **Administrador** para cadastrar usuários, cargos e vertentes (admin inicial via seed).
2. **Anexos:** até ~20 MB, tipos comuns (pdf, imagens, xlsx, pptx).
3. **Um usuário = um cargo** no MVP.
4. **Vertical comandante** = a vertente dona do projeto; sem co-participação de outras vertentes no MVP.

### Personas e papéis (já definidos)
- **Funcionário de Vertente** — cria/edita (em Rascunho), anexa, comenta (público), submete ao Diretor.
- **Diretor de Vertente** — revisa, aprova para o Marketing ou devolve com justificativa.
- **Membro do Marketing** — comenta com rubrica (interno/público), participa de reuniões.
- **Coordenador de Marketing** — palavra final (aprova/reprova), agenda reuniões.
- **Presidente** — visão consolidada, dashboard, exporta relatórios, vê todos os comentários.

> Detalhamento completo (máquina de estados, regras RN-01 a RN-06, critérios de aceite por módulo)
> está no arquivo **`ESPECIFICACAO_FUNCIONAL.md`**.

---

## 3. 🔵 EM ABERTO — Sugestões para o grupo decidir

> Pesquisa de referência: Adobe Workfront, Wrike, Asana, Airtable, monday e ferramentas de proofing
> (Ziflow), + best practices de briefing e marketing operations.
>
> **Leitura-chave:** a dor da Azul não é "gerenciar projetos", é **retrabalho por desalinhamento**.
> O fluxo já ataca a causa certa, mas, do jeito atual, o app corre risco de virar só um *rastreador
> de status*. As 3 alavancas que as líderes de mercado usam e que hoje estão fracas/ausentes:
> **(a) briefing guiado, (b) revisão em cima da arte (proofing), (c) medir/expor retrabalho e gargalos.**

### Menu de enriquecimento — marcar: entra no MVP / v1.1 / v2 / descartar

| ID | Ideia | Por que importa (dor) | Impacto | Esforço | Sugestão | Decisão do grupo |
|---|---|---|---|---|---|---|
| **E1** | **Briefing guiado por tipo de projeto** (campos que se adaptam a campanha de rota, promoção, TudoAzul, institucional; cada entrega "definition-ready") | Maior alavanca contra retrabalho segundo toda a pesquisa; padroniza o intake | Altíssimo | Médio | **MVP** | ☐ |
| **E2** | **Revisão sobre a arte (proofing/anotação)** — comentar em cima do anexo, preso a uma região, com "Aprovar / Aprovar com ajustes / Solicitar mudança" | Transforma "comentário solto" em feedback acionável; coração das ferramentas líderes | Altíssimo | Alto | **MVP se der; senão v1.1** | ☐ |
| **E3** | **Checkpoint de co-criação** — passo leve de alinhar direção com o Marketing antes de submeter (mini-brief) | Reforça a proposta de valor: Marketing *desde a concepção*, não só na análise | Alto | Baixo | **MVP** | ☐ |
| **E4** | **Prazos/SLA por etapa + gargalos visíveis** — cada status tem prazo; mostra "há quanto tempo parado" e alerta atrasos | Evita "apagar incêndio"; dá previsibilidade | Alto | Médio | **MVP (simples)** | ☐ |
| **E5** | **Métrica de retrabalho e ciclo no dashboard** — taxa de devolução/retrabalho, cycle time, on-time delivery | É como se **prova** à diretoria que o app reduziu a dor (argumento de ROI) | Alto | Baixo | **MVP** | ☐ |
| **E6** | **Fechar o loop concepção→resultado** — registrar KPIs reais pós-campanha vs. esperados no brief | Mostra aprendizado; poucos concorrentes fazem bem | Médio-alto | Médio | **v1.1** | ☐ |
| **E7** | **Governança de marca** — checklist/biblioteca de diretrizes da marca Azul anexa ao projeto | Companhia aérea = marca fortíssima e regulada | Médio | Baixo-médio | **v1.1** | ☐ |
| **E8** | **Resumo de discussão por IA** — resume comentários/pareceres em "o que precisa mudar" | Reduz tempo de leitura antes da reunião; "uau" barato (já rodamos em cima de Claude) | Médio-alto | Baixo | **v1.1** | ☐ |
| **E9** | **Rascunho de brief assistido por IA** — gera 1ª versão do brief e checa contra diretrizes de marca | Acelera o intake com qualidade | Médio | Médio | **v2** | ☐ |
| **E10** | **Base de maturidade** — templates de projeto reutilizáveis, versionamento de anexos, e-assinatura da aprovação | Padrão nas líderes (Workfront/Wrike/Ziflow) | Médio | Variável | **v1.1+** | ☐ |

### Recomendação para o MVP (para acelerar a discussão)
Manter o escopo atual **+ E1, E3, E4, E5** (baixo/médio esforço, atacam a dor de frente) e, se o grupo
topar o esforço, **E2** (proofing) — sem revisar a arte de verdade, o app fica a meio caminho da dor
real. **E8** (resumo por IA) é um diferencial barato para encaixar cedo.

---

## 4. Perguntas de apoio para a reunião do grupo

1. Qual é **a métrica de sucesso** do projeto para a Azul? (ex.: reduzir X% do retrabalho / tempo de
   aprovação) — isso ajuda a priorizar E5/E4/E6.
2. O **proofing (E2)** é essencial no lançamento ou aceitamos começar com comentário estruturado e
   evoluir? (define o tamanho do MVP)
3. Vale investir nos diferenciais de **IA (E8/E9)** desde cedo como fator "uau" para aprovação interna?
4. Alguma restrição de **TI/segurança da Azul** que precisamos saber já (hospedagem, LGPD, onde os
   anexos podem ficar)?

---

## 5. Próximos passos

1. **Grupo decide** os itens E1–E10 (coluna "Decisão do grupo") e responde as perguntas da seção 4.
2. Atualizo a **`ESPECIFICACAO_FUNCIONAL.md`** com o que entrar.
3. Elaboro a **Especificação Técnica** (stack, arquitetura, modelo de dados, estrutura, plano incremental).
4. Iniciamos a **implementação** por incrementos.

---

## Anexos / arquivos do projeto
- `DISCOVERY.md` — discovery original (blocos 1–3 completos).
- `ESPECIFICACAO_FUNCIONAL.md` — especificação funcional consolidada (decisões desta sessão).
- `RESUMO_SESSAO.md` — este documento.
