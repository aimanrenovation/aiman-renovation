"use client";

import { useState, useEffect, useCallback } from "react";
import { Zap, X, Clock } from "lucide-react";

interface UrgentMission {
  id: string;
  titre: string;
  description: string;
  chantierNom: string | null;
  bonusDescription: string | null;
  bonusMontantCents: number | null;
  dateLimite: string;
}

export function UrgentMissionsBanner() {
  const [missions, setMissions] = useState<UrgentMission[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [accepting, setAccepting] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<{ id: string; titre: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    try {
      const res = await fetch("/api/employes/missions");
      if (res.ok) {
        const data = await res.json();
        setMissions(data.missions ?? []);
      }
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchMissions();
    const id = setInterval(fetchMissions, 15_000);
    return () => clearInterval(id);
  }, [fetchMissions]);

  async function handleAccept(missionId: string) {
    setAccepting(missionId);
    setError(null);
    try {
      const res = await fetch(`/api/employes/missions/${missionId}/accepter`, {
        method: "POST",
      });
      if (res.ok) {
        const mission = missions.find((m) => m.id === missionId);
        setAccepted({ id: missionId, titre: mission?.titre ?? "" });
        setMissions((prev) => prev.filter((m) => m.id !== missionId));
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.error === "mission_deja_prise_ou_expiree") {
          setError("Mission deja prise !");
          setMissions((prev) => prev.filter((m) => m.id !== missionId));
        } else {
          setError(data.error || "Erreur");
        }
      }
    } catch {
      setError("Erreur reseau");
    } finally {
      setAccepting(null);
    }
  }

  const visible = missions.filter((m) => !dismissed.has(m.id));

  if (visible.length === 0 && !accepted) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Success feedback */}
      {accepted && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 animate-in fade-in">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
            <Zap className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-green-800">Mission acceptee !</div>
            <div className="text-xs text-green-600">{accepted.titre}</div>
          </div>
          <button
            onClick={() => setAccepted(null)}
            className="text-green-400 hover:text-green-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Error feedback */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-semibold underline">
            OK
          </button>
        </div>
      )}

      {/* Mission cards */}
      {visible.map((m) => {
        const isAccepting = accepting === m.id;
        const deadline = new Date(m.dateLimite);
        const now = new Date();
        const hoursLeft = Math.max(0, Math.round((deadline.getTime() - now.getTime()) / 3_600_000));

        return (
          <div
            key={m.id}
            className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-sm"
          >
            <button
              onClick={() => setDismissed((prev) => new Set([...prev, m.id]))}
              className="absolute right-3 top-3 text-amber-400 hover:text-amber-600"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Mission urgente
                </div>
                <div className="mt-0.5 text-sm font-semibold text-neutral-900">{m.titre}</div>
                <div className="mt-1 text-xs text-neutral-600 line-clamp-2">{m.description}</div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  {m.chantierNom && (
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5">{m.chantierNom}</span>
                  )}
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {hoursLeft}h restantes
                  </span>
                  {m.bonusMontantCents && (
                    <span className="font-semibold text-green-600">
                      +{(m.bonusMontantCents / 100).toFixed(0)}EUR
                    </span>
                  )}
                  {m.bonusDescription && !m.bonusMontantCents && (
                    <span className="font-medium text-green-600">{m.bonusDescription}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAccept(m.id)}
              disabled={isAccepting}
              className="mt-3 w-full rounded-xl bg-[#E50000] py-2.5 text-sm font-bold text-white shadow-sm transition-transform active:scale-[0.97] disabled:opacity-50"
            >
              {isAccepting ? "Envoi..." : "J'accepte cette mission !"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
