import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/**
 * Count business days (Mon-Fri) between two dates, inclusive.
 */
function countBusinessDays(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export const POST = requireAuth(async (request, ctx) => {
  const { id } = await (ctx as { params: Promise<{ id: string }> }).params;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const statut = body.statut;
  const reponse = body.reponse;

  if (statut !== "accepte" && statut !== "refuse") {
    return NextResponse.json({ error: "invalid_statut" }, { status: 400 });
  }

  // Fetch the demande first
  const [demande] = await db
    .select()
    .from(schema.demandesAbsence)
    .where(eq(schema.demandesAbsence.id, id))
    .limit(1);

  if (!demande) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (demande.statut !== "en_attente") {
    return NextResponse.json({ error: "already_responded" }, { status: 409 });
  }

  // Update the demande
  const [updated] = await db
    .update(schema.demandesAbsence)
    .set({
      statut,
      reponsePatron: typeof reponse === "string" ? reponse : null,
      reponduLe: new Date(),
    })
    .where(eq(schema.demandesAbsence.id, id))
    .returning();

  // If accepted and type is conge_paye, update solde_conges
  if (statut === "accepte" && demande.type === "conge_paye") {
    const nbJours = countBusinessDays(demande.dateDebut, demande.dateFin);

    // Upsert solde_conges: increment joursPris
    const [existing] = await db
      .select()
      .from(schema.soldeConges)
      .where(eq(schema.soldeConges.employeId, demande.employeId))
      .limit(1);

    if (existing) {
      await db
        .update(schema.soldeConges)
        .set({
          joursPris: sql`${schema.soldeConges.joursPris} + ${nbJours}`,
          updatedAt: new Date(),
        })
        .where(eq(schema.soldeConges.employeId, demande.employeId));
    } else {
      await db
        .insert(schema.soldeConges)
        .values({
          employeId: demande.employeId,
          joursPris: String(nbJours),
        });
    }
  }

  return NextResponse.json({ ok: true, demande: updated });
}, ["patron"]);
