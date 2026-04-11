import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";
import { generateParrainageCode } from "@/lib/employes/parrainage-code";

/**
 * GET /api/parrainage
 * Liste tous les parrainages (employe ou patron).
 */
export const GET = requireAuth(async () => {
  const rows = await db
    .select()
    .from(schema.parrainages)
    .orderBy(desc(schema.parrainages.createdAt));

  return NextResponse.json({ parrainages: rows });
});

/**
 * POST /api/parrainage
 * Créer un nouveau parrainage — génère le code automatiquement.
 */
export const POST = requireAuth(async (request, _ctx, session) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { parrainNom, parrainPrenom, parrainEmail, parrainPhone, parrainChantierId, recompense } =
    body as {
      parrainNom?: string;
      parrainPrenom?: string;
      parrainEmail?: string;
      parrainPhone?: string;
      parrainChantierId?: string;
      recompense?: string;
    };

  if (!parrainNom || !parrainPrenom) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const code = generateParrainageCode(parrainNom);

  const [row] = await db
    .insert(schema.parrainages)
    .values({
      parrainNom,
      parrainPrenom,
      parrainEmail: parrainEmail || null,
      parrainPhone: parrainPhone || null,
      parrainChantierId: parrainChantierId || null,
      recompense: recompense || null,
      code,
    })
    .returning();

  dispatchJarvisEvent({
    type: "parrainage.created",
    employe_id: session.sub,
    chantier_id: row.parrainChantierId ?? "",
    timestamp: new Date().toISOString(),
    data: {
      parrainageId: row.id,
      code: row.code,
      parrainNom: row.parrainNom,
      parrainPrenom: row.parrainPrenom,
    },
  });

  return NextResponse.json({ ok: true, parrainage: row }, { status: 201 });
});
