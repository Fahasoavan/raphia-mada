import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetailPage from "./ProductDetailPage";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name.fr} — Fiche produit`,
    description: `${product.short.fr} MOQ ${product.moq} pièces, prix dégressifs. Demande de devis Raphia Mada, export Europe & USA.`,
  };
}

export default function Page({ params }: Props) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  return <ProductDetailPage slug={params.slug} />;
}
