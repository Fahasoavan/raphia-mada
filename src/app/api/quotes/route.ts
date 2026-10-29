import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getProduct } from "@/data/products";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "quotes.json");

async function readQuotes(): Promise<QuoteRecord[]> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  try {
    const raw = (await fs.readFile(DATA_FILE, "utf8")).replace(/^\uFEFF/, "").trim();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuoteRecord[]) : [];
  } catch {
    return [];
  }
}

async function writeQuotes(quotes: QuoteRecord[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(quotes, null, 2), "utf8");
}

function fieldError(field: string, message: string) {
  return NextResponse.json({ error: "validation", field, message }, { status: 400 });
}

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

  const quotes = await readQuotes();

  // Référence : DEV-<année>-<compteur sur 4 chiffres>
  const year = new Date().getFullYear();
  const count = quotes.filter((q) => q.reference.startsWith(`DEV-${year}-`)).length;
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

  quotes.push(record);
  await writeQuotes(quotes);

  return NextResponse.json({ ok: true, reference, quote: record }, { status: 201 });
}

export async function GET() {
  const quotes = await readQuotes();
  return NextResponse.json({ quotes }, { status: 200 });
}
