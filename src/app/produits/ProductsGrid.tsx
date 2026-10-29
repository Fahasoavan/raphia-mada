"use client";

import { useMemo, useState } from "react";
import { CATEGORY_ORDER, Category, products } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

type Filter = Category | "all";

export default function ProductsGrid() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="section-title">{t.productsPage.title}</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{t.productsPage.subtitle}</p>

      {/* Filtres */}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={t.productsPage.title}>
        <button
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            filter === "all" ? "bg-forest text-cream" : "border border-raphia/40 text-raphia hover:bg-raphia/10"
          }`}
        >
          {t.productsPage.filtersAll}
        </button>
        {CATEGORY_ORDER.map((cat: Category) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === cat ? "bg-forest text-cream" : "border border-raphia/40 text-raphia hover:bg-raphia/10"
            }`}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      {/* Grille */}
      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-raphia/40 p-8 text-center text-ink/60">
          {t.productsPage.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
