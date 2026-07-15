// api/chat.js
// Função serverless (Vercel) do agente de triagem do Azul Brand Operating System.
// Fluxo: valida -> rate limit -> recalcula status/score canônicos -> monta
// mensagens (system prompt + contexto como DADOS + histórico) -> OpenRouter.
//
// Segurança:
// - O system prompt é adicionado somente aqui (o cliente nunca envia "system").
// - A avaliação recebida é tratada como DADO (defesa contra prompt injection).
// - Score/status são recalculados de forma determinística no backend.
// - Erros nunca expõem chaves, prompts internos ou detalhes técnicos.

import { SYSTEM_PROMPT, GUARDRAILS, buildEvaluationContext } from './_lib/prompts.js';
import { validateChatRequest } from './_lib/validation.js';
import { rateLimit } from './_lib/rateLimit.js';
import { evaluate } from './_lib/scoring.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-3-flash-preview';
const TEMPERATURE = 0.2; // baixa, para consistência
// Limita o tamanho da resposta: evita reservar o máximo do modelo (e estourar crédito),
// e mantém as respostas de triagem concisas. Configurável via OPENROUTER_MAX_TOKENS.
const MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS) || 1024;

export default async function handler(req, res) {
  // 1) Apenas POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    // 2) Rate limiting simples por IP
    const ip = getClientIp(req);
    const rl = rateLimit(ip);
    if (!rl.allowed) {
      res.setHeader('Retry-After', String(rl.retryAfter));
      return res.status(429).json({ error: 'Muitas solicitações em pouco tempo. Aguarde alguns instantes e tente novamente.' });
    }

    // 3) Corpo da requisição
    const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;

    // 4) Validação/sanitização
    const v = validateChatRequest(body);
    if (!v.ok) {
      return res.status(400).json({ error: v.error });
    }
    const { messages, projectEvaluation } = v.data;

    // 5) Recalcula status/score CANÔNICOS no backend (não confia no cliente)
    let canonical = null;
    if (projectEvaluation && projectEvaluation.dimensions) {
      canonical = evaluate({
        dimensions: projectEvaluation.dimensions,
        risks: projectEvaluation.risks || [],
        missingInformation: projectEvaluation.missingInformation || [],
        riskLevel: projectEvaluation.riskLevel || '',
        insufficientData: String(projectEvaluation.status || '').toLowerCase() === 'awaiting',
      });
    }

    // 6) Chave e modelo via variáveis de ambiente
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;
    if (!apiKey) {
      // Log sem vazar segredos; resposta genérica ao cliente.
      console.error('[api/chat] OPENROUTER_API_KEY ausente no ambiente.');
      return res.status(500).json({ error: 'Serviço de avaliação temporariamente indisponível.' });
    }

    // 7) Monta as mensagens (system sempre primeiro; projeto sempre como dado)
    const payloadMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: GUARDRAILS },
      { role: 'system', content: buildEvaluationContext(projectEvaluation, canonical) },
      ...messages,
    ];

    // 8) Chamada ao OpenRouter (Gemini Flash)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let upstream;
    try {
      upstream = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-Title': 'Azul Brand Operating System - Triagem',
        },
        body: JSON.stringify({
          model,
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
          messages: payloadMessages,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('[api/chat] OpenRouter erro', upstream.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Não foi possível concluir a avaliação agora. Tente novamente em instantes.' });
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(200).json({ reply: 'Tripulante, não consegui gerar uma resposta agora. Pode reformular a pergunta ou tentar novamente?' });
    }

    // 9) Resposta ao frontend (inclui status/score canônicos como referência)
    return res.status(200).json({
      reply,
      canonical: canonical || undefined,
    });
  } catch (err) {
    // Não expõe stack/detalhes ao cliente.
    console.error('[api/chat] erro inesperado:', err?.name, err?.message);
    const msg = err?.name === 'AbortError'
      ? 'A avaliação demorou mais que o esperado. Tente novamente.'
      : 'Ocorreu um erro ao processar sua solicitação.';
    return res.status(500).json({ error: msg });
  }
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}
