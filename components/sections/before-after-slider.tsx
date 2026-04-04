"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  title: string;
}

export function BeforeAfterSlider({ before, after, title }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(100); // Start full "avant"
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);
  const targetRef = useRef(100);
  const currentRef = useRef(100);

  // Spring animation — smooth inertia movement
  const animateSpring = useCallback(() => {
    const diff = targetRef.current - currentRef.current;
    if (Math.abs(diff) < 0.1) {
      currentRef.current = targetRef.current;
      setPosition(targetRef.current);
      animationRef.current = null;
      return;
    }
    currentRef.current += diff * 0.12;
    setPosition(currentRef.current);
    animationRef.current = requestAnimationFrame(animateSpring);
  }, []);

  const setTarget = useCallback((value: number) => {
    targetRef.current = value;
    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animateSpring);
    }
  }, [animateSpring]);

  // Auto-reveal when scrolling into view
  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          // Animate from 100% (full avant) to 50% (split view)
          setTimeout(() => {
            setTarget(50);
            setHasAnimated(true);
          }, 300);
          observer.disconnect();
        }
      },
      { threshold: [0.4] }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasAnimated, setTarget]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 2), 98);
    targetRef.current = pct;
    currentRef.current = pct;
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden cursor-col-resize select-none touch-none rounded-t-lg"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Image APRÈS (fond complet) */}
      <div className={`absolute inset-0 transition-transform duration-700 ease-out ${isHovered ? "scale-[1.03]" : "scale-100"}`}>
        <Image
          src={after}
          alt={`${title} — après`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Image AVANT (clippée) */}
      <div
        className={`absolute inset-0 transition-transform duration-700 ease-out ${isHovered ? "scale-[1.03]" : "scale-100"}`}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${title} — avant`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Ligne de séparation avec glow */}
      <div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 w-[6px] -translate-x-[2px] bg-white/20 blur-[6px]" />
        {/* Ligne principale */}
        <div className="w-[2px] h-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />

        {/* Poignée circulaire avec pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Pulse ring */}
          <div className={`absolute inset-[-8px] rounded-full border-2 border-white/30 ${!hasAnimated || isDragging ? "" : "animate-ping"}`}
               style={{ animationDuration: "2s", animationIterationCount: "3" }} />
          {/* Handle */}
          <div className={`relative w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center transition-transform duration-200 ${isDragging ? "scale-110" : ""}`}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M8 5L4 11L8 17" stroke="#E50000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 5L18 11L14 17" stroke="#E50000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Labels AVANT / APRÈS avec transition */}
      <div className={`absolute top-3 left-3 backdrop-blur-md rounded-full px-4 py-1.5 z-20 transition-all duration-500 ${
        position > 15 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      } bg-black/60 border border-white/10`}>
        <span className="text-xs text-white font-semibold tracking-wider">AVANT</span>
      </div>
      <div className={`absolute top-3 right-3 backdrop-blur-md rounded-full px-4 py-1.5 z-20 transition-all duration-500 ${
        position < 85 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      } bg-[#E50000]/80 border border-[#E50000]/30`}>
        <span className="text-xs text-white font-semibold tracking-wider">APRÈS</span>
      </div>

      {/* Instruction au premier affichage */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-1000 ${
        hasAnimated && !isDragging ? "opacity-100" : "opacity-0"
      }`}>
        <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
          <span className="text-[10px] text-white/70 tracking-wider">↔ GLISSEZ POUR COMPARER</span>
        </div>
      </div>
    </div>
  );
}
