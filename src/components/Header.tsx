"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Barre de progression de lecture au sommet de la page
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/produits", label: t.nav.products },
    { href: "/a-propos", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function switchLang(next: "fr" | "en") {
    setLang(next);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-raphia/20 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre rounded">
          {/* Monogramme feuille de raphia */}
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" className="shrink-0">
            <circle cx="15" cy="15" r="14" fill="#2F4A3A" />
            <path
              d="M15 25 C15 25 8 18 8 12 C8 7.5 11 5 15 5 C19 5 22 7.5 22 12 C22 18 15 25 15 25 Z M15 8 V22 M10 12.5 L20 15.5 M11 10 L19 19"
              stroke="#D9A441"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <span>Raphia Mada</span>
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition hover:text-ocre ${
                pathname === l.href ? "text-ocre" : "text-forest"
              }`}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Compteur de devis */}
          <Link
            href="/devis"
            className="relative inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:bg-forest-dark"
            aria-label={`${t.nav.quote} (${count})`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 2h2l1.5 8.5h8L16 5H6" stroke="#FAF5EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="14" r="1.4" fill="#FAF5EA" />
              <circle cx="13" cy="14" r="1.4" fill="#FAF5EA" />
            </svg>
            <span className="hidden sm:inline">{t.nav.cartShort}</span>
            <span
              key={count}
              aria-hidden="false"
              className="badge-pop rounded-full bg-ocre px-2 text-xs font-bold text-ink"
              title={t.cartBadge}
            >
              {count}
            </span>
          </Link>

          {/* Sélecteur FR / EN */}
          <div className="overflow-hidden rounded-full border border-raphia/40 text-xs font-semibold" role="group" aria-label="Langue / Language">
            {(["fr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1.5 uppercase transition ${
                  lang === l ? "bg-raphia text-cream" : "text-raphia hover:bg-raphia/10"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden rounded p-2 text-forest hover:bg-raphia/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              {open ? (
                <path d="M5 5 L17 17 M17 5 L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Barre de progression de lecture (repositionnée à chaque changement de page) */}
      <div
        key={pathname}
        className="h-[3px] w-full bg-transparent"
        role="presentation"
        aria-hidden="true"
      >
        <div
          className="h-full origin-left bg-ocre transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Nav mobile */}
      {open && (
        <nav id="mobile-nav" aria-label="Navigation mobile" className="border-t border-raphia/20 bg-cream md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block rounded px-3 py-3 text-sm font-medium transition hover:bg-raphia/10 ${
                    pathname === l.href ? "text-ocre" : "text-forest"
                  }`}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
