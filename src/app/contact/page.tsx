import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'atelier Raphia Mada : e-mail, WhatsApp, adresse à Antananarivo. Réponse sous 48 h ouvrées pour toute demande de devis en gros.",
};

export default function ContactPage() {
  return <ContactView />;
}
