import { and, desc, eq, gte } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";

export const dynamic = "force-dynamic";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function minutes(pointage: { heureDebut: Date; heureFin: Date | null; pauseMinutes: number }) {
  if (!pointage.heureFin) return null;
  const diff = pointage.heureFin.getTime() - pointage.heureDebut.getTime();
  return Math.max(0, Math.round(diff / 60000) - (pointage.pauseMinutes ?? 0));
}

export default async function HistoriquePage() {
  const { employe } = await requireActiveEmploye();
  const from = daysAgo(30);

  const pointages = await db
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
        gte(schema.pointages.date, from)
      )
    )
    .orderBy(desc(schema.pointages.heureDebut));

  const totalMinutes = pointages.reduce((acc, p) => acc + (minutes(p) ?? 0), 0);
  const totalH = Math.floor(totalMinutes / 60);
  const totalM = totalMinutes % 60;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Historique (30 j)</h1>
      <div className="rounded-2xl bg-neutral-900 p-5 text-white">
        <div className="text-xs uppercase opacity-70">Total travaillé</div>
        <div className="mt-1 text-3xl font-bold">
          {totalH}h {String(totalM).padStart(2, "0")}
        </div>
      </div>

      {pointages.length === 0 ? (
        <p className="text-center text-sm text-neutral-500">Aucun pointage sur cette période.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pointages.map((p) => {
            const dur = minutes(p);
            return (
              <li
                key={p.id}
                className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-3"
              >
                <div>
                  <div className="text-sm font-medium">{p.chantierNom}</div>
                  <div className="text-xs text-neutral-500">
                    {new Date(`${p.date}T00:00:00`).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    · {p.heureDebut.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    {p.heureFin && (
                      <>
                        {" → "}
                        {p.heureFin.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </>
                    )}
                  </div>
                  {p.noGeoDebut && (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      sans géoloc
                    </span>
                  )}
                  {p.onSiteDebut === false && (
                    <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                      hors zone
                    </span>
                  )}
                </div>
                <div className="text-right text-sm font-semibold">
                  {dur != null ? `${Math.floor(dur / 60)}h${String(dur % 60).padStart(2, "0")}` : "…"}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
