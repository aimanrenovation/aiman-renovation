import { NextResponse } from "next/server";
import { eq, and, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireManager, isErrorResponse } from "@/lib/employes/manager-guard";

/** POST /api/employes/manager/pointages/[id]/validate */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const result = await requireManager();
  if (isErrorResponse(result)) return result;

  const { session, managedEmployeIds } = result;
  const { id } = await ctx.params;

  if (managedEmployeIds.length === 0) {
    return NextResponse.json({ error: "no_managed_employes" }, { status: 403 });
  }

  // Fetch the pointage
  const [pointage] = await db
    .select()
    .from(schema.pointages)
    .where(
      and(
        eq(schema.pointages.id, id),
        inArray(schema.pointages.employeId, managedEmployeIds)
      )
    )
    .limit(1);

  if (!pointage) {
    return NextResponse.json({ error: "pointage_not_found" }, { status: 404 });
  }

  if (pointage.validationStatut !== "brut") {
    return NextResponse.json(
      { error: "pointage_already_validated", statut: pointage.validationStatut },
      { status: 409 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const action = body.action;
  if (action !== "valide" && action !== "corrige") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {
    validationStatut: "valide_manager",
    validatedByManager: session.sub,
    managerValidatedAt: new Date(),
  };

  if (action === "corrige") {
    if (body.correctionNotes) updates.correctionNotes = body.correctionNotes;
    if (body.heureDebutCorrigee)
      updates.heureDebutCorrigee = new Date(body.heureDebutCorrigee as string);
    if (body.heureFinCorrigee)
      updates.heureFinCorrigee = new Date(body.heureFinCorrigee as string);
    if (typeof body.pauseMinutesCorrigee === "number")
      updates.pauseMinutesCorrigee = body.pauseMinutesCorrigee;
  }

  const [updated] = await db
    .update(schema.pointages)
    .set(updates)
    .where(eq(schema.pointages.id, id))
    .returning({
      id: schema.pointages.id,
      validationStatut: schema.pointages.validationStatut,
      validatedByManager: schema.pointages.validatedByManager,
      managerValidatedAt: schema.pointages.managerValidatedAt,
      correctionNotes: schema.pointages.correctionNotes,
      heureDebutCorrigee: schema.pointages.heureDebutCorrigee,
      heureFinCorrigee: schema.pointages.heureFinCorrigee,
      pauseMinutesCorrigee: schema.pointages.pauseMinutesCorrigee,
    });

  return NextResponse.json({ pointage: updated });
}
