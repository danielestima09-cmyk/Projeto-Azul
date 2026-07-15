# Especificação Funcional — Projeto Azul (Versão A — Base)

> **Versão A — Base.** Contém apenas o que **já estava definido** no discovery e nas decisões desta
> sessão, sem os enriquecimentos sugeridos após a pesquisa de mercado (esses estão na **Versão B**).
> Segue o mesmo padrão do documento de discovery.
> Status: **Pronta para especificação técnica.**

---

## 1. Visão Geral do Produto

**Nome:** Projeto Azul

**Descrição:** Aplicativo corporativo interno para que as vertentes (departamentos) da Azul Linhas
Aéreas criem e desenvolvam projetos em conjunto com a equipe de Marketing desde o início do processo.
O sistema gerencia o ciclo de vida completo do projeto — da concepção à divulgação — com colaboração,
aprovações e visibilidade para todos os níveis hierárquicos.

**Problema que resolve:** As vertentes criavam projetos isoladamente, sem consultar o Marketing.
Quando o projeto chegava ao Marketing, já estava "pronto", mas inadaptado ao público, gerando
retrabalho para readequar a comunicação. O sistema inverte esse fluxo, trazendo o Marketing para
dentro do processo desde a concepção.

**Modelo de negócio:** Solução interna corporativa (não comercializada externamente).

**Decisões de plataforma e produto (desta sessão):**
- Aplicação **web desktop-first**, responsiva para mobile (não é app de loja).
- **Login próprio** (email + senha), com arquitetura preparada para SSO corporativo futuro.
- Escopo do MVP: **completo (M1 a M5)**.
- Emails reais via **SendGrid**; reuniões **internas ao app**; sem integração com sistemas da Azul.

---

## 2. Personas

| Persona | Papel | Permissões | Workflow principal |
|---|---|---|---|
| Funcionário de Vertente | Cria projetos na sua área | Criar/editar (em Rascunho), anexar arquivos, comentar (público), submeter | Cria → submete ao Diretor → acompanha feedback do Marketing |
| Diretor de Vertente | Revisa projetos da sua área | Revisar, aprovar p/ Marketing, devolver com justificativa, comentar | Recebe notificação → revisa → aprova ou devolve |
| Membro do Marketing | Analisa projetos | Comentar com rubrica (interno/público), participar de reuniões | Recebe projeto → analisa → comenta → participa de reunião |
| Coordenador de Marketing | Palavra final sobre o projeto | Aprovar/reprovar, agendar reuniões, comentar | Analisa pareceres → coordena reunião → aprova ou devolve |
| Presidente | Visão geral de todos os projetos | Acessar dashboard, ver todos os comentários, exportar relatórios | Acompanha indicadores → participa de reuniões de desempenho |
| Administrador | Gestão de acessos | Cadastrar usuários, cargos e vertentes | Mantém cadastros base do sistema |

---

## 3. Requisitos Funcionais (Módulos)

### M1 — Gestão de Projetos

**Descrição:** Módulo central para criação, edição e acompanhamento de projetos, gerenciando todo o
ciclo de vida, do rascunho à conclusão.

**Ciclo de vida (status):**
Rascunho → Em revisão (Diretor de Vertente) → Em análise (Marketing) → Aprovado → Em divulgação → Concluído

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Criar projeto | Nome, objetivo, público-alvo, metas, orçamento planejado, vertical comandante, KPIs, resultados esperados, anexos | Valida campos obrigatórios, define status "Rascunho", assina responsável | Projeto criado |
| Submeter projeto | Projeto em Rascunho | Valida obrigatórios, muda status para "Em revisão" | Notificação ao Diretor |
| Revisar projeto (Diretor) | Projeto em revisão + decisão | Aprova (→ "Em análise") ou devolve (→ "Rascunho", com justificativa) | Notificação ao Marketing ou ao criador |
| Anexar arquivos | Upload de arquivos (planilhas, apresentações, artes) | Armazena o arquivo vinculado ao projeto | Arquivo disponível aos participantes |
| Editar projeto | Campos alteráveis | Permite edição apenas em "Rascunho" | Projeto atualizado |
| Publicar / Concluir | Projeto aprovado | Muda status para "Em divulgação" e depois "Concluído" (registra resultados) | Projeto atualizado |

