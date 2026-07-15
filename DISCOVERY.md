# Discovery — Projeto Azul

> Documento gerado a partir da conversa estruturada de discovery.
> Status: **Em andamento** — Blocos 1 a 3 concluídos, Bloco 4 em aberto.

---

## 1. Visão Geral do Produto

**Nome:** Projeto Azul

**Descrição:** Aplicativo corporativo para que as vertentes (departamentos) da Azul Linhas Aéreas criem e desenvolvam projetos em conjunto com a equipe de Marketing desde o início do processo. O sistema gerencia o ciclo de vida completo do projeto — da concepção à divulgação — com colaboração, aprovações e visibilidade para todos os níveis hierárquicos.

**Problema que resolve:** As vertentes criavam projetos isoladamente, sem consultar o Marketing. Quando o projeto chegava ao Marketing, já estava "pronto", mas inadaptado ao público, gerando retrabalho para readequar a comunicação. O sistema inverte esse fluxo, trazendo o Marketing para dentro do processo desde a concepção.

**Modelo de negócio:** Solução interna corporativa (não comercializada externamente).

---

## 2. Personas

| Persona | Papel | Permissões | Workflow principal |
|---|---|---|---|
| Funcionário de Vertente | Cria projetos na sua área | Criar projeto, anexar arquivos, comentar | Cria → submete ao Diretor → acompanha feedback do Marketing |
| Diretor de Vertente | Revisa projetos da sua área | Revisar e aprovar projetos | Recebe notificação → revisa → aprova para Marketing |
| Membro do Marketing | Analisa projetos | Comentar com rubrica estruturada, participar de reuniões | Recebe projeto → analisa → faz comentários → participa de reunião |
| Coordenador de Marketing | Palavra final sobre o projeto | Aprovar/reprovar projetos, agendar reuniões | Analisa pareceres → coordena reunião → aprova ou devolve |
| Presidente | Visão geral de todos os projetos | Acessar dashboard, ver todos os comentários, exportar relatórios | Acompanha indicadores → participa de reuniões de desempenho |

---

## 3. Requisitos Funcionais (Módulos)

### M1 — Gestão de Projetos

**Descrição:** Módulo central para criação, edição e acompanhamento de projetos. Gerencia todo o ciclo de vida do projeto, desde o rascunho até a conclusão.

**Ciclo de vida (status):**
Rascunho → Em revisão (Diretor de Vertente) → Em análise (Marketing) → Aprovado → Em divulgação → Concluído

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Criar projeto | Nome, objetivo, público-alvo, metas, orçamento planejado, vertical comandante, KPIs, resultados esperados, anexos | Valida campos obrigatórios, define status "Rascunho", assina responsável | Projeto criado, notificação enviada ao Diretor |
| Revisar projeto (Diretor) | Projeto recebido | Análise do Diretor, alteração de status para "Em revisão" → "Em análise (Marketing)" | Notificação enviada ao Marketing |
| Anexar arquivos | Upload de arquivos (planilhas, apresentações, artes) | Armazenamento do arquivo vinculado ao projeto | Arquivo disponível para todos os participantes |
| Editar projeto | Campos alteráveis do projeto | Valida se edição é permitida no status atual | Projeto atualizado |

**Regras de Negócio aplicáveis:** RN-01, RN-03

**Fluxo Principal (Happy Path):**
1. Funcionário de Vertente cria projeto com todos os campos obrigatórios e anexos
2. Sistema salva como "Rascunho" e notifica Diretor da Vertente
3. Diretor revisa e aprova → status vai para "Em análise (Marketing)"
4. Marketing analisa, comenta, participa de reunião
5. Coordenador aprova → status vai para "Aprovado"
6. Marketing divulga → status "Em divulgação"
7. Projeto concluído → status "Concluído", KPIs registrados

**Exceções / Edge Cases:**
- Se campos obrigatórios não forem preenchidos → sistema bloqueia criação
- Se Diretor reprovar → sistema notifica criador com feedback e mantém em "Rascunho"
- Se Coordenador reprovar → sistema notifica todos e retorna para "Rascunho" ou "Em análise"

**Critérios de Aceite:**
- [ ] Qualquer funcionário de vertente pode criar um projeto
- [ ] Projeto só avança ao Marketing após aprovação do Diretor da Vertente
- [ ] Projetos em "Aprovado" ou "Em divulgação" não podem ser editados sem desbloqueio

