"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

export default function ContactView() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field: "name" | "email" | "message", value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = t.contactPage.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = t.contactPage.errors.email;
    if (form.message.trim().length < 10) next.message = t.contactPage.errors.message;
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSending(true);
    // Démo : aucune transmission réelle, on simule un court délai réseau
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }, 700);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="section-title">{t.contactPage.title}</h1>
      <p className="mt-2 max-w-2xl text-ink/70">{t.contactPage.subtitle}</p>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Coordonnées */}
        <Reveal>
        <div className="space-y-6">
          <dl className="card space-y-4 p-6 text-sm">
            <div>
              <dt className="eyebrow !mb-1">{t.contactPage.email}</dt>              <dd>
                <a href="mailto:contact@raphia-mada.mg" className="font-medium text-raphia hover:underline">contact@raphia-mada.mg</a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow !mb-1">{t.contactPage.phone}</dt>
              <dd className="text-ink/80">+261 34 00 000 00</dd>
            </div>
            <div>
              <dt className="eyebrow !mb-1">{t.contactPage.address}</dt>
              <dd className="text-ink/80">Lot II M 12 Bis, Antananarivo 101, Madagascar</dd>
            </div>
            <div>
              <dt className="eyebrow !mb-1">{t.contactPage.hours}</dt>
              <dd className="text-ink/80">{t.contactPage.hours}</dd>
            </div>
          </dl>
          <a
            href="https://wa.me/261340000000?text=Bonjour%20Raphia%20Mada%2C%20je%20souhaite%20des%20informations%20sur%20vos%20produits."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full !bg-[#25D366] !text-ink hover:!bg-[#20bd5a]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="snore">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z" fill="currentColor" opacity="0.25" />
              <path d="M8.5 7.5c-.3 1.9.9 4.3 2.3 5.6 1.4 1.4 3.8 2.6 5.6 2.3l.6-1.7-2-1.2-1.2.7c-.9-.5-2.4-2-2.9-2.9l.7-1.2-1.2-2-1.9.4Z" fill="currentColor" />
            </svg>
            {t.contactPage.whatsapp}
          </a>
        </div>
        </Reveal>

        {/* Formulaire simple */}
        <Reveal delay={140}>
          <form onSubmit={handleSubmit} noValidate className="card h-fit p-6" aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="font-serif text-xl font-bold text-forest">{t.contactPage.formTitle}</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label htmlFor="c-name" className="label">{t.contactPage.form.name}</label>
              <input id="c-name" type="text" autoComplete="name" className={`input ${errors.name ? "border-red-600" : ""}`} value={form.name} onChange={(e) => update("name", e.target.value)} required />
              {errors.name && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="c-email" className="label">{t.contactPage.form.email}</label>
              <input id="c-email" type="email" autoComplete="email" className={`input ${errors.email ? "border-red-600" : ""}`} value={form.email} onChange={(e) => update("email", e.target.value)} required />
              {errors.email && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="c-message" className="label">{t.contactPage.form.message}</label>
              <textarea id="c-message" rows={5} className={`input resize-y ${errors.message ? "border-red-600" : ""}`} value={form.message} onChange={(e) => update("message", e.target.value)} required />
              {errors.message && <p role="alert" className="mt-1 text-xs font-medium text-red-700">{errors.message}</p>}
            </div>
          </div>
          {sent && <p role="status" className="mt-4 rounded-lg bg-forest/10 px-3 py-2 text-sm font-medium text-forest">{t.contactPage.success}</p>}
          <button type="submit" disabled={sending} className="btn-primary click-feedback mt-6 w-full">
            {sending ? t.contactPage.form.sending : t.contactPage.form.submit}
          </button>
          <p className="mt-3 text-xs text-ink/50">{t.contactPage.demo}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
