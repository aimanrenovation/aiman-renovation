"use client";

import { useState, useEffect } from "react";

interface Solde {
  joursAcquis: number;
  joursPris: number;
  joursRestants: number;
}

export function AbsenceSolde() {
  const [solde, setSolde] = useState<Solde | null>(null);

  useEffect(() => {
    fetch("/api/employes/absences/solde")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setSolde(d.solde))
      .catch(() => {});
  }, []);

  if (!solde) {
    return (
      <div className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-white" />
    );
  }

  const total = solde.joursAcquis;
  const restants = solde.joursRestants;
  const pct = total > 0 ? Math.round((restants / total) * 100) : 0;

  const barColor =
    restants > 10
      ? "bg-green-500"
      : restants > 5
        ? "bg-amber-500"
        : "bg-red-500";

  const textColor =
    restants > 10
      ? "text-green-600"
      : restants > 5
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Big number display */}
      <div className="text-center">
        <div className={`text-4xl font-bold ${textColor}`}>
          {restants}
          <span className="text-lg font-medium text-neutral-400">/{total}</span>
        </div>
        <div className="mt-1 text-sm text-neutral-500">jours restants</div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-neutral-400">
          <span>{solde.joursPris} pris</span>
          <span>{pct}%</span>
        </div>
      </div>
    </div>
  );
}
