import { promises as fs } from "fs";
import path from "path";
import type { QuoteRecord } from "@/app/api/quotes/route";

/**
 * Couche de stockage des demandes de devis.
 *
 * - Sur déploiement (Vercel…) : **Upstash Redis** via son API REST si les variables
 *   UPSTASH_REDIS_REST_URL et UPSTASH_REDIS_REST_TOKEN sont définies.
 *   Chaque devis est un élément d'un Sorted Set (« ZADD quotes <score> <json> »)
 *   → écritures indépendantes, pas de réécriture du fichier entier, rarement
 *   perdu si deux requêtes arrivent en même temps.
 * - En local sans config : fallback sur data/quotes.json (config .next dev).
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const storageMode: "redis" | "file" = REDIS_URL && REDIS_TOKEN ? "redis" : "file";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "quotes.json");
const KEY = "raphia:quotes";

async function redisCommand(args: (string | number)[]): Promise<unknown> {  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN as string}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`Upstash: ${json.error}`);
  return json.result;
}

/** Exécute une commande Redis (utilisé aussi pour le rate limiting). */
export function redisCommandPublic(args: (string | number)[]): Promise<unknown> {
  return redisCommand(args);
}

/** Compteur atomique de références : INCR par année, indépendant de la purge. */
export async function nextReference(): Promise<string> {
  const year = new Date().getFullYear();
  if (storageMode === "redis") {
    try {
      const value = (await redisCommand(["INCR", `raphia:refs:${year}`])) as number;
      if (Number.isFinite(value)) {
        return `DEV-${year}-${String(value).padStart(4, "0")}`;
      }
    } catch {
      /* réseau Redis indisponible : on retombe sur le compteur local ci-dessous */
    }
  }
  // Fallback dev (fichier) : éventail de collisions possible, acceptable en mono-utilisateur.
  const quotes = await readLocal();
  const count = quotes.filter((q) => q.reference.startsWith(`DEV-${year}-`)).length;
  return `DEV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function saveQuote(quote: QuoteRecord): Promise<void> {
  if (storageMode === "redis") {
    // score : timestamp en ms (écarté de +0.x pour éviter les collisions)
    const score = Date.parse(quote.createdAt) + Math.random() * 0.999;
    await redisCommand(["ZADD", KEY, score, JSON.stringify(quote)]);
    return;
  }
  const quotes = await readLocal();
  quotes.push(quote);
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(quotes, null, 2), "utf8");
}

export async function listQuotes(): Promise<QuoteRecord[]> {
  if (storageMode === "redis") {
    const raw = (await redisCommand(["ZREVRANGE", KEY, "0", "-1"])) as string[] | null;
    if (!Array.isArray(raw)) return [];
    const parsed: QuoteRecord[] = [];
    for (const item of raw) {
      try {
        parsed.push(JSON.parse(item) as QuoteRecord);
      } catch {
        /* entrée corrompue : ignorée */
      }
    }
    return parsed;
  }
  return readLocal();
}

/** Rétention : supprime les demandes de plus de `maxAgeDays` jours (défaut 30). */
export async function purgeOldQuotes(maxAgeDays = 30): Promise<number> {
  if (storageMode === "redis") {
    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    const before = (await listQuotes()).length;
    await redisCommand(["ZREMRANGEBYSCORE", KEY, "-inf", cutoff]);
    const after = (await listQuotes()).length;
    return Math.max(0, before - after);
  }
  const quotes = await readLocal();
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const kept = quotes.filter((q) => Date.parse(q.createdAt) >= cutoff);
  if (kept.length !== quotes.length) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(kept, null, 2), "utf8");
  }
  return quotes.length - kept.length;
}

async function readLocal(): Promise<QuoteRecord[]> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    return [];
  }
  try {
    const raw = (await fs.readFile(DATA_FILE, "utf8")).replace(/^\uFEFF/, "").trim();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuoteRecord[]) : [];
  } catch {
    return [];
  }
}
