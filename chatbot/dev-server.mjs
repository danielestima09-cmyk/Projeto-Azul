// dev-server.mjs — servidor local para testar o chatbot com o modelo REAL (Gemini via OpenRouter).
// Sem dependências. Serve o protótipo e responde POST /api/chat usando a função serverless real.
//
// Uso:
//   export OPENROUTER_API_KEY=sua_chave
//   export OPENROUTER_MODEL=google/gemini-3-flash-preview   # opcional
//   node chatbot/dev-server.mjs
//   -> abra http://localhost:3000/prototipos/base.html
//
// Sem a chave definida, o /api/chat responde erro e o protótipo cai para a simulação offline.

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import handler from '../api/chat.js';

const HERE = fileURLToPath(new URL('.', import.meta.url));      // .../chatbot/
const ROOT = normalize(join(HERE, '..'));                       // raiz do repo

// Carrega chatbot/.env.local (se existir) para process.env — sem sobrescrever o que já está definido.
// Assim a chave pode ficar num arquivo local (ignorado pelo git) em vez de ir no comando.
(function loadEnvLocal() {
  const envPath = join(HERE, '.env.local');
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
    console.log('   (variáveis lidas de chatbot/.env.local)');
  } catch { /* ignora erros de leitura */ }
})();

const PORT = process.env.PORT || 3000;
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const path = req.url.split('?')[0];

  // --- API do chatbot ---
  if (path === '/api/chat') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', async () => {
      req.body = body;
      const shim = {
        setHeader: (k, v) => res.setHeader(k, v),
        status(code) { res.statusCode = code; return this; },
        json(obj) { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(obj)); return this; },
      };
      try { await handler(req, shim); }
      catch (e) { res.statusCode = 500; res.end(JSON.stringify({ error: 'Erro interno.' })); }
    });
    return;
  }

  // --- Arquivos estáticos ---
  (async () => {
    try {
      let p = decodeURIComponent(path);
      if (p === '/' || p === '') p = '/prototipos/base.html';
      const filePath = normalize(join(ROOT, p));
      if (!filePath.startsWith(ROOT)) { res.statusCode = 403; return res.end('403'); }
      const data = await readFile(filePath);
      res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream');
      res.end(data);
    } catch {
      res.statusCode = 404; res.end('404 — arquivo não encontrado');
    }
  })();
});

server.listen(PORT, () => {
  console.log(`\n🛫 ABOS dev server: http://localhost:${PORT}`);
  console.log(`   Protótipo:  http://localhost:${PORT}/prototipos/base.html`);
  console.log(`   Chatbot API: POST http://localhost:${PORT}/api/chat`);
  console.log(`   Modelo: ${process.env.OPENROUTER_MODEL || 'google/gemini-3-flash-preview'}`);
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('\n   ⚠️  OPENROUTER_API_KEY não definida — o chatbot usará a SIMULAÇÃO offline.');
    console.log('      Defina a chave para respostas reais do modelo:');
    console.log('      export OPENROUTER_API_KEY=sua_chave\n');
  } else {
    console.log('   ✅ Chave detectada — respostas reais do modelo ativas.\n');
  }
});
