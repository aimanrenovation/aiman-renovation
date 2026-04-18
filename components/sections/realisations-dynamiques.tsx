import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import type { Realisation } from "@/lib/realisations";

interface Props {
  realisations: Realisation[];
}

export function RealisationsDynamiques({ realisations }: Props) {
  if (!realisations || realisations.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {realisations.map((r, i) => {
        const heroImage = r.photos_apres[0] || r.photos_avant[0] || null;

        return (
          <ScrollReveal key={r.slug} direction="up" delay={0.05 * (i % 3)}>
            <Link
              href={`/realisations/${r.slug}`}
              className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/5 hover:border-[#E50000]/30 transition-all h-full flex flex-col"
            >
              {/* Image hero */}
              <div className="relative h-52 overflow-hidden bg-[#1a1a1a]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={r.titre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                    Photo à venir
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                  <span className="text-xs text-gray-300">{r.ville}</span>
                </div>
                {/* Badge "Nouveau" si publié dans les 30 derniers jours */}
                {isRecent(r.date_publication ?? r.date_livraison) && (
                  <div className="absolute top-3 left-3 bg-[#E50000] rounded-full px-3 py-1 z-10">
                    <span className="text-xs text-white font-semibold">
                      Nouveau
                    </span>
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 group-hover:text-[#E50000] transition-colors">
                  {r.titre}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {r.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {r.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

function isRecent(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  try {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    return diffMs < 30 * 24 * 60 * 60 * 1000; // 30 jours
  } catch {
    return false;
  }
}
