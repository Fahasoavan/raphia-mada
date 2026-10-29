export type Lang = "fr" | "en";

export const fr = {
  // SEO & layout
  siteName: "Raphia Mada",
  siteTagline: "Artisanat malgache en raphia, export en gros",
  defaultDescription:
    "Atelier malgache d'artisanat en raphia : paniers, sacs, chapeaux, tapis et sets de table, vendus en gros à l'export vers l'Europe et les États-Unis. Demandez votre devis.",

  // Navigation
  nav: {
    home: "Accueil",
    products: "Produits",
    quote: "Ma demande de devis",
    about: "À propos",
    contact: "Contact",
    cartShort: "Devis",
    skipToContent: "Aller au contenu principal",
  },

  // Hero
  hero: {
    kicker: "Atelier d'artisanat · Export Europe & USA",
    title: "Le raffia malgache, tissé à la main pour vos boutiques et vos hôtels",
    subtitle:
      "Paniers, sacs, chapeaux, tapis et sets de table faits main dans notre atelier de Madagascar. Vente en gros sur devis, MOQ accessibles, export traité de A à Z.",
    cta: "Demander un devis",
    ctaCatalog: "Voir le catalogue",
  },

  // Arguments
  args: {
    title: "Pourquoi nous choisir",
    a1: {
      title: "Fait main, fait juste",
      text: "Chaque pièce est tressée par nos artisans à Madagascar, avec un contrôle qualité par lot avant expédition.",
    },
    a2: {
      title: "Traçabilité complète",
      text: "Matières, ateliers, teintures : vous savez exactement d'où vient chaque article et dans quelles conditions il a été fabriqué.",
    },
    a3: {
      title: "Export sans friction",
      text: "Emballages prêts-boutique, documentation douanière et livraison DDP en Europe et aux États-Unis.",
    },
  },

  // How it works
  how: {
    title: "Comment ça marche",
    subtitle: "De votre première demande au premier conteneur, en 4 étapes.",
    s1: { title: "1. Demande", text: "Sélectionnez vos produits et envoyez votre demande en 2 minutes." },
    s2: { title: "2. Devis sous 48 h", text: "Nous répondons avec un devis chiffré par palier de quantité." },
    s3: { title: "3. Échantillon", text: "Vous validez un échantillon physique avant la production de série." },
    s4: { title: "4. Commande", text: "Production, contrôle qualité, export : livraison sous 3 à 6 semaines." },
  },

  // Testimonials
  testimonials: {
    title: "Ils nous font confiance",
    t1: {
      text: "Qualité de tressage remarquable et délais toujours respectés. Nos clients parisiens adorent la collection chapeaux.",
      author: "Claire M.",
      role: "Acheteuse, boutique de décoration — Paris",
    },
    t2: {
      text: "Un vrai partenaire : transparent sur les prix, réactif sur les échantillons. Nous commandons deux fois par an depuis trois ans.",
      author: "Daniel R.",
      role: "Gérant de boutique — Austin, USA",
    },
    t3: {
      text: "Les paniers habillent parfaitement nos suites. D'élégants détails, un roulement sans souci.",
      author: "Ingrid S.",
      role: "Responsable achats, groupe hôtelier — Copenhague",
    },
  },

  // Home misc
  homeCta: {
    title: "Prêt à garnir vos rayons d'artisanat malgache ?",
    text: "Recevez un devis chiffré sous 48 h, sans engagement.",
    button: "Demander un devis",
  },

  // Products page
  productsPage: {
    title: "Notre catalogue",
    subtitle:
      "Une sélection de pièces signature, toutes disponibles en gros avec des minimums de commande adaptés aux détaillants.",
    filtersAll: "Tout",
    moq: "MOQ",
    moqLabel: "à partir de",
    pieces: "pièces",
    empty: "Aucun produit dans cette catégorie.",
    add: "Ajouter à ma demande de devis",
    added: "Ajouté à votre demande",
    from: "à partir de",
    perPiece: "€ / pièce",
    viewDetails: "Voir la fiche détaillée",
  },

  // Product categories
  categories: {
    baskets: "Paniers",
    bags: "Sacs",
    hats: "Chapeaux",
    rugs: "Tapis",
    tableware: "Sets de table",
  },

  // Product detail
  productDetail: {
    back: "Retour au catalogue",
    description: "Description",
    dimensions: "Dimensions",
    materials: "Matières",
    moq: "Quantité minimale (MOQ)",
    leadTime: "Délai de production",
    leadTimeValue: "jours ouvrés",
    indicativePrice: "Prix indicatif par palier de quantité",
    priceNote:
      "Prix unitaires indicatifs, hors transport, selon palier. Le devis final est établi sur mesure.",
    add: "Ajouter à ma demande de devis",
    notFound: "Produit introuvable",
    notFoundText: "Ce produit n'existe pas ou a été retiré du catalogue.",
    backHome: "Retour à l'accueil",
  },

  // Quote page
  quotePage: {
    title: "Ma demande de devis",
    subtitle: "Composez votre sélection, indiquez vos quantités et envoyez-nous votre demande.",
    cartTitle: "Votre sélection",
    empty: {
      title: "Votre demande de devis est vide",
      text: "Parcourez le catalogue et ajoutez les produits qui vous intéressent.",
      button: "Voir le catalogue",
    },
    qty: "Quantité",
    unitPrice: "Prix unitaire indicatif",
    lineTotal: "Sous-total ligne",
    remove: "Retirer",
    moqShort: "Minimum requis : {min} pièces",
    estimate: "Estimation indicative",
    formTitle: "Vos coordonnées",
    form: {
      name: "Nom et prénom",
      company: "Société",
      email: "E-mail professionnel",
      country: "Pays",
      phone: "Téléphone / WhatsApp",
      partOf: "Délai souhaité",
      partOfPlaceholder: "Ex. avant juin 2026",
      message: "Message (personnalisation, logistique…)",
      messagePlaceholder: "Dites-nous tout : personnalisation, logo, emballage, incoterm…",
      submit: "Envoyer ma demande",
      sending: "Envoi en cours…",
      optional: "facultatif",
    },
    errors: {
      name: "Veuillez indiquer votre nom.",
      company: "Veuillez indiquer votre société.",
      email: "Veuillez saisir un e-mail valide.",
      country: "Veuillez indiquer votre pays.",
      phone: "Veuillez indiquer un numéro valide (ou WhatsApp).",
      submit: "Une erreur est survenue. Veuillez réessayer.",
      qty: "La quantité doit être un nombre positif.",
    },
    confirm: {
      title: "Merci ! Votre demande est enregistrée.",
      text: "Notre équipe vous répond avec un devis chiffré sous 48 h ouvrées.",
      reference: "Numéro de référence",
      recap: "Récapitulatif de votre demande",
      back: "Retour à l'accueil",
      note: "Conservez ce numéro : il nous permet de retrouver votre dossier instantanément.",
    },
  },

  // About
  aboutPage: {
    title: "Notre histoire",
    meta: {
      founded: "Atelier fondé à Antananarivo en 2016",
      people: "37 artisans, 5 employés réguliers",
      export: "Europe & États-Unis",
    },
    story: {
      heading: "Une filière de confiance, du village à la boutique",
      p1: "Raphia Mada est né d'une conviction : le raffia malgache, tressé à la main selon des savoir-faire centenaires, peut rivaliser avec les plus beaux matériaux de la décoration mondiale — à condition de garantir des conditions de travail dignes et une qualité constante.",
      p2: "Depuis notre atelier d'Antananarivo et nos collectes auprès de familles de tisserands des Hauts Plateaux, nous produisons des paniers, sacs, chapeaux, tapis et sets de table pour des détaillants, hôtels et distributeurs en Europe et aux États-Unis. Chaque commande est suivie, chaque lot est contrôlé, chaque artisan est rémunéré au-delà du salaire médian régional.",
    },
    values: {
      heading: "Nos valeurs",
      v1: { title: "Commerce équitable", text: "Les tarifs artisans sont fixés et audités chaque année, indépendamment du volume commandé." },
      v2: { title: "Qualité constante", text: "Double contrôle : un contrôle à la fin du tissage, un contrôle avant expédition, échantillon physiquement approuvé par le client." },
      v3: { title: "Carbone maîtrisé", text: "Emballages recyclables, transport maritime par défaut, et achat de crédits carbone sur chaque conteneur." },
    },
    process: {
      heading: "Nos étapes de fabrication",
      s1: { title: "Récolte & séchage", text: "Le raffia est récolté, séché et trié selon un grade A/B/C au sein du village producteur." },
      s2: { title: "Tressage", text: "Nos tisserands et teinturières s'enchaînent le tressage traditionnel, à plat ou en spirale, à la main." },
      s3: { title: "Teinture", text: "Teintures végétales ou à faible impact, avec des séries-test résistantes à la lumière." },
      s4: { title: "Finition & contrôle", text: "Bords cousus, doublures ou anses posés, puis contrôle qualité par lot avant mise en carton." },
      s5: { title: "Emballage & export", text: "Emballages individuels prêts-boutique, cartons optimisés, documentation douanière préparée par nos soins." },
    },
  },

  // Contact
  contactPage: {
    title: "Contact",
    subtitle: "Une question, une personnalisation, une visite d'atelier ? Écrivez-nous ou WhatsApp nous.",
    email: "E-mail",
    phone: "Téléphone / WhatsApp",
    address: "Adresse",
    whatsapp: "Discuter sur WhatsApp",
    hours: "Lundi — vendredi, 9 h — 18 h (heure de Madagascar)",
    formTitle: "Envoyez-nous un message",
    form: {
      name: "Nom",
      email: "E-mail",
      message: "Message",
      submit: "Envoyer",
      sending: "Envoi…",
    },
    errors: {
      name: "Veuillez indiquer votre nom.",
      email: "Veuillez saisir un e-mail valide.",
      message: "Veuillez saisir votre message (10 caractères minimum).",
    },
    success: "Merci ! Votre message a bien été envoyé.",
    demo: "Formulaire de démonstration : aucun message n'est réellement transmis.",
  },

  // Admin
  admin: {
    banner: "Démo : page accessible sans mot de passe, créée uniquement pour l'exercice.",
    title: "Demandes reçues",
    table: {
      reference: "Référence",
      date: "Date",
      company: "Société",
      country: "Pays",
      products: "Produits",
      total: "Qté totale",
    },
    empty: "Aucune demande pour le moment. Les nouvelles demandes apparaîtront ici en temps réel.",
    loading: "Chargement des demandes…",
    error: "Impossible de charger les demandes.",
    auth: {
    protected: "Accès protégé",
    prompt: "Page réservée : entrez le mot de passe admin (défini dans la variable d'environnement ADMIN_PASSWORD).",
    password: "Mot de passe",
    submit: "Se connecter",
    connecting: "Connexion…",
    wrong: "Mot de passe incorrect.",
    logout: "Se déconnecter",
  },
  demoNote: "Mode démo public : le jeu de données affiché est 100 % fictif. Les demandes réelles ne sont jamais exposées sans mot de passe.",
  demoBanner: "Site de démonstration — n'entrez pas de vraies données personnelles dans les formulaires.",
  back: "Retour au site",
    dashboard: {
      title: "Tableau de bord",
      kpiRequests: "Demandes reçues",
      kpiUnits: "Pièces demandées",
      kpiRevenue: "Valeur estimée",
      kpiAvg: "Panier moyen",
      kpiSocieties: "Sociétés clientes",
      evolution: "Évolution des demandes (par mois)",
      topProducts: "Produits les plus demandés",
      byCountry: "Demandes par pays",
      byCategory: "Pièces par catégorie",
      requestsShort: "demandes",
      unitsShort: "pièces",
      noData: "Aucune donnée : les graphiques s'afficheront dès la première demande enregistrée.",
      recent: "Toutes les demandes",
    },
  },

  // Header cart
  cartBadge: "Compteur de produits dans la demande de devis",

  // Misc
  footer: {
    tagline: "Artisanat malgache en raffia, exporté avec soin.",
    links: "Navigation",
    contact: "Contact",
    newsletter: "Recevez nos arrivées de saison",
    rights: "Tous droits réservés.",
    admin: "Espace admin",
  },
};

