"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function AboutView() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="section-title">{t.aboutPage.title}</h1>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
        <li className="flex items-center gap-2"><span aria-hidden="true">🏭</span> {t.aboutPage.meta.founded}</li>
        <li className="flex items-center gap-2"><span aria-hidden="true">🧵</span> {t.aboutPage.meta.people}</li>
        <li className="flex items-center gap-2"><span aria-hidden="true">🌍</span> {t.aboutPage.meta.export}</li>
      </ul>

      {/* Histoire */}
      <Reveal>
      <div className="card mt-8 p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold text-forest">{t.aboutPage.story.heading}</h2>
        <p className="mt-4 leading-relaxed text-ink/80">{t.aboutPage.story.p1}</p>
        <p className="mt-4 leading-relaxed text-ink/80">{t.aboutPage.story.p2}</p>
        <div aria-hidden="true" className="mt-6 h-20 rounded-2xl bg-[linear-gradient(120deg,#8A5A2B_0%,#D9A441_50%,#2F4A3A_100%)] opacity-70 transition-all duration-500 hover:opacity-100" />
      </div>
      </Reveal>

      {/* Valeurs */}
      <h2 className="mt-12 font-serif text-2xl font-bold text-forest">{t.aboutPage.values.heading}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[t.aboutPage.values.v1, t.aboutPage.values.v2, t.aboutPage.values.v3].map((v, i) => (
          <Reveal key={i} delay={i * 110}>
            <div className="card card-hover h-full p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ocre/20 text-xl transition-transform duration-300 hover:rotate-12" aria-hidden="true">
                {["🤝", "🏆", "🌱"][i]}
              </div>
              <h3 className="mt-3 font-serif text-lg font-bold text-forest">{v.title}</h3>
              <p className="mt-2 text-sm text-ink/75">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Étapes de fabrication */}
      <h2 className="mt-12 font-serif text-2xl font-bold text-forest">{t.aboutPage.process.heading}</h2>
      <div className="mt-6 space-y-4">
        {[t.aboutPage.process.s1, t.aboutPage.process.s2, t.aboutPage.process.s3, t.aboutPage.process.s4, t.aboutPage.process.s5].map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="card card-hover relative p-6 pl-16">
              <span aria-hidden="true" className="absolute left-6 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-bold text-cream transition-transform duration-300 hover:scale-110">
                {i + 1}
              </span>
              <h3 className="font-serif text-lg font-bold text-forest">{s.title}</h3>
              <p className="mt-1 text-sm text-ink/75">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-ocre/15 p-8 text-center transition-colors duration-300 hover:bg-ocre/25">
        <p className="font-serif text-xl font-bold text-forest">{t.homeCta.title}</p>
        <Link href="/devis" className="btn-primary click-feedback mt-5">{t.homeCta.button}</Link>
      </div>
    </section>
  );
}