**Regras de Negócio aplicáveis:** RN-01, RN-03, RN-05, RN-06

**Fluxo Principal (Happy Path):**
1. Funcionário de Vertente cria projeto com todos os campos obrigatórios e anexos (status "Rascunho").
2. Funcionário submete → status "Em revisão" e Diretor é notificado.
3. Diretor aprova → status "Em análise (Marketing)" e Marketing é notificado.
4. Marketing analisa, comenta e participa de reunião.
5. Coordenador aprova → status "Aprovado".
6. Marketing divulga → status "Em divulgação".
7. Projeto concluído → status "Concluído", KPIs registrados.

**Exceções / Edge Cases:**
- Campos obrigatórios não preenchidos → sistema bloqueia submissão.
- Diretor devolve → projeto volta a "Rascunho" com justificativa; criador é notificado.
- Coordenador reprova → projeto retorna (Rascunho ou Em análise) com justificativa; todos notificados.
- Tentativa de editar projeto fora de "Rascunho" → bloqueada.

**Critérios de Aceite:**
- [ ] Qualquer Funcionário de Vertente pode criar um projeto na sua vertente.
- [ ] Projeto só avança ao Marketing após aprovação do Diretor da Vertente.
- [ ] Projetos fora de "Rascunho" não podem ser editados sem devolução.
- [ ] Toda transição de status é registrada (autor, data, justificativa quando aplicável).

---

### M2 — Colaboração (Comentários Estruturados)

**Descrição:** Sistema de comentários com rubrica estruturada para que o Marketing dê feedback
organizado sobre cada projeto, evitando comentários soltos.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Comentar em projeto | Tópico (Público-alvo, Orçamento, Metas, Comunicação, Outro), descrição, prioridade (Alta/Média/Baixa), visibilidade (Interno/Público), @menção | Valida obrigatórios, assina autor e data, aplica visibilidade | Comentário registrado, notificação aos envolvidos com permissão |
| Visualizar comentários | Projeto selecionado | Filtra por tópico, prioridade e visibilidade conforme permissão do usuário | Lista de comentários visíveis |
| @menção | Usuário marcado | Identifica usuário e dispara notificação (se ele puder ver o comentário) | Notificação ao mencionado |

**Regras de Negócio aplicáveis:** RN-04

**Fluxo Principal (Happy Path):**
1. Membro do Marketing acessa projeto em "Em análise".
2. Seleciona tópico "Público-alvo", descreve, marca prioridade "Alta" e visibilidade "Público".
3. @menciona o criador do projeto.
4. Sistema registra e notifica o criador.

**Exceções / Edge Cases:**
- @menção de usuário inválido → sistema ignora e sinaliza erro.
- Comentário vazio → sistema bloqueia.
- Funcionário de Vertente tenta criar comentário "Interno" → não permitido (só "Público").

**Critérios de Aceite:**
- [ ] Comentário exige tópico, descrição, prioridade e visibilidade.
- [ ] @menção dispara notificação ao mencionado (respeitando permissão de ver o comentário).
- [ ] Vertente nunca vê comentários internos; Presidente vê todos.
- [ ] Filtro por tópico, prioridade e visibilidade.

---

### M3 — Aprovações e Agendamento de Reuniões

**Descrição:** Gerencia as aprovações do Coordenador de Marketing e o agendamento de reuniões
internas para deliberação de projetos.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Aprovar projeto | Projeto em "Em análise" | Coordenador valida pareceres e altera status para "Aprovado" | Notificação a todos os envolvidos |
| Reprovar/devolver projeto | Projeto em "Em análise" + justificativa | Coordenador retorna o projeto | Notificação, projeto retorna |
| Agendar reunião | Projeto, data/hora, participantes, pauta | Cria evento interno associado ao projeto | Notificação aos participantes |

**Regras de Negócio aplicáveis:** RN-02, RN-05

