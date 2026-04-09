"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface LightboxPhoto {
  id: string;
  url: string;
  caption: string | null;
  employe: string;
  priseLe: string;
}

interface Props {
  photos: LightboxPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({ photos, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  const photo = photos[index];
  if (!photo) return null;

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    if (Math.abs(touchDeltaX.current) > 60) {
      if (touchDeltaX.current > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  const dateStr = new Date(photo.priseLe).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white/70">
          {index + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-xl"
          aria-label="Fermer"
        >
          &#x2715;
        </button>
      </div>

      {/* Photo */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2">
        {/* Prev button (desktop) */}
        {photos.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm md:block"
            aria-label="Photo precedente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.url}
          alt={photo.caption || "Photo chantier"}
          className="max-h-full max-w-full object-contain"
        />

        {/* Next button (desktop) */}
        {photos.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm md:block"
            aria-label="Photo suivante"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom info */}
      <div className="px-4 pb-6 pt-3">
        {photo.caption && (
          <p className="mb-1 text-sm text-white">{photo.caption}</p>
        )}
        <p className="text-xs text-white/60">
          {photo.employe} &middot; {dateStr}
        </p>
      </div>
    </div>
  );
}
