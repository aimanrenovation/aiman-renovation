"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LinkButton } from "@/components/ui/link-button";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const SIDES = ["left", "right", "left", "right", "left", "center"] as const;
const START_PCTS = [2, 14, 28, 45, 62, 78];
const END_PCTS = [14, 28, 45, 62, 78, 100];

export function Hero() {
  const t = useTranslations("home.hero");

  const scrollTexts = (t.raw("scroll_texts") as { text: string; highlight: string }[]).map((item, i) => ({
    text: item.text,
    highlight: item.highlight,
    side: SIDES[i] || "center",
    startPct: START_PCTS[i] || 0,
    endPct: END_PCTS[i] || 100,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const [frameConfig, setFrameConfig] = useState({ path: "/frames/hero-desktop/frame-", total: 145 });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setFrameConfig({ path: "/frames/hero/frame-", total: 145 });
    }
  }, []);

  /* Precharger les frames */
  const preloadFrames = useCallback(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= frameConfig.total; i++) {
      const img = document.createElement("img");
      img.src = `${frameConfig.path}${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded >= 10) setReady(true);
      };
      images.push(img);
    }
    framesRef.current = images;
  }, [frameConfig]);

  /* Canvas scroll-driven — technique Apple */
  useEffect(() => {
    preloadFrames();

    const container = containerRef.current;
    const canvas = canvasRef.current;
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
          const idx = Math.min(Math.floor(self.progress * (frameConfig.total - 1)), frameConfig.total - 1);
          const img = framesRef.current[idx];
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
  }, [frameConfig, preloadFrames]);

  /* Animations textes + intro + CTA */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
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

      const ctaEl = document.getElementById("hero-cta");
      if (ctaEl) {
        gsap.fromTo(ctaEl,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5,
            scrollTrigger: { trigger: container, start: "82% top", end: "86% top", scrub: 0.5 },
          }
        );
      }

      textsRef.current.forEach((el, i) => {
        if (!el) return;
        const cfg = scrollTexts[i];
        const fromX = cfg.side === "left" ? -80 : cfg.side === "right" ? 80 : 0;
        const fadeDuration = 4;

        gsap.fromTo(el,
          { opacity: 0, x: fromX, y: cfg.side === "center" ? 20 : 0 },
          {
            opacity: 1, x: 0, y: 0, duration: 0.5,
            scrollTrigger: { trigger: container, start: `${cfg.startPct}% top`, end: `${cfg.startPct + fadeDuration}% top`, scrub: 0.5 },
          }
        );

        if (i < scrollTexts.length - 1) {
          gsap.to(el, {
            opacity: 0,
            x: cfg.side === "left" ? -40 : cfg.side === "right" ? 40 : 0,
            y: cfg.side === "center" ? -20 : 0,
            scrollTrigger: { trigger: container, start: `${cfg.endPct - fadeDuration}% top`, end: `${cfg.endPct}% top`, scrub: 0.5 },
          });
        }
      });
    }, container);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Poster pendant chargement */}
        {!ready && (
          <>
            <Image src="/images/hero-poster.jpg" alt="" fill sizes="100vw" priority className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

        <div ref={introRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div data-anim className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#002B7F]" />
            <div className="w-8 h-0.5 bg-white" />
            <div className="w-8 h-0.5 bg-[#CE1126]" />
          </div>
          <h1 data-anim className="font-heading text-3xl sm:text-4xl md:text-6xl leading-none tracking-tight">
            {t("title")} <span className="text-[#E50000]">{t("title_highlight")}</span>
          </h1>
          <p data-anim className="mt-4 md:mt-5 text-base md:text-lg text-white/70 max-w-md mx-auto font-light">
            {t("scroll_hint")}
          </p>
          <div data-anim className="absolute bottom-10 animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {scrollTexts.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => { textsRef.current[i] = el; }}
            className={`absolute z-10 px-6 sm:px-8 md:px-16 ${
              cfg.side === "left" ? "left-0 top-1/2 -translate-y-1/2 text-left"
                : cfg.side === "right" ? "right-0 top-1/2 -translate-y-1/2 text-right"
                : "inset-0 flex items-center justify-center text-center"
            }`}
            style={{ opacity: 0 }}
          >
            <div className={cfg.side === "center" ? "" : "max-w-xs sm:max-w-sm md:max-w-md"}>
              <p
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
                className={`font-heading leading-tight text-white ${
                  cfg.side === "center" ? "text-2xl sm:text-3xl md:text-5xl" : "text-xl sm:text-2xl md:text-4xl"
                }`}
              >
                {cfg.text}{" "}
                <span className="text-[#E50000]">{cfg.highlight}</span>
              </p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-16 left-0 right-0 z-10 flex justify-center">
          <div className="flex flex-col sm:flex-row items-center gap-3 opacity-0" id="hero-cta">
            <LinkButton href="/devis" size="lg" className="bg-[#E50000] hover:bg-[#B80000] text-white px-8 py-4 md:py-5 rounded-md">
              {t("cta_devis")}
            </LinkButton>
            <LinkButton href="/realisations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 md:py-5 rounded-md">
              {t("cta_realisations")}
            </LinkButton>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
      </div>
    </div>
  );
}
