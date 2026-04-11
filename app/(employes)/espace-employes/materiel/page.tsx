import Link from "next/link";
import { sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";

export const dynamic = "force-dynamic";

export default async function MaterielPage() {
  const { employe } = await requireActiveEmploye();

  const chantiersList = await db
    .select({
      id: schema.chantiers.id,
      nom: schema.chantiers.nom,
      adresse: schema.chantiers.adresse,
      ville: schema.chantiers.ville,
      statut: schema.chantiers.statut,
      materiauCount: sql<number>`(
        SELECT count(*)::int FROM suivi_materiel
        WHERE chantier_id = ${schema.chantiers.id}
      )`,
    })
    .from(schema.chantiers)
    .where(
      sql`${schema.chantiers.id} IN (
        SELECT chantier_id FROM plannings WHERE employe_id = ${employe.id}
        UNION
        SELECT chantier_id FROM pointages WHERE employe_id = ${employe.id}
      )`
    )
    .orderBy(schema.chantiers.nom);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Suivi materiel</h1>

      {chantiersList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-neutral-700">Aucun chantier</p>
            <p className="mt-1 text-xs text-neutral-500">
              Vos chantiers apparaitront ici.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {chantiersList.map((c) => (
            <li key={c.id}>
              <Link
                href={`/espace-employes/materiel/${c.id}`}
                className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors active:bg-neutral-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold truncate">{c.nom}</div>
                  <div className="text-xs text-neutral-500 truncate">
                    {c.adresse}{c.ville ? `, ${c.ville}` : ""}
                  </div>
                </div>
                <div className="ml-3 flex flex-col items-end">
                  <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                    {c.materiauCount} materiau{c.materiauCount !== 1 ? "x" : ""}
                  </span>
                  {c.statut && (
                    <span className="mt-1 text-[10px] text-neutral-400">
                      {c.statut}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
