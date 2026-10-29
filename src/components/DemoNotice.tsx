"use client";

import { useI18n } from "@/lib/i18n";

/** Bandeau RGPD/qualité des données : le site est une démo, pas de vraies données. */
export default function DemoNotice({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  return (
    <div
      role="note"
      className={`flex items-center gap-2 rounded-xl border border-ocre/50 bg-ocre/15 px-4 py-2.5 text-sm font-medium text-ink ${className}`}
    >
      <span aria-hidden="true">🪧</span> {t.admin.demoBanner}
    </div>
  );
}
