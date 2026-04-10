"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  ManagerPointageRow,
  type PointageData,
} from "./manager-pointage-row";

interface ManagerPointageTableProps {
  pointages: PointageData[];
  onValidate: (id: string) => Promise<void>;
  onCorrect: (
    id: string,
    data: {
      heureDebut: string;
      heureFin: string;
      pauseMinutes: number;
      notes: string;
    }
  ) => Promise<void>;
  onValidateAll: () => Promise<void>;
}

export function ManagerPointageTable({
  pointages,
  onValidate,
  onCorrect,
  onValidateAll,
}: ManagerPointageTableProps) {
  const [validatingAll, setValidatingAll] = useState(false);
  const brutCount = pointages.filter((p) => p.statut === "brut").length;

  async function handleValidateAll() {
    setValidatingAll(true);
    try {
      await onValidateAll();
    } finally {
      setValidatingAll(false);
    }
  }

  if (pointages.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-neutral-500">
          Aucun pointage pour cette semaine.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Batch action bar */}
      {brutCount > 0 && (
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <span className="text-sm text-neutral-600">
            <span className="font-semibold text-orange-700">{brutCount}</span>{" "}
            pointage{brutCount > 1 ? "s" : ""} en attente de validation
          </span>
          <button
            type="button"
            onClick={handleValidateAll}
            disabled={validatingAll}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {validatingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Valider tout
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Employé</th>
              <th className="px-3 py-3">Chantier</th>
              <th className="px-3 py-3">Début</th>
              <th className="px-3 py-3">Fin</th>
              <th className="px-3 py-3 text-center">Pause</th>
              <th className="px-3 py-3">Durée</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pointages.map((p) => (
              <ManagerPointageRow
                key={p.id}
                pointage={p}
                onValidate={onValidate}
                onCorrect={onCorrect}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
