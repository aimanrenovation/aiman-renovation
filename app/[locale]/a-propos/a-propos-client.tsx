"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPANY } from "@/lib/constants";
import { CtaBanner } from "@/components/sections/cta-banner";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const ENGAGEMENT_ICONS = ["quality", "calendar", "clean", "chat", "handshake", "shield"];
const ENGAGEMENT_IMAGES = [
  "/images/engage-qualite.jpg",
  "/images/engage-delais.jpg",
  "/images/engage-propre.jpg",
  "/images/engage-communication.jpg",
  "/images/engage-ecoute.jpg",
  "/images/engage-garantie.jpg",
];
const STEP_IMAGES = [
  "/images/process-contact.jpg",
  "/images/process-visite.jpg",
  "/images/process-devis.jpg",
  "/images/process-travaux.jpg",
  "/images/process-reception.jpg",
];
const CERT_IMAGES = [
  "/images/cert-decennale.jpg",
  "/images/cert-rc.jpg",
  "/images/cert-irve.jpg",
  "/images/cert-elec.jpg",
];
const STORY_PCTS = [
  { startPct: 0, endPct: 12 },
  { startPct: 12, endPct: 25 },
  { startPct: 25, endPct: 40 },
  { startPct: 40, endPct: 55 },
  { startPct: 55, endPct: 72 },
  { startPct: 72, endPct: 100 },
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

const PARCOURS_FRAMES = 80;

export default function AProposClient() {
  const t = useTranslations("about");
  const tc = useTranslations("common");

  const storyTexts = t.raw("story_texts") as { text: string; highlight: string; story: string }[];
  const steps = t.raw("steps") as { number: string; title: string; desc: string }[];
  const engagements = t.raw("engagements") as { title: string; desc: string }[];
  const certifications = t.raw("certifications") as { title: string; desc: string }[];
  const zones = tc.raw("zones") as string[];

  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const storyContainerRef = useRef<HTMLElement>(null);
  const storyCanvasRef = useRef<HTMLCanvasElement>(null);
  const storyTitleRef = useRef<HTMLHeadingElement>(null);
  const storyTextsRef = useRef<(HTMLDivElement | null)[]>([]);
  const parcoursFramesRef = useRef<HTMLImageElement[]>([]);
  const [framePath, setFramePath] = useState("/frames/parcours-desktop/frame-");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engagementRefs = useRef<(HTMLDivElement | null)[]>([]);
  const certRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Mobile ou desktop frames */
  useEffect(() => {
    if (window.innerWidth < 768) {
      setFramePath("/frames/parcours/frame-");
    }
  }, []);

  /* Canvas scroll-driven — technique Apple (mobile + desktop) */
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= PARCOURS_FRAMES; i++) {
      const img = document.createElement("img");
      img.src = `${framePath}${String(i).padStart(4, "0")}.jpg`;
      images.push(img);
    }
    parcoursFramesRef.current = images;

    const container = storyContainerRef.current;
    const canvas = storyCanvasRef.current;
    if (!container || !canvas) return;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const resize = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const gsapCtx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          const idx = Math.min(Math.floor(self.progress * (PARCOURS_FRAMES - 1)), PARCOURS_FRAMES - 1);
          const img = parcoursFramesRef.current[idx];
          if (img && img.complete && ctx2d) {
            const isMob = window.innerWidth < 768;
            const scale = isMob
              ? Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
              : Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
            const w = img.naturalWidth * scale;
            const h = img.naturalHeight * scale;
            ctx2d.fillStyle = "#000";
            ctx2d.fillRect(0, 0, canvas.width, canvas.height);
            ctx2d.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          }
        },
      });
    }, container);

    return () => { window.removeEventListener("resize", resize); gsapCtx.revert(); };
  }, [framePath]);

  /* Textes synchronises parcours (mobile + desktop) */
  useEffect(() => {
    const container = storyContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      storyTextsRef.current.forEach((el, i) => {
        if (!el) return;
        const cfg = STORY_PCTS[i];
        const fadeDuration = 5;
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5,
            scrollTrigger: { trigger: container, start: `${cfg.startPct}% top`, end: `${cfg.startPct + fadeDuration}% top`, scrub: 0.5 } }
        );
        if (i < storyTexts.length - 1) {
          gsap.to(el, {
            opacity: 0, y: -10,
            scrollTrigger: { trigger: container, start: `${cfg.endPct - fadeDuration}% top`, end: `${cfg.endPct}% top`, scrub: 0.5 },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [framePath]);

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
            alt="Aiman Renovation — A propos"
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
            {t("hero_title_prefix")} <span className="text-[#E50000]">{t("hero_title_highlight")}</span>
          </h1>
          <p className="mt-4 text-gray-300 text-lg md:text-xl max-w-xl">
            {t("hero_subtitle", { experience: COMPANY.experience })}
          </p>
        </div>
      </section>

      {/* Notre histoire — video scroll-driven du parcours */}
      <section ref={storyContainerRef} className="relative z-10 bg-black" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <canvas ref={storyCanvasRef} className="absolute inset-0" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

          {/* Titre reveal */}
          <div className="absolute top-20 left-0 right-0 z-10 px-6">
            <div className="max-w-5xl mx-auto">
              <h2
                ref={storyTitleRef}
                className="font-heading text-3xl md:text-5xl"
                style={{ clipPath: "inset(0 100% 0 0)" }}
              >
                {t("story_title")} <span className="text-[#E50000]">{t("story_title_highlight")}</span>
              </h2>
            </div>
          </div>

          {/* Textes synchronises au scroll */}
          {storyTexts.map((cfg, i) => (
            <div
              key={i}
              ref={(el) => { storyTextsRef.current[i] = el; }}
              className="absolute bottom-16 left-0 right-0 z-10 px-6"
              style={{ opacity: 0 }}
            >
              <div className="max-w-5xl mx-auto">
                <div className="bg-black/60 backdrop-blur-md rounded-xl p-5 md:p-8 max-w-lg border border-white/5">
                  <p className="font-heading text-xl sm:text-2xl md:text-3xl text-white leading-tight">
                    {cfg.text} <span className="text-[#E50000]">{cfg.highlight}</span>
                  </p>
                  <p className="mt-3 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                    {cfg.story}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        </div>
      </section>

      {/* Processus */}
      <section className="relative z-10 bg-[#0A0A0A] py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-3xl md:text-5xl text-center mb-20">
            {t("process_title")} <span className="text-[#E50000]">{t("process_title_highlight")}</span>
          </h2>

          <div className="space-y-24">
            {steps.map((step, i) => (
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
                    src={STEP_IMAGES[i] || STEP_IMAGES[0]}
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
            {t("engagements_title")} <span className="text-[#E50000]">{t("engagements_title_highlight")}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagements.map((e, i) => (
              <div
                key={e.title}
                ref={(el) => { engagementRefs.current[i] = el; }}
                className="group bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-[#E50000]/20 transition-all"
                style={{ opacity: 0 }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={ENGAGEMENT_IMAGES[i] || ENGAGEMENT_IMAGES[0]}
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
                      <EngagementIcon name={ENGAGEMENT_ICONS[i] || "quality"} />
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
            {t("certifications_title")} <span className="text-[#E50000]">{t("certifications_title_highlight")}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {certifications.map((cert, i) => (
              <div
                key={cert.title}
                ref={(el) => { certRefs.current[i] = el; }}
                className="group relative rounded-2xl overflow-hidden h-52"
                style={{ opacity: 0 }}
              >
                {/* Image fond */}
                <Image
                  src={CERT_IMAGES[i] || CERT_IMAGES[0]}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

                {/* Contenu */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E50000] flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-xl text-white">{cert.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{cert.desc}</p>
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
            {tc("zone_title")}<span className="text-[#E50000]">{tc("zone_title_highlight")}</span>
          </h2>
          <p className="text-gray-400 mb-12">
            {tc("zones_subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {zones.map((zone: string) => (
              <span key={zone} className="px-5 py-2.5 rounded-full border border-white/20 text-gray-300 text-sm hover:border-[#E50000]/40 hover:text-white transition-all backdrop-blur-sm">
                {zone}
              </span>
            ))}
            <span className="px-5 py-2.5 rounded-full border border-[#E50000]/30 text-[#E50000] text-sm backdrop-blur-sm">
              {tc("zones_and_beyond")}
            </span>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
