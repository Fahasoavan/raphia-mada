import { storageMode, redisCommandPublic } from "./quoteStore";

/**
 * Limiteur de débit — trop de requêtes ou payloads abusifs doivent être rejetés tôt.
 *
 * - Prod (Redis) : compteur INCR + EXPIRE par clé et par fenêtre → atomique, partagé
 *   entre les instances serverless de Vercel.
 * - Dev (fichier) : compteur en mémoire de process (best effort, mono-instance).
 * Les clés incluent l'IP client et le « canal » (quote / admin-login).
 */
export interface ClientMap {
  [key: string]: { count: number; firstAt: number };
}

const memory = new Map<string, { count: number; firstAt: number }>();

function clientKey(channel: string, windowMs: number, ip: string): string {
  const windowIndex = Math.floor(Date.now() / windowMs);
  return `${channel}:${ip}:${windowIndex}`;
}

export async function rateLimit(
  channel: string,
  ip: string,
  limit: number,
  windowMs: number
): Promise<{ ok: boolean; retryAfterSec: number }> {
  const key = clientKey(channel, windowMs, ip);

  if (storageMode === "redis") {
    try {
      const count = Number(await redisCommandPublic(["INCR", `raphia:rl:${key}`]));
      if (count === 1) await redisCommandPublic(["EXPIRE", `raphia:rl:${key}`, Math.ceil(windowMs / 1000)]);
      if (count > limit) {
        return { ok: false, retryAfterSec: Math.ceil((windowMs - (Date.now() % windowMs)) / 1000) };
      }
      return { ok: true, retryAfterSec: 0 };
    } catch {
      /* Redis KO : on retombe sur le limiteur en mémoire */
    }
  }

  const entry = memory.get(key) ?? { count: 0, firstAt: Date.now() };
  entry.count += 1;
  memory.set(key, entry);
  if (memory.size > 1000) {
    // Garde-fou mémoire : purge des fenêtres expirées
    const now = Date.now();
    for (const [k, v] of memory) {
      if (now - v.firstAt > 60 * 60 * 1000) memory.delete(k);
    }
  }
  if (entry.count > limit) {
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (Date.now() - entry.firstAt)) / 1000));
    return { ok: false, retryAfterSec };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** IP du client, en tenant compte des proxies (Vercel ajoute X-Forwarded-For). */
export function ipOf(req: { headers: Headers }): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "local";
}

export const TOO_MANY = "rate_limited";
