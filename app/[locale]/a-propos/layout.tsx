import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos — Artisan Rénovation depuis 19 ans",
  description:
    "Aiman Renovation, entreprise de rénovation à Saint-Louis (68300). 19 ans d'expérience, assurance décennale, devis gratuit. Découvrez notre équipe.",
};

export default function AProposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
