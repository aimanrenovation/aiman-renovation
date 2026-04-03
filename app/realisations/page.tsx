import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Découvrez nos projets de rénovation à Saint-Louis et environs. Cuisines, salles de bain, façades, aménagements extérieurs.",
};

const PROJECTS = [
  {
    title: "Cuisine ouverte contemporaine",
    service: "cuisine",
    location: "Saint-Louis",
    duration: "4 semaines",
    surface: "18 m²",
    description:
      "Transformation complète d'une cuisine fermée en un espace ouvert sur le séjour. Îlot central, plan de travail en quartz, éclairage LED encastré.",
  },
  {
    title: "Salle de bain parentale moderne",
    service: "salle-de-bain",
    location: "Huningue",
    duration: "3 semaines",
    surface: "9 m²",
    description:
      "Remplacement d'une baignoire par une douche à l'italienne. Double vasque suspendue, carrelage grand format imitation marbre, niche éclairée.",
  },
  {
    title: "Ravalement façade ITE",
    service: "facade-isolation",
    location: "Hésingue",
    duration: "5 semaines",
    surface: "180 m²",
    description:
      "Isolation thermique par l'extérieur d'une maison des années 70. Polystyrène 16 cm, enduit gratté ton pierre. Gain énergétique estimé : 40%.",
  },
  {
    title: "Jardin paysager avec terrasse",
    service: "paysager",
    location: "Blotzheim",
    duration: "3 semaines",
    surface: "85 m²",
    description:
      "Création d'une terrasse en bois composite, allées en pavés autobloquants, plantation de haies, éclairage extérieur LED.",
  },
  {
    title: "Borne de recharge en copropriété",
    service: "borne-recharge",
    location: "Saint-Louis",
    duration: "2 jours",
    surface: "—",
    description:
      "Installation d'une wallbox 7,4 kW dans le parking souterrain d'une copropriété de 24 lots. Tirage de câble depuis le tableau général.",
  },
  {
    title: "Installation photovoltaïque 6 kWc",
    service: "panneaux-photovoltaiques",
    location: "Bartenheim",
    duration: "3 jours",
    surface: "32 m² de panneaux",
    description:
      "Pose de 16 panneaux monocristallins sur toiture sud. Autoconsommation avec revente du surplus à EDF OA. Production estimée : 6 500 kWh/an.",
  },
  {
    title: "Rénovation complète appartement",
    service: "peinture-finitions",
    location: "Village-Neuf",
    duration: "6 semaines",
    surface: "72 m²",
    description:
      "Peinture complète (murs et plafonds), pose de parquet stratifié, rénovation électrique et remplacement de la salle de bain. Un appartement transformé.",
  },
  {
    title: "Mise aux normes électrique",
    service: "electricite",
    location: "Kembs",
    duration: "2 semaines",
    surface: "110 m²",
    description:
      "Remplacement complet du tableau électrique, passage de nouveaux câbles, ajout de prises et interrupteurs, installation éclairage LED dans toute la maison.",
  },
  {
    title: "Salle de bain PMR",
    service: "salle-de-bain",
    location: "Sierentz",
    duration: "3 semaines",
    surface: "7 m²",
    description:
      "Aménagement d'une salle de bain accessible : douche plain-pied extra-plate, barres d'appui, siège rabattable, sol antidérapant.",
  },
  {
    title: "Cuisine équipée sur mesure",
    service: "cuisine",
    location: "Hésingue",
    duration: "3 semaines",
    surface: "14 m²",
    description:
      "Cuisine en L avec rangements optimisés, crédence en carrelage métro, plan de travail stratifié imitation bois, éclairage sous meubles hauts.",
  },
  {
    title: "Rénovation plomberie maison",
    service: "plomberie",
    location: "Blotzheim",
    duration: "2 semaines",
    surface: "—",
    description:
      "Remplacement complet des canalisations en plomb par du PER. Installation d'un chauffe-eau thermodynamique. Création d'un point d'eau en buanderie.",
  },
  {
    title: "Carrelage salon et cuisine",
    service: "carrelage",
    location: "Huningue",
    duration: "2 semaines",
    surface: "45 m²",
    description:
      "Pose de carrelage grès cérame 60x120 imitation béton ciré. Ragréage complet du support, joints fins assortis, plinthes à gorge.",
  },
];

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
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button className="px-4 py-2 rounded-full bg-[#E50000] text-white text-sm">
              Tous
            </button>
            {SERVICES.slice(0, 6).map((s) => (
              <button
                key={s.slug}
                className="px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:border-[#E50000] hover:text-white text-sm transition-colors"
              >
                {s.shortTitle}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, i) => (
              <ScrollReveal
                key={i}
                direction="up"
                delay={0.05 * (i % 3)}
              >
                <div className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/5 hover:border-[#E50000]/30 transition-all h-full">
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <span className="text-6xl opacity-20">
                      {SERVICES.find((s) => s.slug === project.service)?.icon}
                    </span>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs text-gray-300">
                        {project.location}
                      </span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-[#E50000]">⏱</span>{" "}
                        {project.duration}
                      </span>
                      {project.surface !== "—" && (
                        <span className="flex items-center gap-1">
                          <span className="text-[#E50000]">📐</span>{" "}
                          {project.surface}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
