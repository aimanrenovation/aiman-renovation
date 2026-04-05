"use client";

import { useRef, useEffect, useCallback } from "react";
import { BP } from "./blueprint-colors";
import {
  EXTERIOR_WALLS,
  INTERIOR_WALLS,
  WINDOWS,
  SLIDING_DOORS,
  GARAGE_DOOR,
  ROOM_LABELS,
} from "./blueprint-layout";
import { ZONES_CONFIG } from "../devis-zones-config";
import type { ZoneId, DevisState, DevisAction } from "../devis-types";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Blueprint2DProps {
  state: DevisState;
  dispatch: React.Dispatch<DevisAction>;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const VB_W = 1000;
const VB_H = 720;
const LERP_SPEED = 0.08;
const ZOOM_PADDING = 60;

// Zones sorted by area ascending so small zones (WC) win hit tests over large (jardin)
const ZONES_BY_AREA = [...ZONES_CONFIG].sort(
  (a, b) => a.bounds.w * a.bounds.h - b.bounds.w * b.bounds.h,
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hitTestZone(
  mx: number,
  my: number,
): ZoneId | null {
  for (const zone of ZONES_BY_AREA) {
    const { x, y, w, h } = zone.bounds;
    if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
      return zone.id;
    }
  }
  return null;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function Blueprint2D({ state, dispatch }: Blueprint2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const targetRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const hoveredZoneRef = useRef<ZoneId | null>(null);
  const rafRef = useRef<number>(0);

  // ─── Compute target transform ───────────────────────────────────────

  const computeTarget = useCallback(
    (canvas: HTMLCanvasElement): Transform => {
      const cw = canvas.width / devicePixelRatio;
      const ch = canvas.height / devicePixelRatio;

      if (state.view === "zoomed" && state.activeZone) {
        const zone = ZONES_CONFIG.find((z) => z.id === state.activeZone);
        if (zone) {
          const { x, y, w, h } = zone.bounds;
          const cx = x + w / 2;
          const cy = y + h / 2;
          const scaleX = cw / (w + ZOOM_PADDING * 2);
          const scaleY = ch / (h + ZOOM_PADDING * 2);
          const scale = Math.min(scaleX, scaleY);
          return {
            x: cw / 2 - cx * scale,
            y: ch / 2 - cy * scale,
            scale,
          };
        }
      }

      // Global fit
      const scale = Math.min(cw / VB_W, ch / VB_H);
      return {
        x: (cw - VB_W * scale) / 2,
        y: (ch - VB_H * scale) / 2,
        scale,
      };
    },
    [state.view, state.activeZone],
  );

  // ─── Canvas → viewBox coordinate conversion ────────────────────────

  const canvasToVB = useCallback(
    (clientX: number, clientY: number): { vx: number; vy: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const t = transformRef.current;
      return {
        vx: (px - t.x) / t.scale,
        vy: (py - t.y) / t.scale,
      };
    },
    [],
  );

  // ─── Drawing ────────────────────────────────────────────────────────

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      const t = transformRef.current;

      // Clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.fillStyle = BP.bg;
      ctx.fillRect(0, 0, cw, ch);

      // Apply transform
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.scale(t.scale, t.scale);

      // Grid
      drawGrid(ctx);

      // Zone highlights (hover + selected)
      drawZoneHighlights(ctx, state, hoveredZoneRef.current);

      // Walls
      drawWalls(ctx);

      // Windows
      drawWindows(ctx);

      // Sliding doors
      drawSlidingDoors(ctx);

      // Garage door
      drawGarageDoor(ctx);

      // Labels
      drawLabels(ctx, state);

      ctx.restore();
    },
    [state],
  );

  // ─── Animation loop ────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const tick = () => {
      if (!running) return;

      // Resize canvas to match CSS size
      const rect = canvas.getBoundingClientRect();
      const dpr = devicePixelRatio;
      const pw = Math.round(rect.width * dpr);
      const ph = Math.round(rect.height * dpr);
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }

      const cw = rect.width;
      const ch = rect.height;

      // Compute & lerp toward target
      const target = computeTarget(canvas);
      targetRef.current = target;
      const cur = transformRef.current;
      transformRef.current = {
        x: lerp(cur.x, target.x, LERP_SPEED),
        y: lerp(cur.y, target.y, LERP_SPEED),
        scale: lerp(cur.scale, target.scale, LERP_SPEED),
      };

      draw(ctx, cw, ch);
      rafRef.current = requestAnimationFrame(tick);
    };

    // Initialize transform to target immediately on first frame
    const rect = canvas.getBoundingClientRect();
    const dpr = devicePixelRatio;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const initTarget = computeTarget(canvas);
    transformRef.current = { ...initTarget };
    targetRef.current = { ...initTarget };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [computeTarget, draw]);

  // ─── Pointer events ────────────────────────────────────────────────

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const pt = canvasToVB(e.clientX, e.clientY);
      if (!pt) return;
      hoveredZoneRef.current = hitTestZone(pt.vx, pt.vy);
    },
    [canvasToVB],
  );

  const handlePointerLeave = useCallback(() => {
    hoveredZoneRef.current = null;
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pt = canvasToVB(e.clientX, e.clientY);
      if (!pt) return;
      const zone = hitTestZone(pt.vx, pt.vy);
      if (zone) {
        dispatch({ type: "ZOOM_ZONE", zone });
      }
    },
    [canvasToVB, dispatch],
  );

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    />
  );
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = BP.grid;
  ctx.lineWidth = 0.5;
  const step = 20;
  for (let x = 0; x <= VB_W; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, VB_H);
    ctx.stroke();
  }
  for (let y = 0; y <= VB_H; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VB_W, y);
    ctx.stroke();
  }
  // Major grid
  ctx.strokeStyle = BP.gridMajor;
  ctx.lineWidth = 0.8;
  const major = 100;
  for (let x = 0; x <= VB_W; x += major) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, VB_H);
    ctx.stroke();
  }
  for (let y = 0; y <= VB_H; y += major) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VB_W, y);
    ctx.stroke();
  }
}

