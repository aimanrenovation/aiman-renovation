"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface SignaturePadProps {
  onValidate: (base64Png: string) => void;
}

export function SignaturePad({ onValidate }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [hasStrokes, setHasStrokes] = useState(false);
  const [validated, setValidated] = useState(false);

  const getPos = useCallback(
    (e: MouseEvent | Touch): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const startDraw = useCallback(
    (pos: { x: number; y: number }) => {
      isDrawingRef.current = true;
      lastPosRef.current = pos;
      setHasStrokes(true);
    },
    []
  );

  const draw = useCallback(
    (pos: { x: number; y: number }) => {
      if (!isDrawingRef.current || !lastPosRef.current) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPosRef.current = pos;
    },
    []
  );

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fill white background
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startDraw(getPos(e));
    };
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      draw(getPos(e));
    };
    const onMouseUp = () => endDraw();

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) startDraw(getPos(e.touches[0]));
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) draw(getPos(e.touches[0]));
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      endDraw();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [getPos, startDraw, draw, endDraw]);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
    setValidated(false);
  }, []);

  const handleValidate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL("image/png");
    setValidated(true);
    onValidate(base64);
  }, [onValidate]);

  return (
    <div className="flex flex-col gap-3">
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        className="w-full rounded-xl border border-neutral-300 bg-white touch-none"
        style={{ height: "150px" }}
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-sm font-medium text-neutral-600"
        >
          Effacer
        </button>
        <button
          type="button"
          onClick={handleValidate}
          disabled={!hasStrokes || validated}
          className="flex-1 rounded-xl bg-[#E50000] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {validated ? "Validée" : "Valider"}
        </button>
      </div>
    </div>
  );
}
