"use client";

import { useState } from "react";

interface PointageItem {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string | null;
  pauseMinutes: number;
  onSiteDebut: boolean | null;
  noGeoDebut: boolean;
  chantierNom: string;
}

interface PlanningItem {
  id: string;
  date: string;
  heureDebut: string | null;
  heureFin: string | null;
  mission: string | null;
  statut: string;
  chantierNom: string;
}

interface Props {
  pointages: PointageItem[];
  plannings: PlanningItem[];
}

function minutes(p: PointageItem): number | null {
  if (!p.heureFin) return null;
  const diff = new Date(p.heureFin).getTime() - new Date(p.heureDebut).getTime();
  return Math.max(0, Math.round(diff / 60000) - (p.pauseMinutes ?? 0));
}

const statutLabels: Record<string, { label: string; className: string }> = {
  prevu: { label: "Prevu", className: "bg-blue-100 text-blue-800" },
  confirme: { label: "Confirme", className: "bg-green-100 text-green-800" },
  fait: { label: "Fait", className: "bg-neutral-100 text-neutral-700" },
  annule: { label: "Annule", className: "bg-red-100 text-red-700" },
};

export function HistoriqueClient({ pointages, plannings }: Props) {
  const [tab, setTab] = useState<"pointages" | "planning">("pointages");

  const totalMinutes = pointages.reduce((acc, p) => acc + (minutes(p) ?? 0), 0);
  const totalH = Math.floor(totalMinutes / 60);
  const totalM = totalMinutes % 60;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Historique</h1>

      {/* Toggle */}
      <div className="flex rounded-xl bg-neutral-100 p-1">
        <button
          onClick={() => setTab("pointages")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "pointages"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Pointages
        </button>
        <button
          onClick={() => setTab("planning")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === "planning"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
        >
          Planning
        </button>
      </div>

      {tab === "pointages" && (
        <>
          <div className="rounded-2xl bg-neutral-900 p-5 text-white">
            <div className="text-xs uppercase opacity-70">Total travaille (30 j)</div>
            <div className="mt-1 text-3xl font-bold">
              {totalH}h {String(totalM).padStart(2, "0")}
            </div>
          </div>

          {pointages.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              Aucun pointage sur cette periode.
            </p>
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
                        &middot;{" "}
                        {new Date(p.heureDebut).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {p.heureFin && (
                          <>
                            {" \u2192 "}
                            {new Date(p.heureFin).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </>
                        )}
                      </div>
                      {p.noGeoDebut && (
                        <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                          sans geoloc
                        </span>
                      )}
                      {p.onSiteDebut === false && (
                        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          hors zone
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm font-semibold">
                      {dur != null
                        ? `${Math.floor(dur / 60)}h${String(dur % 60).padStart(2, "0")}`
                        : "\u2026"}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === "planning" && (
        <>
          <div className="rounded-2xl bg-neutral-900 p-5 text-white">
            <div className="text-xs uppercase opacity-70">Planning (7 j)</div>
            <div className="mt-1 text-3xl font-bold">
              {plannings.length} mission{plannings.length !== 1 ? "s" : ""}
            </div>
          </div>

          {plannings.length === 0 ? (
            <p className="text-center text-sm text-neutral-500">
              Aucun planning sur les 7 derniers jours.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {plannings.map((p) => {
                const s = statutLabels[p.statut] ?? {
                  label: p.statut,
                  className: "bg-neutral-100 text-neutral-700",
                };
                return (
                  <li
                    key={p.id}
                    className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{p.chantierNom}</div>
                      <div className="text-xs text-neutral-500">
                        {new Date(`${p.date}T00:00:00`).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                        {p.heureDebut && (
                          <>
                            {" "}
                            &middot; {p.heureDebut.slice(0, 5)}
                            {p.heureFin && <> &ndash; {p.heureFin.slice(0, 5)}</>}
                          </>
                        )}
                      </div>
                      {p.mission && (
                        <div className="mt-1 truncate text-xs text-neutral-600">{p.mission}</div>
                      )}
                    </div>
                    <span
                      className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.className}`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
