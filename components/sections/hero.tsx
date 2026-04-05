"use client";

import { useRef, useEffect, useState } from "react";
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

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState("/videos/hero-scroll-smooth.mp4");

  /* Choisir la vidéo mobile ou desktop */
  useEffect(() => {
    if (window.innerWidth < 768) {
      setVideoSrc("/videos/hero-mobile.mp4");
    }
  }, []);

  /* Vidéo scroll-driven — mobile + desktop */
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      const onLoaded = () => {
        video.pause();
        video.currentTime = 0;
        setReady(true);

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

      /* Intro — fade in puis fade out au scroll */
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

      /* CTA buttons */
      const ctaEl = document.getElementById("hero-cta");
      if (ctaEl) {
        gsap.fromTo(ctaEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.5,
            scrollTrigger: { trigger: container, start: "82% top", end: "86% top", scrub: 0.5 },
          }
        );
      }

      /* Textes synchronisés au scroll */
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
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Vidéo scroll-driven — GPU accelerated */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform" }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Loader — transparent pour voir le poster */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        {/* Intro */}
        <div
          ref={introRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <div data-anim className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#002B7F]" />
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-[#CE1126]" />
          </div>
          <h1 data-anim className="font-heading text-3xl sm:text-4xl md:text-6xl leading-none tracking-tight">
            RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
          </h1>
          <p data-anim className="mt-4 md:mt-5 text-base md:text-lg text-white/70 max-w-md mx-auto font-light">
            Scrollez pour découvrir notre savoir-faire
          </p>
          <div data-anim className="absolute bottom-10 animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Textes scroll-driven */}
        {SCROLL_TEXTS.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => { textsRef.current[i] = el; }}
            className={`absolute z-10 px-6 sm:px-8 md:px-16 ${
              cfg.side === "left"
                ? "left-0 top-1/2 -translate-y-1/2 text-left"
                : cfg.side === "right"
                ? "right-0 top-1/2 -translate-y-1/2 text-right"
                : "inset-0 flex items-center justify-center text-center"
            }`}
            style={{ opacity: 0 }}
          >
            <div className={cfg.side === "center" ? "" : "max-w-xs sm:max-w-sm md:max-w-md"}>
              <p
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                className={`font-heading leading-tight text-white ${
                  cfg.side === "center"
                    ? "text-2xl sm:text-3xl md:text-5xl"
                    : "text-xl sm:text-2xl md:text-4xl"
                }`}
              >
                {cfg.text}{" "}
                <span className="text-[#E50000]">{cfg.highlight}</span>
              </p>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="absolute bottom-16 left-0 right-0 z-10 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-3 opacity-0" id="hero-cta">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4 md:py-5 rounded-md">
              Devis gratuit
            </LinkButton>
            <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 md:py-5 rounded-md">
              Nos réalisations
            </LinkButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
