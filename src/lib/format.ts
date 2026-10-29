/**
 * Formatage monétaire unifié : Intl.NumberFormat partout.
 * fr → « 9,80 » / en → « 9.80 » (les suffixes « € / pièce » restent dans les composants).
 */
export function formatNumber(value: number, lang: "fr" | "en", decimals = 2): string {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
