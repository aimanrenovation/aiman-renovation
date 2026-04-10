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
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl border border-neutral-200 bg-white" />
        ))}
      </div>
    );
  }

  const items = [
    { label: "Acquis", value: solde.joursAcquis, color: "text-neutral-900" },
    { label: "Pris", value: solde.joursPris, color: "text-orange-600" },
    {
      label: "Restants",
      value: solde.joursRestants,
      color: solde.joursRestants > 5 ? "text-green-600" : solde.joursRestants > 0 ? "text-yellow-600" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-sm">
          <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
          <div className="mt-0.5 text-xs text-neutral-500">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
