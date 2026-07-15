# Especificação Funcional — Projeto Azul (Versão B — Enriquecida)

> **Versão B — Enriquecida.** Parte da **Versão A (Base)** e incorpora os enriquecimentos sugeridos
> após a pesquisa de mercado (Adobe Workfront, Wrike, Asana, Airtable, monday, Ziflow + best
> practices de briefing e marketing operations).
> Tudo que é **novo em relação à Base** está marcado com **🟡** e etiquetado por fase sugerida
> (**[MVP]**, **[v1.1]**, **[v2]**). Segue o mesmo padrão do documento de discovery.
> Status: **Proposta para decisão do grupo.**

---

## 1. Visão Geral do Produto

**Nome:** Projeto Azul

**Descrição:** Aplicativo corporativo interno para que as vertentes (departamentos) da Azul Linhas
Aéreas criem e desenvolvam projetos em conjunto com a equipe de Marketing desde o início do processo.
O sistema gerencia o ciclo de vida completo — da concepção à divulgação — com colaboração,
aprovações e visibilidade para todos os níveis hierárquicos.

**Problema que resolve:** As vertentes criavam projetos isoladamente, sem consultar o Marketing,
gerando retrabalho de readequação. O sistema inverte o fluxo, trazendo o Marketing desde a concepção.

**🟡 Diferencial da Versão B:** além de organizar o fluxo, a ferramenta é desenhada para **reduzir e
medir o retrabalho** de forma ativa — com briefing guiado, revisão sobre a arte, prazos com alertas e
indicadores de retrabalho — que a pesquisa aponta como as maiores alavancas contra a dor central.

**Modelo de negócio:** Solução interna corporativa (não comercializada externamente).

**Decisões de plataforma e produto (desta sessão):**
- Aplicação **web desktop-first**, responsiva para mobile.
- **Login próprio** (email + senha), preparado para SSO futuro.
- Escopo do MVP: **completo (M1 a M5)** + enriquecimentos **[MVP]** aprovados pelo grupo.
- Emails reais via **SendGrid**; reuniões **internas**; sem integração com sistemas da Azul.
- 🟡 **[v1.1]** Recursos assistidos por Inteligência Artificial (resumo de discussão, rascunho de brief).

---

## 2. Personas

| Persona | Papel | Permissões | Workflow principal |
|---|---|---|---|
| Funcionário de Vertente | Cria projetos na sua área | Criar/editar (em Rascunho), anexar, comentar (público), submeter | Cria → submete ao Diretor → acompanha feedback |
| Diretor de Vertente | Revisa projetos da sua área | Revisar, aprovar, devolver com justificativa, comentar | Recebe notificação → revisa → aprova ou devolve |
| Membro do Marketing | Analisa projetos | Comentar com rubrica (interno/público), 🟡 anotar sobre a arte, participar de reuniões | Analisa → comenta → participa de reunião |
| Coordenador de Marketing | Palavra final | Aprovar/reprovar, agendar reuniões, comentar | Analisa pareceres → coordena reunião → decide |
| Presidente | Visão geral | Dashboard, ver todos os comentários, exportar relatórios | Acompanha indicadores → reuniões de desempenho |
| Administrador | Gestão de acessos | Cadastrar usuários, cargos, vertentes, 🟡 tipos de projeto e diretrizes de marca | Mantém cadastros base |

---

## 3. Requisitos Funcionais (Módulos)

### M1 — Gestão de Projetos

**Descrição:** Módulo central de criação, edição e acompanhamento de projetos ao longo do ciclo de vida.

**🟡 Ciclo de vida (status) — com etapa opcional de co-criação [MVP]:**
Rascunho → **🟡 Alinhamento com Marketing (opcional)** → Em revisão (Diretor) → Em análise (Marketing) → Aprovado → Em divulgação → Concluído

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Criar projeto | Nome, objetivo, público-alvo, metas, orçamento, vertical comandante, KPIs, resultados esperados, anexos | Valida obrigatórios, status "Rascunho" | Projeto criado |
| 🟡 **[MVP] Criar por tipo (E1)** | **Tipo do projeto** (campanha de rota, promoção, TudoAzul, institucional…) | **Formulário se adapta ao tipo, exibindo campos específicos "definition-ready"** | Projeto com brief padronizado por tipo |
| 🟡 **[MVP] Alinhamento inicial (E3)** | Mini-brief + pergunta de direção ao Marketing | **Consulta rápida ao Marketing antes da revisão do Diretor** | Registro de direção alinhada |
| 🟡 **[v2] Rascunho assistido (E9)** | Poucas informações iniciais | **IA gera 1ª versão do brief e checa diretrizes de marca** | Brief pré-preenchido |
| 🟡 **[v1.1] Registrar resultado final (E6)** | KPIs reais pós-campanha | **Compara resultado real x esperado no brief** | Projeto concluído com aprendizado |
| Submeter / Revisar / Anexar / Editar / Publicar / Concluir | (iguais à Versão A) | (iguais à Versão A) | (iguais à Versão A) |
| 🟡 **[v1.1] Criar a partir de modelo (E10)** | Modelo de projeto reutilizável | **Instancia projeto a partir de template** | Projeto pré-configurado |

