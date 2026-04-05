import type { Metadata } from "next";
import { DevisPageContent } from "@/components/devis/devis-page-content";

export const metadata: Metadata = {
  title: "Devis Gratuit Rénovation — Saint-Louis et Haut-Rhin",
  description:
    "Demandez votre devis gratuit en ligne pour vos travaux de rénovation à Saint-Louis et dans le Haut-Rhin. Réponse sous 4 jours, sans engagement.",
  openGraph: {
    title: "Devis Gratuit Rénovation — Saint-Louis et Haut-Rhin",
    description:
      "Demandez votre devis gratuit en ligne pour vos travaux de rénovation à Saint-Louis et dans le Haut-Rhin. Réponse sous 4 jours, sans engagement.",
  },
};

export default function DevisPage() {
  return <DevisPageContent />;
}
