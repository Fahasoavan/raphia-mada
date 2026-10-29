<div align="center">

# 🧺 Raphia Mada

**Site vitrine + collecte de devis d'un atelier d'artisanat en raphia à Madagascar, à destination des acheteurs B2B (boutiques, hôtels, distributeurs — Europe & USA).**

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38BDF8?logo=tailwindcss)
![npm audit](https://img.shields.io/badge/npm_audit-0_vulnerabilities-4C1)
![License](https://img.shields.io/badge/License-MIT-8A5A2B)

🌐 **Interface du visiteur : FR / EN** (sélecteur dans l'en-tête, conservé en navigation)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFahasoavan%2Fraphia-mada)

*Pas de vente en ligne : le parcours clé est le dépôt d'une **demande de devis** (panier de devis → formulaire → enregistrement en base → dashboard admin).*

</div>

---

## ⚡ Démarrage local

```bash
cp .env.example .env.local   # facultatif : tout marche sans
npm install
npm run dev                  # → http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Développement, port 3000 |
| `npm run build` | Build production (Turbopack + type-check strict) |
| `npm start` | Servir le build production |

## 🚀 Déploiement (Vercel)

1. Cliquez sur le bouton **Deploy with Vercel** ci-dessus (ou importez le repo manuellement).
2. Dans **Variables d'environnement**, définissez (voir `.env.example`) :
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — requises ! (sans elles, le stockage retombe en `data/quotes.json`, non persistant)
   - `ADMIN_PASSWORD` — protège `/admin` par mot de passe ; **non défini = mode démo public à données fictives**
   - `QUOTE_RETENTION_DAYS` — purge des demandes anciennes (défaut : 30)
3. Déployez : `npm audit` → **0 vulnérabilité** au moment du dernier build.

**Pourquoi Upstash ?** Le filesystem Vercel est éphémère : le stockage fichier (V1 du projet, conservé en fallback dev) est remplacé par Redis via son API REST — persistant, atomique, et gratuit à cette échelle. Détail du raisonnement dans [`CHOIX-TECHNIQUES.md`](./CHOIX-TECHNIQUES.md).

## 🏗️ Stack

| Élément | Choix |
|---|---|
| Framework | **Next.js 16.4.3** (App Router, Turbopack) + **React 19** |
| Langage | TypeScript strict |
| Style | Tailwind CSS 3 — palette crème `#FAF5EA`, raphia `#8A5A2B`, vert `#2F4A3A`, ocre `#D9A441` |
| Polices | `next/font` (Playfair Display + Inter) |
| Données produits | `src/data/products.ts` — 8 produits fictifs FR/EN (MOQ, 3 paliers de prix dégressifs) |
| Stockage devis | **Upstash Redis** (prod) / `data/quotes.json` (dev, fallback auto) |
| i18n | Dictionnaire typé maison + Context + localStorage (2 langues) |
| Visuels | **0 image distante** : SVG générés (dégradés + motif de tressage par catégorie) |
| Persistance ignorée | `data/quotes.json` (gitignore, recréé au 1er POST) |

## 📄 Pages

| Page | Route | Points clés |
|---|---|---|
| Accueil | `/` | Accroche, arguments (fait main / traçabilité / export), best-sellers, 4 étapes « comment ça marche », témoignages |
| Catalogue | `/produits` | 8 produits, filtres par catégorie, MOQ affichée, bouton « ajouter à ma demande de devis » |
| Fiche produit | `/produits/[slug]` | Dimensions, matières, MOQ, délai, prix dégressifs 50/200/500, authentification depuis URL dynamique |
| Ma demande de devis | `/devis` | Panier (localStorage) avec alerte MOQ, estimation indicative, formulaire validé client + serveur → confirmation avec référence `DEV-2026-0001` |
| À propos | `/a-propos` | Histoire de l'atelier (2016, Antananarivo), valeurs, 5 étapes de fabrication |
| Contact | `/contact` | Coordonnées fictives, WhatsApp `wa.me`, formulaire de démonstration |
| Admin | `/admin` | **Dashboard** (KPIs + charts animés) + tableau des demandes ; protégé par mot de passe ou mode démo |

## 🔌 API

| Verbe | Route | Description |
|---|---|---|
| `POST` | `/api/quotes` | Dépôt public d'une demande → `201 { ok, reference, quote }` ; `400 { error:"validation", field }` sur champ invalide |
| `GET` | `/api/quotes` | Données des demandes, **réservées à l'admin** : `401` avec cookie d'une session (POST `/api/admin/login` avec `ADMIN_PASSWORD`) ; sinon **données fictives** + flag `demo: true` (déploiement public sans mot de passe) |
| `POST` | `/api/admin/login` | Session 12 h (cookie httpOnly) |
| `POST` | `/api/admin/logout` | Fermeture de session |

Corps attendu du POST :

```json
{
  "name": "…", "company": "…", "email": "…", "country": "…", "phone": "+33612345678",
  "targetDate": "facultatif", "message": "facultatif",
  "items": [{ "slug": "panier-ambositra", "qty": 200 }]
}
```

## 🛠️ Dashboard admin

Calcul à la volée (`useMemo`) sur toutes les demandes, **graphiques SVG/CSS maison** (aucune librairie) :

- **5 KPIs** animés : demandes reçues, pièces, valeur estimée (€), panier moyen, sociétés distinctes
- **Évolution mensuelle** : histogramme 12 mois (valeur au survol)
- **Top produits**, **répartition pays**, **répartition catégories** — barres déployées animées
- Mise à jour automatique toutes les 10 s

## 🎬 Animations & accessibilité

Transitions de page (`template.tsx`), apparitions au scroll (`IntersectionObserver`), cascades, zoom produits, badge panier animé, onde de clic sur les boutons, barre de progression de lecture — le tout **désactivé automatiquement** sur `prefers-reduced-motion: reduce`. Navigation clavier (skip-link), labels/`aria-*`, contrastes vérifiés, états vides/chargement/erreur partout, SEO par page.

## 📁 Architecture

```
├── CHOIX-TECHNIQUES.md            # réflexion d'ingénieur (migrations, arbitraires, production)
├── .env.example                   # variables d'environnement documentées
├── data/quotes.json               # fallback dev (gitignore)
└── src/
    ├── app/
    │   ├── layout.tsx  template.tsx
    │   ├── page.tsx               # accueil
    │   ├── produits/  devis/  a-propos/  contact/
    │   ├── admin/                 # AdminView (connexion + tableau) + Dashboard
    │   └── api/{quotes,admin}     # POST/GET devis, login/logout
    ├── components/                # Header (compteur, FR/EN, barre de lecture), ProductCard,
    │                              # ProductVisual, Reveal, DemoNotice, AddToQuoteButton…
    ├── data/                      # products.ts (catalogue), demoQuotes.ts (jeu fictif)
    └── lib/                       # translations.ts (FR/EN), i18n.tsx, cart.tsx,
                                   # quoteStore.ts (Redis/JSON), adminAuth.ts
```

## ⚠️ Mentions démo

- Coordonnées, produits, témoignages et sociétés **fictifs**
- Bandeau « n'entrez pas de vraies données » sur les formulaires + purge automatique à 30 jours
- `/admin` est protégé par mot de passe **si configuré** — sinon mode démo (données fictives) : non exposées de données réelles en public

## 👤 Auteur

**Anjara Fahasoavan** — [zoanjarafahasoavana@gmail.com](mailto:zoanjarafahasoavana@gmail.com) · [github.com/Fahasoavan](https://github.com/Fahasoavan)
