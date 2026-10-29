import type { Metadata } from "next";
import QuotePageView from "./QuotePageView";

export const metadata: Metadata = {
  title: "Ma demande de devis",
  description:
    "Composez votre sélection d'artisanat en raphia et recevez un devis chiffré sous 48 h : paniers, sacs, chapeaux, tapis et sets de table en gros.",
};

export default function DevisPage() {
  return <QuotePageView />;
}
