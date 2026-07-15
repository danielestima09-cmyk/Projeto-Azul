// lib/validation.js
// Validação e sanitização das requisições recebidas pelo /api/chat.
// Objetivos: limitar quantidade/tamanho de mensagens, aceitar apenas papéis
// seguros do cliente (user/assistant) e nunca deixar o cliente injetar
// mensagens "system" (o system prompt é adicionado apenas no backend).

export const LIMITS = {
  MAX_MESSAGES: 20,        // mensagens do histórico enviadas pelo cliente
  MAX_MESSAGE_CHARS: 4000, // por mensagem
  MAX_TOTAL_CHARS: 24000,  // soma de todas as mensagens
};

const ALLOWED_ROLES = new Set(['user', 'assistant']);

/**
 * @param {any} body
 * @returns {{ ok:true, data:{messages:Array, projectEvaluation:object|null} } | { ok:false, error:string }}
 */
export function validateChatRequest(body) {
  if (!body || typeof body !== 'object') {
    return fail('Requisição inválida.');
  }

  const { messages, projectEvaluation } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return fail('É necessário enviar ao menos uma mensagem.');
  }
  if (messages.length > LIMITS.MAX_MESSAGES) {
    return fail('Muitas mensagens na conversa. Reinicie o chat e tente novamente.');
  }

  const clean = [];
  let total = 0;

  for (const m of messages) {
    if (!m || typeof m !== 'object') return fail('Formato de mensagem inválido.');
    const role = String(m.role || '').toLowerCase();
    const content = typeof m.content === 'string' ? m.content.trim() : '';

    // Descarta silenciosamente papéis não permitidos (ex.: "system" vindo do cliente).
    if (!ALLOWED_ROLES.has(role)) continue;
    if (!content) continue;

    if (content.length > LIMITS.MAX_MESSAGE_CHARS) {
      return fail('Uma das mensagens excede o tamanho máximo permitido.');
    }
    total += content.length;
    if (total > LIMITS.MAX_TOTAL_CHARS) {
      return fail('O conteúdo total da conversa excede o limite permitido.');
    }
    clean.push({ role, content });
  }

  if (clean.length === 0) {
    return fail('Nenhuma mensagem válida foi encontrada.');
  }
  // A última mensagem precisa ser do tripulante (usuário).
  if (clean[clean.length - 1].role !== 'user') {
    return fail('A última mensagem deve ser do tripulante.');
  }

  return { ok: true, data: { messages: clean, projectEvaluation: sanitizeEvaluation(projectEvaluation) } };
}

/** Mantém apenas campos esperados da avaliação; ignora o resto. */
function sanitizeEvaluation(ev) {
  if (!ev || typeof ev !== 'object') return null;
  const pick = (v) => (v === undefined ? undefined : v);
  return {
    projectName: typeof ev.projectName === 'string' ? ev.projectName.slice(0, 300) : undefined,
    overallScore: Number.isFinite(Number(ev.overallScore)) ? Number(ev.overallScore) : undefined,
    status: typeof ev.status === 'string' ? ev.status.slice(0, 60) : undefined,
    riskLevel: typeof ev.riskLevel === 'string' ? ev.riskLevel.slice(0, 40) : undefined,
    dimensions: pick(ev.dimensions),
    recommendations: Array.isArray(ev.recommendations) ? ev.recommendations.slice(0, 50) : undefined,
    risks: Array.isArray(ev.risks) ? ev.risks.slice(0, 50) : undefined,
    missingInformation: Array.isArray(ev.missingInformation) ? ev.missingInformation.slice(0, 50) : undefined,
    sourcesUsed: Array.isArray(ev.sourcesUsed) ? ev.sourcesUsed.slice(0, 50) : undefined,
    conflicts: Array.isArray(ev.conflicts) ? ev.conflicts.slice(0, 50) : undefined,
  };
}

function fail(error) {
  return { ok: false, error };
}
