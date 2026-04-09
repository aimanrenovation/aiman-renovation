import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";

export const dynamic = "force-dynamic";

export default async function GaleriePage() {
  const { employe } = await requireActiveEmploye();

  // Get all chantiers where this employe has plannings or pointages
  const chantiersFromPlannings = db
    .select({ chantierId: schema.plannings.chantierId })
    .from(schema.plannings)
    .where(eq(schema.plannings.employeId, employe.id));

  const chantiersFromPointages = db
    .select({ chantierId: schema.pointages.chantierId })
    .from(schema.pointages)
    .where(eq(schema.pointages.employeId, employe.id));

  // Combine unique chantier IDs and get their info + photo count
  const chantiersList = await db
    .select({
      id: schema.chantiers.id,
      nom: schema.chantiers.nom,
      adresse: schema.chantiers.adresse,
      ville: schema.chantiers.ville,
      photoCount: sql<number>`(
        SELECT count(*)::int FROM photos_chantier
        WHERE chantier_id = ${schema.chantiers.id}
      )`,
      lastPhotoAt: sql<string | null>`(
        SELECT max(prise_le)::text FROM photos_chantier
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
    .orderBy(sql`COALESCE((
      SELECT max(prise_le) FROM photos_chantier
      WHERE chantier_id = ${schema.chantiers.id}
    ), '1970-01-01'::timestamptz) DESC`);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Galerie photos</h1>

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
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-neutral-700">Aucun chantier</p>
            <p className="mt-1 text-xs text-neutral-500">
              Vos chantiers avec photos apparaitront ici.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {chantiersList.map((c) => (
            <li key={c.id}>
              <Link
                href={`/espace-employes/galerie/${c.id}`}
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
                    {c.photoCount} photo{c.photoCount !== 1 ? "s" : ""}
                  </span>
                  {c.lastPhotoAt && (
                    <span className="mt-1 text-[10px] text-neutral-400">
                      {new Date(c.lastPhotoAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
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
