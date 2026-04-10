import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/** POST /api/employes/admin/pointages/[id]/validate-patron — patron only */
export const POST = requireAuth(async (request, ctx, session) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const action = body.action;
  if (action !== "valide" && action !== "refuse") {
    return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  }

  // Fetch the pointage
  const [pointage] = await db
    .select()
    .from(schema.pointages)
    .where(eq(schema.pointages.id, id))
    .limit(1);

  if (!pointage) {
    return NextResponse.json({ error: "pointage_not_found" }, { status: 404 });
  }

  if (pointage.validationStatut !== "valide_manager") {
    return NextResponse.json(
      { error: "pointage_not_ready", statut: pointage.validationStatut },
      { status: 409 }
    );
  }

  if (action === "refuse") {
    // Reset back to brut so manager can re-validate
    const [updated] = await db
      .update(schema.pointages)
      .set({
        validationStatut: "brut",
        validatedByManager: null,
        managerValidatedAt: null,
      })
      .where(eq(schema.pointages.id, id))
      .returning({
        id: schema.pointages.id,
        validationStatut: schema.pointages.validationStatut,
      });
    return NextResponse.json({ pointage: updated });
  }

  // action === "valide"
  const [updated] = await db
    .update(schema.pointages)
    .set({
      validationStatut: "valide_patron",
      validatedByPatron: session.sub,
      patronValidatedAt: new Date(),
    })
    .where(eq(schema.pointages.id, id))
    .returning({
      id: schema.pointages.id,
      validationStatut: schema.pointages.validationStatut,
      validatedByPatron: schema.pointages.validatedByPatron,
      patronValidatedAt: schema.pointages.patronValidatedAt,
    });

  return NextResponse.json({ pointage: updated });
}, ["patron"]);
