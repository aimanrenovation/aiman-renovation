"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANY } from "@/lib/constants";
import { CtaBanner } from "@/components/sections/cta-banner";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { number: "01", title: "Premier contact", desc: "Vous nous appelez ou remplissez le formulaire en ligne. Nous échangeons sur votre projet, vos envies et votre budget.", image: "/images/process-contact.jpg" },
  { number: "02", title: "Visite technique", desc: "Nous nous déplaçons chez vous pour prendre les mesures et évaluer l'état existant. Gratuit et sans engagement.", image: "/images/process-visite.jpg" },
  { number: "03", title: "Devis détaillé", desc: "Sous 4 jours, vous recevez un devis complet : travaux poste par poste, matériaux, planning et montant total.", image: "/images/process-devis.jpg" },
  { number: "04", title: "Réalisation", desc: "Nos artisans interviennent selon le planning. Aiman supervise chaque chantier. Photos d'avancement régulières.", image: "/images/process-travaux.jpg" },
  { number: "05", title: "Réception", desc: "Visite de réception ensemble, point par point. Notre garantie décennale vous protège pendant 10 ans.", image: "/images/process-reception.jpg" },
];

const ENGAGEMENTS = [
  { icon: "quality", title: "Qualité sans compromis", desc: "Matériaux sélectionnés, exécution soignée dans les règles de l'art.", image: "/images/engage-qualite.jpg" },
  { icon: "calendar", title: "Respect des délais", desc: "Le planning du devis est notre feuille de route. Aucune mauvaise surprise.", image: "/images/engage-delais.jpg" },
  { icon: "clean", title: "Chantier propre", desc: "Protection dès le premier jour, nettoyage complet en fin de chantier.", image: "/images/engage-propre.jpg" },
  { icon: "chat", title: "Transparence totale", desc: "Un interlocuteur unique, photos WhatsApp, disponible du lundi au samedi.", image: "/images/engage-communication.jpg" },
  { icon: "handshake", title: "Écoute et conseil", desc: "Si une solution plus simple ou moins coûteuse existe, on vous la propose.", image: "/images/engage-ecoute.jpg" },
  { icon: "shield", title: "Sérénité garantie", desc: "Garantie décennale, RC professionnelle. Votre investissement est protégé.", image: "/images/engage-garantie.jpg" },
];

const CERTIFICATIONS = [
  { title: "Garantie décennale", desc: "10 ans de couverture sur la solidité de l'ouvrage." },
  { title: "RC Professionnelle", desc: "Dommages aux tiers couverts pendant les travaux." },
  { title: "Certification IRVE", desc: "Installation bornes de recharge véhicules électriques." },
  { title: "Habilitations électriques", desc: "B1V, B2V, BR, BC — interventions basse tension." },
];

const ZONES = [
  "Saint-Louis", "Huningue", "Hésingue", "Village-Neuf",
  "Blotzheim", "Bartenheim", "Kembs", "Sierentz",
  "Leymen", "Hagenthal", "Rosenau", "Hégenheim",
];

function EngagementIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    quality: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />,
    clean: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />,
    handshake: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      {icons[name]}
    </svg>
  );
}