**Fluxo Principal (Happy Path):**
1. Coordenador de Marketing acessa projeto.
2. Agenda reunião com participantes (vertente + marketing).
3. Reunião ocorre.
4. Coordenador aprova → status "Aprovado".

**Exceções / Edge Cases:**
- Reunião agendada mas não realizada → aprovação não é bloqueada (pode aprovar sem reunião).
- Reprovação sem justificativa → bloqueada.

**Critérios de Aceite:**
- [ ] Coordenador pode aprovar/reprovar projetos.
- [ ] Reprovação exige justificativa.
- [ ] Agendamento de reunião gera notificação.
- [ ] Sistema não bloqueia aprovação por reunião não realizada.

---

### M4 — Dashboard e Relatórios

**Descrição:** Visão consolidada de todos os projetos para o Presidente e reuniões de desempenho,
com indicadores, filtros e exportação de relatórios.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Visualizar dashboard | Filtros (vertente, período, status) | Agrega dados de projetos | Gráficos: projetos por status, por vertente, orçamento planejado vs realizado, KPIs, projetos atrasados |
| Exportar relatório | Formato (PDF, Excel), filtros | Gera arquivo com dados agregados | Download do relatório |

**Regras de Negócio aplicáveis:** —

**Fluxo Principal (Happy Path):**
1. Presidente acessa dashboard.
2. Aplica filtro por vertente.
3. Visualiza gráficos e indicadores.
4. Exporta relatório em PDF para reunião de desempenho.

**Exceções / Edge Cases:**
- Sem projetos → dashboard vazio com mensagem.

**Critérios de Aceite:**
- [ ] Filtros por vertente, período e status funcionais.
- [ ] Relatórios exportáveis em PDF e Excel.
- [ ] KPIs dos projetos concluídos disponíveis no dashboard.

---

### M5 — Notificações

**Descrição:** Mantém os envolvidos informados sobre mudanças de status, comentários e agendamentos.

**Eventos que disparam notificação:**

| Evento | Gatilho | Notificados | Canal |
|---|---|---|---|
| Projeto submetido | Mudança para "Em revisão" | Diretor da Vertente | Sistema + Email |
| Diretor aprova | Mudança para "Em análise" | Membros do Marketing | Sistema + Email |
| Comentário adicionado / @menção | Novo comentário | Envolvidos com permissão de ver o comentário | Sistema + Email |
| Coordenador aprova/reprova | Mudança de status | Todos os envolvidos | Sistema + Email |
| Reunião agendada | Novo evento | Participantes | Sistema + Email |

**Critérios de Aceite:**
- [ ] Notificações entregues no sistema (in-app) e por email (SendGrid).
- [ ] Histórico de notificações no app, com marcação lida/não lida.
- [ ] Email respeita a visibilidade do comentário (não vaza interno para a vertente).

---

## 4. Requisitos de Frontend & UX

**Plataforma:** Aplicação web desktop-first, responsiva para mobile.

**Navegação (sidebar):** Meus Projetos · Dashboard · Reuniões · Notificações.

**Layout por Persona:**

| Persona | Tela principal | Diferenciação |
|---|---|---|
| Funcionário de Vertente | Lista de projetos + botão "Criar projeto" | Foco nos projetos que criou |
| Diretor de Vertente | Lista de projetos pendentes de revisão | Badge de notificação |
| Membro do Marketing | Lista de projetos em "Em análise" | Foco em projetos aguardando parecer |
| Coordenador de Marketing | Pendências de aprovação + agenda de reuniões | Ações de aprovar/reprovar |
| Presidente | Dashboard com indicadores e gráficos | Visão consolidada, filtros, exportação |

**Componentes complexos:** gráficos de indicadores, lista de projetos com filtros e busca, formulário
de criação de projeto, sistema de comentários com rubrica, calendário/agendamento de reuniões.

**Responsividade:** Desktop-first com adaptação para mobile.

---

## 5. Regras de Negócio