**Regras de Negócio aplicáveis:** RN-01, RN-03, RN-05, RN-06, 🟡 RN-07, 🟡 RN-08

**Fluxo Principal (Happy Path):**
1. Funcionário cria projeto **🟡 escolhendo o tipo (E1)**; formulário guiado é preenchido.
2. **🟡 (opcional) Alinhamento rápido com o Marketing (E3)** para validar a direção.
3. Submete → "Em revisão"; Diretor notificado.
4. Diretor aprova → "Em análise"; Marketing notificado.
5. Marketing analisa, **🟡 anota sobre a arte (E2)**, comenta e participa de reunião.
6. Coordenador aprova → "Aprovado".
7. Divulgação → "Em divulgação"; conclusão → "Concluído" **🟡 com resultado real registrado (E6)**.

**Exceções / Edge Cases:** (iguais à Versão A) + 🟡 alinhamento inicial é opcional e não bloqueia o fluxo.

**Critérios de Aceite:**
- [ ] (Todos os da Versão A)
- [ ] 🟡 **[MVP]** Campos do formulário mudam conforme o tipo de projeto escolhido.
- [ ] 🟡 **[MVP]** É possível fazer um alinhamento rápido com o Marketing antes da revisão do Diretor.
- [ ] 🟡 **[v1.1]** Ao concluir, é possível registrar o resultado real e vê-lo ao lado do esperado.

---

### M2 — Colaboração (Comentários Estruturados + Revisão da Arte)

**Descrição:** Comentários com rubrica estruturada e **🟡 revisão sobre os anexos (proofing)**, para
transformar feedback solto em ajustes acionáveis.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Comentar em projeto | Tópico, descrição, prioridade, visibilidade (Interno/Público), @menção | Valida, assina, aplica visibilidade | Comentário registrado e notificado |
| Visualizar/filtrar comentários | Projeto + filtros | Filtra por tópico, prioridade, visibilidade conforme permissão | Lista visível |
| 🟡 **[MVP/v1.1] Anotar sobre a arte (E2)** | **Marcação em região do anexo (imagem/PDF) + comentário + estado (Aprovar / Aprovar com ajustes / Solicitar mudança)** | **Fixa a anotação ao ponto do arquivo e à versão** | Anotação visível sobre o anexo, acionável |
| 🟡 **[v1.1] Resumo da discussão (E8)** | Todos os comentários do projeto | **IA resume em "o que precisa mudar"** | Resumo executivo do parecer |

**Regras de Negócio aplicáveis:** RN-04, 🟡 RN-09

**Fluxo Principal (Happy Path):**
1. Marketing acessa projeto em "Em análise".
2. Comenta com rubrica (tópico, prioridade, visibilidade) **🟡 e/ou anota diretamente sobre a arte (E2)**.
3. @menciona o criador.
4. Sistema registra e notifica. **🟡 Antes da reunião, gera um resumo da discussão (E8).**

**Exceções / Edge Cases:** (iguais à Versão A) + 🟡 anotação exige um anexo visual válido.

**Critérios de Aceite:**
- [ ] (Todos os da Versão A)
- [ ] 🟡 **[MVP/v1.1]** É possível anotar sobre a arte, com estado da revisão preso ao ponto e à versão.
- [ ] 🟡 **[v1.1]** É possível gerar um resumo automático dos comentários do projeto.

---

### M3 — Aprovações e Agendamento de Reuniões

**Descrição:** Aprovações do Coordenador e agendamento de reuniões internas.

**Entradas e Saídas:** (iguais à Versão A) +

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| 🟡 **[v1.1] Assinar aprovação (E10)** | Decisão do Coordenador | **Registra quem aprovou, com data/hora e versão (e-assinatura)** | Aprovação rastreável |

**Regras de Negócio aplicáveis:** RN-02, RN-05

**Critérios de Aceite:**
- [ ] (Todos os da Versão A)
- [ ] 🟡 **[v1.1]** A aprovação registra autor, data/hora e versão do projeto aprovada.

---

### M4 — Dashboard e Relatórios

**Descrição:** Visão consolidada para a diretoria, **🟡 com foco em provar a redução do retrabalho**.

