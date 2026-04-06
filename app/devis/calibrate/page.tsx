"use client";

import { useState, useRef, useCallback } from "react";

type Point = { x: number; y: number };
type Zone = { id: string; topLeft: Point; bottomRight: Point };

const ZONE_NAMES = [
  "cuisine", "sdb", "wc", "garage", "vestibule",
  "salon", "sam", "chambre1", "chambre2",
  "terrasse", "jardin", "haie", "facades", "toiture",
];

export default function CalibratePage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [clicks, setClicks] = useState<Point[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentZone, setCurrentZone] = useState(0);
  const [lastClick, setLastClick] = useState<Point | null>(null);

  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    // Convert screen coords to SVG coords
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const point = { x: Math.round(svgPt.x), y: Math.round(svgPt.y) };
    setLastClick(point);

    const newClicks = [...clicks, point];
    setClicks(newClicks);

    // Every 2 clicks = one zone (top-left, bottom-right)
    if (newClicks.length === 2) {
      const [tl, br] = newClicks;
      const zone: Zone = {
        id: ZONE_NAMES[currentZone] || `zone${currentZone}`,
        topLeft: { x: Math.min(tl.x, br.x), y: Math.min(tl.y, br.y) },
        bottomRight: { x: Math.max(tl.x, br.x), y: Math.max(tl.y, br.y) },
      };
      setZones((prev) => [...prev, zone]);
      setClicks([]);
      setCurrentZone((prev) => prev + 1);
    }
  }, [clicks, currentZone]);

  const undoLast = () => {
    if (clicks.length > 0) {
      setClicks([]);
    } else if (zones.length > 0) {
      setZones((prev) => prev.slice(0, -1));
      setCurrentZone((prev) => prev - 1);
    }
  };

  const reset = () => {
    setClicks([]);
    setZones([]);
    setCurrentZone(0);
    setLastClick(null);
  };

  // Generate the code output
  const codeOutput = `const ZONES: Record<ZoneId, { x: number; y: number; w: number; h: number }> = {\n${zones
    .map((z) => {
      const x = z.topLeft.x;
      const y = z.topLeft.y;
      const w = z.bottomRight.x - z.topLeft.x;
      const h = z.bottomRight.y - z.topLeft.y;
      return `  ${z.id.padEnd(10)}: { x: ${String(x).padStart(5)}, y: ${String(y).padStart(5)}, w: ${String(w).padStart(5)}, h: ${String(h).padStart(5)} },`;
    })
    .join("\n")}\n};`;

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Left panel - SVG */}
      <div className="flex-1 relative">
        <svg
          ref={svgRef}
          viewBox="0 0 2812 1536"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          onClick={handleClick}
          style={{ cursor: "crosshair" }}
        >
          <image href="/images/blueprint-plan.jpeg" x="0" y="0" width="2812" height="1536" />

          {/* Completed zones */}
          {zones.map((z) => (
            <g key={z.id}>
              <rect
                x={z.topLeft.x}
                y={z.topLeft.y}
                width={z.bottomRight.x - z.topLeft.x}
                height={z.bottomRight.y - z.topLeft.y}
                fill="rgba(229,0,0,0.15)"
                stroke="#E50000"
                strokeWidth={4}
              />
              <text
                x={z.topLeft.x + (z.bottomRight.x - z.topLeft.x) / 2}
                y={z.topLeft.y + (z.bottomRight.y - z.topLeft.y) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize={36}
                fontWeight="bold"
                fontFamily="sans-serif"
                style={{ textShadow: "0 0 10px #000" } as React.CSSProperties}
              >
                {z.id}
              </text>
            </g>
          ))}

          {/* Current first click (waiting for second) */}
          {clicks.length === 1 && (
            <circle cx={clicks[0].x} cy={clicks[0].y} r={12} fill="#00ff00" stroke="#fff" strokeWidth={3} />
          )}

          {/* Crosshair guides */}
          {lastClick && (
            <>
              <line x1={lastClick.x} y1={0} x2={lastClick.x} y2={1536} stroke="rgba(0,255,0,0.3)" strokeWidth={2} strokeDasharray="10,10" />
              <line x1={0} y1={lastClick.y} x2={2812} y2={lastClick.y} stroke="rgba(0,255,0,0.3)" strokeWidth={2} strokeDasharray="10,10" />
            </>
          )}
        </svg>

        {/* Coords display */}
        {lastClick && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-4 py-2 rounded-xl font-mono text-lg">
            x: {lastClick.x}, y: {lastClick.y}
          </div>
        )}
      </div>

      {/* Right panel - Instructions + output */}
      <div className="w-96 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Calibration Blueprint</h1>

        <div className="bg-blue-900/50 border border-blue-500 rounded-xl p-4">
          <p className="font-semibold text-blue-300">
            Zone actuelle : {ZONE_NAMES[currentZone] || "terminé !"}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            {clicks.length === 0
              ? "Clique sur le coin HAUT-GAUCHE de la pièce"
              : "Maintenant clique sur le coin BAS-DROITE"}
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={undoLast} className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">
            Annuler dernier
          </button>
          <button onClick={reset} className="flex-1 bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">
            Reset tout
          </button>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{zones.length}/{ZONE_NAMES.length} zones</p>
          <div className="flex flex-wrap gap-1">
            {ZONE_NAMES.map((name, i) => (
              <span
                key={name}
                className={`text-xs px-2 py-1 rounded ${
                  i < zones.length
                    ? "bg-green-800 text-green-200"
                    : i === currentZone
                    ? "bg-blue-800 text-blue-200"
                    : "bg-gray-800 text-gray-500"
                }`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Code output */}
        {zones.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-300">Code à copier :</p>
              <button
                onClick={() => navigator.clipboard.writeText(codeOutput)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
              >
                Copier
              </button>
            </div>
            <pre className="bg-gray-950 border border-gray-700 rounded-lg p-3 text-xs overflow-x-auto whitespace-pre">
              {codeOutput}
            </pre>
          </div>
        )}

        {/* Individual zone coords */}
        <div className="space-y-1 text-xs font-mono">
          {zones.map((z) => (
            <div key={z.id} className="bg-gray-800 rounded px-2 py-1">
              {z.id}: ({z.topLeft.x},{z.topLeft.y}) → ({z.bottomRight.x},{z.bottomRight.y})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