function drawZoneHighlights(
  ctx: CanvasRenderingContext2D,
  state: DevisState,
  hoveredZone: ZoneId | null,
) {
  for (const zone of ZONES_CONFIG) {
    const { x, y, w, h } = zone.bounds;
    const works = state.selectedWorks[zone.id];
    const hasWorks = works && works.length > 0;
    const isHovered = hoveredZone === zone.id;

    if (hasWorks) {
      // Selected zone — red highlight
      ctx.fillStyle = BP.selectedFill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = BP.selectedStroke;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Badge with work count
      const count = works.length;
      const badgeR = 12;
      const bx = x + w - badgeR - 4;
      const by = y + badgeR + 4;
      ctx.beginPath();
      ctx.arc(bx, by, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = BP.red;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(count), bx, by);
    } else if (isHovered) {
      // Hover highlight — blue
      ctx.fillStyle = BP.hoverFill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = BP.hoverStroke;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, w, h);
    }
  }
}

function drawWalls(ctx: CanvasRenderingContext2D) {
  // Exterior walls
  ctx.fillStyle = BP.wall;
  for (const w of EXTERIOR_WALLS) {
    ctx.fillRect(w.x, w.y, w.w, w.h);
  }
  // Interior walls
  for (const w of INTERIOR_WALLS) {
    ctx.fillRect(w.x, w.y, w.w, w.h);
  }
}

function drawWindows(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = BP.glass;
  ctx.lineWidth = 1.5;

  for (const win of WINDOWS) {
    const { x1, y1, x2, y2, orientation, midpoint } = win;

    if (orientation === "h") {
      // 3 horizontal lines (triple glazing effect)
      for (const offset of [-2, 0, 2]) {
        ctx.beginPath();
        ctx.moveTo(x1, y1 + offset);
        ctx.lineTo(x2, y2 + offset);
        ctx.stroke();
      }
      // Center tick
      ctx.beginPath();
      ctx.moveTo(midpoint, y1 - 4);
      ctx.lineTo(midpoint, y1 + 4);
      ctx.stroke();
    } else {
      // 3 vertical lines
      for (const offset of [-2, 0, 2]) {
        ctx.beginPath();
        ctx.moveTo(x1 + offset, y1);
        ctx.lineTo(x2 + offset, y2);
        ctx.stroke();
      }
      // Center tick
      ctx.beginPath();
      ctx.moveTo(x1 - 4, midpoint);
      ctx.lineTo(x1 + 4, midpoint);
      ctx.stroke();
    }
  }
}

function drawSlidingDoors(ctx: CanvasRenderingContext2D) {
  for (const door of SLIDING_DOORS) {
    const { x1, y1, x2, y2 } = door;
    ctx.strokeStyle = BP.glass;
    ctx.lineWidth = 2;

    // Double line for sliding door
    for (const offset of [-2, 2]) {
      ctx.beginPath();
      ctx.moveTo(x1, y1 + offset);
      ctx.lineTo(x2, y2 + offset);
      ctx.stroke();
    }

    // Arrows indicating sliding direction
    const mx = (x1 + x2) / 2;
    ctx.beginPath();
    ctx.moveTo(mx - 8, y1 - 6);
    ctx.lineTo(mx, y1);
    ctx.lineTo(mx - 8, y1 + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx + 8, y1 - 6);
    ctx.lineTo(mx, y1);
    ctx.lineTo(mx + 8, y1 + 6);
    ctx.stroke();
  }
}

function drawGarageDoor(ctx: CanvasRenderingContext2D) {
  const { x1, y1, x2, y2 } = GARAGE_DOOR;
  ctx.strokeStyle = BP.wall;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLabels(ctx: CanvasRenderingContext2D, state: DevisState) {
  for (const lbl of ROOM_LABELS) {
    const works = state.selectedWorks[lbl.zoneId as ZoneId];
    const hasWorks = works && works.length > 0;

    ctx.fillStyle = hasWorks ? BP.red : BP.label;
    ctx.font = `600 ${lbl.size}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(lbl.text, lbl.x, lbl.y);
  }
}
