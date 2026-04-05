import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ScrollReveal } from "@/components/sections/scroll-reveal";

export const metadata: Metadata = {
  title: "À propos",
  description: `${COMPANY.name} — ${COMPANY.experience} ans d'expérience en rénovation à ${COMPANY.city}. Découvrez notre histoire, nos valeurs et notre processus de travail.`,
};

const STEPS = [
  {
    number: "01",
    title: "Premier contact",
    desc: "Vous nous appelez ou remplissez le formulaire en ligne. Nous échangeons sur votre projet, vos envies et votre budget. Pas de jargon, que du concret.",
  },
  {
    number: "02",
    title: "Visite technique",
    desc: "Nous nous déplaçons chez vous pour prendre les mesures, évaluer l'état existant et identifier les contraintes techniques. Cette visite est gratuite et sans engagement.",
  },
  {
    number: "03",
    title: "Devis détaillé",
    desc: "Sous 4 jours, vous recevez un devis complet : détail des travaux poste par poste, matériaux préconisés, planning prévisionnel et montant total. Tout est transparent.",
  },
  {
    number: "04",
    title: "Réalisation des travaux",
    desc: "Nos artisans interviennent selon le planning défini. Aiman supervise chaque chantier personnellement. Vous recevez des photos d'avancement régulières et pouvez nous joindre à tout moment.",
  },
  {
    number: "05",
    title: "Réception et suivi",
    desc: "Visite de réception ensemble, point par point. Si un détail ne vous convient pas, nous le corrigeons immédiatement. Notre garantie décennale vous protège pendant 10 ans.",
  },
];

const ENGAGEMENTS = [
  {
    icon: "🏆",
    title: "Qualité sans compromis",
    desc: "Matériaux sélectionnés auprès de fournisseurs reconnus, exécution soignée dans les règles de l'art. Nous ne sacrifions jamais la qualité pour gagner du temps.",
  },
  {
    icon: "📅",
    title: "Respect des délais",
    desc: "Le planning défini dans le devis est notre feuille de route. En cas d'imprévu (découverte d'amiante, intempéries), nous vous informons immédiatement et ajustons ensemble.",
  },
  {
    icon: "🧹",
    title: "Chantier propre",
    desc: "Bâches de protection dès le premier jour, évacuation régulière des gravats, nettoyage complet en fin de chantier. Vous récupérez votre logement prêt à vivre.",
  },
  {
    icon: "💬",
    title: "Communication transparente",
    desc: "Un interlocuteur unique du début à la fin. Photos d'avancement par WhatsApp ou e-mail. Disponible par téléphone du lundi au samedi.",
  },
  {
    icon: "🤝",
    title: "Écoute et conseil",
    desc: "Nous prenons le temps de comprendre vos besoins et vous conseillons honnêtement. Si une solution plus simple ou moins coûteuse existe, nous vous la proposons.",
  },
  {
    icon: "🔒",
    title: "Sérénité totale",
    desc: "Garantie décennale, RC professionnelle, assurance dommages-ouvrage sur demande. Vos travaux sont couverts, votre investissement est protégé.",
  },
];

const CERTIFICATIONS = [
  {
    title: "Garantie décennale",
    desc: "Assurance couvrant les dommages affectant la solidité de l'ouvrage ou le rendant impropre à sa destination, pendant 10 ans après réception des travaux.",
  },
  {
    title: "RC Professionnelle",
    desc: "Responsabilité Civile Professionnelle couvrant les dommages causés aux tiers pendant l'exécution des travaux.",
  },
  {
    title: "Certification IRVE",
    desc: "Qualification pour l'installation d'Infrastructures de Recharge pour Véhicules Électriques, obligatoire au-delà de 3,7 kW.",
  },
  {
    title: "Habilitations électriques",
    desc: "Nos électriciens disposent des habilitations B1V, B2V, BR et BC pour intervenir en toute sécurité sur les installations basse tension.",
  },
];

