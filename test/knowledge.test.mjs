// Testes da camada de BASES DE CONHECIMENTO (carregamento + injeção no /api/chat).
// Executar: npm test   (runner nativo do Node — sem dependências).
//
// A chamada externa ao OpenRouter é MOCKADA (globalThis.fetch), então o teste
// não faz rede: só verifica que as bases são carregadas e injetadas no contexto.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  KNOWLEDGE_BASES,
  loadKnowledgeBases,
  buildKnowledgeContext,
} from '../api/_lib/knowledgeBase.js';
import handler from '../api/chat.js';

// ---- Helpers de fixture (raiz temporária com domain/bases/) ----
function makeRoot({ corp = 'conteúdo corporativo', banco = 'conteúdo banco' } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'kb-'));
  mkdirSync(join(root, 'domain', 'bases'), { recursive: true });
  writeFileSync(join(root, 'domain', 'bases', 'base-corporativa.md'), corp);
  writeFileSync(join(root, 'domain', 'bases', 'banco-de-dados.md'), banco);
  return root;
}

// ---- 1) Mapeamento documentado base → dimensões ----
test('mapeamento documentado: base-corporativa e banco-de-dados', () => {
  const corp = KNOWLEDGE_BASES.find((b) => b.id === 'base-corporativa');
  const banco = KNOWLEDGE_BASES.find((b) => b.id === 'banco-de-dados');
  assert.deepEqual(corp.dimensions, ['Branding', 'Comunicação', 'Visual', 'Compliance']);
  assert.deepEqual(banco.dimensions, ['Marketing Estratégico', 'Inteligência Organizacional']);
});

// ---- 2) Bases reais do repositório carregam com conteúdo ----
test('carrega as bases reais do repositório (disponíveis e não vazias)', () => {
  const bases = loadKnowledgeBases();
  for (const b of bases) {
    assert.equal(b.available, true, `${b.id} deve estar disponível`);
    assert.ok(b.content.length > 0, `${b.id} deve ter conteúdo`);
  }
});

// ---- 3) Base ausente/vazia => indisponível e declara a limitação ----
test('base vazia => indisponível e o contexto declara a limitação', () => {
  const root = makeRoot({ corp: 'Manual de teste', banco: '   \n  \t ' }); // banco só espaços
  try {
    const banco = loadKnowledgeBases({ rootDir: root }).find((b) => b.id === 'banco-de-dados');
    assert.equal(banco.available, false, 'banco-de-dados vazio deve ficar indisponível');

    const ctx = buildKnowledgeContext({ rootDir: root });
    assert.match(ctx, /BASE INDISPONÍVEL: "Banco de Dados/);
    assert.match(ctx, /Marketing Estratégico e Inteligência Organizacional/);
    assert.match(ctx, /NÃO invente dados/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ---- 4) Cache por mtime: relê somente quando o arquivo muda ----
test('cache por mtime: reflete a edição do arquivo', () => {
  const root = makeRoot({ corp: 'Versão 1', banco: 'x' });
  const f = join(root, 'domain', 'bases', 'base-corporativa.md');
  try {
    let corp = loadKnowledgeBases({ rootDir: root }).find((b) => b.id === 'base-corporativa');
    assert.match(corp.content, /Versão 1/);

    writeFileSync(f, 'Versão 2');
    const future = new Date(Date.now() + 2000); // garante mtime distinto
    utimesSync(f, future, future);

    corp = loadKnowledgeBases({ rootDir: root }).find((b) => b.id === 'base-corporativa');
    assert.match(corp.content, /Versão 2/, 'deve reler após mudança de mtime');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

// ---- 5) As bases são INJETADAS na chamada ao OpenRouter (fetch mockado) ----
test('bases carregadas e injetadas no contexto do /api/chat (chamada externa mockada)', async () => {
  const origFetch = globalThis.fetch;
  const origKey = process.env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_API_KEY = 'test-key';

  let captured = null;
  globalThis.fetch = async (_url, opts) => {
    captured = JSON.parse(opts.body);
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ok, tripulante.' } }] }),
      text: async () => '',
    };
  };

  try {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '203.0.113.7' }, // IP único p/ não esbarrar no rate limit
      socket: { remoteAddress: '203.0.113.7' },
      body: { messages: [{ role: 'user', content: 'Avalie o projeto submetido.' }] },
    };
    let statusCode = 0;
    const res = {
      setHeader() {},
      status(c) { statusCode = c; return this; },
      json() { return this; },
    };

    await handler(req, res);

    assert.equal(statusCode, 200, 'endpoint deve responder 200');
    assert.ok(captured && Array.isArray(captured.messages), 'o fetch deve receber messages');

    const systemBlob = captured.messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n');

    // Carregadas: âncoras reais das duas bases
    assert.match(systemBlob, /Manual de Marca/, 'conteúdo de base-corporativa deve estar injetado');
    assert.match(systemBlob, /AZUL MARCA MÃE/, 'conteúdo de banco-de-dados deve estar injetado');
    // Injetadas como referência + mapeamento documentado
    assert.match(systemBlob, /MATERIAL DE REFERÊNCIA AUTORIZADO/);
    assert.match(systemBlob, /→ Branding, Comunicação, Visual, Compliance/);
    assert.match(systemBlob, /→ Marketing Estratégico, Inteligência Organizacional/);
  } finally {
    globalThis.fetch = origFetch;
    if (origKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = origKey;
  }
});
