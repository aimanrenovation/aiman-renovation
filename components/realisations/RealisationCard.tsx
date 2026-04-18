import Image from "next/image";
import Link from "next/link";

interface RealisationCardProps {
  slug: string;
  titre: string;
  ville: string;
  datePublication?: string;
  photoAfter?: string | null;
  surface?: number | null;
  isRecent?: boolean;
}

export function RealisationCard({
  slug,
  titre,
  ville,
  datePublication,
  photoAfter,
  surface,
  isRecent,
}: RealisationCardProps) {
  const formattedDate = datePublication
    ? new Date(datePublication).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <Link
      href={`/realisations/${slug}`}
      className="group relative bg-[#111111] rounded-lg overflow-hidden border border-white/5 hover:border-[#E50000]/30 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#1a1a1a] flex-shrink-0">
        {photoAfter ? (
          <Image
            src={photoAfter}
            alt={titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
            Photo à venir
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Ville badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 z-10">
          <span className="text-xs text-gray-300">{ville}</span>
        </div>

        {/* Badge Nouveau */}
        {isRecent && (
          <div className="absolute top-3 left-3 bg-[#E50000] rounded-full px-3 py-1 z-10">
            <span className="text-xs text-white font-semibold">Nouveau</span>
          </div>
        )}

        {/* Surface badge */}
        {surface != null && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 z-10">
            <span className="text-xs text-gray-300">{surface} m²</span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-white text-base mb-2 line-clamp-2 group-hover:text-[#E50000] transition-colors duration-200">
          {titre}
        </h3>

        {formattedDate && (
          <p className="text-xs text-gray-500 mt-auto pt-3 border-t border-white/5">
            {formattedDate}
          </p>
        )}
      </div>
    </Link>
  );
}
