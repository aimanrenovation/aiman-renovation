import { and, asc, eq, gte, lte } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

function monthRange(month: string) {
  const [yearStr, mStr] = month.split("-");
  const year = Number.parseInt(yearStr, 10);
  const m = Number.parseInt(mStr, 10);
  const last = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return { from: `${yearStr}-${mStr}-01`, to: `${yearStr}-${mStr}-${String(last).padStart(2, "0")}` };
}

export default async function PlanningPage({ searchParams }: PageProps) {
  const { employe } = await requireActiveEmploye();
  const { month: monthParam } = await searchParams;
  const month = monthParam ?? new Date().toISOString().slice(0, 7);
  const range = monthRange(month);

  const rows = await db
    .select({
      id: schema.plannings.id,
      date: schema.plannings.date,
      heureDebut: schema.plannings.heureDebut,
      heureFin: schema.plannings.heureFin,
      mission: schema.plannings.mission,
      statut: schema.plannings.statut,
      chantierNom: schema.chantiers.nom,
      chantierVille: schema.chantiers.ville,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(
      and(
        eq(schema.plannings.employeId, employe.id),
        gte(schema.plannings.date, range.from),
        lte(schema.plannings.date, range.to)
      )
    )
    .orderBy(asc(schema.plannings.date));

  const grouped = new Map<string, typeof rows>();
  for (const r of rows) {
    const list = grouped.get(r.date) ?? [];
    list.push(r);
    grouped.set(r.date, list);
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Planning — {month}</h1>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          Aucune mission ce mois-ci.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {Array.from(grouped.entries()).map(([date, list]) => (
            <li key={date} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase text-neutral-500">
                {new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              {list.map((m) => (
                <div key={m.id} className="border-t border-neutral-100 py-2 first:border-0 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{m.chantierNom}</div>
                      {m.chantierVille && (
                        <div className="text-xs text-neutral-500">{m.chantierVille}</div>
                      )}
                      {m.mission && <div className="mt-1 text-xs text-neutral-600">{m.mission}</div>}
                    </div>
                    <div className="text-right text-xs font-medium text-neutral-600">
                      {m.heureDebut?.slice(0, 5) ?? "--"}
                      <br />
                      {m.heureFin?.slice(0, 5) ?? ""}
                    </div>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
