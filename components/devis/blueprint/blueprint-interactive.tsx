"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

interface BlueprintInteractiveProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

// Zone positions as % of the image dimensions
// Based on Gemini blueprint: house fills roughly 75% of image width, 70% of height
// Image aspect ratio ~16:9 (from the JPEG)
const ZONE_POSITIONS: Record<ZoneId, { left: string; top: string; width: string; height: string }> = {
  // Rangée haute
  cuisine:   { left: "10%",  top: "10%",  width: "25%", height: "30%" },
  sdb:       { left: "35%",  top: "10%",  width: "9%",  height: "30%" },
  wc:        { left: "44%",  top: "10%",  width: "7%",  height: "30%" },
  garage:    { left: "51%",  top: "10%",  width: "28%", height: "30%" },
  // Corridor
  vestibule: { left: "10%",  top: "40%",  width: "15%", height: "8%" },
  // Rangée basse
  salon:     { left: "10%",  top: "48%",  width: "18%", height: "28%" },
  sam:       { left: "28%",  top: "48%",  width: "12%", height: "28%" },
  chambre1:  { left: "40%",  top: "48%",  width: "16%", height: "28%" },
  chambre2:  { left: "56%",  top: "48%",  width: "23%", height: "28%" },
  // Extérieur
  terrasse:  { left: "10%",  top: "78%",  width: "69%", height: "8%" },
  jardin:    { left: "2%",   top: "88%",  width: "96%", height: "8%" },
  haie:      { left: "0%",   top: "0%",   width: "3%",  height: "100%" },
  facades:   { left: "82%",  top: "10%",  width: "5%",  height: "66%" },
  toiture:   { left: "10%",  top: "2%",   width: "69%", height: "6%" },
};

export function BlueprintInteractive({ state, dispatch }: BlueprintInteractiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = useCallback((zoneId: ZoneId) => {
    if (state.view === "global") {
      // Zoom vers la zone
      const pos = ZONE_POSITIONS[zoneId];
      if (pos && imageWrapRef.current) {
        const left = parseFloat(pos.left) / 100;
        const top = parseFloat(pos.top) / 100;
        const width = parseFloat(pos.width) / 100;
        const height = parseFloat(pos.height) / 100;

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Scale pour que la zone remplisse ~60% de l'écran
        const scale = Math.min(0.6 / width, 0.6 / height);
        const clampedScale = Math.min(scale, 3.5);

        const originX = centerX * 100;
        const originY = centerY * 100;

        gsap.to(imageWrapRef.current, {
          scale: clampedScale,
          transformOrigin: `${originX}% ${originY}%`,
          duration: 0.8,
          ease: "power2.inOut",
        });
      }
      dispatch({ type: "ZOOM_ZONE", zone: zoneId });
    }
  }, [state.view, dispatch]);

  const handleZoomOut = useCallback(() => {
    if (imageWrapRef.current) {
      gsap.to(imageWrapRef.current, {
        scale: 1,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
    dispatch({ type: "ZOOM_OUT" });
  }, [dispatch]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#091428]">
      {/* Image wrapper avec transform pour zoom */}
      <div ref={imageWrapRef} className="relative w-full h-full">
        {/* Blueprint image */}
        <Image
          src="/images/blueprint-plan.jpeg"
          alt="Plan de maison interactif"
          fill
          className="object-contain"
          priority
          quality={90}
        />

        {/* Zones cliquables overlay */}
        {ZONES_CONFIG.filter(z => z.category === "interieur").map((zone) => {
          const pos = ZONE_POSITIONS[zone.id];
          if (!pos) return null;
          const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
          const isActive = state.activeZone === zone.id;

          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={`absolute transition-all duration-300 rounded-sm cursor-pointer border-2
                ${isActive
                  ? "bg-[#E50000]/20 border-[#E50000] shadow-[0_0_15px_rgba(229,0,0,0.3)]"
                  : hasWorks
                    ? "bg-[#E50000]/10 border-[#E50000]/40"
                    : "bg-transparent border-transparent hover:bg-[#4A9EFF]/10 hover:border-[#4A9EFF]/40"
                }`}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
              }}
            >
              {/* Badge compteur */}
              {hasWorks && (
                <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {state.selectedWorks[zone.id].length}
                </span>
              )}
            </button>
          );
        })}

        {/* Zones extérieures (plus subtiles) */}
        {ZONES_CONFIG.filter(z => z.category === "exterieur").map((zone) => {
          const pos = ZONE_POSITIONS[zone.id];
          if (!pos) return null;
          const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;

          return (
            <button
              key={zone.id}
              onClick={() => handleZoneClick(zone.id)}
              className={`absolute transition-all duration-300 cursor-pointer border
                ${hasWorks
                  ? "bg-[#E50000]/10 border-[#E50000]/30"
                  : "bg-transparent border-transparent hover:bg-[#1a7a3a]/10 hover:border-[#1a7a3a]/30"
                }`}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
              }}
            >
              {hasWorks && (
                <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {state.selectedWorks[zone.id].length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bouton retour (vue zoomée) */}
      {state.view === "zoomed" && (
        <button
          onClick={handleZoomOut}
          className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm hover:bg-black/90 transition-all"
        >
          ← Retour au plan
        </button>
      )}
    </div>
  );
}
