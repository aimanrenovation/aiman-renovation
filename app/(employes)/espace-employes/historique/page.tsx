import { and, asc, desc, eq, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { HistoriqueClient } from "./historique-client";

export const dynamic = "force-dynamic";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default async function HistoriquePage() {
  const { employe } = await requireActiveEmploye();
  const from30 = daysAgo(30);
  const from7 = daysAgo(7);

  const [pointages, planningsRows] = await Promise.all([
    db
      .select({
        id: schema.pointages.id,
        date: schema.pointages.date,
        heureDebut: schema.pointages.heureDebut,
        heureFin: schema.pointages.heureFin,
        pauseMinutes: schema.pointages.pauseMinutes,
        onSiteDebut: schema.pointages.onSiteDebut,
        noGeoDebut: schema.pointages.noGeoDebut,
        chantierNom: schema.chantiers.nom,
      })
      .from(schema.pointages)
      .innerJoin(schema.chantiers, eq(schema.pointages.chantierId, schema.chantiers.id))
      .where(
        and(
          eq(schema.pointages.employeId, employe.id),
          gte(schema.pointages.date, from30)
        )
      )
      .orderBy(desc(schema.pointages.heureDebut)),
    db
      .select({
        id: schema.plannings.id,
        date: schema.plannings.date,
        heureDebut: schema.plannings.heureDebut,
        heureFin: schema.plannings.heureFin,
        mission: schema.plannings.mission,
        statut: schema.plannings.statut,
        chantierNom: schema.chantiers.nom,
      })
      .from(schema.plannings)
      .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
      .where(
        and(
          eq(schema.plannings.employeId, employe.id),
          gte(schema.plannings.date, from7)
        )
      )
      .orderBy(asc(schema.plannings.date), asc(schema.plannings.heureDebut)),
  ]);

  const pointagesData = pointages.map((p) => ({
    id: p.id,
    date: p.date,
    heureDebut: p.heureDebut.toISOString(),
    heureFin: p.heureFin?.toISOString() ?? null,
    pauseMinutes: p.pauseMinutes,
    onSiteDebut: p.onSiteDebut,
    noGeoDebut: p.noGeoDebut,
    chantierNom: p.chantierNom,
  }));

  const planningsData = planningsRows.map((p) => ({
    id: p.id,
    date: p.date,
    heureDebut: p.heureDebut,
    heureFin: p.heureFin,
    mission: p.mission,
    statut: p.statut,
    chantierNom: p.chantierNom,
  }));

  return <HistoriqueClient pointages={pointagesData} plannings={planningsData} />;
}