| ID | Regra | Condição | Ação/Resultado | Módulos afetados |
|---|---|---|---|---|
| RN-01 | Projeto exige aprovação do Diretor | Funcionário submete projeto | Não avança ao Marketing sem revisão do Diretor | M1 |
| RN-02 | Coordenador tem palavra final | Projeto em "Em análise" | Decisão do Coordenador aprova ou retorna | M3 |
| RN-03 | Edição de projeto | Projeto fora de "Rascunho" | Edição só permitida em Rascunho; após submissão, apenas com devolução | M1 |
| RN-04 | Visibilidade de comentários | Comentário criado | Interno (Marketing + Presidente) vs Público (todos os envolvidos) | M2, M5 |
| RN-05 | Devolução/reprovação | Diretor ou Coordenador devolve | Sempre exige justificativa registrada | M1, M3 |
| RN-06 | Anexos | Arquivo enviado | Fica vinculado ao projeto e visível a todos os envolvidos | M1 |

---

## 6. Integrações

| Integração | Uso | Observação |
|---|---|---|
| **SendGrid** | Envio real de emails de notificação | Único serviço externo do MVP |
| Autenticação própria | Login por email/senha | Preparado para SSO corporativo futuro (fora do MVP) |
| — | Sem integração com sistemas da Azul, Outlook ou Google | Reuniões são internas ao app |

---

## 7. Modelo de Dados (Conceitual)

- **Usuario** (id, nome, email, senhaHash, cargo, vertenteId) — N:1 → Vertente
- **Vertente** (id, nome, diretorId) — 1:N → Projeto
- **Projeto** (id, nome, objetivo, publicoAlvo, metas, orcamentoPlanejado, verticalComandanteId, kpis, resultadosEsperados, status, criadoEm, criadoPor) — N:1 → Vertente
- **HistoricoStatus** (id, projetoId, statusAnterior, statusNovo, autorId, justificativa, data) — N:1 → Projeto
- **Anexo** (id, projetoId, nomeArquivo, tipo, tamanho, url, enviadoPor, enviadoEm) — N:1 → Projeto
- **Comentario** (id, projetoId, autorId, topico, descricao, prioridade, visibilidade, criadoEm) — N:1 → Projeto
- **Mencao** (id, comentarioId, usuarioId) — N:1 → Comentario
- **Reuniao** (id, projetoId, data, hora, pauta, criadoPor) — N:1 → Projeto
- **ParticipanteReuniao** (id, reuniaoId, usuarioId) — N:1 → Reuniao
- **Notificacao** (id, usuarioId, tipo, mensagem, lida, criadaEm) — N:1 → Usuario

---

## 8. Escopo do MVP

**Dentro:** M1, M2, M3, M4, M5 completos; login próprio; emails via SendGrid; reuniões internas;
cadastro de usuários/vertentes por administrador.

**Fora:** SSO corporativo; integração com Outlook/Google/sistemas Azul; app nativo de loja; uso
offline; versionamento de projeto; múltiplos cargos por usuário.

---

## 9. Riscos e Premissas

**Premissas confirmadas:**
1. Existe papel **Administrador** para cadastrar usuários, cargos e vertentes (admin inicial via seed).
2. Anexos até ~20 MB, tipos comuns (pdf, imagens, xlsx, pptx).
3. Um usuário = um cargo no MVP.
4. Vertical comandante = a vertente dona do projeto; sem co-participação de outras vertentes no MVP.

**Riscos:**
- Adoção: o valor depende de a vertente realmente usar desde o Rascunho (mudança de cultura).
- Confidencialidade dos comentários internos precisa ser garantida em todas as camadas (tela, email, API).
- Hospedagem/armazenamento de anexos e conformidade com LGPD a definir com a TI da Azul.

---

## Glossário

- **Vertente:** departamento/área da empresa que origina projetos.
- **Vertical comandante:** a vertente responsável (dona) por um projeto.
- **Rubrica de comentário:** estrutura obrigatória do comentário (tópico, prioridade, visibilidade).
- **Comentário interno:** visível apenas ao Marketing e ao Presidente.
- **Comentário público:** visível a todos os envolvidos no projeto.
- **Envolvidos:** criador, diretor da vertente, membros do Marketing atribuídos e coordenador.
