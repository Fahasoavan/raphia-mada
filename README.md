# 🧺 Raphia Mada — Site vitrine & demandes de devis

Site web complet pour **Raphia Mada**, un atelier malgache d'artisanat en raphia (paniers, sacs, chapeaux, tapis, sets de table) qui vend **en gros** à des boutiques, hôtels et distributeurs en Europe et aux États-Unis.

> ❌ **Pas de vente en ligne** : l'objectif du site est de collecter des **demandes de devis** (panier de devis → formulaire → enregistrement + tableau de bord admin).

---

## ⚡ Démarrage

```bash
npm install
npm run dev      # http://localhost:3000
```

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement sur le port **3000** |
| `npm run build` | Build de production (type-check + génération statique) |
| `npm start` | Serve le build de production sur le port 3000 |

---

## 🧱 Stack technique

| Élément | Choix |
|---|---|
| Framework | **Next.js 14** (App Router) + React 18 |
| Langage | **TypeScript** strict |
| Style | **Tailwind CSS 3** (palette personnalisée) |
| Polices | `next/font` intégré (Playfair Display + Inter via Google Fonts) |
| Données produits | Fichier statique `src/data/products.ts` |
| Stockage des devis | `data/quotes.json` (créé automatiquement) — **aucune base de données, aucune API externe** |
| Images | Zéro image distante : visuels **100 % SVG** (dégradés + motifs de tressage par catégorie) |

## 🎨 Design

- **Palette** : crème `#FAF5EA` · brun raphia `#8A5A2B` · vert profond `#2F4A3A` · ocre `#D9A441`
- **Typographie** : Playfair Display (serif, titres) + Inter (sans-serif, texte)
- Mobile-first, deux langues, identique sur tous les écrans

## 🌐 Langues

Sélecteur **FR / EN** dans l'en-tête. Dictionnaire maison `src/lib/translations.ts` (aucune lib i18n) ; la langue est conservée en `localStorage` (`raphia-mada-lang`) pendant toute la navigation.

---

## 📄 Pages

| Page | Route | Contenu |
|---|---|---|
| Accueil | `/` | Bandeau d'accroche, 3 arguments (fait main / traçabilité / export), 4 best-sellers, « Comment ça marche » en 4 étapes, 3 témoignages, CTA devis |
| Catalogue | `/produits` | Grille de 8 produits, **filtres par catégorie**, MOQ + prix d'appel sur chaque carte, bouton « Ajouter à ma demande de devis » |
| Fiche produit | `/produits/[slug]` | Description complète, dimensions, matières, MOQ, délai de production, **prix dégressifs par palier** (ex. 50 / 200 / 500 pièces), ajout au devis |
| Ma demande de devis | `/devis` | Panier (quantités modifiables, suppression, alerte MOQ, estimation indicative) + formulaire validé + **page de confirmation avec référence** (ex. `DEV-2026-0001`) |
| À propos | `/a-propos` | Histoire de l'atelier (fondé en 2016 à Antananarivo), valeurs, 5 étapes de fabrication |
| Contact | `/contact` | Coordonnées fictives, bouton WhatsApp (`wa.me` +261 34 00 000 00), formulaire simple (simulation offline) |
| Admin (démo) | `/admin` | **Dashboard** (KPIs animés + graphiques) et tableau de toutes les demandes. **Sans mot de passe — bandeau démo affiché** |

## 🧩 Route API

Une seule route : `POST`/`GET` sur **`/api/quotes`** (`src/app/api/quotes/route.ts`).

