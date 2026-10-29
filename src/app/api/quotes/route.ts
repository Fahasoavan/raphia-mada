import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { demoQuotes } from "@/data/demoQuotes";
import { adminPassword, isAdmin } from "@/lib/adminAuth";
import { listQuotes, purgeOldQuotes, saveQuote, storageMode, nextReference } from "@/lib/quoteStore";
import { rateLimit, ipOf, TOO_MANY } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface QuoteRecord {
  reference: string;
  createdAt: string;
  name: string;
  company: string;
  email: string;
  country: string;
  phone: string;
  targetDate: string;
  message: string;
  items: { slug: string; nameFr: string; nameEn: string; qty: number; unitPrice: number }[];
  totalQty: number;
}

/* ---------- Rétention des demandes (données de démo) ---------- */

const RETENTION_DAYS = Number(process.env.QUOTE_RETENTION_DAYS ?? 30);

function fieldError(field: string, message: string) {
  return NextResponse.json({ error: "validation", field, message }, { status: 400 });
}

/* ---------- POST : dépôt public d'une demande ---------- */

/* Limites anti-abus */

const MAX_TEXT_LENGTHS: Record<string, number> = {
  name: 120,
  company: 120,
  email: 254,
  country: 80,
  phone: 30,
  targetDate: 120,
  message: 2000,
};
const MAX_ITEMS = 50;
const MAX_QTY = 1_000_000;
const POST_LIMIT = 5; // /minute/IP
const POST_WINDOW_MS = 60 * 1000;
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(req: NextRequest) {
  // 1) Limiteur de débit par IP (Redis en prod, mémoire en dev)
  const rl = await rateLimit("quote-post", ipOf(req), POST_LIMIT, POST_WINDOW_MS);
  if (!rl.ok) {
    return NextResponse.json(
      { error: TOO_MANY, retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  // 2) Garde-fou taille brute du corps (pas de payload géant avant parse)
  const bodyLength = Number(req.headers.get("content-length") ?? 0);
  if (bodyLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large", maxBytes: MAX_BODY_BYTES }, { status: 413 });
  }
  const rawBody = await req.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large", maxBytes: MAX_BODY_BYTES }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const name = String(data.name ?? "").trim();
  const company = String(data.company ?? "").trim();
  const email = String(data.email ?? "").trim();
  const country = String(data.country ?? "").trim();
  const phone = String(data.phone ?? "").trim();
  const targetDate = String(data.targetDate ?? "").trim();
  const message = String(data.message ?? "").trim();

  // 3) Limites par champ
  if (name.length > MAX_TEXT_LENGTHS.name) return fieldError("name", "too_long");
  if (company.length > MAX_TEXT_LENGTHS.company) return fieldError("company", "too_long");
  if (email.length > MAX_TEXT_LENGTHS.email) return fieldError("email", "too_long");
  if (country.length > MAX_TEXT_LENGTHS.country) return fieldError("country", "too_long");
  if (phone.length > MAX_TEXT_LENGTHS.phone) return fieldError("phone", "too_long");
  if (targetDate.length > MAX_TEXT_LENGTHS.targetDate) return fieldError("targetDate", "too_long");
  if (message.length > MAX_TEXT_LENGTHS.message) return fieldError("message", "too_long");

  if (!name) return fieldError("name", "name_required");
  if (!company) return fieldError("company", "company_required");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!emailOk) return fieldError("email", "email_invalid");
  if (!country) return fieldError("country", "country_required");
  const phoneOk = /^[+\d][\d\s().-]{5,20}$/.test(phone);
  if (!phoneOk) return fieldError("phone", "phone_invalid");

  // Validation des articles
  const rawItems = Array.isArray(data.items) ? data.items : [];
  if (rawItems.length > MAX_ITEMS) return fieldError("items", "too_many");
  const items: QuoteRecord["items"] = [];
  for (const it of rawItems) {
    const obj = (it ?? {}) as Record<string, unknown>;
    const slug = String(obj.slug ?? "");
    const qty = Number(obj.qty);
    const product = getProduct(slug);
    if (!product || !Number.isFinite(qty) || qty <= 0 || qty > MAX_QTY) {
      return fieldError("items", "items_invalid");
    }
    items.push({
      slug: product.slug,
      nameFr: product.name.fr,
      nameEn: product.name.en,
      qty: Math.round(qty),
      unitPrice: product.tiers[product.tiers.length - 1].price,
    });
  }
  if (items.length === 0) return fieldError("items", "items_empty");

  // Référence : INCR atomique Redis par année (indépendante de la purge,
  // impossible que deux envois simultanés partagent le même numéro)
  const reference = await nextReference();

  const record: QuoteRecord = {
    reference,
    createdAt: new Date().toISOString(),
    name,
    company,
    email,
    country,
    phone,
    targetDate,
    message,
    items,
    totalQty: items.reduce((s, it) => s + it.qty, 0),
  };

  try {
    await saveQuote(record);
    // Rétention : purge régulière des demandes anciennes (données de démo)
    await purgeOldQuotes(RETENTION_DAYS).catch(() => 0);
  } catch {
    return NextResponse.json(
      { error: "storage", message: "Impossible d'enregistrer la demande pour le moment." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, reference, quote: record }, { status: 201 });
}

/* ---------- GET : données des demandes (réservées à l'admin) ---------- */

export async function GET(req: NextRequest) {
  const pw = adminPassword();

  // Mot de passe configuré → seul l'admin authentifié voit les vraies demandes
  if (pw) {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: "unauthorized", requiresAuth: true, source: storageMode }, { status: 401 });
    }
    const quotes = await listQuotes().catch(() => []);
    return NextResponse.json({ quotes, source: storageMode, protected: true }, { status: 200 });
  }

  // Aucun mot de passe configuré (déploiement public) → mode démo :
  // données 100 % fictives, jamais les demandes réelles.
  return NextResponse.json(
    { quotes: demoQuotes, source: storageMode, demo: true },
    { status: 200 }
  );
}