export default function AProposPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const storyTitleRef = useRef<HTMLHeadingElement>(null);
  const storyLinesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engagementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const certRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero title */
      if (heroTitleRef.current) {
        gsap.fromTo(heroTitleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power4.inOut",
            scrollTrigger: { trigger: heroTitleRef.current, start: "top 85%", end: "top 55%", scrub: 1 } }
        );
      }

      /* Story title */
      if (storyTitleRef.current) {
        gsap.fromTo(storyTitleRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.5, ease: "power4.inOut",
            scrollTrigger: { trigger: storyTitleRef.current, start: "top 80%", end: "top 50%", scrub: 1 } }
        );
      }

      /* Story lines */
      storyLinesRef.current.forEach((line) => {
        if (!line) return;
        gsap.fromTo(line, { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8,
            scrollTrigger: { trigger: line, start: "top 85%", end: "top 70%", scrub: 0.5 } }
        );
      });

      /* Steps */
      stepRefs.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(step,
          { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
          { opacity: 1, x: 0, duration: 0.8,
            scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      });

      /* Engagements */
      engagementRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      });

      /* Certifications */
      certRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.6,
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero immersif */}
      <section className="relative h-[70vh] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/ambiance-alsace.jpg"
            alt="Aiman Renovation — À propos"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 w-full">
          <h1
            ref={heroTitleRef}
            className="font-heading text-4xl sm:text-5xl md:text-7xl leading-none"
            style={{ clipPath: "inset(0 100% 0 0)" }}
          >
            À <span className="text-[#E50000]">PROPOS</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg md:text-xl max-w-xl">
            {COMPANY.experience} ans d&apos;expérience. Un seul objectif : rénover jusqu&apos;au bout de vos rêves.
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="relative z-10 bg-black py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              ref={storyTitleRef}
              className="font-heading text-3xl md:text-5xl mb-10"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              NOTRE <span className="text-[#E50000]">HISTOIRE</span>
            </h2>
            <div className="space-y-5">
              {[
                `Depuis l'âge de 20 ans, Aiman travaille dans le bâtiment. D'abord ouvrier polyvalent, puis chef d'équipe — ${COMPANY.experience} ans à poser, construire, rénover. Des centaines de chantiers qui forgent un savoir-faire qu'aucune école ne peut enseigner.`,
                `En 2024, fort de cette expérience, il crée ${COMPANY.name}. L'idée est simple : offrir aux habitants de Saint-Louis et du Haut-Rhin un artisan de confiance, capable de prendre en charge un projet de A à Z.`,
                `Installé au cœur du Trois Pays, chaque projet est abordé avec la même philosophie :`,
              ].map((line, i) => (
                <p key={i} ref={(el) => { storyLinesRef.current[i] = el; }} className="text-gray-400 text-lg leading-relaxed">
                  {line}
                  {i === 2 && <em className="text-[#E50000]"> &ldquo;{COMPANY.slogan}&rdquo;</em>}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/images/element-atelier.jpg"
              alt="Outils d'artisan — le savoir-faire Aiman Renovation"
              width={400}
              height={400}
              className="rounded-2xl w-full max-w-sm"
            />
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="relative z-10 bg-[#0A0A0A] py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-5xl text-center mb-20">
            NOTRE <span className="text-[#E50000]">PROCESSUS</span>
          </h2>

          <div className="space-y-24">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { stepRefs.current[i] = el; }}
                className={`flex flex-col gap-8 items-center ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ opacity: 0 }}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative aspect-video rounded-2xl overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#E50000] flex items-center justify-center">
                    <span className="font-heading text-white text-sm">{step.number}</span>
                  </div>
                </div>

                {/* Texte */}
                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? "md:pl-8" : "md:pr-8"}`}>
                  <div className="w-10 h-0.5 bg-[#E50000] mb-4" />
                  <h3 className="font-heading text-2xl md:text-3xl text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section className="relative z-10 bg-black py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-5xl text-center mb-16">
            NOS <span className="text-[#E50000]">ENGAGEMENTS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENGAGEMENTS.map((e, i) => (
              <div
                key={e.title}
                ref={(el) => { engagementRefs.current[i] = el; }}
                className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-[#E50000]/20 transition-all"
                style={{ opacity: 0 }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                </div>
                {/* Texte */}
                <div className="p-6 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#E50000]/10 flex items-center justify-center text-[#E50000] shrink-0 group-hover:bg-[#E50000]/20 transition-colors">
                      <EngagementIcon name={e.icon} />
                    </div>
                    <h3 className="font-heading text-lg text-white">{e.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="relative z-10 bg-[#0A0A0A] py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-5xl text-center mb-16">
            CERTIFICATIONS & <span className="text-[#E50000]">ASSURANCES</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CERTIFICATIONS.map((cert, i) => (
              <div
                key={cert.title}
                ref={(el) => { certRefs.current[i] = el; }}
                className="bg-[#111111] border border-white/5 rounded-xl p-8 flex items-start gap-5"
                style={{ opacity: 0 }}
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#E50000]/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#E50000" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-lg text-white mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone d'intervention */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/ambiance-alsace.jpg" alt="Alsace" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <div className="relative py-20 md:py-32 max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl md:text-5xl mb-4">
            ZONE D&apos;<span className="text-[#E50000]">INTERVENTION</span>
          </h2>
          <p className="text-gray-400 mb-12">
            Saint-Louis et sud du Haut-Rhin, à la frontière suisse et allemande.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ZONES.map((zone) => (
              <span key={zone} className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm hover:border-[#E50000]/40 hover:text-white transition-all backdrop-blur-sm">
                {zone}
              </span>
            ))}
            <span className="px-5 py-2.5 rounded-full border border-[#E50000]/30 text-[#E50000] text-sm backdrop-blur-sm">
              et au-delà
            </span>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
