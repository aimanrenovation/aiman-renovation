import { NextResponse } from "next/server";
import { inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** POST /api/employes/admin/pointages/transmit — bulk transmit to accountant */
export const POST = requireAuth(async (request) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const pointageIds = body.pointageIds;
  if (!Array.isArray(pointageIds) || pointageIds.length === 0) {
    return NextResponse.json({ error: "invalid_pointage_ids" }, { status: 400 });
  }

  // Verify all pointages are valide_patron
  const pointages = await db
    .select({
      id: schema.pointages.id,
      validationStatut: schema.pointages.validationStatut,
    })
    .from(schema.pointages)
    .where(inArray(schema.pointages.id, pointageIds as string[]));

  if (pointages.length !== pointageIds.length) {
    return NextResponse.json({ error: "some_pointages_not_found" }, { status: 404 });
  }

  const notReady = pointages.filter((p) => p.validationStatut !== "valide_patron");
  if (notReady.length > 0) {
    return NextResponse.json(
      {
        error: "some_pointages_not_ready",
        ids: notReady.map((p) => p.id),
      },
      { status: 409 }
    );
  }

  // Bulk update
  const updated = await db
    .update(schema.pointages)
    .set({ validationStatut: "transmis_comptabilite" })
    .where(inArray(schema.pointages.id, pointageIds as string[]))
    .returning({
      id: schema.pointages.id,
      validationStatut: schema.pointages.validationStatut,
    });

  return NextResponse.json({ updated, count: updated.length });
}, ["patron"]);
