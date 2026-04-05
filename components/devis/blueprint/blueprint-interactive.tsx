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

// Zone positions en % PAR RAPPORT À L'IMAGE (2812x1536)
// Mesurées sur le blueprint Gemini
const ZONE_POSITIONS: Record<ZoneId, { left: number; top: number; width: number; height: number }> = {
  // Rangée haute — Cuisine (haut-gauche avec plan L)
  cuisine:   { left: 10.5, top: 8,    width: 24,   height: 32 },
  // SDB (petite pièce entre cuisine et WC)
  sdb:       { left: 34.5, top: 8,    width: 8.5,  height: 19 },
  // WC (encore plus petit, à droite de SDB)
  wc:        { left: 34.5, top: 27,   width: 8.5,  height: 13 },
  // Garage (grande pièce haut-droite)
  garage:    { left: 43,   top: 8,    width: 35,   height: 32 },

  // Corridor distributif (bande horizontale au milieu)
  vestibule: { left: 10.5, top: 40,   width: 67.5, height: 6 },

  // Rangée basse — Salon (bas-gauche avec TV + canapé)
  salon:     { left: 10.5, top: 46,   width: 17,   height: 28 },
  // SAM (salle à manger, à droite du salon)
  sam:       { left: 27.5, top: 46,   width: 9.5,  height: 28 },
  // Chambre 1 parentale (centre-bas)
  chambre1:  { left: 37,   top: 46,   width: 17,   height: 28 },
  // Chambre 2 (bas-droite)
  chambre2:  { left: 54,   top: 46,   width: 24,   height: 28 },

  // Extérieur
  terrasse:  { left: 10.5, top: 76,   width: 37,   height: 7 },
  jardin:    { left: 3,    top: 85,   width: 94,   height: 10 },
  haie:      { left: 0,    top: 0,    width: 4,    height: 100 },
  facades:   { left: 82,   top: 8,    width: 5,    height: 66 },
  toiture:   { left: 10.5, top: 1,    width: 67.5, height: 6 },
};

export function BlueprintInteractive({ state, dispatch }: BlueprintInteractiveProps) {
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const handleZoneClick = useCallback((zoneId: ZoneId) => {
    if (state.view === "global") {
      const pos = ZONE_POSITIONS[zoneId];
      if (pos && imageWrapRef.current) {
        const centerX = pos.left + pos.width / 2;
        const centerY = pos.top + pos.height / 2;
        const scale = Math.min(60 / pos.width, 60 / pos.height, 3.5);

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
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
    dispatch({ type: "ZOOM_OUT" });
  }, [dispatch]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#091428]">
      {/* Wrapper avec aspect ratio fixe de l'image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={imageWrapRef}
          className="relative w-full"
          style={{ aspectRatio: "2812 / 1536", maxHeight: "100%" }}
        >
          {/* Blueprint image */}
          <Image
            src="/images/blueprint-plan.jpeg"
            alt="Plan de maison interactif"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />

          {/* Zones cliquables — positionnées en % de l'image */}
          {ZONES_CONFIG.filter(z => z.category === "interieur").map((zone) => {
            const pos = ZONE_POSITIONS[zone.id];
            if (!pos) return null;
            const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
            const isActive = state.activeZone === zone.id;

            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone.id)}
                className={`absolute transition-all duration-300 cursor-pointer border-2
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
                {hasWorks && (
                  <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                    {state.selectedWorks[zone.id].length}
                  </span>
                )}
              </button>
            );
          })}

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
                  <span className="absolute -top-2 -right-2 bg-[#E50000] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {state.selectedWorks[zone.id].length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bouton retour (vue zoomée) */}
      {state.view === "zoomed" && (
        <button
          onClick={handleZoomOut}
          className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-all"
        >
          ← Retour au plan
        </button>
      )}
    </div>
  );
}
