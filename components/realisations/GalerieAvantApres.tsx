import Image from "next/image";

interface GalerieAvantApresProps {
  photosAvant: string[];
  photosApres: string[];
}

/**
 * Galerie comparative avant/après.
 * - Si les deux séries ont des photos : affichage en 2 colonnes côte à côte.
 * - Si une seule série : colonne pleine largeur avec label.
 */
export function GalerieAvantApres({
  photosAvant,
  photosApres,
}: GalerieAvantApresProps) {
  const hasAvant = photosAvant.length > 0;
  const hasApres = photosApres.length > 0;

  if (!hasAvant && !hasApres) return null;

  // Mode côte à côte : on aligne photo par photo jusqu'au min des deux séries
  if (hasAvant && hasApres) {
    const minLen = Math.min(photosAvant.length, photosApres.length);
    const pairs = Array.from({ length: minLen }, (_, i) => ({
      avant: photosAvant[i],
      apres: photosApres[i],
    }));
    // Photos restantes non appariées
    const extraAvant = photosAvant.slice(minLen);
    const extraApres = photosApres.slice(minLen);

    return (
      <div className="space-y-6">
        {/* Paires côte à côte */}
        {pairs.map((pair, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <PhotoItem
              url={pair.avant}
              label="Avant"
              accentClass="bg-amber-500/90"
              index={i}
              priority={i === 0}
            />
            <PhotoItem
              url={pair.apres}
              label="Après"
              accentClass="bg-[#E50000]/90"
              index={i}
              priority={i === 0}
            />
          </div>
        ))}

        {/* Extra avant (non appariées) */}
        {extraAvant.length > 0 && (
          <div>
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide mb-2">
              Avant — suite
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {extraAvant.map((url, i) => (
                <PhotoItem
                  key={`extra-avant-${i}`}
                  url={url}
                  label="Avant"
                  accentClass="bg-amber-500/90"
                  index={i}
                  priority={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Extra après (non appariées) */}
        {extraApres.length > 0 && (
          <div>
            <p className="text-xs text-[#E50000] font-semibold uppercase tracking-wide mb-2">
              Après — suite
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {extraApres.map((url, i) => (
                <PhotoItem
                  key={`extra-apres-${i}`}
                  url={url}
                  label="Après"
                  accentClass="bg-[#E50000]/90"
                  index={i}
                  priority={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode série unique
  const photos = hasApres ? photosApres : photosAvant;
  const label = hasApres ? "Après" : "Avant";
  const accent = hasApres ? "bg-[#E50000]/90" : "bg-amber-500/90";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {photos.map((url, i) => (
        <PhotoItem
          key={i}
          url={url}
          label={label}
          accentClass={accent}
          index={i}
          priority={i === 0}
        />
      ))}
    </div>
  );
}

function PhotoItem({
  url,
  label,
  accentClass,
  index,
  priority,
}: {
  url: string;
  label: string;
  accentClass: string;
  index: number;
  priority: boolean;
}) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors duration-200">
      <Image
        src={url}
        alt={`${label} — photo ${index + 1}`}
        fill
        className="object-cover hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 640px) 50vw, 33vw"
        priority={priority}
      />
      <div
        className={`absolute bottom-2 left-2 ${accentClass} backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full`}
      >
        {label}
      </div>
    </div>
  );
}
