"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-raphia/20 bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold">{t.siteName}</p>
          <p className="mt-2 max-w-xs text-sm text-cream/80">{t.footer.tagline}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-ocre">{t.footer.links}</p>
          <ul className="space-y-2 text-sm text-cream/85">
            <li><Link href="/" className="hover:text-ocre">{t.nav.home}</Link></li>
            <li><Link href="/produits" className="hover:text-ocre">{t.nav.products}</Link></li>
            <li><Link href="/devis" className="hover:text-ocre">{t.nav.quote}</Link></li>
            <li><Link href="/a-propos" className="hover:text-ocre">{t.nav.about}</Link></li>
            <li><Link href="/contact" className="hover:text-ocre">{t.nav.contact}</Link></li>
            <li>
              <Link href="/admin" className="text-cream/60 hover:text-ocre" data-admin>
                {t.footer.admin}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-ocre">{t.footer.contact}</p>
          <ul className="space-y-2 text-sm text-cream/85">
            <li><a href="mailto:zoanjarafahasoavana@gmail.com" className="hover:text-ocre">zoanjarafahasoavana@gmail.com</a></li>
            <li>
              <a href="https://wa.me/261344333443" target="_blank" rel="noopener noreferrer" className="hover:text-ocre">
                +261 34 43 334 43 (WhatsApp)
              </a>
            </li>
            <li>Antananarivo, Madagascar</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15 py-4 text-center text-xs text-cream/60">
        © {year} {t.siteName} · {t.footer.rights}
      </div>
    </footer>
  );
}