---

### M2 — Colaboração (Comentários Estruturados)

**Descrição:** Sistema de comentários com rubrica estruturada para que o Marketing dê feedback organizado sobre cada projeto. Evita comentários soltos e bagunçados.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Comentar em projeto | Tópico (ex: Público-alvo, Orçamento, Metas), Descrição, Prioridade (Alta/Média/Baixa), @menção | Valida campos obrigatórios, assina autor e data | Comentário registrado, notificação enviada aos envolvidos |
| Visualizar comentários | Projeto selecionado | Filtragem por tópico e prioridade | Lista de comentários do projeto |
| @menção | Nome de usuário marcado | Identifica usuário e dispara notificação | Notificação ao usuário mencionado |

**Regras de Negócio aplicáveis:** RN-04

**Fluxo Principal (Happy Path):**
1. Membro do Marketing acessa projeto em "Em análise"
2. Seleciona tópico "Público-alvo", preenche descrição, marca prioridade "Alta"
3. @menciona o criador do projeto
4. Sistema registra comentário e notifica o criador

**Exceções / Edge Cases:**
- Se @menção for de usuário inválido → sistema ignora e notifica erro
- Se comentário vazio → sistema bloqueia

**Critérios de Aceite:**
- [ ] Comentário exige tópico, descrição e prioridade
- [ ] @menção dispara notificação para o usuário marcado
- [ ] Presidente vê todos os comentários de todos os projetos
- [ ] Visibilidade dos comentários varia conforme responsáveis do projeto

---

### M3 — Aprovações e Agendamento de Reuniões

**Descrição:** Gerencia as aprovações do Coordenador de Marketing e permite agendar reuniões para deliberação de projetos.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Aprovar projeto | Projeto em "Em análise" | Coordenador valida pareceres e altera status | Notificação a todos os envolvidos |
| Agendar reunião | Projeto, data/hora, participantes, pauta | Cria evento no sistema, associa ao projeto | Notificação aos participantes |
| Reprovar projeto | Projeto em "Em análise" | Coordenador rejeita com justificativa | Notificação, projeto retorna |

**Regras de Negócio aplicáveis:** RN-02

**Fluxo Principal (Happy Path):**
1. Coordenador de Marketing acessa projeto
2. Agenda reunião com participantes (vertente + marketing)
3. Reunião ocorre
4. Coordenador aprova projeto → status "Aprovado"

**Exceções / Edge Cases:**
- Se reunião for agendada mas não realizada → aprovação não é bloqueada (pode aprovar sem reunião)

**Critérios de Aceite:**
- [ ] Coordenador pode aprovar/reprovar projetos
- [ ] Reprovação exige justificativa
- [ ] Agendamento de reunião gera notificação
- [ ] Sistema não bloqueia aprovação até reunião ser realizada

---

### M4 — Dashboard e Relatórios

**Descrição:** Visão consolidada de todos os projetos para o Presidente e reuniões de desempenho. Indicadores, filtros e exportação de relatórios.

**Entradas e Saídas:**

| Funcionalidade | Entradas | Processamento | Saídas |
|---|---|---|---|
| Visualizar dashboard | Filtros (vertente, período, status) | Agrega dados de projetos | Gráficos: projetos por status, por vertente, orçamento vs realizado, KPIs, projetos atrasados |
| Exportar relatório | Formato (PDF, Excel), filtros | Geração de arquivo com dados agregados | Download do relatório |

**Regras de Negócio aplicáveis:** —

**Fluxo Principal (Happy Path):**
1. Presidente acessa dashboard
2. Aplica filtro por vertente
3. Visualiza gráficos e indicadores
4. Exporta relatório em PDF para reunião de desempenho

**Exceções / Edge Cases:**
- Se não houver projetos → dashboard vazio com mensagem

**Critérios de Aceite:**
- [ ] Filtros por vertente, período e status funcionais
- [ ] Relatórios exportáveis em PDF e Excel
- [ ] KPIs dos projetos concluídos disponíveis no dashboard

---

### M5 — Notificações

**Descrição:** Sistema de notificações para manter todos os envolvidos informados sobre mudanças de status, comentários e agendamentos.

**Eventos que disparam notificação:**

