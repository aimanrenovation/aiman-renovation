import type { Metadata } from "next";
import { DevisPageContent } from "@/components/devis/devis-page-content";

export const metadata: Metadata = {
  title: "Devis gratuit — Aiman Renovation",
  description:
    "Demandez votre devis de renovation gratuit en ligne. Experience interactive 3D pour visualiser votre projet. Saint-Louis 68300.",
  openGraph: {
    title: "Devis gratuit — Aiman Renovation",
    description:
      "Configurez votre projet de renovation en 3D et recevez un devis gratuit.",
  },
};

export default function DevisPage() {
  return <DevisPageContent />;
}
