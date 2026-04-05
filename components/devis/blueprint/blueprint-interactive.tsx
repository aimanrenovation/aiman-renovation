"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

interface BlueprintInteractiveProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

// Coordonnées en PIXELS de l'image source (2812x1536)
// Le SVG a le même viewBox → alignement automatique
const ZONES: Record<ZoneId, { x: number; y: number; w: number; h: number }> = {
  cuisine:   { x: 452,  y: 200,  w: 490,  h: 445 },
  sdb:       { x: 942,  y: 200,  w: 200,  h: 250 },
  wc:        { x: 942,  y: 450,  w: 200,  h: 195 },
  garage:    { x: 1142, y: 200,  w: 515,  h: 445 },
  vestibule: { x: 452,  y: 645,  w: 690,  h: 90 },
  salon:     { x: 452,  y: 735,  w: 320,  h: 346 },
  sam:       { x: 772,  y: 735,  w: 210,  h: 346 },
  chambre1:  { x: 982,  y: 735,  w: 300,  h: 346 },
  chambre2:  { x: 1282, y: 735,  w: 375,  h: 346 },
  terrasse:  { x: 452,  y: 1081, w: 530,  h: 120 },
  jardin:    { x: 100,  y: 1201, w: 2600, h: 200 },
  haie:      { x: 20,   y: 20,   w: 100,  h: 1480 },
  facades:   { x: 1700, y: 200,  w: 100,  h: 880 },
  toiture:   { x: 452,  y: 50,   w: 1200, h: 140 },
};

export function BlueprintInteractive({ state, dispatch }: BlueprintInteractiveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleZoneClick = useCallback((zoneId: ZoneId) => {
    if (state.view !== "global") return;
    const z = ZONES[zoneId];
    if (!z || !svgRef.current) return;

    const cx = z.x + z.w / 2;
    const cy = z.y + z.h / 2;
    const scale = Math.min(1400 / z.w, 750 / z.h, 3);

    gsap.to(svgRef.current, {
      scale,
      transformOrigin: `${(cx / 2812) * 100}% ${(cy / 1536) * 100}%`,
      duration: 1,
      ease: "power3.inOut",
    });
    dispatch({ type: "ZOOM_ZONE", zone: zoneId });
  }, [state.view, dispatch]);

  useEffect(() => {
    if (state.view === "global" && svgRef.current) {
      gsap.to(svgRef.current, {
        scale: 1,
        transformOrigin: "50% 50%",
        duration: 1,
        ease: "power3.inOut",
      });
    }
  }, [state.view]);

  const totalWorks = Object.values(state.selectedWorks).reduce(
    (sum, arr) => sum + arr.length, 0
  );

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#091428] flex items-center justify-center">
      {/* SVG avec image en fond + zones cliquables — même viewBox = alignement parfait */}
      <svg
        ref={svgRef}
        viewBox="0 0 2812 1536"
        className="w-full h-full will-change-transform"
        preserveAspectRatio="xMidYMid meet"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {/* Image de fond */}
        <image href="/images/blueprint-plan.jpeg" x="0" y="0" width="2812" height="1536" />

        {/* Zones intérieures */}
        {ZONES_CONFIG.filter(z => z.category === "interieur").map((zone) => {
          const z = ZONES[zone.id];
          if (!z) return null;
          const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
          const isActive = state.activeZone === zone.id;

          return (
            <g key={zone.id} onClick={() => handleZoneClick(zone.id)} style={{ cursor: "pointer" }}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={isActive ? "rgba(229,0,0,0.2)" : hasWorks ? "rgba(229,0,0,0.1)" : "transparent"}
                stroke={isActive ? "#E50000" : hasWorks ? "rgba(229,0,0,0.5)" : "transparent"}
                strokeWidth={isActive ? 6 : hasWorks ? 4 : 0}
                rx={4}
                className="transition-all duration-300"
              />
              {/* Hover effect */}
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill="transparent"
                stroke="transparent"
                strokeWidth={4}
                rx={4}
                className="hover:fill-[rgba(74,158,255,0.12)] hover:stroke-[rgba(74,158,255,0.5)]"
                style={{ transition: "all 0.3s" }}
              />
              {/* Label au centre */}
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#4A9EFF" fontSize={z.w < 250 ? 28 : 36} fontFamily="sans-serif" fontWeight="bold"
                opacity={0} className="hover:opacity-80"
                style={{ transition: "opacity 0.3s", pointerEvents: "none" }}
              >
                {zone.label}
              </text>
              {/* Badge compteur */}
              {hasWorks && (
                <>
                  <circle cx={z.x + z.w - 10} cy={z.y + 10} r={22} fill="#E50000" />
                  <text
                    x={z.x + z.w - 10} y={z.y + 12}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={22} fontWeight="bold" fontFamily="sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {state.selectedWorks[zone.id].length}
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Zones extérieures */}
        {ZONES_CONFIG.filter(z => z.category === "exterieur").map((zone) => {
          const z = ZONES[zone.id];
          if (!z) return null;
          const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;

          return (
            <g key={zone.id} onClick={() => handleZoneClick(zone.id)} style={{ cursor: "pointer" }}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={hasWorks ? "rgba(229,0,0,0.1)" : "transparent"}
                stroke={hasWorks ? "rgba(229,0,0,0.3)" : "transparent"}
                strokeWidth={3}
                className="hover:fill-[rgba(26,122,58,0.1)] hover:stroke-[rgba(26,122,58,0.4)]"
                style={{ transition: "all 0.3s" }}
              />
              {hasWorks && (
                <>
                  <circle cx={z.x + z.w - 10} cy={z.y + 10} r={18} fill="#E50000" />
                  <text
                    x={z.x + z.w - 10} y={z.y + 12}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="white" fontSize={18} fontWeight="bold" fontFamily="sans-serif"
                    style={{ pointerEvents: "none" }}
                  >
                    {state.selectedWorks[zone.id].length}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Instructions */}
      {state.view === "global" && (
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3 pb-4 sm:pb-6">
            {totalWorks === 0 ? (
              <div className="pointer-events-auto bg-black/70 backdrop-blur-sm rounded-2xl px-5 py-2.5 sm:px-6 sm:py-3 text-center animate-pulse">
                <p className="text-white font-semibold text-base sm:text-lg">Cliquez sur une pièce pour commencer</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Sélectionnez les zones de votre maison à rénover</p>
              </div>
            ) : (
              <button
                onClick={() => dispatch({ type: "SHOW_RECAP" })}
                className="pointer-events-auto rounded-2xl bg-[#E50000] px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95"
              >
                Envoyer mon devis ({totalWorks} travaux)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bouton retour */}
      {state.view === "zoomed" && (
        <button
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-sm text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-medium hover:bg-black/95 transition-all shadow-lg"
        >
          ← Retour au plan
        </button>
      )}
    </div>
  );
}
