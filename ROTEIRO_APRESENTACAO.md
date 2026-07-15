# 🎤 Roteiro de Apresentação — Projeto Azul

> **Para quê serve este documento:** te guiar, passo a passo, a apresentar ao grupo tudo que já
> construímos — de um jeito que **todos entendam e aprendam**, tanto quem vai para a área de
> **tecnologia** quanto quem vai para **negócios (business)**.
>
> **Duração sugerida:** 30 a 40 minutos (20 de explicação + 10 de demonstração + 10 de decisões).
> **Formato:** conversa. Faça perguntas ao grupo, não só fale. Aprender junto é o objetivo.

---

## 🧭 Como usar este roteiro

- Cada etapa tem: **o que dizer**, **o conceito que se aprende**, e dois ganchos: 💻 (tecnologia) e 📊 (negócios).
- Os símbolos ajudam você a olhar para a pessoa certa na hora certa — mas **todos ouvem tudo**. A graça é o pessoal de tech entender de negócio e vice-versa.
- Onde diz **[MOSTRAR]**, abra o arquivo ou o protótipo no telão.
- Não precisa decorar. Fale com suas palavras. Este é um mapa, não um script rígido.

---

## 1. Abertura — comece pelo problema (3 min)

**O que dizer:**
> "Antes de qualquer tela ou código, a gente começou por uma pergunta: **que problema estamos resolvendo?**
> Imaginem a Azul, a companhia aérea. Os departamentos dela (que a gente chama de *vertentes*) criavam
> projetos sozinhos e só no final chamavam o Marketing. Aí o Marketing recebia tudo pronto — mas
> inadequado — e tinha que **refazer**. Isso é retrabalho: tempo e dinheiro jogados fora.
> Nosso sistema resolve isso trazendo o Marketing para dentro desde o começo."

**💡 Conceito que se aprende:** todo bom projeto de software **nasce de uma dor real**, não de uma ideia de tela.

- 💻 **Tech:** "a gente não começou escrevendo código — começou entendendo o problema. Código é a última etapa."
- 📊 **Business:** "isso se chama *dor do cliente*. Se você não sabe a dor, você constrói algo que ninguém usa."

**Pergunta para o grupo:** "Vocês já usaram algum app que claramente não resolvia o problema de vocês? Por quê será que isso acontece?"

---

## 2. A jornada que percorremos (2 min) — o mapa

**O que dizer:**
> "A gente seguiu as etapas que profissionais de verdade seguem. Pensa numa construção: ninguém
> levanta a parede antes da planta. No software é igual."

Desenhe/mostre esta sequência (é o coração do aprendizado):

```
1. DISCOVERY        → entender o problema e quem usa
2. ESPEC. FUNCIONAL → decidir O QUE o sistema faz
3. PESQUISA         → aprender com o mercado e enriquecer a ideia
4. PROTÓTIPO        → ver e "tocar" antes de construir
5. ESPEC. TÉCNICA   → decidir COMO vamos construir   (faremos hoje/depois)
6. DESENVOLVIMENTO  → construir de verdade            (próxima fase)
```

**💡 Conceito:** separar **"o que"** (funcional) de **"como"** (técnico) evita retrabalho — a mesma dor da Azul, agora na nossa própria equipe!

---

## 3. Etapa 1 — Discovery: entender antes de construir (4 min)

**[MOSTRAR]** `DISCOVERY.md`

**O que dizer:**
> "Aqui a gente respondeu: qual o problema, quem são as pessoas que usam, e o que elas precisam fazer.
> Repare que definimos os **tipos de usuário** — chamamos de *personas*."

Mostre as personas (Funcionário, Diretor, Marketing, Coordenador — e o Administrador do sistema) e explique com uma frase cada.

**💡 Conceito: persona.** É um "personagem" que representa um tipo de usuário real, com o que ele pode e não pode fazer.

- 💻 **Tech:** "cada persona vai virar um *nível de permissão* no sistema — quem pode aprovar, quem só comenta."
- 📊 **Business:** "personas ajudam a desenhar o produto para gente real, não para um usuário genérico."

**Pergunta:** "Se vocês fossem o *Coordenador de Marketing* da Azul, o que gostariam de ver ao abrir o app?"

---

