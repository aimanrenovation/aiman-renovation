import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { RapportForm } from "@/components/employes/rapport-form";

export const dynamic = "force-dynamic";

export default async function RapportPage() {
  const { employe } = await requireActiveEmploye();
  const today = new Date().toISOString().slice(0, 10);

  const missions = await db
    .select({
      chantierId: schema.chantiers.id,
      chantierNom: schema.chantiers.nom,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(and(eq(schema.plannings.employeId, employe.id), eq(schema.plannings.date, today)))
    .orderBy(asc(schema.plannings.heureDebut));

  const uniqueChantiers = Array.from(
    new Map(missions.map((m) => [m.chantierId, m])).values()
  );

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Rapport du jour</h1>
      {uniqueChantiers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          Aucun chantier affecté aujourd&apos;hui.
        </div>
      ) : (
        <RapportForm chantiers={uniqueChantiers} />
      )}
    </div>
  );
}
