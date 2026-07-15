// Testes da função determinística de score/status (domínio da triagem).
// Executar: npm test   (usa o test runner nativo do Node — sem dependências)
//
// A chamada ao OpenRouter NÃO entra aqui: o score é uma função PURA (não chama rede).
// O teste do endpoint /api/chat com o OpenRouter mockado está descrito em docs/TESTING.md.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, computeOverallScore, STATUS } from '../api/_lib/scoring.js';

// Atalho para montar as 6 dimensões.
const dims = (b, c, v, co, sm, oi) => ({
  branding: { score: b }, communication: { score: c }, visual: { score: v },
  compliance: { score: co }, strategicMarketing: { score: sm }, organizationalIntelligence: { score: oi },
});

test('média com pesos iguais das 6 dimensões', () => {
  assert.equal(computeOverallScore(dims(90, 75, 80, 85, 80, 94)), 84);
});

test('100 em todas e sem riscos => approved', () => {
  const r = evaluate({ dimensions: dims(100, 100, 100, 100, 100, 100) });
  assert.equal(r.status, STATUS.APPROVED);
  assert.equal(r.overallScore, 100);
});

test('média entre 70 e 99 => adjust', () => {
  assert.equal(evaluate({ dimensions: dims(90, 75, 80, 85, 80, 94) }).status, STATUS.ADJUST);
});

test('média abaixo de 70 => blocked', () => {
  assert.equal(evaluate({ dimensions: dims(80, 75, 70, 40, 60, 65), risks: [{ severity: 'high' }] }).status, STATUS.BLOCKED);
});

test('risco crítico => preventive, independentemente da média', () => {
  assert.equal(evaluate({ dimensions: dims(100, 100, 100, 100, 100, 100), risks: [{ critical: true }] }).status, STATUS.PREVENTIVE_BLOCK);
});

test('informações ausentes => awaiting', () => {
  assert.equal(evaluate({ dimensions: dims(90, 75, 80, 85, 80, 94), missingInformation: ['arte'] }).status, STATUS.AWAITING);
});

test('dimensão sem nota (null) => awaiting e score null (não conta como zero)', () => {
  const r = evaluate({ dimensions: { ...dims(90, 75, 80, 85, 80, 94), visual: { score: null } } });
  assert.equal(r.status, STATUS.AWAITING);
  assert.equal(r.overallScore, null);
});
