import { and, eq, gt, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { MissionsList } from "@/components/employes/mission-list";

export const dynamic = "force-dynamic";

export default async function MissionsPage() {
  const { employe } = await requireActiveEmploye();

  const accepteur = alias(schema.employes, "accepteur");
  const createur = alias(schema.employes, "createur");

  const rows = await db
    .select({
      id: schema.missionsUrgentes.id,
      titre: schema.missionsUrgentes.titre,
      description: schema.missionsUrgentes.description,
      chantierNom: schema.chantiers.nom,
      chantierVille: schema.chantiers.ville,
      bonusDescription: schema.missionsUrgentes.bonusDescription,
      bonusMontantCents: schema.missionsUrgentes.bonusMontantCents,
      dateLimite: schema.missionsUrgentes.dateLimite,
      statut: schema.missionsUrgentes.statut,
      acceptePar: schema.missionsUrgentes.acceptePar,
      accepteParNom: sql<string | null>`concat(${accepteur.firstname}, ' ', ${accepteur.lastname})`,
      creePar: schema.missionsUrgentes.creePar,
      creeParNom: sql<string>`concat(${createur.firstname}, ' ', ${createur.lastname})`,
    })
    .from(schema.missionsUrgentes)
    .leftJoin(
      schema.chantiers,
      eq(schema.missionsUrgentes.chantierId, schema.chantiers.id),
    )
    .leftJoin(
      accepteur,
      eq(schema.missionsUrgentes.acceptePar, accepteur.id),
    )
    .innerJoin(
      createur,
      eq(schema.missionsUrgentes.creePar, createur.id),
    )
    .where(
      gt(schema.missionsUrgentes.dateLimite, sql`now() - interval '24 hours'`),
    )
    .orderBy(desc(schema.missionsUrgentes.createdAt));

  const missions = rows.map((r) => ({
    id: r.id,
    titre: r.titre,
    description: r.description,
    chantierNom: r.chantierNom ?? undefined,
    chantierVille: r.chantierVille ?? undefined,
    bonusDescription: r.bonusDescription ?? undefined,
    bonusMontantCents: r.bonusMontantCents ?? undefined,
    dateLimite: r.dateLimite.toISOString(),
    statut: r.statut,
    acceptePar: r.acceptePar ?? undefined,
    accepteParNom: r.accepteParNom ?? undefined,
    creePar: r.creePar,
    creeParNom: r.creeParNom,
  }));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Missions urgentes</h1>
      <MissionsList missions={missions} currentEmployeId={employe.id} />
    </div>
  );
}
