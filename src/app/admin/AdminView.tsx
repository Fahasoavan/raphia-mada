"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { QuoteRecord } from "@/app/api/quotes/route";
import Reveal from "@/components/Reveal";
import Dashboard from "./Dashboard";

type State = "loading" | "ready" | "error" | "login" | "demo";

export default function AdminView() {
  const { t, lang } = useI18n();
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [state, setState] = useState<State>("loading");
  const [source, setSource] = useState<"redis" | "file">("file");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (res.status === 401) {
        setState("login");
        return;
      }
      if (!res.ok) {
        setState("error");
        return;
      }
      setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
      setSource(data.source === "redis" ? "redis" : "file");
      setState(data.demo ? "demo" : "ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => load(), 10000); // rafraîchissement auto (démo)
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthMessage("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword("");
        await load();
        return;
      }
      setAuthMessage(t.admin.auth.wrong);
    } catch {
      setAuthMessage(t.admin.error);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    await load();
  }

  /* Connexion : mot de passe du champ ADMIN_PASSWORD */
  if (state === "login") {
    return (
      <section className="mx-auto max-w-md px-4 py-20 sm:px-6">
        <Reveal>
          <form onSubmit={handleLogin} className="card p-8" aria-labelledby="login-title">
            <h1 id="login-title" className="section-title text-center">{t.admin.auth.protected}</h1>
            <p className="mt-2 text-center text-sm text-ink/70">{t.admin.auth.prompt}</p>
            <label htmlFor="admin-pw" className="label mt-6">{t.admin.auth.password}</label>
            <input
              id="admin-pw"
              type="password"
              autoComplete="current-password"
              className="input"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthMessage(""); }}
              required
            />
            {authMessage && <p role="alert" className="mt-2 text-xs font-medium text-red-700">{authMessage}</p>}
            <button type="submit" className="btn-primary mt-6 w-full">{t.admin.auth.submit}</button>
            <Link href="/" className="mt-4 block text-center text-sm text-raphia hover:underline">{t.admin.back}</Link>
          </form>
        </Reveal>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {state === "demo" && (
        <div role="note" className="rounded-xl bg-ocre/20 px-4 py-3 text-sm font-medium text-ink">
          ⚠ {t.admin.banner}
        </div>
      )}
      {state === "ready" && (
        <div role="note" className="rounded-xl bg-forest/10 px-4 py-3 text-sm font-medium text-forest">
          🔓 {t.admin.realDataNote} <span className="text-ink/50">({source === "redis" ? "Upstash Redis" : "JSON local"})</span>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="section-title">{t.admin.title}</h1>
        <div className="flex items-center gap-2">
          {state === "ready" && (
            <button onClick={handleLogout} className="btn-outline !px-4 !py-2 text-sm">{t.admin.auth.logout}</button>
          )}
          <Link href="/" className="btn-outline !px-4 !py-2 text-sm">{t.admin.back}</Link>
        </div>
      </div>

      {state === "loading" && <p className="mt-8 text-ink/60" aria-busy="true">{t.admin.loading}</p>}
      {state === "error" && <p role="alert" className="mt-8 text-red-700">{t.admin.error}</p>}

      {state === "demo" && (
        <p role="note" className="mt-4 rounded-xl bg-forest/10 px-4 py-3 text-sm font-medium text-forest">
          🔒 {t.admin.demoNote} <span className="text-ink/50">({source === "redis" ? "Upstash Redis" : "JSON local"})</span>
        </p>
      )}

      {(state === "ready" || state === "demo") && (
        <>
          <Dashboard quotes={quotes} />
          <RequestsTable quotes={quotes} fmtDate={fmtDate} lang={lang} />
        </>
      )}
    </section>
  );
}

/* ---------- Table des demandes ---------- */

function RequestsTable({
  quotes,
  fmtDate,
  lang,
}: {
  quotes: QuoteRecord[];
  fmtDate: (iso: string) => string;
  lang: "fr" | "en";
}) {
  const { t } = useI18n();
  return (
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
  );
}
