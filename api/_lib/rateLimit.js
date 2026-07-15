// lib/rateLimit.js
// Rate limiting simples por IP, com janela deslizante em memória.
//
// OBS.: em ambientes serverless (Vercel) a memória é por instância e efêmera,
// então este limite é "best-effort" (mitiga abuso básico). Para um limite
// rígido e distribuído, use um armazenamento compartilhado (ex.: Upstash/Redis).

const WINDOW_MS = 60_000; // 1 minuto
const MAX_REQUESTS = 20;  // por IP, por janela

/** ip -> array de timestamps (ms) dentro da janela */
const buckets = new Map();

/**
 * @param {string} ip
 * @param {{windowMs?:number, max?:number}} [opts]
 * @returns {{ allowed:boolean, remaining:number, retryAfter:number }}
 */
export function rateLimit(ip, opts = {}) {
  const windowMs = opts.windowMs ?? WINDOW_MS;
  const max = opts.max ?? MAX_REQUESTS;
  const key = ip || 'unknown';
  const now = Date.now();

  const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);

  if (recent.length >= max) {
    const retryAfter = Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000));
    buckets.set(key, recent);
    return { allowed: false, remaining: 0, retryAfter };
  }

  recent.push(now);
  buckets.set(key, recent);

  // Limpeza oportunista para evitar crescimento indefinido do Map.
  if (buckets.size > 5000) {
    for (const [k, arr] of buckets) {
      const alive = arr.filter((t) => now - t < windowMs);
      if (alive.length === 0) buckets.delete(k);
      else buckets.set(k, alive);
    }
  }

  return { allowed: true, remaining: max - recent.length, retryAfter: 0 };
}
