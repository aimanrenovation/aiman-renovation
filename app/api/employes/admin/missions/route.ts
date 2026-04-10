import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { requireAuth } from "@/lib/auth/middleware";
import { dispatchJarvisEvent } from "@/lib/jarvis/webhook";

/**
 * GET /api/employes/admin/missions
 * Toutes les missions (tous statuts). Patron uniquement.
 */
export const GET = requireAuth(async () => {
  const createur = schema.employes;

  // Alias for the accepte_par join — use a raw sub-select to avoid Drizzle alias complexity
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
      statut: schema.missionsUrgentes.statut,
      acceptePar: schema.missionsUrgentes.acceptePar,
      accepteLe: schema.missionsUrgentes.accepteLe,
      creePar: schema.missionsUrgentes.creePar,
      createurPrenom: createur.firstname,
      createurNom: createur.lastname,
      createdAt: schema.missionsUrgentes.createdAt,
    })
    .from(schema.missionsUrgentes)
    .leftJoin(
      schema.chantiers,
      eq(schema.missionsUrgentes.chantierId, schema.chantiers.id),
    )
    .innerJoin(createur, eq(schema.missionsUrgentes.creePar, createur.id))
    .orderBy(schema.missionsUrgentes.createdAt);

  // Enrich with accepte_par employee name if present
  const accepteParIds = [
    ...new Set(rows.filter((r) => r.acceptePar).map((r) => r.acceptePar!)),
  ];

  let accepteParMap: Record<string, string> = {};
  if (accepteParIds.length > 0) {
    const accepteRows = await db
      .select({
        id: schema.employes.id,
        firstname: schema.employes.firstname,
        lastname: schema.employes.lastname,
      })
      .from(schema.employes)
      .where(
        sql`${schema.employes.id} IN ${accepteParIds}`,
      );
    accepteParMap = Object.fromEntries(
      accepteRows.map((e) => [e.id, `${e.firstname} ${e.lastname}`]),
    );
  }

  const missions = rows.map((r) => ({
    ...r,
    accepteParNom: r.acceptePar ? (accepteParMap[r.acceptePar] ?? null) : null,
  }));

  return NextResponse.json({ ok: true, missions });
}, ["patron"]);

/**
 * POST /api/employes/admin/missions
 * Créer une mission urgente. Patron uniquement.
 */
export const POST = requireAuth(async (request, _ctx, session) => {
  let body: {
    titre?: string;
    description?: string;
    chantier_id?: string;
    bonus_description?: string;
    bonus_montant_cents?: number;
    date_limite?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!body.titre || !body.description || !body.date_limite) {
    return NextResponse.json(
      { error: "missing_fields", required: ["titre", "description", "date_limite"] },
      { status: 400 },
    );
  }

  const dateLimite = new Date(body.date_limite);
  if (isNaN(dateLimite.getTime())) {
    return NextResponse.json({ error: "invalid_date_limite" }, { status: 400 });
  }
  if (dateLimite <= new Date()) {
    return NextResponse.json(
      { error: "date_limite_must_be_future" },
      { status: 400 },
    );
  }

  const [mission] = await db
    .insert(schema.missionsUrgentes)
    .values({
      titre: body.titre,
      description: body.description,
      chantierId: body.chantier_id ?? null,
      bonusDescription: body.bonus_description ?? null,
      bonusMontantCents: body.bonus_montant_cents ?? null,
      dateLimite,
      creePar: session.sub,
    })
    .returning();

  dispatchJarvisEvent({
    type: "mission_urgente_creee" as never,
    employe_id: session.sub,
    chantier_id: body.chantier_id ?? "",
    timestamp: new Date().toISOString(),
    data: {
      missionId: mission.id,
      titre: mission.titre,
      dateLimite: mission.dateLimite.toISOString(),
      bonusMontantCents: mission.bonusMontantCents,
    },
  });

  return NextResponse.json({ ok: true, mission }, { status: 201 });
}, ["patron"]);