export default function AProposPage() {
  return (
    <>
      {/* En-tête */}
      <section className="relative z-10 pt-32 pb-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl">
            À <span className="text-[#E50000]">PROPOS</span>
          </h1>
          <p className="mt-6 text-gray-400 text-lg max-w-2xl">
            Découvrez qui nous sommes, comment nous travaillons et pourquoi
            nos clients nous font confiance depuis {COMPANY.experience} ans.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#111111] py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-heading text-3xl md:text-4xl mb-8">
              NOTRE <span className="text-[#E50000]">HISTOIRE</span>
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Tout commence par une passion. Depuis l&apos;âge de 20 ans, Aiman travaille dans le
                bâtiment. D&apos;abord comme ouvrier polyvalent, puis chef d&apos;équipe, il a appris
                chaque métier sur le terrain : la plomberie, l&apos;électricité, le carrelage,
                la peinture, l&apos;isolation. {COMPANY.experience} ans à poser, à construire, à rénover —
                des centaines de chantiers qui forgent un savoir-faire qu&apos;aucune école ne peut enseigner.
              </p>
              <p>
                En 2024, fort de cette expérience et porté par la volonté de proposer un service de
                rénovation différent — plus humain, plus transparent, plus exigeant — Aiman crée sa propre
                entreprise : <strong className="text-white">{COMPANY.name}</strong>. L&apos;idée est
                simple : offrir aux habitants de Saint-Louis et du Haut-Rhin un artisan de confiance,
                capable de prendre en charge un projet de A à Z, avec un seul interlocuteur.
              </p>
              <p>
                Installé au 14 rue de la Paix à Saint-Louis, au coeur du Trois Pays (France, Suisse,
                Allemagne), Aiman Renovation intervient dans toutes les communes environnantes. Chaque
                projet est abordé avec la même philosophie :{" "}
                <em className="text-[#E50000]">&ldquo;{COMPANY.slogan}&rdquo;</em> — une promesse
                qui se traduit par un engagement total sur la qualité, les délais et la satisfaction client.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Notre processus */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl">
                NOTRE <span className="text-[#E50000]">PROCESSUS</span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Du premier appel à la réception des travaux, un processus clair en 5 étapes.
              </p>
            </div>
            <div className="space-y-8">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className="flex items-start gap-6 bg-[#111111] border border-white/5 rounded-lg p-8 hover:border-[#E50000]/20 transition-colors"
                >
                  <div className="shrink-0 w-14 h-14 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                    <span className="font-heading text-[#E50000] text-xl">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Nos engagements */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#111111] py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl">
                NOS <span className="text-[#E50000]">ENGAGEMENTS</span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Ce ne sont pas des mots — ce sont des actes que nous appliquons sur chaque chantier.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENGAGEMENTS.map((e) => (
                <div
                  key={e.title}
                  className="bg-black border border-white/5 rounded-lg p-8"
                >
                  <span className="text-4xl">{e.icon}</span>
                  <h3 className="font-heading text-lg text-white mt-4 mb-2">{e.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Nos valeurs */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-heading text-3xl md:text-4xl mb-12 text-center">
              NOS <span className="text-[#E50000]">VALEURS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Qualité",
                  desc: "Des matériaux sélectionnés, une exécution soignée. Nous traitons chaque chantier comme si c'était le nôtre. Aucun compromis sur la qualité, jamais.",
                },
                {
                  title: "Transparence",
                  desc: "Devis détaillé poste par poste, suivi régulier avec photos, aucune surprise sur la facture finale. Vous savez exactement ce que vous payez et pourquoi.",
                },
                {
                  title: "Engagement",
                  desc: "Nous rénovons jusqu'au bout de vos rêves. Chaque projet mené à terme, dans les délais, avec la satisfaction du client comme seul objectif.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="bg-[#111111] border border-white/5 rounded-lg p-8"
                >
                  <h3 className="font-heading text-xl text-[#E50000] mb-3">{v.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Certifications et assurances */}
      <ScrollReveal direction="up">
        <section className="relative z-10 bg-[#111111] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl">
                CERTIFICATIONS & <span className="text-[#E50000]">ASSURANCES</span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                Votre sérénité repose sur des garanties concrètes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CERTIFICATIONS.map((cert) => (
                <div
                  key={cert.title}
                  className="bg-black border border-white/5 rounded-lg p-8 flex items-start gap-4"
                >
                  <div className="shrink-0 w-3 h-3 rounded-full bg-[#E50000] mt-2" />
                  <div>
                    <h3 className="font-heading text-lg text-white mb-2">{cert.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Zone d'intervention */}
      <ScrollReveal direction="up" delay={0.05}>
        <section className="relative z-10 bg-black py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-8">
              ZONE D&apos;<span className="text-[#E50000]">INTERVENTION</span>
            </h2>
            <p className="text-gray-400 leading-relaxed text-center max-w-2xl mx-auto mb-8">
              Basés au coeur de Saint-Louis, au carrefour des trois frontières, nous intervenons
              dans toutes les communes du sud du Haut-Rhin. Notre proximité nous permet d&apos;être
              réactifs et disponibles pour chaque chantier.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Saint-Louis",
                "Huningue",
                "Hésingue",
                "Village-Neuf",
                "Blotzheim",
                "Bartenheim",
                "Kembs",
                "Sierentz",
                "Leymen",
                "Hagenthal",
                "Rosenau",
                "Hégenheim",
              ].map((ville) => (
                <span
                  key={ville}
                  className="px-4 py-2 rounded-full border border-white/10 text-gray-300 text-sm"
                >
                  {ville}
                </span>
              ))}
              <span className="px-4 py-2 rounded-full border border-[#E50000]/30 text-[#E50000] text-sm">
                et au-delà sur demande
              </span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <CtaBanner />
    </>
  );
}
