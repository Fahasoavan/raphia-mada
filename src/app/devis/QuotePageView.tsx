"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart, CartItem } from "@/lib/cart";
import { getProduct, Product } from "@/data/products";
import ProductVisual from "@/components/ProductVisual";
import Reveal from "@/components/Reveal";

interface Confirmed {
  reference: string;
  items: { slug: string; nameFr: string; nameEn: string; qty: number; unitPrice: number }[];
  totalQty: number;
  name: string;
  company: string;
  country: string;
}

interface FormState {
  name: string;
  company: string;
  email: string;
  country: string;
  phone: string;
  targetDate: string;
  message: string;
}

const EMPTY: FormState = { name: "", company: "", email: "", country: "", phone: "", targetDate: "", message: "" };

function tierPriceFor(product: Product, qty: number): number {
  // Prix applicatif : le palier le plus élevé dont la quantité est atteinte
  let price = product.tiers[0].price;
  for (const tier of product.tiers) {
    if (qty >= tier.qty) price = tier.price;
  }
  return price;
}

export default function QuotePageView() {
  const { t, lang } = useI18n();
  const { items, ready, setQty, remove, clear } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);

  const detailed = items
    .map((it: CartItem) => ({ item: it, product: getProduct(it.slug) }))
    .filter((x): x is { item: CartItem; product: Product } => x.product !== undefined);

  const totalQty = detailed.reduce((s, x) => s + x.item.qty, 0);
  const estimate = detailed.reduce((s, x) => s + tierPriceFor(x.product, x.item.qty) * x.item.qty, 0);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 2) next.name = t.quotePage.errors.name;
    if (form.company.trim().length < 2) next.company = t.quotePage.errors.company;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t.quotePage.errors.email;
    if (form.country.trim().length < 2) next.country = t.quotePage.errors.country;
    if (!/^[+\d][\d\s().-]{5,20}$/.test(form.phone.trim())) next.phone = t.quotePage.errors.phone;
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSending(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((it) => ({ slug: it.slug, qty: it.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.field && data?.field !== "items") {
          setErrors((prev) => ({ ...prev, [data.field]: t.quotePage.errors.submit }));
        }
        setSubmitError(t.quotePage.errors.submit);
        setSending(false);
        return;
      }
      setConfirmed({
        reference: data.reference,
        items: data.quote.items,
        totalQty: data.quote.totalQty,
        name: data.quote.name,
        company: data.quote.company,
        country: data.quote.country,
      });
      clear();
    } catch {
      setSubmitError(t.quotePage.errors.submit);
    } finally {
      setSending(false);
    }
  }

  // Écran de confirmation
  if (confirmed) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="page-in card p-8 text-center sm:p-10">
          <div className="badge-pop mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-cream text-2xl" aria-hidden="true">✓</div>
          <h1 className="mt-5 font-serif text-2xl font-bold text-forest sm:text-3xl">{t.quotePage.confirm.title}</h1>
          <p className="mt-2 text-ink/75">{t.quotePage.confirm.text}</p>

          <p className="mt-6 text-sm text-ink/60">{t.quotePage.confirm.reference}</p>
          <p className="font-serif text-3xl font-bold text-raphia">{confirmed.reference}</p>

          <div className="mt-8 rounded-2xl bg-raphia/5 p-5 text-left text-sm">
            <h2 className="font-semibold text-forest">{t.quotePage.confirm.recap}</h2>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div><dt className="font-medium text-forest">{t.quotePage.form.name}</dt><dd>{confirmed.name}</dd></div>
              <div><dt className="font-medium text-forest">{t.quotePage.form.company}</dt><dd>{confirmed.company}</dd></div>
              <div><dt className="font-medium text-forest">{t.quotePage.form.country}</dt><dd>{confirmed.country}</dd></div>
              <div><dt className="font-medium text-forest">{t.quotePage.qty}</dt><dd>{confirmed.totalQty} {t.productsPage.pieces}</dd></div>
            </dl>
            <ul className="mt-4 divide-y divide-raphia/20 border-t border-raphia/20">
              {confirmed.items.map((it, idx) => {
                const name = lang === "en" ? it.nameEn : it.nameFr;
                return (
                  <li
                    key={it.slug}
                    className="fade-up-item flex items-center justify-between gap-3 py-2 transition-colors duration-200 hover:bg-raphia/5"
                    style={{ animationDelay: `${idx * 90}ms` }}
                  >
                    <span>{name}</span>
                    <span className="text-ink/60">× {it.qty}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-4 text-xs text-ink/50">{t.quotePage.confirm.note}</p>
          <Link href="/" className="btn-primary mt-8">{t.quotePage.confirm.back}</Link>
        </div>
      </section>
    );
  }

  if (!ready) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6" aria-busy="true">
        <p className="text-ink/60">{t.admin.loading}</p>
      </section>
    );
  }

  // Panier vide
  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <div aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-raphia/10 text-3xl">🧺</div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-forest">{t.quotePage.empty.title}</h1>
        <p className="mt-2 text-ink/70">{t.quotePage.empty.text}</p>
        <Link href="/produits" className="btn-primary mt-8">{t.quotePage.empty.button}</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="section-title">{t.quotePage.title}</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{t.quotePage.subtitle}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Sélection */}
        <div aria-labelledby="cart-title">
          <h2 id="cart-title" className="font-serif text-xl font-bold text-forest">{t.quotePage.cartTitle}</h2>
          <ul className="mt-4 space-y-4">
            {detailed.map(({ item, product }, idx) => {
              const unit = tierPriceFor(product, item.qty);
              const belowMoq = item.qty < product.moq;
              return (
                <li
                  key={item.slug}
                  className="card card-hover fade-up-item flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Link href={`/produits/${product.slug}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre rounded-xl">
                    <ProductVisual product={product} className="h-20 w-20 shrink-0 rounded-xl" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif font-bold text-forest">{product.name[lang]}</p>
                    <p className="text-xs text-ink/60">
                      {t.productsPage.from} {unit.toFixed(2).replace(".", lang === "fr" ? "," : ".")} {t.productsPage.perPiece} · MOQ {product.moq}
                    </p>
                    {belowMoq && <p className="mt-1 text-xs font-medium text-ocre-dark">⚠ {t.quotePage.moqShort.replace("{min}", String(product.moq))}</p>}
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <label className="flex items-center gap-2 text-sm">
                      <span className="sr-only">{`${t.quotePage.qty} — ${product.name[lang]}`}</span>
                      {t.quotePage.qty}
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => setQty(item.slug, Number(e.target.value))}
                        className="input w-20 !py-1.5"
                        aria-label={`${t.quotePage.qty} — ${product.name[lang]}`}
                      />
                    </label>
                    <button
                      onClick={() => remove(item.slug)}
                      className="text-sm font-medium text-raphia underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre rounded"
                      aria-label={`${t.quotePage.remove} : ${product.name[lang]}`}
                    >
                      {t.quotePage.remove}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-forest px-5 py-4 text-cream">
            <div>
              <p className="text-sm text-cream/75">{t.quotePage.estimate}</p>
              <p className="text-xs text-cream/50">{totalQty} {t.productsPage.pieces}</p>
            </div>
            <p className="font-serif text-2xl font-bold">
              ≈ {estimate.toFixed(2).replace(".", lang === "fr" ? "," : ".")} €
            </p>
          </div>
          <p className="mt-2 text-xs text-ink/50">{t.productDetail.priceNote}</p>
        </div>

        {/* Formulaire */}
        <Reveal delay={150}>
          <form onSubmit={handleSubmit} noValidate className="card h-fit p-6" aria-labelledby="form-title">
          <h2 id="form-title" className="font-serif text-xl font-bold text-forest">{t.quotePage.formTitle}</h2>

          <div className="mt-4 grid gap-4">
            <div>
              <label htmlFor="q-name" className="label">{t.quotePage.form.name}</label>
              <input id="q-name" type="text" autoComplete="name" className={`input ${errors.name ? "border-red-600" : ""}`} value={form.name} onChange={(e) => update("name", e.target.value)} required />
              {errors.name && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="q-company" className="label">{t.quotePage.form.company}</label>
              <input id="q-company" type="text" autoComplete="organization" className={`input ${errors.company ? "border-red-600" : ""}`} value={form.company} onChange={(e) => update("company", e.target.value)} required />
              {errors.company && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.company}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="q-email" className="label">{t.quotePage.form.email}</label>
                <input id="q-email" type="email" autoComplete="email" className={`input ${errors.email ? "border-red-600" : ""}`} value={form.email} onChange={(e) => update("email", e.target.value)} required />
                {errors.email && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="q-country" className="label">{t.quotePage.form.country}</label>
                <input id="q-country" type="text" autoComplete="country-name" className={`input ${errors.country ? "border-red-600" : ""}`} value={form.country} onChange={(e) => update("country", e.target.value)} required />
                {errors.country && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.country}</p>}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="q-phone" className="label">{t.quotePage.form.phone}</label>
                <input id="q-phone" type="tel" autoComplete="tel" className={`input ${errors.phone ? "border-red-600" : ""}`} value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                {errors.phone && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="q-date" className="label">
                  {t.quotePage.form.partOf} <span className="font-normal text-ink/50">({t.quotePage.form.optional})</span>
                </label>
                <input id="q-date" type="text" placeholder={t.quotePage.form.partOfPlaceholder} className="input" value={form.targetDate} onChange={(e) => update("targetDate", e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="q-message" className="label">
                {t.quotePage.form.message} <span className="font-normal text-ink/50">({t.quotePage.form.optional})</span>
              </label>
              <textarea id="q-message" rows={4} placeholder={t.quotePage.form.messagePlaceholder} className="input resize-y" value={form.message} onChange={(e) => update("message", e.target.value)} />
            </div>
          </div>

          {submitError && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{submitError}</p>
          )}

          <button type="submit" disabled={sending} className="btn-primary click-feedback mt-6 w-full">
            {sending ? t.quotePage.form.sending : t.quotePage.form.submit}
          </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
