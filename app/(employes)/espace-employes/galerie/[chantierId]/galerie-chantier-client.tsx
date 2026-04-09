"use client";

import { useState } from "react";
import { PhotoLightbox, type LightboxPhoto } from "@/components/employes/photo-lightbox";

interface PhotoItem {
  id: string;
  url: string;
  caption: string | null;
  employe: string;
  priseLe: string;
}

interface DateGroup {
  date: string;
  label: string;
  photos: PhotoItem[];
}

interface Props {
  chantierNom: string;
  groups: DateGroup[];
}

export function GalerieChantierClient({ chantierNom, groups }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Flatten all photos for lightbox navigation
  const allPhotos: LightboxPhoto[] = groups.flatMap((g) =>
    g.photos.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      employe: p.employe,
      priseLe: p.priseLe,
    }))
  );

  function getGlobalIndex(groupIdx: number, photoIdx: number): number {
    let idx = 0;
    for (let g = 0; g < groupIdx; g++) {
      idx += groups[g].photos.length;
    }
    return idx + photoIdx;
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">{chantierNom}</h1>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
          <p className="text-sm text-neutral-500">Aucune photo pour ce chantier.</p>
        </div>
      ) : (
        groups.map((g, gi) => (
          <section key={g.date}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              {g.label}
            </h2>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5">
              {g.photos.map((p, pi) => (
                <button
                  key={p.id}
                  onClick={() => setLightboxIndex(getGlobalIndex(gi, pi))}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.caption || "Photo"}
                    className="h-full w-full object-cover transition-transform group-active:scale-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4">
                    <span className="block truncate text-[10px] text-white/90">{p.employe}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))
      )}

      {lightboxIndex != null && (
        <PhotoLightbox
          photos={allPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
