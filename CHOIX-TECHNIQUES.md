# Choix techniques — Raphia Mada

Document écrit pour un lecteur technique (recruteur ou pair). Il explique les décisions prises — et celles que je ne prendrais pas de la même façon en production.

---

## 1. De « JSON local » à une vraie base de données

**V1** : les demandes de devis étaient écrites dans `data/quotes.json` via `fs`. Sur Vercel, c'est faux par construction : le système de fichiers est **éphémère et en lecture seule** — chaque instance a son propre disque, créé le temps d'une requête.

**V2 (actuelle)** : une couche de stockage unique (`src/lib/quoteStore.ts`) derrière deux fonctions (`saveQuote`, `listQuotes`), avec deux implémentations :

| Mode | Déclencheur | Support |
|---|---|---|
| **Upstash Redis** (REST) | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` définis | Production (Vercel etc.), plan gratuit |
| **Fichier JSON** | fallback | `npm run dev` local, zéro config |

Détail de la modélisation Redis : chaque devis est un élément d'un **Sorted Set** (`ZADD raphia:quotes <score> <json>`). Deux revendications :
- **Écritures indépendantes en O(log n)** : deux formulaires envoyés en même temps ne s'écrasent plus mutuellement (le fichier JSON, lui, se réécrivait en totalité) ;
- **Lecture triée par date** (`ZREVRANGE`) sans index supplémentaire.

Le compteur de référence (`DEV-2026-0004`) est dérivé des demandes de l'année en cours côté serveur — simple, et suffisant à cette échelle.

## 2. Pourquoi pas de bibliothèque i18n

- La surface de traduction est **finie et connue** (une vitrine B2B, deux langues) : un dictionnaire typé TypeScript (`src/lib/translations.ts`) donne la vérification *compile-time* des clés manquantes, qu'aucune lib ne donne gratuitement.
- Un provider React natif (`Context`) + `localStorage` : **0 dépendance**, 0 bundle supplémentaire.
- Les contenus produits vivent dans les données (`name: { fr, en }`) — la traduction suit la donnée, pas une couche de pluriel/gender dont on n'a pas besoin.
- Une vraie lib (next-intl, i18next) deviendrait pertinente : routage `/fr`/`/en` avec locale dans l'URL pour le SEO international, formats de dates/nombres injectés côté serveur. C'est documenté dans « Ce que je ferais de plus ».

## 3. Pourquoi des SVG plutôt que des images

- **Zéro asset externe** : pas de photos à négocier, pas de licences, pas de CDN d'images — le site se build et se déploie sans rien télécharger.
- **Cohérence de la palette** : chaque visuel est dégradé `#FAF5EA → #8A5A2B → #2F4A3A` + motif de tressage distinctif **par catégorie** (panier, sac, chapeau, tapis, set de table). Les produits « ressemblent » à la marque, pas à une base photo générique.
- **Poids** : un visuel SVG inline pèse < 2 Ko, contre 40–120 Ko pour un JPEG webp équivalent ; petite First Load JS.
- En production, je remplacerais par une **photographie produit réelle** hébergée via `next/image` (lazy, formats AVIF/WebP, placeholders) — les SVG restent le fallback anti-« image manquante ».

## 4. État global : Context natifs, pas de Zustand/Redux

Deux états partagés seulement : la langue et le panier de devis. React Context + localStorage suffit et reste lisible (`src/lib/i18n.tsx`, `src/lib/cart.tsx`). Redux serait de l'over-engineering, Zustand un luxe. Les **règles métier** (MOQ, prix dégressifs par palier) restent dans la donnée (`products.ts`) — le panier ne fait qu'agrèger, le calcul de prix vit au même endroit que la donnée.

## 5. Sécurité & cycle de vie des données

| Risque | Réponse |
|---|---|
| Le filesystem n'est pas persistant | Base Redis (voir §1) |
| `/admin` public | `ADMIN_PASSWORD` (**12 caractères minimum**, fail closed → sinon mode démo) → cookie **httpOnly** + `sameSite=lax` + `secure` en prod, 12 h. Jeton de session **signé HMAC** (`{ exp }.sig`, secret dérivé du mot de passe + `ADMIN_SESSION_SECRET`) : un cookie volé expire automatiquement, et changer le mot de passe invalide toutes les sessions |
| Anniversaire de mot de passe / énumération | Login limité à **5 tentatives / 5 min / IP** (429 + `Retry-After`) |
| Visiteurs qui saisissent de vraies données | Bandeau visible sur tous les formulaires + **purge automatique à 30 jours** (`ZREMRANGEBYSCORE`, configurable via `QUOTE_RETENTION_DAYS`) |
| Saturation de la base (SPAM) | Rate limiting sur `POST /api/quotes` (**5 req/min/IP**, `INCR`+`EXPIRE` Redis partagé entre instances), plafond de 64 Ko par corps, limites par champ (message ≤ 2 000 caractères, ≤ 50 lignes, ≤ 1 M pièces) |
| Références de devis dupliquées | Compteur **atomique Redis `INCR`** par année (dev-only : fallback fichier, mono-utilisateur) ; la purge n'affecte plus la numérotation |
| Requêtes mal formées | Double validation (client + serveur), réponses 400 typées par champ |

## 6. Next.js 16 vs 14 (migration effectuée)

Le site est parti sur 14.2.15 puis mis à jour en **16.4.3** après plusieurs annonces de vulnérabilités (bypass de middleware, RCE, cache poisoning). Ce qui a été adapté :
- `params` des pages dynamiques devient une `Promise` (await) ;
- React 19 + `@types/react` 19 ;
- TypeScript target `ES2017`, associé à la runtime Turbopack du build ;
- `next lint` retiré (supprimé de Next 16 — utiliser ESLint directement) ;
- `postcss` forcé via `overrides` à une version patchée : **`npm audit` → 0 vulnérabilité**, sans passer par un audit `--force` aveugle.

## 7. Ce que je ferais de plus en production

1. **Base de données relationnelle** (Neon/Supabase Postgres) pour des requêtes analytiques (dashboard SQL) et un vrai UUID par demande — le Sorted Set Redis est une pause pragmatique, pas une destination.
2. **Anti-spam** : rate-limiting par IP + honeypot + captcha invisible (les bots adorent envoyer des devis).
3. **E-mail transactionnel** (Resend/Postmark) : accusé de réception au visiteur, notification à l'équipe, avec les mêmes données que l'API.
4. **CI/CD** : GitHub Actions (lint, `tsc --noEmit`, `next build`, `npm audit --omit=dev`) + déploiement preview Vercel par PR.
5. **Tests** : Vitest pour la logique de prix/panier, Playwright pour les parcours ( devis complet, login admin, mode démo).
6. **i18n à routage** : `/fr`, `/en` dans l'URL (next-intl) pour des URLs indexables par marché + `hreflang`.
7. **Conformité RGPD sérieuse** : consentement cookies, rétention choisie à l'inscription, export/suppression des données personnelle par demande.
8. **Observabilité** : Sentry (front + API), Uptime, et un webhook Slack sur `/api/quotes` 5xx.
9. **Catalogue piloté par CMS** (Sanity/Contentful) plutôt qu'un `data/products.ts` figé.
10. **Espace admin étendu** : export CSV, pagination, recherche, marquage « traité/en cours », historique des statuts.