**Entradas e Saídas:** (iguais à Versão A) +

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| 🟡 **[MVP] Indicadores de retrabalho (E5)** | Histórico de status e prazos | **Calcula taxa de devolução/retrabalho, tempo de ciclo e entregas no prazo** | Gráficos de retrabalho, cycle time, on-time |
| 🟡 **[v1.1] Resultado x esperado (E6)** | Resultados reais dos concluídos | **Compara realizado vs planejado por projeto/vertente** | Indicador de acerto de metas |

**Critérios de Aceite:**
- [ ] (Todos os da Versão A)
- [ ] 🟡 **[MVP]** Dashboard exibe taxa de retrabalho, tempo médio até aprovação e entregas no prazo.
- [ ] 🟡 **[v1.1]** É possível comparar resultado real x esperado dos projetos concluídos.

---

### M5 — Notificações

**Descrição:** Avisos in-app e por email. **🟡 Inclui alertas de prazo/atraso (E4).**

**Eventos que disparam notificação:** (iguais à Versão A) +

| Evento | Gatilho | Notificados | Canal |
|---|---|---|---|
| 🟡 **[MVP] Prazo próximo/estourado (E4)** | Item parado além do prazo da etapa | Responsáveis da etapa | Sistema + Email |
| 🟡 **[MVP/v1.1] Nova anotação na arte (E2)** | Anotação criada sobre um anexo | Envolvidos com permissão | Sistema + Email |

**Critérios de Aceite:**
- [ ] (Todos os da Versão A)
- [ ] 🟡 **[MVP]** Sistema alerta quando um projeto ultrapassa o prazo da etapa.

---

### 🟡 M6 — Prazos e SLA por Etapa **[MVP]** (E4)

**Descrição:** Define prazos por etapa do ciclo de vida e dá visibilidade a gargalos.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Definir prazo por etapa | Etapa + prazo (dias) | Administrador configura padrão; opcional por projeto | Prazos aplicados |
| Acompanhar tempo na etapa | Projeto em andamento | Calcula "há quanto tempo parado" (queue aging) | Indicador de atraso, ordenação por urgência |
| Alertar atraso | Item além do prazo | Dispara notificação (via M5) | Alerta ao responsável |

**Regras de Negócio aplicáveis:** 🟡 RN-10

**Critérios de Aceite:**
- [ ] Cada etapa tem um prazo configurável.
- [ ] Lista de projetos mostra tempo parado e destaca atrasados.
- [ ] Atraso gera alerta.

---

### 🟡 M7 — Governança de Marca **[v1.1]** (E7)

**Descrição:** Biblioteca de diretrizes da marca Azul e checklist associado ao projeto.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Manter diretrizes | Documentos/itens de diretriz (admin) | Armazena biblioteca da marca | Diretrizes disponíveis |
| Checklist de marca no projeto | Projeto + itens de diretriz | Marca conformidade item a item | Status de aderência à marca |

**Critérios de Aceite:**
- [ ] Biblioteca de diretrizes acessível no projeto.
- [ ] Checklist de aderência preenchível antes da aprovação.

---

## 4. Requisitos de Frontend & UX

**Plataforma:** web desktop-first, responsiva. **Navegação (sidebar):** Meus Projetos · Dashboard ·
Reuniões · Notificações · 🟡 **Prazos/Atrasos [MVP]** · 🟡 **Marca [v1.1]**.

**Layout por Persona:** (igual à Versão A) +
- 🟡 Coordenador/Diretor: destaque para **itens atrasados** (E4) na lista.
- 🟡 Presidente: painel com **indicadores de retrabalho** (E5).

**Componentes complexos:** (iguais à Versão A) +
- 🟡 **Visualizador de arte com anotação** (marcar ponto + estado da revisão) — E2.
- 🟡 **Formulário dinâmico por tipo de projeto** — E1.
- 🟡 **Indicadores de retrabalho e prazos** — E4/E5.

---

## 5. Regras de Negócio

