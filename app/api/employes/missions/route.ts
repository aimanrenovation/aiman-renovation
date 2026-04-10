import { and, eq, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";

/**
 * GET /api/employes/missions
 * Liste les missions urgentes ouvertes (statut='ouverte' ET date_limite > now).
 * Accessible à tout employé authentifié.
 */
export const GET = requireAuth(async () => {
  const rows = await db
    .select({
      id: schema.missionsUrgentes.id,
      titre: schema.missionsUrgentes.titre,
      description: schema.missionsUrgentes.description,
      chantierId: schema.missionsUrgentes.chantierId,
      chantierNom: schema.chantiers.nom,
      chantierVille: schema.chantiers.ville,
      bonusDescription: schema.missionsUrgentes.bonusDescription,
      bonusMontantCents: schema.missionsUrgentes.bonusMontantCents,
      dateLimite: schema.missionsUrgentes.dateLimite,
      creePar: schema.missionsUrgentes.creePar,
      createurPrenom: schema.employes.firstname,
      createdAt: schema.missionsUrgentes.createdAt,
    })
    .from(schema.missionsUrgentes)
    .leftJoin(
      schema.chantiers,
      eq(schema.missionsUrgentes.chantierId, schema.chantiers.id),
    )
    .innerJoin(
      schema.employes,
      eq(schema.missionsUrgentes.creePar, schema.employes.id),
    )
    .where(
      and(
        eq(schema.missionsUrgentes.statut, "ouverte"),
        gt(schema.missionsUrgentes.dateLimite, sql`now()`),
      ),
    )
    .orderBy(schema.missionsUrgentes.dateLimite);

  return NextResponse.json({ ok: true, missions: rows });
});
