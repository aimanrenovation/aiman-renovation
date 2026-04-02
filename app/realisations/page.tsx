import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";
import { CtaBanner } from "@/components/sections/cta-banner";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description: "Découvrez nos projets de rénovation à Saint-Louis et environs. Avant/après.",
};

const PROJECTS = [
  { title: "Rénovation cuisine complète", service: "cuisine", location: "Saint-Louis" },
  { title: "Salle de bain moderne", service: "salle-de-bain", location: "Huningue" },
  { title: "Ravalement façade ITE", service: "facade-isolation", location: "Hésingue" },
  { title: "Aménagement jardin", service: "paysager", location: "Blotzheim" },
  { title: "Installation borne IRVE", service: "borne-recharge", location: "Saint-Louis" },
  { title: "Panneaux solaires toiture", service: "panneaux-photovoltaiques", location: "Bartenheim" },
];

export default function RealisationsPage() {
  return (
    <>
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-5xl md:text-6xl">NOS <span className="text-[#E50000]">RÉALISATIONS</span></h1>
            <p className="mt-4 text-gray-400 text-lg">Chaque projet est unique. Voici un aperçu de nos transformations.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button className="px-4 py-2 rounded-full bg-[#E50000] text-white text-sm">Tous</button>
            {SERVICES.slice(0, 6).map((s) => (
              <button key={s.slug} className="px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:border-[#E50000] hover:text-white text-sm transition-colors">{s.shortTitle}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => (
              <div key={i} className="group relative aspect-[4/3] bg-[#111111] rounded-lg overflow-hidden border border-white/5 hover:border-[#E50000]/30 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <span className="text-6xl opacity-20">{SERVICES.find((s) => s.slug === project.service)?.icon}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