| ID | Regra | Condição | Ação/Resultado | Módulos |
|---|---|---|---|---|
| RN-01 | Projeto exige aprovação do Diretor | Funcionário submete | Não avança ao Marketing sem revisão | M1 |
| RN-02 | Coordenador tem palavra final | Projeto em "Em análise" | Aprova ou retorna | M3 |
| RN-03 | Edição de projeto | Fora de "Rascunho" | Só edita em Rascunho; após submissão, só com devolução | M1 |
| RN-04 | Visibilidade de comentários | Comentário criado | Interno (Marketing+Presidente) vs Público (envolvidos) | M2, M5 |
| RN-05 | Devolução/reprovação | Diretor/Coordenador devolve | Exige justificativa registrada | M1, M3 |
| RN-06 | Anexos | Arquivo enviado | Vinculado ao projeto e visível aos envolvidos | M1 |
| 🟡 RN-07 | Tipo de projeto define o brief (E1) | Criação do projeto | Campos obrigatórios variam conforme o tipo | M1 |
| 🟡 RN-08 | Alinhamento inicial é opcional (E3) | Antes da revisão do Diretor | Não bloqueia o fluxo; fica registrado | M1 |
| 🟡 RN-09 | Anotação presa à versão (E2) | Anotação sobre anexo | Amarrada ao ponto e à versão do arquivo | M2 |
| 🟡 RN-10 | Prazo por etapa gera alerta (E4) | Item além do prazo | Dispara alerta ao responsável | M5, M6 |

---

## 6. Integrações

| Integração | Uso | Fase |
|---|---|---|
| **SendGrid** | Envio real de emails | MVP |
| Autenticação própria | Login email/senha (SSO futuro) | MVP |
| 🟡 **Inteligência Artificial (Claude)** | Resumo de discussão (E8) e rascunho de brief (E9) | v1.1 / v2 |
| — | Sem integração com Outlook/Google/sistemas Azul | — |

---

## 7. Modelo de Dados (Conceitual)

**Base (igual à Versão A):** Usuario, Vertente, Projeto, HistoricoStatus, Anexo, Comentario, Mencao,
Reuniao, ParticipanteReuniao, Notificacao.

**🟡 Novas entidades da Versão B:**
- 🟡 **TipoProjeto** (id, nome, camposObrigatorios) — 1:N → Projeto — *E1*
- 🟡 **AnotacaoArte** (id, anexoId, versao, posicao, comentario, estado, autorId, criadoEm) — N:1 → Anexo — *E2*
- 🟡 **PrazoEtapa** (id, etapa, prazoDias, projetoId?) — configuração de SLA — *E4*
- 🟡 **ResultadoProjeto** (id, projetoId, kpiRealizado, comparativoEsperado, registradoEm) — N:1 → Projeto — *E6*
- 🟡 **DiretrizMarca** (id, titulo, descricao, documentoUrl) e **ChecklistMarca** (id, projetoId, diretrizId, conforme) — *E7*
- 🟡 **ModeloProjeto** (id, nome, tipoProjetoId, estruturaBase) — *E10*
- 🟡 **AssinaturaAprovacao** (id, projetoId, aprovadorId, versao, dataHora) — *E10*

---

## 8. Escopo do MVP

**Dentro (Base + enriquecimentos [MVP] recomendados):**
- M1–M5 completos (Versão A).
- 🟡 E1 (formulário por tipo), 🟡 E3 (alinhamento inicial), 🟡 M6/E4 (prazos e alertas),
  🟡 E5 (indicadores de retrabalho).
- 🟡 E2 (revisão sobre a arte) — **incluir no MVP se houver fôlego; senão v1.1.**

**v1.1:** E2 (se não entrar antes), E6 (resultado x esperado), E7/M7 (governança de marca),
E8 (resumo por IA), E10 (modelos + e-assinatura).

**v2:** E9 (rascunho de brief por IA).

**Fora:** SSO corporativo; integração Outlook/Google/sistemas Azul; app de loja; offline; multi-cargo.

> Observação: as fases acima são **sugestão**. O grupo decide o que sobe ou desce de fase.

---

## 9. Riscos e Premissas

**Premissas confirmadas:** (iguais à Versão A) +
- 🟡 Tipos de projeto e diretrizes de marca serão cadastrados pelo Administrador.
- 🟡 Recursos de IA usarão o modelo Claude, respeitando a visibilidade dos comentários (não expor interno).

**Riscos:** (iguais à Versão A) +
- 🟡 Escopo maior: E2 (proofing) é o item de maior esforço — avaliar entrada no MVP.
- 🟡 IA: revisar privacidade dos dados enviados ao modelo com a segurança da Azul.

---

## Glossário

- **Vertente / Vertical comandante / Rubrica / Comentário interno/público / Envolvidos:** (iguais à Versão A).
- 🟡 **Tipo de projeto:** categoria que define quais campos o brief exige (E1).
- 🟡 **Anotação sobre a arte (proofing):** comentário preso a um ponto do anexo, com estado de revisão (E2).
- 🟡 **SLA de etapa:** prazo esperado para o projeto permanecer em cada status (E4).
- 🟡 **Cycle time:** tempo total do projeto entre criação e aprovação/conclusão (E5).
- 🟡 **Taxa de retrabalho:** proporção de projetos devolvidos/reprovados ao menos uma vez (E5).
