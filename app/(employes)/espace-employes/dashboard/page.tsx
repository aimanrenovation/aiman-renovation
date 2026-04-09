import Link from "next/link";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { employe } = await requireActiveEmploye();
  const today = new Date().toISOString().slice(0, 10);

  const missions = await db
    .select({
      id: schema.plannings.id,
      heureDebut: schema.plannings.heureDebut,
      heureFin: schema.plannings.heureFin,
      mission: schema.plannings.mission,
      chantierId: schema.chantiers.id,
      chantierNom: schema.chantiers.nom,
      chantierAdresse: schema.chantiers.adresse,
      chantierVille: schema.chantiers.ville,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(
      and(eq(schema.plannings.employeId, employe.id), eq(schema.plannings.date, today))
    )
    .orderBy(asc(schema.plannings.heureDebut));

  const [openPointage] = await db
    .select()
    .from(schema.pointages)
    .where(and(eq(schema.pointages.employeId, employe.id), isNull(schema.pointages.heureFin)))
    .limit(1);

  return (
    <div className="flex flex-col gap-5">
      <section>
        <h1 className="text-xl font-bold">Bonjour {employe.firstname} 👋</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </section>

      {openPointage && (
        <Link
          href="/espace-employes/pointage"
          className="flex items-center justify-between rounded-2xl bg-[#E50000] px-5 py-4 text-white shadow-sm"
        >
          <div>
            <div className="text-xs font-medium uppercase tracking-wide opacity-80">
              Pointage en cours
            </div>
            <div className="text-base font-semibold">Tap pour gérer</div>
          </div>
          <span className="text-2xl">→</span>
        </Link>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Mes missions du jour
        </h2>
        {missions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            Aucune mission planifiée aujourd&apos;hui.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {missions.map((m) => (
              <li
                key={m.id}
                className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{m.chantierNom}</div>
                    <div className="text-xs text-neutral-500">
                      {m.chantierAdresse}
                      {m.chantierVille ? `, ${m.chantierVille}` : ""}
                    </div>
                  </div>
                  <div className="text-right text-xs font-medium text-neutral-600">
                    {m.heureDebut?.slice(0, 5) ?? "--"}
                    <br />
                    {m.heureFin?.slice(0, 5) ?? ""}
                  </div>
                </div>
                {m.mission && (
                  <div className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                    {m.mission}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {!openPointage && missions.length > 0 && (
        <Link
          href="/espace-employes/pointage"
          className="flex h-14 items-center justify-center rounded-2xl bg-[#E50000] text-base font-semibold text-white shadow-sm"
        >
          Démarrer ma journée
        </Link>
      )}
    </div>
  );
}
