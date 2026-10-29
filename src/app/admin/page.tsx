import type { Metadata } from "next";
import AdminView from "./AdminView";

export const metadata: Metadata = {
  title: "Espace admin (démo)",
  description: "Page de démonstration : liste des demandes de devis reçues.",
  robots: { index: false },
};

export default function AdminPage() {
  return <AdminView />;
}
