"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  const { t } = useI18n();
  const featured = products.slice(0, 4);

  return (
    <>
      {/* Bandeau d'accroche */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-weave" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M0 8 H16 M8 0 V16" stroke="#FAF5EA" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-weave)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="float-slow pointer-events-none absolute right-6 top-8 hidden select-none lg:block" aria-hidden="true">
            {/* Panier SVG décoratif flottant */}
            <svg width="120" height="120" viewBox="0 0 100 100">
              <g stroke="#D9A441" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
                <path d="M20 45 Q50 25 80 45 Q65 70 35 70 Q15 55 20 45 Z" />
                <path d="M25 48 Q50 32 75 48" />
                <path d="M28 55 Q52 42 72 55" />
                <path d="M33 63 Q52 52 67 63" />
              </g>
            </svg>
          </div>
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/85">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/devis" className="btn-accent click-feedback">
              {t.hero.cta}
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/produits" className="inline-flex items-center justify-center rounded-full border border-cream/60 px-6 py-3 font-medium text-cream transition-all duration-300 hover:bg-cream hover:text-forest active:scale-95">
              {t.hero.ctaCatalog}
            </Link>
          </div>
        </div>
      </section>

      {/* 3 arguments */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="args-title">
        <h2 id="args-title" className="section-title text-center">{t.args.title}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[t.args.a1, t.args.a2, t.args.a3].map((arg, i) => (
            <Reveal key={i} delay={i * 120}>
              <div className="card card-hover h-full p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ocre/20 text-2xl" aria-hidden="true">
                  {["✋", "🌿", "🌍"][i]}
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-forest">{arg.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{arg.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Aperçu produits */}
      <section className="bg-raphia/5 py-16" aria-labelledby="featured-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="featured-title" className="section-title">Nos best-sellers</h2>
            <Link href="/produits" className="text-sm font-medium text-raphia underline-offset-4 hover:underline">
              {t.hero.ctaCatalog} →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="how-title">
        <h2 id="how-title" className="section-title text-center">{t.how.title}</h2>
        <p className="mt-2 text-center text-ink/70">{t.how.subtitle}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[t.how.s1, t.how.s2, t.how.s3, t.how.s4].map((s, i) => (
            <Reveal key={i} delay={i * 110}>
              <div className="card card-hover relative h-full p-6">
                <span aria-hidden="true" className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-forest font-serif text-lg font-bold text-cream transition-transform duration-300 hover:scale-110">
                  {i + 1}
                </span>
                <h3 className="mt-2 font-serif text-lg font-bold text-forest">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-forest py-16 text-cream" aria-labelledby="testimonials-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="testimonials-title" className="section-title text-center text-cream">{t.testimonials.title}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[t.testimonials.t1, t.testimonials.t2, t.testimonials.t3].map((tm, i) => (
              <Reveal key={i} delay={i * 130}>
                <figure className="h-full rounded-2xl bg-forest-dark p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-forest hover:shadow-lg hover:shadow-black/20">
                  <div className="text-ocre" aria-hidden="true">★★★★★</div>
                  <blockquote className="mt-3 text-sm leading-relaxed text-cream/90">“ {tm.text} ”</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{tm.author}</span>
                    <span className="block text-cream/60">{tm.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-ocre/15 p-10 text-center transition-all duration-300 hover:bg-ocre/25">
          <h2 className="section-title">{t.homeCta.title}</h2>
          <p className="mt-2 text-ink/75">{t.homeCta.text}</p>
          <Link href="/devis" className="btn-primary click-feedback mt-6">
            {t.homeCta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
