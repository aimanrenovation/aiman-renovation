"use client";

import { useState, useEffect } from "react";

const TYPE_LABELS: Record<string, string> = {
  conge_paye: "Conge paye",
  maladie: "Maladie",
  accident_travail: "Accident du travail",
  sans_solde: "Sans solde",
  formation: "Formation",
  evenement_familial: "Evenement familial",
  autre: "Autre",
};

const STATUT_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  en_attente: { bg: "bg-amber-100", text: "text-amber-800", label: "En attente" },
  accepte: { bg: "bg-green-100", text: "text-green-800", label: "Approuve" },
  refuse: { bg: "bg-red-100", text: "text-red-800", label: "Refuse" },
};

interface Absence {
  id: string;
  dateDebut: string;
  dateFin: string;
  type: string;
  raison: string | null;
  statut: string;
  nbJours: number;
  reponsePatron: string | null;
  createdAt: string;
}

function formatDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function AbsenceList({ refreshKey }: { refreshKey: number }) {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/employes/absences")
      .then((r) => (r.ok ? r.json() : { absences: [] }))
      .then((d) => setAbsences(d.absences ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl border border-neutral-200 bg-white" />
        ))}
      </div>
    );
  }

  if (absences.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500">
        Aucune demande d&apos;absence
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {absences.map((a) => {
        const config = STATUT_CONFIG[a.statut] ?? {
          bg: "bg-neutral-100",
          text: "text-neutral-600",
          label: a.statut,
        };

        const isRefused = a.statut === "refuse";

        return (
          <div
            key={a.id}
            className={`rounded-xl border bg-white p-4 shadow-sm ${
              isRefused ? "border-red-200 opacity-75" : "border-neutral-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {/* Type badge */}
                <div className="text-sm font-medium text-neutral-900">
                  {TYPE_LABELS[a.type] || a.type}
                </div>

                {/* Dates */}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="font-medium">{formatDate(a.dateDebut)}</span>
                  <span>&rarr;</span>
                  <span className="font-medium">{formatDate(a.dateFin)}</span>
                  <span className="text-neutral-300">|</span>
                  <span>
                    {a.nbJours} jour{a.nbJours > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
              >
                {config.label}
              </span>
            </div>

            {/* Motif */}
            {a.raison && (
              <div className="mt-2 text-xs text-neutral-500">
                {a.raison}
              </div>
            )}

            {/* Refusal reason */}
            {isRefused && a.reponsePatron && (
              <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                Motif du refus : {a.reponsePatron}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