## 4. Etapa 2 — Especificação Funcional: o "o quê" (5 min)

**[MOSTRAR]** `ESPECIFICACAO_FUNCIONAL_BASE.md`

**O que dizer:**
> "Depois de entender, a gente detalhou **o que** o sistema faz. Duas coisas valem a pena mostrar:
> o **ciclo de vida** do projeto e as **regras de negócio**."

**a) Ciclo de vida (a esteira):**
> "Um projeto passa por etapas: Rascunho → Revisão do Diretor → Análise do Marketing → Aprovado →
> Divulgação → Concluído. Cada etapa tem um responsável."

**💡 Conceito: máquina de estados.** É a ideia de que algo só pode ir de um passo para outro seguindo regras (um projeto não "pula" da criação direto para aprovado).

**b) Regras de negócio:**
> "São as leis do sistema. Ex.: *RN-01 — um projeto só vai ao Marketing depois que o Diretor aprova.*"

- 💻 **Tech:** "regras de negócio viram *validações* no código — o sistema impede o que não pode acontecer."
- 📊 **Business:** "são as políticas da empresa transformadas em regras claras. Sem elas, cada um faz de um jeito."

**Pergunta:** "Que outra regra vocês criariam? Por exemplo: um projeto pode ser editado depois de enviado?"
(É uma decisão real que tomamos — RN-03!)

---

## 5. Etapa 3 — Pesquisa e enriquecimento: aprender com o mundo (5 min)

**[MOSTRAR]** a Parte 2 do `RESUMO_SESSAO_NEGOCIOS.md` (tabela E1–E10)

**O que dizer:**
> "A gente não inventou tudo do zero. Pesquisamos como as **melhores ferramentas do mundo**
> (Asana, Wrike, Adobe Workfront, e ferramentas de aprovação de arte como o Ziflow) resolvem isso.
> E descobrimos coisas que deixam nosso projeto muito melhor — listamos como ideias **E1 a E10**."

Dê 2 ou 3 exemplos concretos e fáceis:
- **E1 — formulário inteligente:** o formulário muda conforme o tipo de campanha (rota, promoção…).
- **E2 — comentar em cima da arte:** em vez de "muda o título", você aponta *exatamente* onde na imagem.
- **E5 — painel de retrabalho:** um gráfico que **prova** que estamos reduzindo a dor da Azul.

**💡 Conceito: benchmarking.** Olhar o que já existe e funciona antes de reinventar a roda.

- 💻 **Tech:** "aprender padrões que o mercado já validou economiza tempo e evita erros conhecidos."
- 📊 **Business:** "é pesquisa de mercado. Mostra que a solução tem embasamento, não é só achismo."

**Pergunta:** "Qual dessas ideias vocês acham que a Azul mais valorizaria? Por quê?"
(Guardem as respostas — vão ajudar na decisão do fim!)

---

## 6. Etapa 4 — Protótipos: ver antes de construir (8 min) ⭐ o momento mais legal

**[MOSTRAR AO VIVO]** abra `prototipos/index.html` e navegue.

**O que dizer:**
> "Antes de escrever o sistema de verdade, a gente construiu um **protótipo**: uma maquete que
> funciona e dá pra navegar, mas com dados de mentirinha. Serve pra todo mundo 'sentir' o produto e
> dar opinião **antes** de gastar semanas programando."

**Roteiro da demonstração (faça nesta ordem):**
1. Mostre a tela inicial e as **duas versões**: Base e Enriquecida.
2. Abra a **Base**. No topo direito, use o **seletor de persona**:
   - Entre como **Funcionário** → mostre "Criar projeto".
   - Troque para **Diretor** → aparece "Aprovar / Devolver".
   - Troque para **Coordenador de Marketing** → aparece o **Dashboard** consolidado com gráficos.
   - **Destaque:** "reparem que a tela MUDA conforme quem entra. Isso são as *permissões* que definimos lá no Discovery! O Dashboard, por exemplo, aparece só para o Coordenador e os Diretores."
3. Abra um projeto e mostre as abas (comentários, anexos, histórico).
4. Agora abra a **Enriquecida** e mostre o diferencial:
   - A aba **Revisão da Arte** (E2) — clique num marcador na imagem.
   - A seção **Prazos & SLA** (E4) — os alertas de atraso.
   - O **Dashboard** com a **taxa de retrabalho** (E5).

