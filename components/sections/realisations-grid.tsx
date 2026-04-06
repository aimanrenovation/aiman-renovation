"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/services";
import { useTranslations } from "next-intl";
import { BeforeAfterSlider } from "@/components/sections/before-after-slider";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

/* Static data that does NOT need translation (images, slugs, locations) */
const PROJECT_META = [
  { service: "cuisine", location: "Saint-Louis", before: "/images/realisations/cuisine-avant.jpg", after: "/images/realisations/cuisine-apres.jpg" },
  { service: "salle-de-bain", location: "Huningue", before: "/images/realisations/salle-de-bain-avant.jpg", after: "/images/realisations/salle-de-bain-apres.jpg" },
  { service: "facade-isolation", location: "Hésingue", before: "/images/realisations/facade-ite-avant.jpg", after: "/images/realisations/facade-ite-apres.jpg" },
  { service: "paysager", location: "Blotzheim", before: "/images/realisations/jardin-avant.jpg", after: "/images/realisations/jardin-apres.jpg" },
  { service: "borne-recharge", location: "Saint-Louis", before: "/images/realisations/borne-irve-avant.jpg", after: "/images/realisations/borne-irve-apres.jpg" },
  { service: "panneaux-photovoltaiques", location: "Bartenheim", before: "/images/realisations/panneaux-solaires-avant.jpg", after: "/images/realisations/panneaux-solaires-apres.jpg" },
  { service: "peinture-finitions", location: "Village-Neuf", before: "/images/realisations/peinture-avant.jpg", after: "/images/realisations/peinture-apres.jpg" },
  { service: "electricite", location: "Kembs", before: "/images/realisations/electricite-avant.jpg", after: "/images/realisations/electricite-apres.jpg" },
  { service: "plomberie", location: "Blotzheim", before: "/images/realisations/plomberie-avant.jpg", after: "/images/realisations/plomberie-apres.jpg" },
  { service: "carrelage", location: "Huningue", before: "/images/realisations/carrelage-avant.jpg", after: "/images/realisations/carrelage-apres.jpg" },
];

interface TranslatedProject {
  title: string;
  duration: string;
  surface: string;
  description: string;
}

interface TranslatedService {
  slug: string;
  shortTitle: string;
}

export function RealisationsGrid() {
  const tRoot = useTranslations();
  const tRealisations = useTranslations("realisations");
  const serviceItems = tRoot.raw("service_items") as TranslatedService[];
  const serviceMap = new Map(serviceItems.map((s) => [s.slug, s]));

  const translatedProjects = tRealisations.raw("projects") as TranslatedProject[];

  const PROJECTS = PROJECT_META.map((meta, i) => ({
    ...meta,
    title: translatedProjects[i]?.title ?? "",
    duration: translatedProjects[i]?.duration ?? "",
    surface: translatedProjects[i]?.surface ?? "",
    description: translatedProjects[i]?.description ?? "",
  }));

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
