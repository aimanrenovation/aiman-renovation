/**
 * POST /api/realisations/create
 *
 * Endpoint prive appele par Jarvis agent #16 (SiteWebCMAgent) pour publier
 * automatiquement une fiche realisation sur aiman-renovation.fr.
 *
 * Securite : header X-Jarvis-Token === process.env.JARVIS_SITE_TOKEN
 * Body : JSON valide avec les champs requis (valide via Zod)
 * Reponse : 201 + { slug, url } | 401 | 400 | 500
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db/client";
import { realisations } from "@/lib/db/schema";

// ---------------------------------------------------------------------------
// Schema Zod
// ---------------------------------------------------------------------------

const RealisationBodySchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase alphanumeric with hyphens"),
  titre: z.string().min(3).max(200),
  titre_de: z.string().max(200).optional(),
  titre_en: z.string().max(200).optional(),
  meta_title: z.string().max(65).optional(),
  meta_description: z.string().max(155).optional(),
  description: z.string().default(""),
  description_de: z.string().optional(),
  description_en: z.string().optional(),
  ville: z.string().min(2).max(100).default("Saint-Louis"),
  type_chantier: z.string().min(2).max(100).default("renovation"),
  reference_dossier: z.string().max(50).optional(),
  photos_avant: z.array(z.string().url()).default([]),
  photos_apres: z.array(z.string().url()).default([]),
  photos_pendant: z.array(z.string().url()).default([]),
  tags: z.array(z.string().max(50)).default([]),
  schema_org: z.record(z.string(), z.unknown()).optional(),
  date_publication: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

type RealisationBody = z.infer<typeof RealisationBodySchema>;

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  // 1. Authentification
  const token = request.headers.get("x-jarvis-token");
  const expectedToken = process.env.JARVIS_SITE_TOKEN;

  if (!expectedToken) {
    console.error("[realisations/create] JARVIS_SITE_TOKEN not configured");
    return NextResponse.json(
      { error: "Server misconfiguration: token not set" },
      { status: 500 },
    );
  }

  if (!token || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse + validation body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = RealisationBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data: RealisationBody = parsed.data;

  // 3. Upsert dans Neon Postgres (on conflict slug -> update)
  try {
    await db
      .insert(realisations)
      .values({
        slug: data.slug,
        titre: data.titre,
        titre_de: data.titre_de ?? null,
        titre_en: data.titre_en ?? null,
        meta_title: data.meta_title ?? null,
        meta_description: data.meta_description ?? null,
        description: data.description,
        description_de: data.description_de ?? null,
        description_en: data.description_en ?? null,
        ville: data.ville,
        type_chantier: data.type_chantier,
        reference_dossier: data.reference_dossier ?? null,
        photos_avant: data.photos_avant,
        photos_apres: data.photos_apres,
        photos_pendant: data.photos_pendant,
        tags: data.tags,
        schema_org: data.schema_org ?? null,
        date_publication: data.date_publication ?? new Date().toISOString().slice(0, 10),
        publiee: true,
      })
      .onConflictDoUpdate({
        target: realisations.slug,
        set: {
          titre: data.titre,
          titre_de: data.titre_de ?? null,
          titre_en: data.titre_en ?? null,
          meta_title: data.meta_title ?? null,
          meta_description: data.meta_description ?? null,
          description: data.description,
          description_de: data.description_de ?? null,
          description_en: data.description_en ?? null,
          ville: data.ville,
          type_chantier: data.type_chantier,
          reference_dossier: data.reference_dossier ?? null,
          photos_avant: data.photos_avant,
          photos_apres: data.photos_apres,
          photos_pendant: data.photos_pendant,
          tags: data.tags,
          schema_org: data.schema_org ?? null,
          date_publication: data.date_publication ?? new Date().toISOString().slice(0, 10),
          publiee: true,
          updatedAt: new Date(),
        },
      });
  } catch (err) {
    console.error("[realisations/create] DB error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // 4. Revalidate cache Next.js
  revalidateTag("realisations", {});
  revalidateTag(`realisation-${data.slug}`, {});

  // 5. Reponse 201
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiman-renovation.fr";
  const url = `${baseUrl}/fr/realisations/${data.slug}`;

  return NextResponse.json({ slug: data.slug, url }, { status: 201 });
}
