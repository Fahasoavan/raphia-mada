import type { Metadata } from "next";
import ProductsGrid from "./ProductsGrid";

export const metadata: Metadata = {
  title: "Produits — Catalogue en gros",
  description:
    "Catalogue d'artisanat en raphia en gros : paniers, sacs, chapeaux, tapis et sets de table. MOQ accessibles, prix dégressifs par palier, export Europe et USA.",
};

export default function ProductsPage() {
  return <ProductsGrid />;
}
