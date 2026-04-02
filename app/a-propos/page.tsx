import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "À propos",
  description: `${COMPANY.name} — ${COMPANY.experience} ans d'expérience en rénovation à ${COMPANY.city}.`,
};

export default function AProposPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-6xl">À <span className="text-[#E50000]">PROPOS</span></h1>
          <div className="mt-12 space-y-12">
            <div>
              <h2 className="font-heading text-2xl text-[#E50000] mb-4">NOTRE HISTOIRE</h2>
              <p className="text-gray-400 leading-relaxed">
                Fort de {COMPANY.experience} ans d&apos;expérience dans le bâtiment, Aiman a fondé {COMPANY.name} avec une conviction : chaque habitat mérite d&apos;être transformé avec le même soin, la même exigence et la même passion. Basés à {COMPANY.city}, nous intervenons dans tout le Haut-Rhin.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl text-[#E50000] mb-4">NOS VALEURS</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: "Qualité", desc: "Des matériaux sélectionnés, une exécution soignée. Aucun compromis." },
                  { title: "Transparence", desc: "Devis détaillé, suivi régulier, aucune surprise." },
                  { title: "Engagement", desc: "Nous rénovons jusqu'au bout de vos rêves. Chaque projet mené à terme." },
                ].map((v) => (
                  <div key={v.title} className="bg-[#111111] border border-white/5 rounded-lg p-6">
                    <h3 className="font-heading text-lg text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-heading text-2xl text-[#E50000] mb-4">ZONE D&apos;INTERVENTION</h2>
              <p className="text-gray-400 leading-relaxed">
                Nous intervenons à {COMPANY.city} et dans toutes les communes environnantes : Huningue, Hésingue, Village-Neuf, Blotzheim, Bartenheim, Kembs, Sierentz, Leymen, Hagenthal et au-delà.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
