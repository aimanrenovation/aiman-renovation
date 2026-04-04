import type { Metadata } from "next";
import { RealisationsGrid } from "@/components/sections/realisations-grid";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Découvrez nos projets de rénovation à Saint-Louis et environs. Cuisines, salles de bain, façades, aménagements extérieurs.",
};

export default function RealisationsPage() {
  return (
    <>
      <section className="relative z-10 pt-32 pb-10 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl">
              NOS <span className="text-[#E50000]">RÉALISATIONS</span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
              Chaque projet est unique. Voici un aperçu de nos transformations à
              Saint-Louis et dans le Haut-Rhin. Des rénovations menées avec
              exigence, du premier coup de masse à la touche finale.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <RealisationsGrid />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
