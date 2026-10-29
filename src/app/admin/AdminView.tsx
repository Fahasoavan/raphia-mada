"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { QuoteRecord } from "@/app/api/quotes/route";
import Reveal from "@/components/Reveal";
import Dashboard from "./Dashboard";

export default function AdminView() {
  const { t, lang } = useI18n();
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    // Rafraîchissement automatique toutes les 10 s (démo)
    timer.current = setInterval(() => {
      fetch("/api/quotes")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!cancelled && data && Array.isArray(data.quotes)) setQuotes(data.quotes);
        })
        .catch(() => undefined);
    }, 10000);
    return () => {
      cancelled = true;
      clearInterval(timer.current ?? undefined);
    };
  }, []);

  function fmtDate(iso: string) {
    try {
      return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div role="note" className="rounded-xl bg-ocre/20 px-4 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.02]">
        ⚠ {t.admin.banner}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="section-title">{t.admin.title}</h1>
        <Link href="/" className="btn-outline !px-4 !py-2 text-sm">{t.admin.back}</Link>
      </div>

      {state === "loading" && <p className="mt-8 text-ink/60" aria-busy="true">{t.admin.loading}</p>}
      {state === "error" && <p role="alert" className="mt-8 text-red-700">{t.admin.error}</p>}

      {state === "ready" && quotes.length > 0 && <Dashboard quotes={quotes} />}
      {state === "ready" && quotes.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-raphia/40 p-8 text-center text-ink/60">{t.admin.empty}</p>
      )}

      {state === "ready" && quotes.length > 0 && (
        <div className="card anim-table mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">{t.admin.title}</caption>
            <thead>
              <tr className="border-b border-raphia/25 bg-raphia/5 text-forest">
                <th scope="col" className="px-4 py-3 font-semibold">{t.admin.table.reference}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t.admin.table.date}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t.admin.table.company}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t.admin.table.country}</th>
                <th scope="col" className="px-4 py-3 font-semibold">{t.admin.table.products}</th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">{t.admin.table.total}</th>
              </tr>
            </thead>
            <tbody>
              {/* Les plus récentes en premier */}
              {[...quotes].reverse().map((q) => (
                <tr key={q.reference} className="border-b border-raphia/10 transition-colors duration-200 last:border-0 hover:bg-ocre/10">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-raphia">{q.reference}</td>
                  <td className="px-4 py-3 text-ink/70">{fmtDate(q.createdAt)}</td>
                  <td className="px-4 py-3 font-medium text-forest">{q.company}</td>
                  <td className="px-4 py-3 text-ink/80">{q.country}</td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5 text-ink/80">
                      {q.items.map((it) => (
                        <li key={it.slug}>
                          {lang === "en" ? it.nameEn : it.nameFr} <span className="text-ink/50">× {it.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{q.totalQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