| Evento | Gatilho | Notificados | Canal |
|---|---|---|---|
| Projeto criado | Criação de projeto | Diretor da Vertente | Sistema + Email |
| Diretor aprova | Mudança de status para "Em análise" | Membros do Marketing | Sistema + Email |
| Comentário adicionado | Novo comentário com ou sem @menção | Responsáveis do projeto | Sistema + Email |
| Coordenador aprova | Mudança de status para "Aprovado" | Todos os envolvidos | Sistema + Email |
| Reunião agendada | Novo evento de reunião | Participantes | Sistema + Email |

**Critérios de Aceite:**
- [ ] Notificações entregues no sistema (in-app) e por email
- [ ] Usuário pode acessar histórico de notificações no app

---

## 4. Requisitos de Frontend & UX

**Plataforma:** App mobile nativo (cross-platform — Android/iOS e instalável em PCs/notebooks).

**Navegação:** Sidebar com as seções:
- Meus Projetos
- Dashboard
- Reuniões
- Notificações

**Layout por Persona:**

| Persona | Tela principal | Diferenciação |
|---|---|---|
| Funcionário de Vertente | Lista de projetos + botão "Criar projeto" | Foco nos projetos que criou |
| Diretor de Vertente | Lista de projetos pendentes de revisão | Badge de notificação |
| Membro do Marketing | Lista de projetos em "Em análise" | Foco em projetos aguardando parecer |
| Coordenador de Marketing | Pendências de aprovação + agenda de reuniões | Ações de aprovar/reprovar |
| Presidente | Dashboard com indicadores e gráficos | Visão consolidada, filtros, exportação |

**Componentes complexos:**
- Gráficos de indicadores (funil de projetos, pizza por vertente, barras de orçamento)
- Lista de projetos com filtros e busca
- Formulário de criação de projeto com campos dinâmicos
- Sistema de comentários com rubrica (tópico, prioridade, @menção)
- Calendário/agendamento de reuniões

**Responsividade:** Mobile-first com adaptação para desktop.

---

## 5. Regras de Negócio

*(Parcial — em conversação, bloco ainda em aberto)*

| ID | Regra | Condição | Ação/Resultado | Módulos afetados |
|---|---|---|---|---|
| RN-01 | Projeto precisa de aprovação do Diretor | Funcionário cria projeto | Projeto não avança ao Marketing sem revisão do Diretor | M1 |
| RN-02 | Coordenador do Marketing tem palavra final | Projeto em "Em análise" | Decisão do Coordenador aprova ou retorna o projeto | M3 |
| RN-03 | Edição de projeto | ? | *Aguardando definição* | M1 |
| RN-04 | Visibilidade de comentários | ? | *Aguardando definição* | M2 |

---

## 6. Integrações

*(Aguardando definição — Bloco 6 ainda não iniciado)*

---

## 7. Modelo de Dados (Conceitual)

*(Parcial — baseado no que foi levantado até agora)*

- Projeto (id, nome, objetivo, publicoAlvo, metas, orcamentoPlanejado, verticalComandante, kpis, resultadosEsperados, status, criadoEm, criadoPor) --> N:1 --> Vertente
- Vertente (id, nome, diretorId) --> 1:N --> Projeto
- Usuario (id, nome, email, cargo, vertenteId) --> N:1 --> Vertente
- Comentario (id, projetoId, autorId, topico, descricao, prioridade, criadoEm, @mencaoId) --> N:1 --> Projeto
- Reuniao (id, projetoId, data, hora, pauta, criadoPor) --> N:1 --> Projeto
- ParticipanteReuniao (id, reuniaoId, usuarioId)
- Notificacao (id, usuarioId, tipo, mensagem, lida, criadaEm)

---

## 8. Escopo do MVP

*(Aguardando definição — Bloco 8 ainda não iniciado)*

---

## 9. Riscos e Premissas

*(Aguardando definição — Bloco 9 ainda não iniciado)*

---

## Glossário

*(Aguardando definição de termos específicos)*

---

> **Status do Discovery:** Blocos 1, 2 e 3 concluídos. Bloco 4 (Regras de Negócio) em andamento. Blocos 5 a 9 não iniciados.
> **Próximos passos:** Finalizar Regras de Negócio e prosseguir com Requisitos Não-Funcionais, Integrações, Escopo, Riscos e Glossário.
