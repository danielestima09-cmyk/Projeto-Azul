// lib/scoring.js
// Cálculo determinístico do score geral e definição do status da triagem.
// IMPORTANTE: o modelo de IA NÃO calcula o resultado final — ele gera notas,
// justificativas, evidências, riscos e recomendações. Este módulo é a fonte
// da verdade para score e status.

export const DIMENSIONS = [
  'branding',
  'communication',
  'visual',
  'compliance',
  'strategicMarketing',
  'organizationalIntelligence',
];

// Inicialmente todas as dimensões têm o mesmo peso.
export const WEIGHTS = DIMENSIONS.reduce((acc, d) => {
  acc[d] = 1 / DIMENSIONS.length;
  return acc;
}, {});

export const STATUS = {
  APPROVED: 'approved',           // 100% — apto para encaminhamento
  ADJUST: 'adjust',               // 70–99% — ajustes necessários
  BLOCKED: 'blocked',             // < 70% — reestruturação necessária
  PREVENTIVE_BLOCK: 'preventive', // risco crítico — revisão especializada obrigatória
  AWAITING: 'awaiting',           // dados insuficientes — aguardando complementação
};

export const STATUS_META = {
  [STATUS.APPROVED]:        { label: 'Aprovado para encaminhamento ao marketing' },
  [STATUS.ADJUST]:          { label: 'Ajustes necessários' },
  [STATUS.BLOCKED]:         { label: 'Bloqueado para publicação — reestruturação necessária' },
  [STATUS.PREVENTIVE_BLOCK]:{ label: 'Bloqueado preventivamente — revisão especializada obrigatória' },
  [STATUS.AWAITING]:        { label: 'Aguardando complementação' },
};

/** Converte um valor em nota válida (0–100) ou null se ausente/inválido.
 *  Atenção: null/undefined/'' significam "sem nota" (não zero). */
function toScore(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, n));
}

/**
 * Média (com pesos iguais) das seis dimensões. Arredondada ao inteiro.
 * Retorna null se faltar a nota de qualquer dimensão obrigatória.
 * @param {Record<string,{score:number}>} dimensions
 */
export function computeOverallScore(dimensions) {
  if (!dimensions || typeof dimensions !== 'object') return null;
  let sum = 0;
  for (const dim of DIMENSIONS) {
    const s = toScore(dimensions[dim]?.score);
    if (s === null) return null; // dimensão ausente => não há nota confiável
    sum += s * WEIGHTS[dim];
  }
  return Math.round(sum);
}

/** Existe risco crítico? (flag explícita, nível de risco ou severidade do item) */
function hasCriticalRisk({ risks = [], criticalRisk = false, riskLevel = '' } = {}) {
  if (criticalRisk === true) return true;
  if (String(riskLevel).toLowerCase() === 'critical') return true;
  return (Array.isArray(risks) ? risks : []).some(
    (r) => r && (r.critical === true || String(r.severity || '').toLowerCase() === 'critical')
  );
}

/**
 * Decide status e score de forma determinística, seguindo as regras do ABOS.
 * Ordem de precedência: risco crítico > dados insuficientes > faixas de score.
 *
 * @param {object} input
 * @param {Record<string,{score:number}>} input.dimensions
 * @param {Array} [input.risks]
 * @param {Array} [input.missingInformation]
 * @param {boolean} [input.criticalRisk]
 * @param {boolean} [input.insufficientData]
 * @param {string}  [input.riskLevel]
 * @returns {{ overallScore:number|null, status:string, statusLabel:string }}
 */
export function evaluate(input = {}) {
  const {
    dimensions,
    risks = [],
    missingInformation = [],
    insufficientData = false,
  } = input;

  const overallScore = computeOverallScore(dimensions);

  // 1) Bloqueio preventivo por risco crítico — independe da média.
  if (hasCriticalRisk(input)) {
    return withLabel(overallScore, STATUS.PREVENTIVE_BLOCK);
  }

  // 2) Dados insuficientes — não atribui nota definitiva.
  const missingBlocks = Array.isArray(missingInformation) && missingInformation.length > 0;
  if (insufficientData || overallScore === null || missingBlocks) {
    return withLabel(overallScore, STATUS.AWAITING);
  }

  // 3) 100% exige nota máxima em todas as dimensões e nenhum risco pendente.
  const allMax = DIMENSIONS.every((d) => toScore(dimensions[d]?.score) === 100);
  const noRisks = (Array.isArray(risks) ? risks : []).length === 0;
  if (allMax && noRisks) {
    return withLabel(100, STATUS.APPROVED);
  }

  // 4) Faixas de score.
  if (overallScore >= 70) return withLabel(overallScore, STATUS.ADJUST);
  return withLabel(overallScore, STATUS.BLOCKED);
}

function withLabel(overallScore, status) {
  return { overallScore, status, statusLabel: STATUS_META[status]?.label || status };
}
