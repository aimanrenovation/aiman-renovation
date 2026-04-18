import fs from "fs";
import path from "path";

export interface RealisationPhoto {
  url: string;
  caption?: string;
}

export interface RealisationSchemaOrg {
  "@context": string;
  "@type": string | string[];
  name: string;
  url: string;
  provider?: Record<string, unknown>;
  areaServed?: Record<string, unknown>;
  serviceType?: string;
  dateCreated?: string;
}

export interface Realisation {
  slug: string;
  titre: string;
  // Champs SEO optionnels (générés par Jarvis ou renseignés manuellement)
  meta_title?: string;
  meta_description?: string;
  description: string;
  ville: string;
  type_chantier: string;
  surface_m2?: number;
  reference_dossier?: string;
  // date_publication est calculée depuis date_livraison si absente
  date_publication?: string;
  // date_livraison : champ natif Jarvis (ISO 8601 : "2026-04-18")
  date_livraison?: string;
  photos_avant: string[];
  photos_apres: string[];
  photos_pendant: string[];
  video_url?: string | null;
  tags: string[];
  schema_org: RealisationSchemaOrg;
}

const REALISATIONS_DIR = path.join(process.cwd(), "content", "realisations");

/** Charge toutes les réalisations depuis content/realisations/*.json */
export function getAllRealisations(): Realisation[] {
  if (!fs.existsSync(REALISATIONS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(REALISATIONS_DIR)
    .filter((f) => f.endsWith(".json") && f !== ".gitkeep");

  const realisations: Realisation[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(
        path.join(REALISATIONS_DIR, file),
        "utf-8",
      );
      const data = JSON.parse(content) as Realisation;
      if (data.slug && data.titre) {
        // Normalisation : date_publication depuis date_livraison si absent
        if (!data.date_publication && data.date_livraison) {
          data.date_publication = data.date_livraison;
        }
        realisations.push(data);
      }
    } catch {
      // Fichier JSON invalide — on skip silencieusement
    }
  }

  // Tri par date de publication décroissante (plus récent en premier)
  realisations.sort((a, b) =>
    (b.date_publication ?? b.date_livraison ?? "").localeCompare(
      a.date_publication ?? a.date_livraison ?? "",
    ),
  );

  return realisations;
}

/** Charge une réalisation par son slug. Retourne undefined si introuvable. */
export function getRealisationBySlug(slug: string): Realisation | undefined {
  const filePath = path.join(REALISATIONS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content) as Realisation;
    // Normalisation : date_publication depuis date_livraison si absent
    if (!data.date_publication && data.date_livraison) {
      data.date_publication = data.date_livraison;
    }
    return data;
  } catch {
    return undefined;
  }
}

/** Retourne tous les slugs pour generateStaticParams. */
export function getAllRealisationSlugs(): string[] {
  if (!fs.existsSync(REALISATIONS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(REALISATIONS_DIR)
    .filter((f) => f.endsWith(".json") && f !== ".gitkeep")
    .map((f) => f.replace(/\.json$/, ""));
}