| Verbe | Réponse | Rôle |
|---|---|---|
| `GET /api/quotes` | `200 { quotes: [...] }` | Liste de toutes les demandes (utilisé par l'admin) |
| `POST /api/quotes` | `201 { ok, reference, quote }` | Enregistre la demande dans `data/quotes.json` et génère la référence `DEV-<année>-<compteur sur 4 chiffres>` |
| — | `400 { error: "validation", field, message }` | Validation serveur : nom, société, e-mail, pays, téléphone, items (slug inconnu, quantité ≤ 0, panier vide) |
| — | `400 { error: "invalid-json" }` | Corps non JSON |

Corps attendu du POST :

```json
{
  "name": "...", "company": "...", "email": "...", "country": "...", "phone": "+33612345678",
  "targetDate": "facultatif", "message": "facultatif",
  "items": [{ "slug": "panier-ambositra", "qty": 200 }]
}
```

Le fichier `data/quotes.json` est créé automatiquement (dossier `data/` au `cwd` du serveur) ; sa lecture tolère un BOM UTF-8.

## 🔬 Simulations possibles (QA)

1. **Parcours complet** : `/produits` → filtres → fiche → « Ajouter » sur 2–3 produits → `/devis` → montée d'une quantité sous la MOQ (alerte ocre) → envoi → confirmation `DEV-…` → `/admin`.
2. **Erreurs de validation** : chaque champ a son cas (nom trop court, e-mail invalide, téléphone invalide, slug inconnu, `qty: 0`, `items: []`, JSON cassé) — lecture du rôle `field`/`message` dans la réponse 400, ou à l'écran sous chaque champ.
3. **Persistance du panier** : localStorage `raphia-mada-quote-cart` — survit à la navigation et à la fermeture ; suppressions/quantités synchronisent l'entête.
4. **Admin live** : `/admin` **s'auto-rafraîchit toutes les 10 s** — envoyez un POST depuis un terminal et regardez le dashboard se mettre à jour.
5. **Réinitialisation démo** : vider `data/quotes.json` en `[]` (ou supprimer le fichier).

## 🛠️ Dashboard admin (/admin)

Calculé à la volée côté client depuis toutes les demandes (`useMemo`), aucune librairie de charts (SVG/CSS pur) :

- **5 KPIs** animés (compteur progressif) : demandes reçues, pièces demandées, valeur estimée (€, sur les prix unitaires), panier moyen, sociétés clientes distinctes
- **Évolution des demandes par mois** : histogramme des 12 derniers mois, valeur exacte au survol
- **Produits les plus demandés** (top 5), **demandes par pays** (top 6), **pièces par catégorie** — barres qui se déploient à l'apparition
- Tout est traduit FR/EN ; le dashboard se place avant le tableau « Toutes les demandes »

## 🎬 Animations & accessibilité

- Transitions de page (App Router `template.tsx`), apparitions au scroll (`IntersectionObserver`, `src/components/Reveal.tsx`), cascades de cartes, zoom visuel produits au survol, badge panier qui rebondit, onde de clic sur les boutons, barre de progression de lecture
- **`prefers-reduced-motion: reduce`** : toutes les animations/instantané
- Navigation clavier (skip-link, focus visibles), labels et `aria-*` sur les champs, contrastes vérifiés, état vide / chargement / erreur sur toutes les zones dynamiques
- SEO : `title` / `description` par page (via `generateMetadata` pour les fiches produits), admin en `noindex`

## 📁 Architecture du code

```
├── data/quotes.json               # demandes enregistrées (créé au premier POST)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # providers langue + panier, Header/Footer, metadata
│   │   ├── template.tsx           # transition de page
│   │   ├── page.tsx / Products    # accueil
│   │   ├── produits/              # catalogue (page.tsx + ProductsGrid.tsx) + [slug]
│   │   ├── devis/                 # panier + formulaire + confirmation
│   │   ├── a-propos/ contact/
│   │   ├── admin/                 # AdminView (tableau) + Dashboard (KPIs & charts)
│   │   └── api/quotes/route.ts    # GET / POST des devis
│   ├── components/                # Header (compteur, FR/EN, barre de scroll), Footer,
│   │                              # ProductCard, ProductVisual (SVG), Reveal, AddToQuoteButton
│   ├── data/products.ts           # 8 produits fictifs (FR/EN, MOQ, paliers de prix…)
│   └── lib/
│       ├── translations.ts        # dictionnaire FR/EN complet
│       ├── i18n.tsx               # LanguageProvider (localStorage)
│       └── cart.tsx               # CartProvider (panier de devis, localStorage)
```

**Clés localStorage** : `raphia-mada-lang` (langue) · `raphia-mada-quote-cart` (panier de devis).

## 🧪 Données de démonstration

8 produits fictifs : Panier d'Ambositra, Sac Toamasina, Chapeau Morondava, Tapis Analamanga, Set de table Ranomafana, Panier Vazimba, Sac Mahajanga, Chapeau Vohitsara — chacun avec description FR/EN, dimensions, matières, MOQ, délai et 3 paliers de prix dégressifs (€/pièce).

## ⚠️ Mentions

- Coordonnées (mail, téléphone, adresse, témoignages) **fictives**, à usage démo
- **`/admin` est volontairement sans mot de passe** (bandeau visible) — ne pas déployer tel quel en production
- Le formulaire de Contact est une **simulation** (aucun envoi réseau)

## 👤 Auteur

Site de démonstration — **Raphia Mada** · git « Anjara » · build vérifié avec Next.js 14.2.15.
