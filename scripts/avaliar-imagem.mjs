// scripts/avaliar-imagem.mjs
// Avalia uma imagem REAL de campanha usando o MESMO "cérebro" do chatbot do site:
// reaproveita o system prompt (api/_lib/prompts.js) e as bases de conhecimento
// (api/_lib/knowledgeBase.js) exatamente como o endpoint /api/chat faz — aqui só
// acrescentamos a imagem no formato multimodal do OpenRouter.
//
// Uso:
//   node scripts/avaliar-imagem.mjs "teste da IA/Imagem teste.jpeg"
//   node scripts/avaliar-imagem.mjs "teste da IA/Imagem teste.jpeg" --out "teste da IA/avaliacao.md"
//   (--out/-o salva a avaliação no arquivo E mantém a impressão no terminal)
//
// A chave e o modelo vêm de chatbot/.env.local (o mesmo do dev-server); nada é hardcoded.
// NÃO altera o site nem o dev-server — é um utilitário isolado.

import { readFile, writeFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SYSTEM_PROMPT, GUARDRAILS } from '../api/_lib/prompts.js';
import { buildKnowledgeContext } from '../api/_lib/knowledgeBase.js';

const HERE = fileURLToPath(new URL('.', import.meta.url)); // .../scripts/
const REPO_ROOT = normalize(join(HERE, '..'));

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Mesmo default do endpoint (api/chat.js) quando OPENROUTER_MODEL não está definido.
const DEFAULT_MODEL = 'google/gemini-3-flash-preview';
const TEMPERATURE = 0.2;
const MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS) || 2048;
const TIMEOUT_MS = 60_000;

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif',
};

// Carrega chatbot/.env.local para process.env, sem sobrescrever o que já existe
// (mesma semântica do dev-server; não importamos de lá para não acoplar/alterar o site).
function loadEnvLocal() {
  const envPath = join(REPO_ROOT, 'chatbot', '.env.local');
  if (!existsSync(envPath)) return;
  try {
    for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const s = line.trim();
      if (!s || s.startsWith('#')) continue;
      const i = s.indexOf('=');
      if (i < 0) continue;
      const k = s.slice(0, i).trim();
      const v = s.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  } catch { /* ignora erros de leitura */ }
}

function die(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

// Parser simples: extrai --out <arquivo> (ou --out=<arquivo>) e os argumentos posicionais.
function parseArgs(argv) {
  const positionals = [];
  let out = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out' || a === '-o') {
      out = argv[++i]; // valor no próximo token
    } else if (a.startsWith('--out=')) {
      out = a.slice('--out='.length);
    } else {
      positionals.push(a);
    }
  }
  return { imagePath: positionals[0], out: out && out.trim() ? out.trim() : null };
}

// Instrução da tarefa (DADO do usuário). O tom "tripulante" e as regras vêm do system prompt.
const TASK_TEXT = [
  'Tripulante, avalie a peça de campanha em anexo (imagem) como uma submissão para a triagem do Marketing.',
  'Compare SOMENTE com as bases autorizadas fornecidas como referência. Estruture a resposta assim:',
  '',
  '1. Diagnóstico geral — descreva objetivamente o que é a peça.',
  '2. Avaliação por dimensão — para CADA uma, dê nota de 0 a 100 e justificativa curta:',
  '   Branding, Comunicação, Visual, Compliance, Marketing Estratégico, Inteligência Organizacional.',
  '3. Riscos — com severidade, com atenção especial a compliance, LGPD, marca, reputação e regulação.',
  '4. Recomendações práticas.',
  '5. Ação de triagem sugerida — aprovar, ajustar, bloquear ou aguardar informações.',
  '',
  'Diferencie claramente fatos, evidências, interpretações e recomendações. Se faltar informação para',
  'alguma dimensão, declare a limitação em vez de inventar. Lembre que a decisão final é humana e que',
  'esta análise não representa aprovação jurídica, regulatória ou autorização definitiva de publicação.',
].join('\n');

async function main() {
  loadEnvLocal();

  const { imagePath: arg, out: outPath } = parseArgs(process.argv.slice(2));
  if (!arg) {
    die('Informe o caminho da imagem.\n   Ex.: node scripts/avaliar-imagem.mjs "teste da IA/Imagem teste.jpeg"\n   Opcional: --out <arquivo.md> para salvar a avaliação.');
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    die('OPENROUTER_API_KEY ausente. Defina em chatbot/.env.local (ou como variável de ambiente).');
  }
  const model = (process.env.OPENROUTER_MODEL || '').trim() || DEFAULT_MODEL;

  const imgPath = resolve(process.cwd(), arg);
  if (!existsSync(imgPath)) {
    die(`Imagem não encontrada: "${arg}"\n   (resolvido para ${imgPath})\n   Confira o nome — o Linux diferencia maiúsculas/minúsculas.`);
  }

  const ext = extname(imgPath).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    die(`Extensão de imagem não suportada: "${ext}". Use JPG, PNG, WEBP ou GIF.`);
  }

  let base64;
  try {
    base64 = (await readFile(imgPath)).toString('base64');
  } catch (e) {
    die(`Não foi possível ler a imagem: ${e?.message || e}`);
  }

  // Mesmas mensagens de sistema do /api/chat: system prompt + guardrails + bases (referência).
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'system', content: GUARDRAILS },
    { role: 'system', content: buildKnowledgeContext() },
    {
      role: 'user',
      content: [
        { type: 'text', text: TASK_TEXT },
        { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } },
      ],
    },
  ];

  console.log(`\n🛫 Avaliando "${arg}" com o cérebro do ABOS…`);
  console.log(`   Modelo: ${model}\n`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let upstream;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'Azul Brand Operating System - Avaliação de Imagem',
      },
      body: JSON.stringify({ model, temperature: TEMPERATURE, max_tokens: MAX_TOKENS, messages }),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeout);
    if (e?.name === 'AbortError') die('A avaliação demorou mais que o esperado (timeout). Tente novamente.');
    die(`Falha de rede ao chamar o OpenRouter: ${e?.message || e}`);
  }
  clearTimeout(timeout);

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => '');
    die(`OpenRouter retornou erro ${upstream.status}.\n   ${detail.slice(0, 400)}`);
  }

  const data = await upstream.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    die('O modelo não retornou conteúdo. Tente novamente ou verifique se o modelo aceita imagem.');
  }

  const line = '─'.repeat(72);
  console.log(line);
  console.log(reply);
  console.log(line);
  console.log('\nℹ️  Triagem assistida por IA — a decisão final é humana.\n');

  // Salva em arquivo se --out foi informado (sem deixar de imprimir no terminal).
  if (outPath) {
    const doc = [
      '# Avaliação de triagem — imagem',
      '',
      `- **Imagem:** \`${arg}\``,
      `- **Modelo:** \`${model}\` (via OpenRouter)`,
      '- **Cérebro:** mesmo system prompt + bases do chatbot do site (Azul Brand Operating System)',
      '',
      '> Triagem assistida por IA — a decisão final é humana. Não substitui aprovação',
      '> jurídica, de compliance ou da liderança de Marketing.',
      '',
      '---',
      '',
      reply,
      '',
    ].join('\n');
    try {
      await writeFile(resolve(process.cwd(), outPath), doc, 'utf8');
      console.log(`💾 Avaliação salva em: ${outPath}\n`);
    } catch (e) {
      // Não derruba a execução: a avaliação já foi impressa acima.
      console.error(`⚠️  Não foi possível salvar em "${outPath}": ${e?.message || e}\n`);
    }
  }
}

main().catch((e) => die(`Erro inesperado: ${e?.message || e}`));
