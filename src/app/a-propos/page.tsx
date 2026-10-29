import type { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "À propos — Notre atelier",
  description:
    "L'histoire de l'atelier Raphia Mada à Antananarivo : artisans, valeurs de commerce équitable, qualité et export responsable.",
};

export default function AboutPage() {
  return <AboutView />;
}
