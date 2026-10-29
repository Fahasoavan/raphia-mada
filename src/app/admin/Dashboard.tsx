"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { QuoteRecord } from "@/app/api/quotes/route";
import { getProduct, Category } from "@/data/products";
import Reveal from "@/components/Reveal";

/* ---------- Compteur animé ---------- */
function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{format(display)}</>;
}

/* ---------- Barre animée qui se déploie ---------- */
function GrowBar({
  percent,
  color,
  className = "",
}: {
  percent: number;
  color: string;
  className?: string;
}) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-raphia/10 ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${grown ? Math.max(4, percent) : 0}%`, backgroundColor: color }}
      />
    </div>
  );
}

const BAR_COLORS = ["#2F4A3A", "#D9A441", "#8A5A2B", "#4A6B55", "#B08050", "#6E451F"];

function fmtMoney(n: number, locale: string) {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
}

/* ---------- Dashboard ---------- */
export default function Dashboard({ quotes }: { quotes: QuoteRecord[] }) {
  const { t, lang } = useI18n();
  const d = t.admin.dashboard;
  const locale = lang === "fr" ? "fr-FR" : "en-US";

  const agg = useMemo(() => {
    const byMonth = new Map<string, { count: number; value: number }>();
    const byProduct = new Map<string, { labelFr: string; labelEn: string; qty: number }>();
    const byCountry = new Map<string, number>();
    const byCategory = new Map<Category, number>();
    const companySet = new Set<string>();

    let totalQty = 0;
    let totalValue = 0;

    for (const q of quotes) {
      const month = (q.createdAt ?? "").slice(0, 7); // YYYY-MM
      if (month) {
        const m = byMonth.get(month) ?? { count: 0, value: 0 };
        m.count += 1;
        m.value += q.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
        byMonth.set(month, m);
      }
      for (const it of q.items) {
        const prod = byProduct.get(it.slug) ?? { labelFr: it.nameFr, labelEn: it.nameEn, qty: 0 };
        prod.qty += it.qty;
        byProduct.set(it.slug, prod);
        const catKey = getProduct(it.slug)?.category;
        if (catKey) byCategory.set(catKey, (byCategory.get(catKey) ?? 0) + it.qty);
      }
      if (q.country) byCountry.set(q.country, (byCountry.get(q.country) ?? 0) + 1);
      if (q.company) companySet.add(q.company);
      totalQty += q.totalQty;
      totalValue += q.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
    }

    const months = [...byMonth.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([key, v]) => {
        const [y, mo] = key.split("-").map(Number);
        const label = new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(
          new Date(y, mo - 1, 1)
        );
        return { label, count: v.count, value: v.value };
      });

    const products = [...byProduct.entries()]
      .map(([slug, v]) => ({ slug, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const countries = [...byCountry.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const categories: { cat: Category; qty: number }[] = [...byCategory.entries()]
      .map(([cat, qty]) => ({ cat, qty }))
      .sort((a, b) => b.qty - a.qty);

    return { months, products, countries, categories, totalQty, totalValue, societies: companySet.size };
  }, [quotes, locale]);

  const maxMonth = Math.max(1, ...agg.months.map((m) => m.count));
  const maxProd = Math.max(1, ...agg.products.map((p) => p.qty));
  const maxCountry = Math.max(1, ...agg.countries.map((c) => c.count));
  const maxCat = Math.max(1, ...agg.categories.map((c) => c.qty));
  const kpis = [
    { label: d.kpiRequests, value: quotes.length, fmt: (n: number) => fmtMoney(n, locale), icon: "📥", color: "bg-forest text-cream" },
    { label: d.kpiUnits, value: agg.totalQty, fmt: (n: number) => fmtMoney(n, locale), icon: "🧺", color: "bg-ocre/25" },
    { label: d.kpiRevenue, value: agg.totalValue, fmt: (n: number) => `${fmtMoney(n, locale)} €`, icon: "💰", color: "bg-raphia/15" },
    { label: d.kpiAvg, value: quotes.length ? agg.totalValue / quotes.length : 0, fmt: (n: number) => `${fmtMoney(n, locale)} €`, icon: "📊", color: "bg-forest/10" },
    { label: d.kpiSocieties, value: agg.societies, fmt: (n: number) => fmtMoney(n, locale), icon: "🏬", color: "bg-ocre/15" },
  ];

  return (
    <div className="mt-4">
      <h2 className="font-serif text-2xl font-bold text-forest">{d.title}</h2>

      {/* KPIs */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 80}>
            <div
              className={`card card-hover flex flex-col justify-center p-5 ${k.color}`}
            >
              <div className="flex items-center gap-2 text-sm text-ink/70">
                <span aria-hidden="true">{k.icon}</span> {k.label}
              </div>
              <p className="mt-1 font-serif text-3xl font-bold text-forest">
                <CountUp value={k.value} format={k.fmt} />
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Graphiques */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Évolution mensuelle */}
        <Reveal>
          <div className="card h-full p-5">
            <h3 className="font-serif font-bold text-forest">{d.evolution}</h3>
            {agg.months.length === 0 ? (
              <p className="mt-6 text-sm text-ink/50">{d.noData}</p>
            ) : (
              <div className="mt-4 flex h-40 items-end gap-2" role="img" aria-label={d.evolution}>
                {agg.months.map((m) => (
                  <div key={m.label} className="group flex flex-1 flex-col items-center justify-end gap-1" title={`${m.label} — ${m.count} ${d.requestsShort}`}>
                    <span className="text-[10px] font-semibold text-forest opacity-0 transition-opacity group-hover:opacity-100">
                      {m.count}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-forest transition-all duration-700 ease-out group-hover:bg-ocre"
                      style={{ height: `${(m.count / maxMonth) * 100}%`, minHeight: "6px" }}
                    />
                    <span className="text-[10px] text-ink/55">{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Top produits */}
        <Reveal delay={100}>
          <div className="card h-full p-5">
            <h3 className="font-serif font-bold text-forest">{d.topProducts}</h3>
            {agg.products.length === 0 ? (
              <p className="mt-6 text-sm text-ink/50">{d.noData}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {agg.products.map((p, i) => (
                  <li key={p.slug} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium text-forest">{lang === "en" ? p.labelEn : p.labelFr}</span>
                      <span className="text-ink/60">{p.qty} {d.unitsShort}</span>
                    </div>
                    <GrowBar percent={(p.qty / maxProd) * 100} color={BAR_COLORS[i % BAR_COLORS.length]} className="h-2.5" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* Pays */}
        <Reveal delay={140}>
          <div className="card h-full p-5">
            <h3 className="font-serif font-bold text-forest">{d.byCountry}</h3>
            {agg.countries.length === 0 ? (
              <p className="mt-6 text-sm text-ink/50">{d.noData}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {agg.countries.map((c, i) => (
                  <li key={c.country} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium text-forest">{c.country}</span>
                      <span className="text-ink/60">{c.count} {d.requestsShort}</span>
                    </div>
                    <GrowBar percent={(c.count / maxCountry) * 100} color={BAR_COLORS[i % BAR_COLORS.length]} className="h-2.5" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        {/* Catégories */}
        <Reveal delay={180}>
          <div className="card h-full p-5">
            <h3 className="font-serif font-bold text-forest">{d.byCategory}</h3>
            {agg.categories.length === 0 ? (
              <p className="mt-6 text-sm text-ink/50">{d.noData}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {agg.categories.map((c, i) => (
                  <li key={c.cat} className="text-sm">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium text-forest">{t.categories[c.cat]}</span>
                      <span className="text-ink/60">{c.qty} {d.unitsShort}</span>
                    </div>
                    <GrowBar percent={(c.qty / maxCat) * 100} color={BAR_COLORS[i % BAR_COLORS.length]} className="h-2.5" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      </div>

      <h3 id="recent" className="mt-10 font-serif text-xl font-bold text-forest">{d.recent}</h3>
    </div>
  );
}
