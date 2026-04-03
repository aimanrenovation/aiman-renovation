"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LinkButton } from "@/components/ui/link-button";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_TEXTS = [
  { text: "Votre habitat", highlight: "mérite mieux", side: "left" as const, startPct: 2, endPct: 14 },
  { text: "Nos artisans", highlight: "prennent le relais", side: "right" as const, startPct: 14, endPct: 28 },
  { text: "19 ans", highlight: "d'expérience", side: "left" as const, startPct: 28, endPct: 45 },
  { text: "Chaque détail", highlight: "compte", side: "right" as const, startPct: 45, endPct: 62 },
  { text: "Du sol", highlight: "au plafond", side: "left" as const, startPct: 62, endPct: 78 },
  { text: "Nous rénovons jusqu'au bout", highlight: "de vos rêves", side: "center" as const, startPct: 78, endPct: 100 },
];

const MOBILE_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
  "/images/hero-4.png",
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  /* Détection une seule fois au mount */
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  /* Carrousel mobile */
  useEffect(() => {
    if (isDesktop !== false) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % MOBILE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isDesktop]);

  /* Animations mobile */
  useEffect(() => {
    if (isDesktop !== false || !mobileRef.current) return;
    const els = mobileRef.current.querySelectorAll("[data-anim]");
    gsap.fromTo(els,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
  }, [isDesktop]);

  /* Animations desktop — vidéo scroll-driven */
  useEffect(() => {
    if (isDesktop !== true) return;
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      if (video) {
        const onLoaded = () => {
          video.pause();
          video.currentTime = 0;
          ScrollTrigger.create({
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            onUpdate: (self) => {
              if (video.duration) {
                video.currentTime = self.progress * video.duration;
              }
            },
          });
        };
        if (video.readyState >= 1) onLoaded();
        else video.addEventListener("loadedmetadata", onLoaded, { once: true });
      }

      if (introRef.current) {
        const els = introRef.current.querySelectorAll("[data-anim]");
        gsap.fromTo(els,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, delay: 0.3, ease: "power3.out" }
        );
        gsap.to(introRef.current, {
          opacity: 0, y: -30,
          scrollTrigger: { trigger: container, start: "1% top", end: "8% top", scrub: 0.5 },
        });
      }

      textsRef.current.forEach((el, i) => {
        if (!el) return;
        const cfg = SCROLL_TEXTS[i];
        const fromX = cfg.side === "left" ? -80 : cfg.side === "right" ? 80 : 0;
        const fadeDuration = 4;

        gsap.fromTo(el,
          { opacity: 0, x: fromX, y: cfg.side === "center" ? 20 : 0 },
          {
            opacity: 1, x: 0, y: 0, duration: 0.5,
            scrollTrigger: {
              trigger: container,
              start: `${cfg.startPct}% top`,
              end: `${cfg.startPct + fadeDuration}% top`,
              scrub: 0.5,
            },
          }
        );

        if (i < SCROLL_TEXTS.length - 1) {
          gsap.to(el, {
            opacity: 0,
            x: cfg.side === "left" ? -40 : cfg.side === "right" ? 40 : 0,
            y: cfg.side === "center" ? -20 : 0,
            scrollTrigger: {
              trigger: container,
              start: `${cfg.endPct - fadeDuration}% top`,
              end: `${cfg.endPct}% top`,
              scrub: 0.5,
            },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  }, [isDesktop]);

  /* ═══ SSR + chargement : fond noir pour éviter le flash blanc ═══ */
  if (isDesktop === null) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <h1 className="font-heading text-3xl md:text-6xl leading-none tracking-tight text-white">
          RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
        </h1>
      </div>
    );
  }

  /* ═══ Mobile ═══ */
  if (!isDesktop) {
    return (
      <div ref={mobileRef} className="relative h-screen overflow-hidden bg-black">
        {MOBILE_IMAGES.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt="Aiman Renovation"
            fill
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ${
              i === currentImg ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div data-anim className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#002B7F]" />
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-[#CE1126]" />
          </div>
          <h1 data-anim className="font-heading text-3xl sm:text-4xl leading-none tracking-tight">
            RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
          </h1>
          <p data-anim className="mt-4 text-base text-white/70 max-w-xs mx-auto font-light">
            Nous rénovons jusqu&apos;au bout{" "}
            <span className="text-[#E50000]">de vos rêves</span>
          </p>
          <div data-anim className="mt-8 flex flex-col items-center gap-3">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4 rounded-md">
              Devis gratuit
            </LinkButton>
            <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-md">
              Nos réalisations
            </LinkButton>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {MOBILE_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentImg ? "bg-[#E50000] w-6" : "bg-white/30 w-2"
              }`}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </div>
    );
  }

  /* ═══ Desktop ═══ */
  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <div data-anim className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#002B7F]" />
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-[#CE1126]" />
          </div>
          <h1 data-anim className="font-heading text-4xl md:text-6xl leading-none tracking-tight">
            RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
          </h1>
          <p data-anim className="mt-5 text-lg text-white/70 max-w-md mx-auto font-light">
            Scrollez pour découvrir notre savoir-faire
          </p>
          <div data-anim className="absolute bottom-10 animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {SCROLL_TEXTS.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => { textsRef.current[i] = el; }}
            className={`absolute z-10 px-8 md:px-16 ${
              cfg.side === "left"
                ? "left-0 top-1/2 -translate-y-1/2 text-left"
                : cfg.side === "right"
                ? "right-0 top-1/2 -translate-y-1/2 text-right"
                : "inset-0 flex items-center justify-center text-center"
            }`}
            style={{ opacity: 0 }}
          >
            <div className={cfg.side === "center" ? "" : "max-w-md"}>
              <p className={`font-heading leading-tight text-white ${
                cfg.side === "center"
                  ? "text-3xl md:text-5xl"
                  : "text-2xl md:text-4xl"
              }`}>
                {cfg.text}{" "}
                <span className="text-[#E50000]">{cfg.highlight}</span>
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-16 left-0 right-0 z-10 flex justify-center">
          <div className="flex items-center gap-4 opacity-0" id="hero-cta">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-5 rounded-md">
              Devis gratuit
            </LinkButton>
            <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-5 rounded-md">
              Nos réalisations
            </LinkButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
