import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

/**
 * POST /api/parrainage/convert
 * Convertir un parrainage — le filleul signe un chantier.
 */
export const POST = requireAuth(async (request, _ctx, session) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { code, filleulNom, filleulPhone, filleulEmail, filleulChantierId } =
    body as {
      code?: string;
      filleulNom?: string;
      filleulPhone?: string;
      filleulEmail?: string;
      filleulChantierId?: string;
    };

  if (!code) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  // Find the parrainage by code
  const [existing] = await db
    .select()
    .from(schema.parrainages)
    .where(eq(schema.parrainages.code, code));

  if (!existing) {
    return NextResponse.json({ error: "code_not_found" }, { status: 404 });
  }

  if (existing.statut === "converti") {
    return NextResponse.json({ error: "already_converted" }, { status: 409 });
  }

  if (existing.statut === "expire") {
    return NextResponse.json({ error: "code_expired" }, { status: 410 });
  }

  const [updated] = await db
    .update(schema.parrainages)
    .set({
      statut: "converti",
      filleulNom: filleulNom || existing.filleulNom,
      filleulPhone: filleulPhone || existing.filleulPhone,
      filleulEmail: filleulEmail || existing.filleulEmail,
      filleulChantierId: filleulChantierId || existing.filleulChantierId,
      convertAt: sql`now()`,
    })
    .where(eq(schema.parrainages.id, existing.id))
    .returning();

  dispatchJarvisEvent({
    type: "parrainage.converti",
    employe_id: session.sub,
    chantier_id: updated.filleulChantierId ?? updated.parrainChantierId ?? "",
    timestamp: new Date().toISOString(),
    data: {
      parrainageId: updated.id,
      code: updated.code,
      parrainNom: updated.parrainNom,
      parrainPrenom: updated.parrainPrenom,
      filleulNom: updated.filleulNom,
    },
  });

  return NextResponse.json({ ok: true, parrainage: updated });
});
