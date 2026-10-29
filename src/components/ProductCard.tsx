"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import ProductVisual from "./ProductVisual";
import { formatNumber } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { t, lang } = useI18n();
  const { add, has } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(product.slug, product.moq >= 1 ? 1 : 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <Link href={`/produits/${product.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre rounded-t-2xl" aria-label={`${product.name[lang]} — ${t.productsPage.viewDetails}`}>
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 group-hover:scale-105">
            <ProductVisual product={product} className="aspect-[4/3] w-full" />
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow">{t.categories[product.category]}</p>
        <h3 className="mt-1 font-serif text-lg font-bold text-forest">{product.name[lang]}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/70">{product.short[lang]}</p>

        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/80">
          <div className="flex items-center gap-1">
            <dt className="font-semibold text-forest">{t.productsPage.moq} :</dt>
            <dd>
              {t.productsPage.moqLabel} {product.moq} {t.productsPage.pieces}
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="font-semibold text-forest">{t.productsPage.from} :</dt>
            <dd>
              {formatNumber(product.tiers[0].price, lang)} {t.productsPage.perPiece}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={handleAdd}
            className={`btn-accent w-full !px-4 !py-2 text-sm ${justAdded ? "!bg-forest !text-cream" : ""}`}
            aria-label={`${t.productsPage.add} : ${product.name[lang]}`}
          >
            {justAdded ? `✓ ${t.productsPage.added}` : t.productsPage.add}
          </button>
          <Link
            href={`/produits/${product.slug}`}
            className="text-center text-sm font-medium text-raphia underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre rounded"
          >
            {t.productsPage.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}
