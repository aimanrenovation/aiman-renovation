"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/services";
import { useTranslations } from "next-intl";
import { BeforeAfterSlider } from "@/components/sections/before-after-slider";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

const PROJECTS = [
  {
    title: "Cuisine ouverte contemporaine",
    service: "cuisine",
    location: "Saint-Louis",
    duration: "4 semaines",
    surface: "18 m²",
    description:
      "Transformation complète d'une cuisine fermée en un espace ouvert sur le séjour. Îlot central, plan de travail en quartz, éclairage LED encastré.",
    before: "/images/realisations/cuisine-avant.jpg",
    after: "/images/realisations/cuisine-apres.jpg",
  },
  {
    title: "Salle de bain parentale moderne",
    service: "salle-de-bain",
    location: "Huningue",
    duration: "3 semaines",
    surface: "9 m²",
    description:
      "Remplacement d'une baignoire par une douche à l'italienne. Double vasque suspendue, carrelage grand format imitation marbre, niche éclairée.",
    before: "/images/realisations/salle-de-bain-avant.jpg",
    after: "/images/realisations/salle-de-bain-apres.jpg",
  },
  {
    title: "Ravalement façade ITE",
    service: "facade-isolation",
    location: "Hésingue",
    duration: "5 semaines",
    surface: "180 m²",
    description:
      "Isolation thermique par l'extérieur d'une maison des années 70. Polystyrène 16 cm, enduit gratté ton pierre. Gain énergétique estimé : 40%.",
    before: "/images/realisations/facade-ite-avant.jpg",
    after: "/images/realisations/facade-ite-apres.jpg",
  },
  {
    title: "Jardin paysager avec terrasse",
    service: "paysager",
    location: "Blotzheim",
    duration: "3 semaines",
    surface: "85 m²",
    description:
      "Création d'une terrasse en bois composite, allées en pavés autobloquants, plantation de haies, éclairage extérieur LED.",
    before: "/images/realisations/jardin-avant.jpg",
    after: "/images/realisations/jardin-apres.jpg",
  },
  {
    title: "Borne de recharge en copropriété",
    service: "borne-recharge",
    location: "Saint-Louis",
    duration: "2 jours",
    surface: "—",
    description:
      "Installation d'une wallbox 7,4 kW dans le parking souterrain d'une copropriété de 24 lots. Tirage de câble depuis le tableau général.",
    before: "/images/realisations/borne-irve-avant.jpg",
    after: "/images/realisations/borne-irve-apres.jpg",
  },
  {
    title: "Installation photovoltaïque 6 kWc",
    service: "panneaux-photovoltaiques",
    location: "Bartenheim",
    duration: "3 jours",
    surface: "32 m² de panneaux",
    description:
      "Pose de 16 panneaux monocristallins sur toiture sud. Autoconsommation avec revente du surplus à EDF OA. Production estimée : 6 500 kWh/an.",
    before: "/images/realisations/panneaux-solaires-avant.jpg",
    after: "/images/realisations/panneaux-solaires-apres.jpg",
  },
  {
    title: "Rénovation complète appartement",
    service: "peinture-finitions",
    location: "Village-Neuf",
    duration: "6 semaines",
    surface: "72 m²",
    description:
      "Peinture complète (murs et plafonds), pose de parquet stratifié, rénovation électrique et remplacement de la salle de bain. Un appartement transformé.",
    before: "/images/realisations/peinture-avant.jpg",
    after: "/images/realisations/peinture-apres.jpg",
  },
  {
    title: "Mise aux normes électrique",
    service: "electricite",
    location: "Kembs",
    duration: "2 semaines",
    surface: "110 m²",
    description:
      "Remplacement complet du tableau électrique, passage de nouveaux câbles, ajout de prises et interrupteurs, installation éclairage LED dans toute la maison.",
    before: "/images/realisations/electricite-avant.jpg",
    after: "/images/realisations/electricite-apres.jpg",
  },
  {
    title: "Rénovation plomberie maison",
    service: "plomberie",
    location: "Blotzheim",
    duration: "2 semaines",
    surface: "—",
    description:
      "Remplacement complet des canalisations en plomb par du PER. Installation d'un chauffe-eau thermodynamique. Création d'un point d'eau en buanderie.",
    before: "/images/realisations/plomberie-avant.jpg",
    after: "/images/realisations/plomberie-apres.jpg",
  },
  {
    title: "Carrelage salon et cuisine",
    service: "carrelage",
    location: "Huningue",
    duration: "2 semaines",
    surface: "45 m²",
    description:
      "Pose de carrelage grès cérame 60x120 imitation béton ciré. Ragréage complet du support, joints fins assortis, plinthes à gorge.",
    before: "/images/realisations/carrelage-avant.jpg",
    after: "/images/realisations/carrelage-apres.jpg",
  },
];

interface TranslatedService {
  slug: string;
  shortTitle: string;
}

export function RealisationsGrid() {
  const tRoot = useTranslations();
  const tRealisations = useTranslations("realisations");
  const serviceItems = tRoot.raw("service_items") as TranslatedService[];
  const serviceMap = new Map(serviceItems.map((s) => [s.slug, s]));

  const FILTER_SERVICES = [
    { slug: "all", label: tRealisations("filter_all") },
    ...SERVICES.map((s) => ({ slug: s.slug, label: serviceMap.get(s.slug)?.shortTitle ?? s.shortTitle })),
  ];

  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? PROJECTS
    : PROJECTS.filter((p) => p.service === activeFilter);

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {FILTER_SERVICES.map((f) => (
          <button
            key={f.slug}
            onClick={() => setActiveFilter(f.slug)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              activeFilter === f.slug
                ? "bg-[#E50000] text-white scale-105"
                : "border border-white/20 text-gray-400 hover:border-[#E50000] hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <ScrollReveal key={`${activeFilter}-${i}`} direction="up" delay={0.05 * (i % 3)}>
            <div className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/5 hover:border-[#E50000]/30 transition-all h-full">
              <div className="relative">
                <BeforeAfterSlider
                  before={project.before}
                  after={project.after}
                  title={project.title}
                />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 z-30">
                  <span className="text-xs text-gray-300">{project.location}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-white text-lg mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="text-[#E50000]">⏱</span> {project.duration}
                  </span>
                  {project.surface !== "—" && (
                    <span className="flex items-center gap-1">
                      <span className="text-[#E50000]">📐</span> {project.surface}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">{tRealisations("no_results")}</p>
      )}
    </>
  );
}
