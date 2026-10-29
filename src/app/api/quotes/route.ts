import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { demoQuotes } from "@/data/demoQuotes";
import { adminPassword, isAdmin } from "@/lib/adminAuth";
import { listQuotes, purgeOldQuotes, saveQuote, storageMode } from "@/lib/quoteStore";

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

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
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

  if (!name) return fieldError("name", "name_required");
  if (!company) return fieldError("company", "company_required");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  if (!emailOk) return fieldError("email", "email_invalid");
  if (!country) return fieldError("country", "country_required");
  const phoneOk = /^[+\d][\d\s().-]{5,20}$/.test(phone);
  if (!phoneOk) return fieldError("phone", "phone_invalid");

  // Validation des articles
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items: QuoteRecord["items"] = [];
  for (const it of rawItems) {
    const obj = (it ?? {}) as Record<string, unknown>;
    const slug = String(obj.slug ?? "");
    const qty = Number(obj.qty);
    const product = getProduct(slug);
    if (!product || !Number.isFinite(qty) || qty <= 0) {
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

  // Référence : DEV-<année>-<compteur>, atomique côté Redis (cardinalité du sorted set)
  const year = new Date().getFullYear();
  const existing = await listQuotes().catch(() => []);
  const count = existing.filter((q) => q.reference.startsWith(`DEV-${year}-`)).length;
  const reference = `DEV-${year}-${String(count + 1).padStart(4, "0")}`;

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
