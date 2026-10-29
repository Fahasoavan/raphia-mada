import { Category, Product } from "@/data/products";

/**
 * Visuel produit 100 % SVG : fond dégradé basé sur la teinte du produit,
 * plus un motif de tressage distinctif par catégorie. Aucune image distante.
 */
export default function ProductVisual({
  product,
  className = "",
}: {
  product: Pick<Product, "slug" | "category" | "hue" | "name">;
  className?: string;
}) {
  const id = product.slug;
  const weave: Record<Category, React.ReactNode> = {
    baskets: (
      <g stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M20 45 Q50 25 80 45 Q65 70 35 70 Q15 55 20 45 Z" />
        <path d="M25 48 Q50 32 75 48" />
        <path d="M28 55 Q52 42 72 55" />
        <path d="M33 63 Q52 52 67 63" />
      </g>
    ),
    bags: (
      <g stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round">
        <rect x="28" y="42" width="44" height="34" rx="4" />
        <path d="M40 42 C40 30 60 30 60 42" />
        <path d="M32 52 H68 M32 62 H68" />
      </g>
    ),
    hats: (
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="3" fill="none" strokeLinecap="round">
        <ellipse cx="50" cy="62" rx="34" ry="9" />
        <path d="M32 62 C32 38 68 38 68 62" />
        <path d="M35 56 H65" />
      </g>
    ),
    rugs: (
      <g stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round">
        <rect x="18" y="32" width="64" height="42" rx="3" />
        <path d="M18 42 H82 M18 52 H82 M18 64 H82" />
        <path d="M32 32 V74 M50 32 V74 M68 32 V74" />
      </g>
    ),
    tableware: (
      <g stroke="rgba(255,255,255,0.45)" strokeWidth="3" fill="none" strokeLinecap="round">
        <rect x="22" y="38" width="40" height="28" rx="3" />
        <rect x="38" y="48" width="40" height="28" rx="3" />
        <path d="M30 38 V66 M38 38 V66 M46 38 V66" />
        <path d="M46 48 V76 M54 48 V76 M62 48 V76" />
      </g>
    ),
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${product.hue} 0%, #2F4A3A 130%)`,
      }}
      role="img"
      aria-label={product.name.fr}
    >
      {/* Trame de tressage en fond */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id={`weave-${id}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7 H14 M7 0 V14" stroke="#FAF5EA" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#weave-${id})`} />
      </svg>
      {/* Pictogramme central */}
      <svg viewBox="0 0 100 100" className="relative h-full w-full" aria-hidden="true">
        {weave[product.category]}
      </svg>
    </div>
  );
}
