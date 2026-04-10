"use client";

import { useState, useEffect } from "react";

const TYPE_LABELS: Record<string, string> = {
  conge_paye: "Congé payé",
  maladie: "Maladie",
  accident_travail: "Accident du travail",
  sans_solde: "Sans solde",
  formation: "Formation",
  evenement_familial: "Événement familial",
  autre: "Autre",
};

const STATUT_STYLES: Record<string, string> = {
  en_attente: "bg-yellow-100 text-yellow-800",
  accepte: "bg-green-100 text-green-800",
  refuse: "bg-red-100 text-red-800",
};

const STATUT_LABELS: Record<string, string> = {
  en_attente: "En attente",
  accepte: "Accepté",
  refuse: "Refusé",
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
      {absences.map((a) => (
        <div key={a.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-neutral-900">
                {TYPE_LABELS[a.type] || a.type}
              </div>
              <div className="mt-0.5 text-xs text-neutral-500">
                {a.dateDebut} → {a.dateFin} · {a.nbJours} jour{a.nbJours > 1 ? "s" : ""}
              </div>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUT_STYLES[a.statut] || "bg-neutral-100 text-neutral-600"}`}>
              {STATUT_LABELS[a.statut] || a.statut}
            </span>
          </div>
          {a.statut === "refuse" && a.reponsePatron && (
            <div className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
              Motif : {a.reponsePatron}
            </div>
          )}
          {a.raison && (
            <div className="mt-2 text-xs text-neutral-500">
              {a.raison}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
