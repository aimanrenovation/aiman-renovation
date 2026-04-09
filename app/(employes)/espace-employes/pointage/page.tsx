import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { PointageClient } from "@/components/employes/pointage-client";

export const dynamic = "force-dynamic";

export default async function PointagePage() {
  const { employe } = await requireActiveEmploye();
  const today = new Date().toISOString().slice(0, 10);

  const [openPointage] = await db
    .select({
      id: schema.pointages.id,
      heureDebut: schema.pointages.heureDebut,
      onSiteDebut: schema.pointages.onSiteDebut,
      noGeoDebut: schema.pointages.noGeoDebut,
      distanceDebutM: schema.pointages.distanceDebutM,
      chantierId: schema.pointages.chantierId,
      chantierNom: schema.chantiers.nom,
    })
    .from(schema.pointages)
    .innerJoin(schema.chantiers, eq(schema.pointages.chantierId, schema.chantiers.id))
    .where(and(eq(schema.pointages.employeId, employe.id), isNull(schema.pointages.heureFin)))
    .limit(1);

  const missions = await db
    .select({
      chantierId: schema.chantiers.id,
      chantierNom: schema.chantiers.nom,
      chantierAdresse: schema.chantiers.adresse,
      radiusM: schema.chantiers.radiusM,
      mission: schema.plannings.mission,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(and(eq(schema.plannings.employeId, employe.id), eq(schema.plannings.date, today)))
    .orderBy(asc(schema.plannings.heureDebut));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Pointage</h1>
      <PointageClient
        openPointage={
          openPointage
            ? {
                id: openPointage.id,
                heureDebutIso: openPointage.heureDebut.toISOString(),
                chantierNom: openPointage.chantierNom,
                onSiteDebut: openPointage.onSiteDebut,
                noGeoDebut: openPointage.noGeoDebut,
                distanceDebutM: openPointage.distanceDebutM,
              }
            : null
        }
        missions={missions}
      />
    </div>
  );
}