**💡 Conceito: protótipo (ou MVP visual).** Testar a ideia barato e rápido, antes do investimento grande.

- 💻 **Tech:** "isso é feito com HTML, CSS e JavaScript — as três linguagens base de qualquer site."
- 📊 **Business:** "é como uma maquete de imóvel: o cliente aprova a planta antes de a obra começar."

**Pergunta:** "Navegando aqui, o que vocês mudariam? Toda opinião agora vale ouro — mudar aqui é barato, mudar depois de pronto é caro."

---

## 7. Etapa 5 e 6 — O que vem depois (2 min)

**O que dizer:**
> "Faltam duas etapas. A **especificação técnica** — onde decidimos COMO construir (quais tecnologias,
> como organizar) — e o **desenvolvimento**, que é construir o sistema de verdade. E tem uma parte
> muito legal: a gente vai construir usando **inteligência artificial como parceira de programação**
> (o Claude Code), que ajuda a escrever e organizar o código."

**💡 Conceito: arquitetura de software.** É a "planta elétrica e hidráulica" do sistema — decidir a estrutura antes de construir para não dar problema depois.

---

## 8. 🗳️ As decisões que precisamos tomar JUNTOS (5 min)

**O que dizer:**
> "Agora é com todo mundo. Nada aqui é decisão de uma pessoa só — vamos decidir em grupo."

Coloque na mesa (estão no `RESUMO_SESSAO_NEGOCIOS.md`):
1. **Qual protótipo seguimos** — a Versão **Base** ou a **Enriquecida** (ou base + algumas ideias E1–E10)?
2. **Quais ideias E1–E10 entram** agora, ficam para depois, ou saem?
3. **Qual é a nossa meta de sucesso?** (ex.: mostrar redução de retrabalho)
4. Alguma preocupação de **tecnologia ou privacidade** que devemos considerar?

**Dica de facilitação:** para cada ideia E1–E10, pergunte "entra, depois ou não?" e conte os votos.
Deixe tanto o pessoal de tech quanto o de business justificar — as razões são diferentes e **as duas importam**.

---

## 9. 📖 Glossário rápido (deixe visível durante a apresentação)

| Termo | Em palavras simples |
|---|---|
| **Discovery** | Fase de entender o problema e quem usa, antes de construir |
| **Persona** | Um "personagem" que representa um tipo de usuário |
| **Especificação funcional** | Documento que diz **o que** o sistema faz |
| **Especificação técnica** | Documento que diz **como** o sistema é construído |
| **Regra de negócio** | Uma "lei" do sistema (o que pode e o que não pode) |
| **Ciclo de vida / máquina de estados** | As etapas por onde um projeto passa, em ordem |
| **MVP** | Primeira versão, com o essencial para já ter valor |
| **Protótipo** | Maquete navegável, com dados de mentira, para testar a ideia |
| **Retrabalho** | Ter que refazer algo — o desperdício que queremos evitar |
| **Benchmarking** | Aprender com quem já faz bem |
| **Arquitetura** | A estrutura/planta de como o software é organizado |

---

## 10. Encerramento (1 min)

**O que dizer:**
> "Resumindo a nossa jornada: **entendemos o problema → decidimos o que fazer → pesquisamos para
> melhorar → construímos uma maquete navegável.** Agora vamos decidir juntos os detalhes e partir para
> a construção. O mais importante: cada etapa dessas é uma habilidade que a gente leva pra vida —
> seja pra quem vai de tecnologia, seja pra quem vai de negócios."

**Frase de efeito para fechar:**
> "A gente não está só fazendo um trabalho de faculdade. A gente está praticando exatamente como
> produtos de verdade nascem no mercado."

---

### ✅ Checklist antes de apresentar
- [ ] Testar a abertura dos protótipos no telão (abrir `prototipos/index.html`).
- [ ] Deixar os arquivos abertos em abas: `DISCOVERY.md`, `ESPECIFICACAO_FUNCIONAL_BASE.md`, `RESUMO_SESSAO_NEGOCIOS.md`.
- [ ] Treinar a troca de persona no protótipo (é o momento que mais impressiona).
- [ ] Levar as perguntas da seção 8 para decidir em grupo.
