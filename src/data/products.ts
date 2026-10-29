export type Category = "baskets" | "bags" | "hats" | "rugs" | "tableware";

export interface PriceTier {
  qty: number;
  price: number; // euros / pièce, prix dégressif
}

export interface Product {
  slug: string;
  name: { fr: string; en: string };
  short: { fr: string; en: string };
  description: { fr: string; en: string };
  category: Category;
  dimensions: string;
  materials: string;
  moq: number;
  leadTimeDays: number;
  tiers: PriceTier[];
  hue: string; // couleur de base du visuel dégradé
}

export const CATEGORY_ORDER: Category[] = ["baskets", "bags", "hats", "rugs", "tableware"];

export const products: Product[] = [
  {
    slug: "panier-ambositra",
    name: { fr: "Panier d'Ambositra", en: "Ambositra Basket" },
    short: {
      fr: "Grand panier de rangement à anses, tressage serré.",
      en: "Large storage basket with handles, tight weave.",
    },
    description: {
      fr: "Panier artisanal tressé à la main dans notre atelier d'Ambositra. Structure rigide en raphia double épaisseur, anses renforcées et finition au naturel. Idéal pour le rangement décoratif en boutique, hôtellerie et concept stores. Teintures végétales non toxiques.",
      en: "Hand-woven artisanal basket from our Ambositra workshop. Rigid double-layer raphia structure, reinforced handles and natural finish. Ideal for decorative storage in shops, hotels and concept stores. Non-toxic vegetable dyes.",
    },
    category: "baskets",
    dimensions: "Ø 40 × H 35 cm",
    materials: "100 % raphia naturel, teinture végétale",
    moq: 50,
    leadTimeDays: 30,
    tiers: [
      { qty: 50, price: 9.8 },
      { qty: 200, price: 8.4 },
      { qty: 500, price: 7.1 },
    ],
    hue: "#8A5A2B",
  },
  {
    slug: "sac-toamasina",
    name: { fr: "Sac Toamasina", en: "Toamasina Bag" },
    short: {
      fr: "Cabas fourre-tout tressé, doublure coton.",
      en: "Woven tote bag, cotton lining.",
    },
    description: {
      fr: "Cabas spacieux au tressage souple, fermé par une patte en couscous de raphia. Doublure en coton bio et pochette intérieure zippée. Pièce phare pour boutiques de mode durable et resorts côtiers.",
      en: "Spacious bag with flexible weave, closed by a raphia button-in-tab flap. Organic cotton lining and zippered inner pocket. A flagship piece for sustainable fashion boutiques and coastal resorts.",
    },
    category: "bags",
    dimensions: "38 × 32 × 14 cm, anses 60 cm",
    materials: "Raphia naturel + doublure coton bio",
    moq: 80,
    leadTimeDays: 35,
    tiers: [
      { qty: 80, price: 16.5 },
      { qty: 300, price: 14.2 },
      { qty: 800, price: 12.4 },
    ],
    hue: "#2F4A3A",
  },
  {
    slug: "chapeau-morondava",
    name: { fr: "Chapeau Morondava", en: "Morondava Hat" },
    short: {
      fr: "Chapeau de soleil au large bord, calotte souple.",
      en: "Wide-brim sun hat, relaxed crown.",
    },
    description: {
      fr: "Chapeau de soleil au bord large (10 cm), calotte souple non structurée. Tressage fin grade A, bord cousu au fil de raphia pour garantir la forme après transport. Personnalisation par ruban tissé sur commande.",
      en: "Sun hat with wide 10 cm brim and soft unstructured crown. Grade A fine weave, brim stitched with raphia thread to keep shape in transit. Custom woven ribbon available on request.",
    },
    category: "hats",
    dimensions: "Tour de tête 57 cm, bord 10 cm",
    materials: "Raphia grade A, fil de raphia",
    moq: 100,
    leadTimeDays: 25,
    tiers: [
      { qty: 100, price: 7.9 },
      { qty: 400, price: 6.6 },
      { qty: 1000, price: 5.5 },
    ],
    hue: "#D9A441",
  },
  {
    slug: "tapis-analamanga",
    name: { fr: "Tapis Analamanga", en: "Analamanga Rug" },
    short: {
      fr: "Tapis moelleux tressé en spirale, motif géométrique.",
      en: "Plush spiral-woven rug, geometric pattern.",
    },
    description: {
      fr: "Tapis épais tressé en spirale continue, motif géométrique inspiré des lambas malgaches. Anti-dérapant naturel grâce à la trame serrée, entretien facile à l'aspirateur. Décor idéal pour spas, hôtels et locations saisonnières.",
      en: "Thick rug woven in a continuous spiral with a geometric pattern inspired by Malagasy lambas. Naturally non-slip thanks to the tight weave, easy to vacuum-clean. Ideal decor for spas, hotels and short-stay rentals.",
    },
    category: "rugs",
    dimensions: "120 × 80 cm (autre sur mesure)",
    materials: "Raphia épais, teintures naturelles",
    moq: 30,
    leadTimeDays: 45,
    tiers: [
      { qty: 30, price: 34.0 },
      { qty: 120, price: 29.5 },
      { qty: 300, price: 25.0 },
    ],
    hue: "#6E451F",
  },
  {
    slug: "set-de-table-ranomafana",
    name: { fr: "Set de table Ranomafana", en: "Ranomafana Placemat" },
    short: {
      fr: "Set de table tressé à motifs, lot de 4.",
      en: "Patterned woven placemat, set of 4.",
    },
    description: {
      fr: "Set de 4 sets de table rectangulaires au tressage à chevrons, bordure contrastée dans trois coloris d'atelier. Rigidité douce et nettoyage par simple humidité. Vendu par lots de 4, emballage kraft prêt-boutique.",
      en: "Set of 4 rectangular placemats with chevron weave and contrasting border in three workshop colours. Soft firmness and wipe-clean care. Sold in sets of 4, shop-ready kraft packaging.",
    },
    category: "tableware",
    dimensions: "45 × 30 cm / set",
    materials: "Raphia tressé chevron",
    moq: 60,
    leadTimeDays: 20,
    tiers: [
      { qty: 60, price: 4.9 },
      { qty: 240, price: 4.1 },
      { qty: 600, price: 3.4 },
    ],
    hue: "#4A6B55",
  },
  {
    slug: "panier-vazimba",
    name: { fr: "Panier Vazimba", en: "Vazimba Basket" },
    short: {
      fr: "Panier carré empilable, couvercle fermant.",
      en: "Stackable square basket, closing lid.",
    },
    description: {
      fr: "Panier de rangement carré et empilable avec couvercle ajusté. Structure autoportante, coins renforcés à double tressage. Formats prisés des concept stores et hôtels-boutiques.",
      en: "Square, stackable storage basket with a tight-fitting lid. Self-supporting structure, reinforced double-weave corners. Popular with concept stores and boutique hotels.",
    },
    category: "baskets",
    dimensions: "30 × 30 × 24 cm",
    materials: "Raphia double épaisseur",
    moq: 50,
    leadTimeDays: 30,
    tiers: [
      { qty: 50, price: 12.3 },
      { qty: 200, price: 10.6 },
      { qty: 500, price: 8.9 },
    ],
    hue: "#B08050",
  },
  {
    slug: "sac-mahajanga",
    name: { fr: "Sac Mahajanga", en: "Mahajanga Bag" },
    short: {
      fr: "Sac bandoulière compact à tressage croisé.",
      en: "Compact crossbody bag, crosshatch weave.",
    },
    description: {
      fr: "Petit sac bandoulière au tressage croisé très fin, anse cuir véritable et fermeture aimantée. Pièce d'été premium adaptée aux boutiques urbaines et destinations touristiques.",
      en: "Small crossbody bag with a very fine crosshatch weave, genuine leather strap and magnetic closure. A premium summer piece for urban boutiques and tourist destinations.",
    },
    category: "bags",
    dimensions: "24 × 18 × 8 cm",
    materials: "Raphia fin + cuir véritable",
    moq: 100,
    leadTimeDays: 35,
    tiers: [
      { qty: 100, price: 21.0 },
      { qty: 300, price: 18.4 },
      { qty: 700, price: 15.9 },
    ],
    hue: "#8A5A2B",
  },
  {
    slug: "chapeau-vohitsara",
    name: { fr: "Chapeau Vohitsara", en: "Vohitsara Hat" },
    short: {
      fr: "Chapeau fedora structuré, ruban contrasté.",
      en: "Structured fedora hat, contrast band.",
    },
    description: {
      fr: "Chapeau fedora structuré à calotte calibrée et ruban contrastant, gardé en forme grâce à un vernis naturel. Édition premium pour boutiques de centre-ville et concept stores de glisse.",
      en: "Structured fedora with calibrated crown and contrast band, kept in shape by a natural varnish. A premium edition for downtown boutiques and resort concept stores.",
    },
    category: "hats",
    dimensions: "Tour de tête 58 cm, bord 8 cm",
    materials: "Raphia grade A + ruban tissé",
    moq: 100,
    leadTimeDays: 28,
    tiers: [
      { qty: 100, price: 11.2 },
      { qty: 400, price: 9.6 },
      { qty: 1000, price: 8.1 },
    ],
    hue: "#D9A441",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
