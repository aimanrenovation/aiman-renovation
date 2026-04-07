"use client";

import { useRef, useState, useEffect, Suspense, lazy } from "react";
import Image from "next/image";
import { useScrollProgress } from "./useScrollProgress";
import { OVERLAY_TEXTS, PHASES } from "./constants";
import { LinkButton } from "@/components/ui/link-button";

const BlueprintScene = lazy(() =>
  import("./BlueprintScene").then((m) => ({ default: m.BlueprintScene }))
);

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

/* ═══ Hero mobile — carrousel d'images (pas de 3D) ═══ */
const MOBILE_IMAGES = [
  "/images/hero-1.png",
  "/images/hero-2.png",
  "/images/hero-3.png",
  "/images/hero-4.png",
];

function HeroMobile() {
  const ref = useRef<HTMLDivElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % MOBILE_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-black">
      {MOBILE_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Aiman Renovation"
          fill
          priority={i === 0}
          quality={85}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            i === currentImg ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-0.5 bg-[#002B7F]" />
          <div className="w-8 h-0.5 bg-white" />
          <div className="w-8 h-0.5 bg-[#CE1126]" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl leading-none tracking-tight">
          RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
        </h1>
        <p className="mt-4 text-base text-white/70 max-w-xs mx-auto font-light">
          Nous rénovons jusqu&apos;au bout{" "}
          <span className="text-[#E50000]">de vos rêves</span>
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
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
    </section>
  );
}

/* ═══ Hero principal — mobile = images, desktop = 3D ═══ */
export function HeroBlueprint() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useScrollProgress(containerRef);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (isMobile !== false) return;
    let raf: number;
    const update = () => {
      const p = progressRef.current;
      const phases = Object.values(PHASES);
      let phase = 0;
      for (let i = phases.length - 1; i >= 0; i--) {
        if (p >= phases[i].start) { phase = i; break; }
      }
      setCurrentPhase(phase);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, isMobile]);

  /* SSR loading state — fond noir */
  if (isMobile === null) {
    return (
      <section className="h-screen bg-black flex items-center justify-center">
        <h1 className="font-heading text-3xl md:text-6xl text-white text-center px-6">
          RÉNOVATION <span className="text-[#E50000]">SUR MESURE</span>
        </h1>
      </section>
    );
  }

  /* Mobile — carrousel d'images */
  if (isMobile) {
    return <HeroMobile />;
  }

  /* Desktop — scène 3D scroll-driven */
  return (
    <section
      ref={containerRef}
      className="relative bg-[#0A0A0A] h-[500vh]"
      aria-label="Animation 3D montrant les étapes de rénovation d'un séjour"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Suspense fallback={<Loader />}>
          <BlueprintScene progressRef={progressRef} />
        </Suspense>

        <div className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-32">
          {OVERLAY_TEXTS.map((item, i) => (
            <p
              key={i}
              className={`absolute font-heading text-4xl text-white transition-all duration-700 ${
                i === currentPhase ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {item.text}
            </p>
          ))}
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-500 ${
          currentPhase === 0 ? "opacity-100" : "opacity-0"
        }`}>
          <div className="animate-bounce">
            <div className="w-5 h-9 border border-white/30 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2.5 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}
