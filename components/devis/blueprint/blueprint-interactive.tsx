"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

interface BlueprintInteractiveProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

// Coordonnées en PIXELS du viewBox SVG (2812x1536)
// Mesurées depuis le screenshot réel avec conversion screen→SVG
// Coordonnées PIXELS image source (2812x1536) — détectées par analyse de pixels
// Murs extérieurs: L=453 T=201 B=1081 R_gar=2317 R_bot=2197
// Cloisons: cui→sdb=920 sdb_wc=450 sdbwc→gar=1250
// Corridor: top=648 bot=665
// Salon→SAM=629 SAM→Ch1=776 Ch1→Ch2=1279
// Corrigé après analyse visuelle debug toutes zones visibles
// Cuisine = tout le haut-gauche avec le carrelage
// SDB = petite pièce "SDB" en haut à droite de la cuisine (avec douche+baignoire)
// WC = sous la SDB (avec cuvette)
// Garage = grande pièce droite en haut (voiture)
// Salon = bas-gauche (TV+canapé) — LARGE, inclut l'espace jusqu'au mur SAM
// SAM = table à manger au centre-gauche
// Ch1 = "Chambre 1 Parentale" grande pièce centre-bas
// Ch2 = "Chambre 2" droite-bas
// SCAN PIXEL AUTOMATIQUE sur l'image source 2812x1536
// Murs épais bleus détectés par analyse PIL (is_blue b>120 r<120)
// Ext gauche: x=441  Ext droite haut: x=1660  Ext droite bas: x=2207
// Ext haut: y=192  Ext bas: y=1089
// Cuisine→SDB: x=747  SDB/WC→Garage: x=1298
// SDB→WC horiz: y=503  Corridor: y=647→680
// Salon→SAM: x=629  Ch1→Ch2: x=1700
const ZONES: Record<ZoneId, { x: number; y: number; w: number; h: number }> = {
  cuisine:   { x:  453, y:  204, w:  294, h:  440 },
  sdb:       { x:  752, y:  204, w:  540, h:  261 },
  wc:        { x:  752, y:  542, w:  540, h:  102 },
  garage:    { x: 1302, y:  204, w:  358, h:  476 },
  vestibule: { x:  453, y:  647, w:  845, h:   33 },
  salon:     { x:  453, y:  680, w:  176, h:  409 },
  sam:       { x:  629, y:  680, w:  523, h:  409 },
  chambre1:  { x: 1152, y:  680, w:  548, h:  409 },
  chambre2:  { x: 1700, y:  680, w:  507, h:  409 },
  terrasse:  { x:  453, y: 1089, w:  699, h:  100 },
  jardin:    { x:   80, y: 1200, w: 2650, h:  260 },
  haie:      { x:   10, y:   10, w:  120, h: 1516 },
  facades:   { x: 2220, y:  204, w:  120, h:  885 },
  toiture:   { x:  453, y:   80, w: 1207, h:  110 },
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
        {/* Styles hover SVG */}
        <style>{`
          .zone-label { opacity: 0; transition: opacity 0.3s; filter: drop-shadow(0 0 10px rgba(74,158,255,0.8)); }
          .zone-rect { transition: all 0.3s; }
          .zone-btn:hover .zone-label { opacity: 1; }
          .zone-btn:hover .zone-rect { fill: rgba(74,158,255,0.15); stroke: rgba(74,158,255,0.6); stroke-width: 4; }
          .zone-ext-btn:hover .zone-rect { fill: rgba(26,122,58,0.12); stroke: rgba(26,122,58,0.5); stroke-width: 3; }
          .zone-ext-btn:hover .zone-label { opacity: 1; }
        `}</style>

        {/* Image de fond */}
        <image href="/images/blueprint-plan.jpeg" x="0" y="0" width="2812" height="1536" />

        {/* Zones intérieures */}
        {ZONES_CONFIG.filter(z => z.category === "interieur").map((zone) => {
          const z = ZONES[zone.id];
          if (!z) return null;
          const hasWorks = (state.selectedWorks[zone.id]?.length ?? 0) > 0;
          const isActive = state.activeZone === zone.id;

          return (
            <g key={zone.id} onClick={() => handleZoneClick(zone.id)} className="zone-btn" style={{ cursor: "pointer" }}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={isActive ? "rgba(229,0,0,0.2)" : hasWorks ? "rgba(229,0,0,0.1)" : "transparent"}
                stroke={isActive ? "#E50000" : hasWorks ? "rgba(229,0,0,0.5)" : "transparent"}
                strokeWidth={isActive ? 6 : hasWorks ? 3 : 0}
                rx={4}
                className="zone-rect"
              />
              {/* Nom de la pièce au hover */}
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#4A9EFF" fontSize={z.w < 300 ? 28 : 40} fontFamily="Arial, sans-serif" fontWeight="bold"
                className="zone-label"
                style={{ pointerEvents: "none" }}
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
            <g key={zone.id} onClick={() => handleZoneClick(zone.id)} className="zone-ext-btn" style={{ cursor: "pointer" }}>
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                fill={hasWorks ? "rgba(229,0,0,0.1)" : "transparent"}
                stroke={hasWorks ? "rgba(229,0,0,0.3)" : "transparent"}
                strokeWidth={3}
                className="zone-rect"
              />
              <text
                x={z.x + z.w / 2} y={z.y + z.h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="#1a7a3a" fontSize={24} fontFamily="Arial, sans-serif" fontWeight="bold"
                className="zone-label"
                style={{ pointerEvents: "none" }}
              >
                {zone.label}
              </text>
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
