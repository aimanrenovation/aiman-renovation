import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { geocodeChantier } from "@/lib/geo/geocoding";

export interface CreateChantierInput {
  clientNom: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  nom: string;
  adresse: string;
  ville?: string | null;
  codePostal?: string | null;
  radiusM?: number;
  dateDebut?: string | null;
  dateFinPrevue?: string | null;
  statut?: string;
}

function fullAddress(input: { adresse: string; codePostal?: string | null; ville?: string | null }) {
  return [input.adresse, input.codePostal, input.ville].filter(Boolean).join(" ");
}

export async function createChantier(input: CreateChantierInput) {
  let lat: string | null = null;
  let lng: string | null = null;
  let geocodingSource: string | null = null;
  let geocodedAt: Date | null = null;

  try {
    const geo = await geocodeChantier(fullAddress(input));
    lat = geo.lat.toFixed(7);
    lng = geo.lng.toFixed(7);
    geocodingSource = geo.source;
    geocodedAt = new Date();
  } catch (err) {
    console.warn(`[chantiers] geocoding failed for "${input.nom}":`, err);
  }

  const [row] = await db
    .insert(schema.chantiers)
    .values({
      clientNom: input.clientNom,
      clientEmail: input.clientEmail ?? null,
      clientPhone: input.clientPhone ?? null,
      nom: input.nom,
      adresse: input.adresse,
      ville: input.ville ?? null,
      codePostal: input.codePostal ?? null,
      latChantier: lat,
      lngChantier: lng,
      radiusM: input.radiusM ?? 500,
      geocodedAt,
      geocodingSource,
      dateDebut: input.dateDebut ?? null,
      dateFinPrevue: input.dateFinPrevue ?? null,
      statut: input.statut ?? "prospect",
    })
    .returning();

  return row;
}

export async function updateChantierAddress(
  id: string,
  patch: { adresse: string; codePostal?: string | null; ville?: string | null; radiusM?: number }
) {
  let lat: string | null = null;
  let lng: string | null = null;
  let geocodingSource: string | null = null;
  let geocodedAt: Date | null = null;

  try {
    const geo = await geocodeChantier(fullAddress(patch));
    lat = geo.lat.toFixed(7);
    lng = geo.lng.toFixed(7);
    geocodingSource = geo.source;
    geocodedAt = new Date();
  } catch (err) {
    console.warn(`[chantiers] geocoding failed for id=${id}:`, err);
  }

  const updates: Partial<typeof schema.chantiers.$inferInsert> = {
    adresse: patch.adresse,
    ville: patch.ville ?? null,
    codePostal: patch.codePostal ?? null,
    latChantier: lat,
    lngChantier: lng,
    geocodedAt,
    geocodingSource,
  };
  if (patch.radiusM != null) updates.radiusM = patch.radiusM;

  const [row] = await db
    .update(schema.chantiers)
    .set(updates)
    .where(eq(schema.chantiers.id, id))
    .returning();
  return row;
}
