"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { getProduct } from "@/data/products";
import ProductVisual from "@/components/ProductVisual";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import Reveal from "@/components/Reveal";
import { formatNumber } from "@/lib/format";

export default function ProductDetailPage({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const product = getProduct(slug);

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="section-title">{t.productDetail.notFound}</h1>
        <p className="mt-3 text-ink/70">{t.productDetail.notFoundText}</p>
        <Link href="/produits" className="btn-primary mt-8">{t.productDetail.back}</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Fil d'Ariane" className="text-sm text-ink/60">
        <Link href="/produits" className="hover:text-raphia">← {t.productDetail.back}</Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-3xl">
            <ProductVisual product={product} className="aspect-square w-full transition-transform duration-500 hover:scale-105" />
          </div>
        </Reveal>

        <Reveal delay={130}>
        <div>
          <p className="eyebrow">{t.categories[product.category]}</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-forest sm:text-4xl">{product.name[lang]}</h1>
          <p className="mt-4 leading-relaxed text-ink/80">{product.description[lang]}</p>

          <dl className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-raphia/20 bg-white p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-forest">{t.productDetail.dimensions}</dt>
              <dd className="text-ink/75">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forest">{t.productDetail.materials}</dt>
              <dd className="text-ink/75">{product.materials}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forest">{t.productDetail.moq}</dt>
              <dd className="text-ink/75">{product.moq} {t.productsPage.pieces}</dd>
            </div>
            <div>
              <dt className="font-semibold text-forest">{t.productDetail.leadTime}</dt>
              <dd className="text-ink/75">≈ {product.leadTimeDays} {t.productDetail.leadTimeValue}</dd>
            </div>
          </dl>

          {/* Paliers de prix */}
          <h2 className="mt-8 font-serif text-xl font-bold text-forest">{t.productDetail.indicativePrice}</h2>
          <table className="mt-3 w-full text-sm">
            <caption className="sr-only">{t.productsPage.perPiece}</caption>
            <thead>
              <tr className="text-left text-ink/60">
                <th scope="col" className="py-2 font-medium">{t.quotePage.qty}</th>
                <th scope="col" className="py-2 font-medium">{t.quotePage.unitPrice}</th>
              </tr>
            </thead>
            <tbody>
              {product.tiers.map((tier) => (
                <tr key={tier.qty} className="border-t border-raphia/10 transition-colors duration-200 hover:bg-ocre/10 hover:border-ocre/40">
                  <td className="py-2 font-medium text-forest">
                    {tier.qty.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")} {t.productsPage.pieces}
                  </td>
                  <td className="py-2 text-ink/80">
                    {formatNumber(tier.price, lang)} {t.productsPage.perPiece}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-ink/50">{t.productDetail.priceNote}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToQuoteButton slug={product.slug} className="btn-accent click-feedback" />
            <Link href="/devis" className="btn-outline">{t.nav.quote}</Link>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
