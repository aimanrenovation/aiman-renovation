import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

const VALEUR_MOYENNE_CHANTIER = 5000; // €

export const GET = requireAuth(async () => {
  const parrainages = await db
    .select()
    .from(schema.parrainages)
    .orderBy(desc(schema.parrainages.createdAt));

  const total = parrainages.length;
  const actifs = parrainages.filter((p) => p.statut === "actif").length;
  const utilises = parrainages.filter((p) => p.statut === "utilise").length;
  const convertis = parrainages.filter((p) => p.statut === "converti").length;
  const expires = parrainages.filter((p) => p.statut === "expire").length;
  const tauxConversion = total > 0 ? Math.round((convertis / total) * 100) : 0;
  const roiEstime = convertis * VALEUR_MOYENNE_CHANTIER;

  return NextResponse.json({
    parrainages,
    stats: {
      total,
      actifs,
      utilises,
      convertis,
      expires,
      tauxConversion,
      roiEstime,
    },
  });
}, ["patron"]);

/** POST /api/employes/admin/parrainages — créer un parrainage */
export const POST = requireAuth(async (request) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { parrainNom, parrainPrenom, parrainEmail, parrainPhone, recompense, code, parrainChantierId } = body as {
    parrainNom?: string;
    parrainPrenom?: string;
    parrainEmail?: string | null;
    parrainPhone?: string | null;
    recompense?: string | null;
    code?: string;
    parrainChantierId?: string | null;
  };

  if (!parrainNom || !parrainPrenom || !code) {
    return NextResponse.json({ error: "champs_requis" }, { status: 400 });
  }

  const [created] = await db
    .insert(schema.parrainages)
    .values({
      parrainNom,
      parrainPrenom,
      parrainEmail: parrainEmail ?? null,
      parrainPhone: parrainPhone ?? null,
      parrainChantierId: parrainChantierId ?? null,
      code,
      recompense: recompense ?? null,
      statut: "actif",
    })
    .returning();

  return NextResponse.json({ parrainage: created }, { status: 201 });
}, ["patron"]);
