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

// Zones en % de l'image — mesurées pixel par pixel sur blueprint.jpeg (2812x1536)
const ZONE_POSITIONS: Record<ZoneId, { left: number; top: number; width: number; height: number }> = {
  cuisine:   { left: 10.3, top: 12.7, width: 23.1, height: 29.0 },
  sdb:       { left: 33.4, top: 12.7, width: 6.8,  height: 29.0 },
  wc:        { left: 40.2, top: 12.7, width: 4.4,  height: 29.0 },
  garage:    { left: 44.6, top: 12.7, width: 33.6, height: 34.8 },
  vestibule: { left: 10.3, top: 41.7, width: 34.3, height: 5.9 },
  salon:     { left: 10.3, top: 47.5, width: 14.2, height: 29.6 },
  sam:       { left: 24.5, top: 47.5, width: 8.0,  height: 29.6 },
  chambre1:  { left: 32.5, top: 47.5, width: 18.7, height: 29.6 },
  chambre2:  { left: 51.2, top: 47.5, width: 35.6, height: 29.6 },
  terrasse:  { left: 10.3, top: 77.1, width: 37.7, height: 8.1 },
  jardin:    { left: 2.8,  top: 85.3, width: 94.2, height: 10.4 },
  haie:      { left: 0,    top: 0,    width: 3.5,  height: 100 },
  facades:   { left: 83,   top: 12.7, width: 5,    height: 64.4 },
  toiture:   { left: 10.3, top: 3,    width: 76.5, height: 8 },
};

export function BlueprintInteractive({ state, dispatch }: BlueprintInteractiveProps) {
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = useCallback((zoneId: ZoneId) => {
    if (state.view === "global") {
      const pos = ZONE_POSITIONS[zoneId];
      if (pos && imageWrapRef.current) {
        const centerX = pos.left + pos.width / 2;
        const centerY = pos.top + pos.height / 2;
        const scale = Math.min(55 / pos.width, 55 / pos.height, 3);

        gsap.to(imageWrapRef.current, {
          scale,
          transformOrigin: `${centerX}% ${centerY}%`,
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
        transformOrigin: "50% 50%",
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
    dispatch({ type: "ZOOM_OUT" });
  }, [dispatch]);

  const totalWorks = Object.values(state.selectedWorks).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#091428]">
      {/* Wrapper image avec aspect ratio */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={imageWrapRef}
          className="relative w-full"
          style={{ aspectRatio: "2812 / 1536", maxHeight: "100%" }}
        >
          <Image
            src="/images/blueprint-plan.jpeg"
            alt="Plan de maison interactif — cliquez sur une pièce"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />

          {/* Zones intérieures cliquables */}
          {ZONES_CONFIG.filter(z => z.category === "interieur").map((zone) => {
            const pos = ZONE_POSITIONS[zone.id];
            if (!pos) return null;
            const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
            const isActive = state.activeZone === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                aria-label={`Sélectionner ${zone.label}`}
                className={`absolute transition-all duration-300 cursor-pointer border-2 group
                  ${isActive
                    ? "bg-[#E50000]/20 border-[#E50000] shadow-[0_0_20px_rgba(229,0,0,0.4)]"
                    : hasWorks
                      ? "bg-[#E50000]/10 border-[#E50000]/50"
                      : "bg-transparent border-transparent hover:bg-[#4A9EFF]/15 hover:border-[#4A9EFF]/50"
                  }`}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  width: `${pos.width}%`,
                  height: `${pos.height}%`,
                }}
              >
                {/* Nom au hover */}
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold pointer-events-none transition-opacity
                  ${isActive || hasWorks ? "opacity-0" : "opacity-0 group-hover:opacity-100 text-[#4A9EFF]"}
                `}>
                  {zone.label}
                </span>
                {/* Badge compteur */}
                {hasWorks && (
                  <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10">
                    {state.selectedWorks[zone.id].length}
                  </span>
                )}
              </button>
            );
          })}

          {/* Zones extérieures */}
          {ZONES_CONFIG.filter(z => z.category === "exterieur").map((zone) => {
            const pos = ZONE_POSITIONS[zone.id];
            if (!pos) return null;
            const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;

            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                aria-label={`Sélectionner ${zone.label}`}
                className={`absolute transition-all duration-300 cursor-pointer border
                  ${hasWorks
                    ? "bg-[#E50000]/10 border-[#E50000]/30"
                    : "bg-transparent border-transparent hover:bg-[#1a7a3a]/15 hover:border-[#1a7a3a]/40"
                  }`}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  width: `${pos.width}%`,
                  height: `${pos.height}%`,
                }}
              >
                {hasWorks && (
                  <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center z-10">
                    {state.selectedWorks[zone.id].length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions client — vue globale */}
      {state.view === "global" && (
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3 pb-6">
            {totalWorks === 0 ? (
              <div className="pointer-events-auto bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-3 text-center animate-pulse">
                <p className="text-white font-semibold text-lg">Cliquez sur une pièce pour commencer</p>
                <p className="text-gray-400 text-sm mt-1">Sélectionnez les zones de votre maison à rénover</p>
              </div>
            ) : (
              <button
                onClick={() => dispatch({ type: "SHOW_RECAP" })}
                className="pointer-events-auto rounded-2xl bg-[#E50000] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
              >
                Envoyer mon devis ({totalWorks} travaux)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bouton retour — vue zoomée */}
      {state.view === "zoomed" && (
        <button
          onClick={handleZoomOut}
          className="absolute top-20 left-4 z-20 bg-black/80 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black/95 transition-all shadow-lg"
        >
          ← Retour au plan
        </button>
      )}
    </div>
  );
}
