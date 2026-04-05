import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/services/services-page-content";

export const metadata: Metadata = {
  title: "Nos Services de Rénovation à Saint-Louis (68)",
  description:
    "Cuisine, salle de bain, électricité, plomberie, carrelage, façades, isolation, peinture, bornes de recharge, photovoltaïque. Artisan qualifié Haut-Rhin.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
