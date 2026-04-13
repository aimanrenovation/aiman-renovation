import Link from "next/link";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { requireActiveEmploye } from "@/lib/employes/guards";
import { WebAuthnRegisterPrompt } from "@/components/employes/webauthn-register-prompt";
import { UrgentMissionsBanner } from "@/components/employes/urgent-missions-banner";

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
      statut: schema.plannings.statut,
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
      <WebAuthnRegisterPrompt />
      <UrgentMissionsBanner />
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
          className="flex items-center justify-between rounded-2xl bg-[#E50000] px-5 py-4 text-white shadow-sm transition-transform active:scale-[0.97]"
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
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
            {/* Empty calendar icon */}
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
            <div>
              <p className="text-sm font-semibold text-neutral-700">
                Pas de mission aujourd&apos;hui
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Profitez bien de votre journée !
              </p>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {missions.map((m) => {
              const badgeMap: Record<string, { label: string; cls: string }> = {
                prevu: { label: "Prévu", cls: "bg-blue-100 text-blue-700" },
                confirme: { label: "Confirmé", cls: "bg-green-100 text-green-700" },
                fait: { label: "Fait", cls: "bg-neutral-200 text-neutral-600" },
                annule: { label: "Annulé", cls: "bg-red-100 text-red-700" },
              };
              const badge = badgeMap[m.statut] ?? badgeMap.prevu;

              return (
                <li key={m.id}>
                  <Link
                    href={`/espace-employes/mission/${m.chantierId}`}
                    className="block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all active:scale-[0.97] active:bg-neutral-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-base font-semibold">{m.chantierNom}</span>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="truncate text-xs text-neutral-500">
                          {m.chantierVille ?? m.chantierAdresse}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs font-medium text-neutral-600">
                          {m.heureDebut?.slice(0, 5) ?? "--"}
                          {m.heureFin ? ` → ${m.heureFin.slice(0, 5)}` : ""}
                        </div>
                        <span className="text-neutral-400">&rsaquo;</span>
                      </div>
                    </div>
                    {m.mission && (
                      <div className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
                        {m.mission}
                      </div>
                    )}
                    <div className="mt-2 text-xs font-medium text-[#E50000]">
                      Voir la fiche mission &rarr;
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {!openPointage && missions.length > 0 && (
        <Link
          href="/espace-employes/pointage"
          className="flex h-14 items-center justify-center rounded-2xl bg-[#E50000] text-base font-semibold text-white shadow-sm transition-transform active:scale-[0.97]"
        >
          Démarrer ma journée
        </Link>
      )}
    </div>
  );
}
