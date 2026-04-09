import { and, desc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { employe } = await requireActiveEmploye();

  // Chantiers avec plannings des 60 derniers jours
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 60);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const rows = await db
    .selectDistinctOn([schema.plannings.chantierId], {
      chantierId: schema.plannings.chantierId,
      chantierNom: schema.chantiers.nom,
      chantierVille: schema.chantiers.ville,
      lastDate: schema.plannings.date,
    })
    .from(schema.plannings)
    .innerJoin(schema.chantiers, eq(schema.plannings.chantierId, schema.chantiers.id))
    .where(
      and(
        eq(schema.plannings.employeId, employe.id),
        gte(schema.plannings.date, cutoffStr)
      )
    )
    .orderBy(schema.plannings.chantierId, desc(schema.plannings.date));

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Messages</h1>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
          Aucun chantier actif pour le moment.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.chantierId}>
              <Link
                href={`/espace-employes/messages/${r.chantierId}`}
                className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors active:bg-neutral-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                  <MessageCircle className="h-5 w-5 text-neutral-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{r.chantierNom}</div>
                  {r.chantierVille && (
                    <div className="truncate text-xs text-neutral-500">{r.chantierVille}</div>
                  )}
                </div>
                <svg className="h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
