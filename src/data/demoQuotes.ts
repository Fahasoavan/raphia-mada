import type { QuoteRecord } from "@/app/api/quotes/route";

/**
 * Jeu de données FICTIF affiché sur /admin quand le site est en déploiement
 * public sans mot de passe configuré (ou pour la démo). Aucune vraie demande
 * n'est exposée : les noms de sociétés sont inventés de toutes pièces.
 */

const FAKE = [
  { company: "Maison Béa (démo)", country: "France", slug: "panier-ambositra", nameFr: "Panier d'Ambositra", nameEn: "Ambositra Basket", qty: 200, price: 8.4, days: 4 },  { company: "Casa Terra (démo)", country: "Espagne", slug: "sac-toamasina", nameFr: "Sac Toamasina", nameEn: "Toamasina Bag", qty: 120, price: 14.2, days: 9 },
  { company: "Nordic Homes (démo)", country: "Danemark", slug: "tapis-analamanga", nameFr: "Tapis Analamanga", nameEn: "Analamanga Rug", qty: 40, price: 29.5, days: 16 },
  { company: "Sunset Resort (démo)", country: "USA", slug: "chapeau-morondava", nameFr: "Chapeau Morondava", nameEn: "Morondava Hat", qty: 300, price: 6.6, days: 23 },
  { company: "Kilindi Interiors (démo)", country: "Allemagne", slug: "set-de-table-ranomafana", nameFr: "Set de table Ranomafana", nameEn: "Ranomafana Placemat", qty: 240, price: 4.1, days: 31 },
  { company: "Zebra Living (démo)", country: "USA", slug: "panier-vazimba", nameFr: "Panier Vazimba", nameEn: "Vazimba Basket", qty: 90, price: 10.6, days: 42 },
  { company: "Le Panier Doré (démo)", country: "France", slug: "sac-mahajanga", nameFr: "Sac Mahajanga", nameEn: "Mahajanga Bag", qty: 150, price: 18.4, days: 55 },
  { company: "Riviera Concept (démo)", country: "Italie", slug: "chapeau-vohitsara", nameFr: "Chapeau Vohitsara", nameEn: "Vohitsara Hat", qty: 210, price: 9.6, days: 63 },
  { company: "Harbor & Co (démo)", country: "Royaume-Uni", slug: "panier-ambositra", nameFr: "Panier d'Ambositra", nameEn: "Ambositra Basket", qty: 260, price: 8.4, days: 74 },
  { company: "Casa Terra (démo)", country: "Espagne", slug: "set-de-table-ranomafana", nameFr: "Set de table Ranomafana", nameEn: "Ranomafana Placemat", qty: 180, price: 4.1, days: 88 },
  { company: "Nordic Homes (démo)", country: "Danemark", slug: "chapeau-morondava", nameFr: "Chapeau Morondava", nameEn: "Morondava Hat", qty: 100, price: 6.6, days: 101 },
  { company: "Sunset Resort (démo)", country: "USA", slug: "tapis-analamanga", nameFr: "Tapis Analamanga", nameEn: "Analamanga Rug", qty: 60, price: 29.5, days: 118 },
];

export const demoQuotes: QuoteRecord[] = FAKE.map((f, i) => ({
  reference: `DEV-2026-${String(i + 1).padStart(4, "0")}`,
  createdAt: new Date(Date.now() - f.days * 24 * 60 * 60 * 1000).toISOString(),
  name: "Contact démo",
  company: f.company,
  email: "demo@example.com",
  country: f.country,
  phone: "+000 000 000",
  targetDate: "",
  message: "Jeu de données fictif (mode démo).",
  items: [{ slug: f.slug, nameFr: f.nameFr, nameEn: f.nameEn, qty: f.qty, unitPrice: f.price }],
  totalQty: f.qty,
}));
