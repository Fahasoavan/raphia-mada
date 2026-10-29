"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { getProduct } from "@/data/products";

export default function AddToQuoteButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { t } = useI18n();
  const { add } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const product = getProduct(slug);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (!product) return null;

  function handleClick() {
    add(slug);
    setJustAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className={className || "btn-accent"}
      aria-label={`${t.productDetail.add} : ${product.name.fr}`}
    >
      {justAdded ? `✓ ${t.productsPage.added}` : t.productDetail.add}
    </button>
  );
}
