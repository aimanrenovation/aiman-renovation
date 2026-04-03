"use client";

import { useRef, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/link-button";

const VIDEO_SRC = "/videos/hero-scroll.mp4";

/* Textes synchronisés au scroll — calés sur les phases visuelles de la vidéo */
const SCROLL_TEXTS = [
  { text: "Tout commence par", highlight: "un plan", startPct: 0, endPct: 12, side: "center" as const },
  { text: "Les murs", highlight: "se lèvent", startPct: 12, endPct: 24, side: "left" as const },
  { text: "Nos artisans", highlight: "prennent le relais", startPct: 24, endPct: 38, side: "right" as const },
  { text: "Chaque détail", highlight: "compte", startPct: 38, endPct: 50, side: "left" as const },
  { text: "Du sol", highlight: "au plafond", startPct: 50, endPct: 62, side: "right" as const },
  { text: "De l'intérieur", highlight: "à l'extérieur", startPct: 62, endPct: 76, side: "left" as const },
  { text: "Nous rénovons jusqu'au bout", highlight: "de vos rêves", startPct: 76, endPct: 100, side: "center" as const },
];

export function HeroFrames() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollPctRef = useRef(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [ready, setReady] = useState(false);

  // Scroll handler — contrôle le currentTime de la vidéo
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const scrollHeight = container.scrollHeight - window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.min(Math.max(scrolled / scrollHeight, 0), 1);

        // Mettre à jour le currentTime de la vidéo
        if (video.duration) {
          video.currentTime = progress * video.duration;
        }

        // Mise à jour du pourcentage pour les textes
        const pct = progress * 100;
        if (Math.abs(pct - scrollPctRef.current) > 0.5) {
          scrollPctRef.current = pct;
          setScrollPct(pct);
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Vidéo scroll-driven — décodeur hardware GPU */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => setReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Loader */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay dégradé — sombre pour lisibilité texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/50" />

        {/* Textes synchronisés — gauche / droite / centre */}
        {SCROLL_TEXTS.map((cfg, i) => (
          <div
            key={i}
            className={`absolute z-10 pointer-events-none px-6 sm:px-8 md:px-16 transition-all duration-700 ${
              scrollPct >= cfg.startPct && scrollPct < cfg.endPct
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            } ${
              cfg.side === "left"
                ? "left-0 top-1/2 -translate-y-1/2 text-left"
                : cfg.side === "right"
                ? "right-0 top-1/2 -translate-y-1/2 text-right"
                : "inset-0 flex items-center justify-center text-center"
            }`}
          >
            <div className={cfg.side === "center" ? "" : "max-w-sm md:max-w-md"}>
              <p
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)" }}
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

        {/* CTA en bas — visible à la fin */}
        <div className={`absolute bottom-20 left-0 right-0 z-10 flex justify-center transition-opacity duration-500 ${
          scrollPct > 80 ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4 rounded-md">
              Devis gratuit
            </LinkButton>
            <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-md">
              Nos réalisations
            </LinkButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
          scrollPct < 5 ? "opacity-100" : "opacity-0"
        }`}>
          <div className="animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Dégradé bas */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