export type Dict = typeof fr;

export const en: Dict = {
  siteName: "Raphia Mada",
  siteTagline: "Malagasy raffia craft, wholesale export",
  defaultDescription:
    "Malagasy raffia craft workshop: baskets, bags, hats, rugs and placemats, sold wholesale for export to Europe and the USA. Request your quote.",

  nav: {
    home: "Home",
    products: "Products",
    quote: "My quote request",
    about: "About",
    contact: "Contact",
    cartShort: "Quote",
    skipToContent: "Skip to main content",
  },

  hero: {
    kicker: "Craft workshop · Export Europe & USA",
    title: "Malagasy raffia, hand-woven for your boutiques and hotels",
    subtitle:
      "Baskets, bags, hats, rugs and placemats handmade in our Madagascar workshop. Wholesale on quote, accessible MOQs, export handled from A to Z.",
    cta: "Request a quote",
    ctaCatalog: "Browse the catalog",
  },

  args: {
    title: "Why choose us",
    a1: {
      title: "Handmade, done right",
      text: "Each piece is woven by our artisans in Madagascar, with quality inspection per batch before shipping.",
    },
    a2: {
      title: "Full traceability",
      text: "Materials, workshops, dyes: you know exactly where every item comes from and under which conditions it was made.",
    },
    a3: {
      title: "Frictionless export",
      text: "Shelf-ready packaging, customs paperwork and DDP delivery in Europe and the United States.",
    },
  },

  how: {
    title: "How it works",
    subtitle: "From your first inquiry to your first container, in 4 steps.",
    s1: { title: "1. Inquiry", text: "Pick your products and send your request in 2 minutes." },
    s2: { title: "2. Quote in 48 h", text: "We reply with a priced quote per quantity tier." },
    s3: { title: "3. Sample", text: "You approve a physical sample before production begins." },
    s4: { title: "4. Order", text: "Production, quality control, export: delivery in 3 to 6 weeks." },
  },

  testimonials: {
    title: "They trust us",
    t1: {
      text: "Outstanding weave quality and deadlines always met. Our Parisian clients love the hat collection.",
      author: "Claire M.",
      role: "Buyer, home décor boutique — Paris",
    },
    t2: {
      text: "A true partner: transparent on pricing, responsive on samples. We have ordered twice a year for three years.",
      author: "Daniel R.",
      role: "Store owner — Austin, USA",
    },
    t3: {
      text: "The baskets dress our suites perfectly. Elegant details, effortless replenishment.",
      author: "Ingrid S.",
      role: "Procurement manager, hotel group — Copenhagen",
    },
  },

  homeCta: {
    title: "Ready to fill your shelves with Malagasy craft?",
    text: "Get a detailed quote within 48 h, no commitment.",
    button: "Request a quote",
  },

  productsPage: {
    title: "Our catalog",
    subtitle: "A selection of signature pieces, all available wholesale with minimum order quantities suited to resellers.",
    filtersAll: "All",
    moq: "MOQ",
    moqLabel: "from",
    pieces: "pieces",
    empty: "No products in this category.",
    add: "Add to my quote request",
    added: "Added to your request",
    from: "from",
    perPiece: "€ / piece",
    viewDetails: "View full details",
  },

  categories: {
    baskets: "Baskets",
    bags: "Bags",
    hats: "Hats",
    rugs: "Rugs",
    tableware: "Placemats",
  },

  productDetail: {
    back: "Back to catalog",
    description: "Description",
    dimensions: "Dimensions",
    materials: "Materials",
    moq: "Minimum order quantity (MOQ)",
    leadTime: "Production lead time",
    leadTimeValue: "working days",
    indicativePrice: "Indicative price per quantity tier",
    priceNote: "Indicative unit prices, excluding shipping, by tier. The final quote is tailored to your order.",
    add: "Add to my quote request",
    notFound: "Product not found",
    notFoundText: "This product does not exist or has been removed from the catalog.",
    backHome: "Back to home",
  },

  quotePage: {
    title: "My quote request",
    subtitle: "Build your selection, adjust quantities and send us your request.",
    cartTitle: "Your selection",
    empty: {
      title: "Your quote request is empty",
      text: "Browse the catalog and add the products you are interested in.",
      button: "Browse the catalog",
    },
    qty: "Quantity",
    unitPrice: "Indicative unit price",
    lineTotal: "Line subtotal",
    remove: "Remove",
    moqShort: "Minimum required: {min} pieces",
    estimate: "Indicative estimate",
    formTitle: "Your details",
    form: {
      name: "Full name",
      company: "Company",
      email: "Business e-mail",
      country: "Country",
      phone: "Phone / WhatsApp",
      partOf: "Target deadline",
      partOfPlaceholder: "e.g. before June 2026",
      message: "Message (customization, logistics…)",
      messagePlaceholder: "Tell us everything: customization, logo, packaging, incoterm…",
      submit: "Send my request",
      sending: "Sending…",
      optional: "optional",
    },
    errors: {
      name: "Please enter your name.",
      company: "Please enter your company name.",
      email: "Please enter a valid e-mail address.",
      country: "Please enter your country.",
      phone: "Please enter a valid phone (or WhatsApp) number.",
      submit: "Something went wrong. Please try again.",
      qty: "Quantity must be a positive number.",
    },
    confirm: {
      title: "Thank you! Your request has been saved.",
      text: "Our team will reply with a detailed quote within 48 business hours.",
      reference: "Reference number",
      recap: "Request summary",
      back: "Back to home",
      note: "Keep this number: it lets us retrieve your file instantly.",
    },
  },

  aboutPage: {
    title: "Our story",
    meta: {
      founded: "Workshop founded in Antananarivo in 2016",
      people: "37 artisans, 5 regular staff",
      export: "Europe & United States",
    },
    story: {
      heading: "A trusted supply chain, from village to boutique",
      p1: "Raphia Mada was born from a conviction: Malagasy raffia, hand-woven using century-old know-how, can rival the finest materials in world décor — provided that dignified working conditions and consistent quality are guaranteed.",
      p2: "From our Antananarivo workshop and our collections from weaver families of the Highlands, we produce baskets, bags, hats, rugs and placemats for retailers, hotels and distributors across Europe and the United States. Every order is tracked, every batch is inspected, every artisan is paid above the regional median wage.",
    },
    values: {
      heading: "Our values",
      v1: { title: "Fair trade", text: "Artisan rates are set and audited every year, regardless of order volume." },
      v2: { title: "Consistent quality", text: "Double inspection: one at the end of weaving, one before shipping, with a physical sample approved by the client." },
      v3: { title: "Controlled footprint", text: "Recyclable packaging, sea freight by default, and carbon credits purchased for every container." },
    },
    process: {
      heading: "How we make our pieces",
      s1: { title: "Harvest & drying", text: "Raffia is harvested, dried and sorted into grades A/B/C at the producing village." },
      s2: { title: "Weaving", text: "Traditional weaving, flat or spiralled, entirely by hand by our weavers and dyers." },
      s3: { title: "Dyeing", text: "Vegetable or low-impact dyes, lightfastness checked on test batches." },
      s4: { title: "Finishing & control", text: "Stitched edges, linings or handles fitted, then batch quality control before boxing." },
      s5: { title: "Packing & export", text: "Shelf-ready individual packaging, optimized cartons, customs paperwork prepared by us." },
    },
  },

  contactPage: {
    title: "Contact",
    subtitle: "A question, a customization, a workshop visit? Write to us or reach us on WhatsApp.",
    email: "E-mail",
    phone: "Phone / WhatsApp",
    address: "Address",
    whatsapp: "Chat on WhatsApp",
    hours: "Monday — Friday, 9 am — 6 pm (Madagascar time)",
    formTitle: "Send us a message",
    form: {
      name: "Name",
      email: "E-mail",
      message: "Message",
      submit: "Send",
      sending: "Sending…",
    },
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid e-mail address.",
      message: "Please type your message (10 characters minimum).",
    },
    success: "Thank you! Your message has been sent.",
    demo: "Demo form: no message is actually transmitted.",
  },

  admin: {
    banner: "Demo: this page is accessible without a password, created for the exercise only.",
    title: "Received requests",
    table: {
      reference: "Reference",
      date: "Date",
      company: "Company",
      country: "Country",
      products: "Products",
      total: "Total qty",
    },
    empty: "No requests yet. New requests will appear here in real time.",
    loading: "Loading requests…",
    error: "Unable to load requests.",
    auth: {
    protected: "Protected area",
    prompt: "Staff only: enter the admin password (set in the ADMIN_PASSWORD environment variable).",
    password: "Password",
    submit: "Log in",
    connecting: "Signing in…",
    wrong: "Incorrect password.",
    logout: "Log out",
  },
  demoNote: "Public demo mode: the displayed dataset is 100% fictitious. Real requests are never exposed without a password.",
  demoBanner: "Demo site — please do not enter real personal data in the forms.",
  back: "Back to site",
    dashboard: {
      title: "Dashboard",
      kpiRequests: "Requests received",
      kpiUnits: "Pieces requested",
      kpiRevenue: "Estimated value",
      kpiAvg: "Average request",
      kpiSocieties: "Client companies",
      evolution: "Requests trend (by month)",
      topProducts: "Most requested products",
      byCountry: "Requests by country",
      byCategory: "Pieces by category",
      requestsShort: "requests",
      unitsShort: "pieces",
      noData: "No data yet: charts will appear with the first request.",
      recent: "All requests",
    },
  },

  cartBadge: "Number of items in the quote request",

  footer: {
    tagline: "Malagasy raffia craft, exported with care.",
    links: "Navigation",
    contact: "Contact",
    newsletter: "Get our seasonal arrivals",
    rights: "All rights reserved.",
    admin: "Admin area",
  },
};

export const translations: Record<Lang, Dict> = { fr, en };
