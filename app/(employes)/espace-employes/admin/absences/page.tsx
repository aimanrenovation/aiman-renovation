"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/employes/admin/stat-card";

// ---- Types ----

interface Demande {
  id: string;
  employeId: string;
  dateDebut: string;
  dateFin: string;
  type: string;
  raison: string | null;
  justificatifS3Key: string | null;
  statut: string;
  reponsePatron: string | null;
  reponduLe: string | null;
  createdAt: string;
  employeFirstname: string;
  employeLastname: string;
}

interface CalendrierEmploye {
  id: string;
  nom: string;
  absences: { dateDebut: string; dateFin: string; type: string; statut: string }[];
}

const TYPE_LABELS: Record<string, string> = {
  conge_paye: "Conge paye",
  maladie: "Maladie",
  accident_travail: "Accident du travail",
  sans_solde: "Sans solde",
  formation: "Formation",
  evenement_familial: "Evenement familial",
  autre: "Autre",
};

const STATUT_CFG: Record<string, { bg: string; text: string; label: string }> = {
  en_attente: { bg: "bg-amber-900/40", text: "text-amber-400", label: "En attente" },
  accepte: { bg: "bg-green-900/40", text: "text-green-400", label: "Approuve" },
  refuse: { bg: "bg-red-900/40", text: "text-red-400", label: "Refuse" },
};

function countBusinessDays(startStr: string, endStr: string): number {
  const start = new Date(startStr);
  const end = new Date(endStr);
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function formatDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

// ---- Component ----

export default function AdminAbsencesPage() {
  const [tab, setTab] = useState<"demandes" | "calendrier">("demandes");
  const [filter, setFilter] = useState<string>("en_attente");
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [calendrier, setCalendrier] = useState<CalendrierEmploye[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [reponse, setReponse] = useState("");

  // Fetch demandes
  useEffect(() => {
    if (tab !== "demandes") return;
    setLoading(true);
    const params = filter ? `?statut=${filter}` : "";
    fetch(`/api/employes/admin/absences${params}`)
      .then((r) => (r.ok ? r.json() : { demandes: [] }))
      .then((d) => setDemandes(d.demandes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab, filter]);

  // Fetch calendrier
  useEffect(() => {
    if (tab !== "calendrier") return;
    setLoading(true);
    fetch("/api/employes/admin/absences/calendrier")
      .then((r) => (r.ok ? r.json() : { employes: [] }))
      .then((d) => setCalendrier(d.employes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  // Stats
  const stats = useMemo(() => {
    const pending = demandes.filter((d) => d.statut === "en_attente").length;
    const accepted = demandes.filter((d) => d.statut === "accepte").length;
    const refused = demandes.filter((d) => d.statut === "refuse").length;
    return { pending, accepted, refused };
  }, [demandes]);

  async function handleRespond(id: string, statut: "accepte" | "refuse") {
    setRespondingId(id);
    try {
      const res = await fetch(`/api/employes/admin/absences/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut, reponse: reponse || undefined }),
      });
      if (res.ok) {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
        setReponse("");
      }
    } catch {
      // silently fail
    } finally {
      setRespondingId(null);
    }
  }

  async function exportCsv() {
    const params = new URLSearchParams();
    // Export all absences for the current year
    const year = new Date().getFullYear();
    params.set("debut", `${year}-01-01`);
    params.set("fin", `${year}-12-31`);

    const res = await fetch(`/api/employes/admin/absences?${params}`);
    if (!res.ok) return;
    const data = await res.json();
    const rows: Demande[] = data.demandes ?? [];

    const header = "Employe,Type,Date debut,Date fin,Jours,Statut,Raison refus";
    const lines = rows.map((r) => {
      const jours = countBusinessDays(r.dateDebut, r.dateFin);
      return [
        `${r.employeFirstname} ${r.employeLastname}`,
        TYPE_LABELS[r.type] || r.type,
        r.dateDebut,
        r.dateFin,
        jours,
        r.statut,
        (r.reponsePatron || "").replace(/[,\n]/g, " "),
      ].join(",");
    });
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `absences_${new Date().getFullYear()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des absences</h1>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 rounded-lg border border-gray-700 px-3 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Stats (only when showing demandes with no filter = all) */}
      {filter === "" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Clock className="h-5 w-5" />} label="En attente" value={stats.pending} />
          <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Approuvees" value={stats.accepted} />
          <StatCard icon={<XCircle className="h-5 w-5" />} label="Refusees" value={stats.refused} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-0.5">
          <button
            onClick={() => setTab("demandes")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "demandes" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Demandes
          </button>
          <button
            onClick={() => setTab("calendrier")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "calendrier" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Calendrier
          </button>
        </div>

        {tab === "demandes" && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-8 rounded-lg border border-gray-700 bg-gray-800 px-3 text-xs text-white focus:border-red-500 focus:outline-none"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="accepte">Approuvees</option>
            <option value="refuse">Refusees</option>
          </select>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-700 bg-gray-800/50" />
          ))}
        </div>
      ) : tab === "demandes" ? (
        <DemandesList
          demandes={demandes}
          respondingId={respondingId}
          reponse={reponse}
          onReponseChange={setReponse}
          onRespond={handleRespond}
        />
      ) : (
        <CalendrierView employes={calendrier} />
      )}
    </div>
  );
}

// ---- Demandes list ----

function DemandesList({
  demandes,
  respondingId,
  reponse,
  onReponseChange,
  onRespond,
}: {
  demandes: Demande[];
  respondingId: string | null;
  reponse: string;
  onReponseChange: (v: string) => void;
  onRespond: (id: string, statut: "accepte" | "refuse") => void;
}) {
  if (demandes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
        <CalendarDays className="mx-auto mb-2 h-8 w-8 text-gray-600" />
        Aucune demande d&apos;absence
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {demandes.map((d) => {
        const cfg = STATUT_CFG[d.statut] ?? STATUT_CFG.en_attente;
        const nbJours = countBusinessDays(d.dateDebut, d.dateFin);
        const isPending = d.statut === "en_attente";
        const isResponding = respondingId === d.id;

        return (
          <div
            key={d.id}
            className="rounded-xl border border-gray-700 bg-gray-800/50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">
                    {d.employeFirstname} {d.employeLastname}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {TYPE_LABELS[d.type] || d.type} &middot;{" "}
                  {formatDate(d.dateDebut)} &rarr; {formatDate(d.dateFin)} &middot;{" "}
                  {nbJours} jour{nbJours > 1 ? "s" : ""}
                </div>
                {d.raison && (
                  <div className="mt-1 text-xs text-gray-500">{d.raison}</div>
                )}
                {d.justificatifS3Key && (
                  <div className="mt-1 text-xs text-blue-400">Justificatif joint</div>
                )}
                {d.reponsePatron && (
                  <div className="mt-2 rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-400">
                    Reponse patron : {d.reponsePatron}
                  </div>
                )}
              </div>
            </div>

            {isPending && (
              <div className="mt-3 flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Raison (optionnel)..."
                  value={respondingId === d.id ? reponse : ""}
                  onFocus={() => onReponseChange("")}
                  onChange={(e) => onReponseChange(e.target.value)}
                  className="h-8 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 text-xs text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onRespond(d.id, "accepte")}
                    disabled={isResponding}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Accepter
                  </button>
                  <button
                    onClick={() => onRespond(d.id, "refuse")}
                    disabled={isResponding}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Refuser
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Calendrier view ----

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];

function getWeekDates(refDate: Date): string[] {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const dates: string[] = [];
  for (let i = 0; i < 14; i++) {
    dates.push(new Date(d).toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function isDateInRange(date: string, debut: string, fin: string): boolean {
  return date >= debut && date <= fin;
}

function CalendrierView({ employes }: { employes: CalendrierEmploye[] }) {
  const [refDate] = useState(new Date());
  const dates = useMemo(() => getWeekDates(refDate), [refDate]);

  if (employes.length === 0) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-8 text-center text-sm text-gray-500">
        <Users className="mx-auto mb-2 h-8 w-8 text-gray-600" />
        Aucune absence planifiee
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800/50">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="sticky left-0 z-10 bg-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Employe
            </th>
            {dates.map((d) => {
              const dt = new Date(d + "T12:00:00");
              const dayIdx = (dt.getDay() + 6) % 7;
              const isToday = d === new Date().toISOString().slice(0, 10);
              const isWeekend = dayIdx >= 5;
              return (
                <th
                  key={d}
                  className={`min-w-[50px] px-1 py-2 text-center text-[10px] font-medium ${
                    isToday
                      ? "bg-red-600/10 text-red-400"
                      : isWeekend
                        ? "text-gray-600"
                        : "text-gray-400"
                  }`}
                >
                  <div>{JOURS[dayIdx]}</div>
                  <div>{dt.getDate()}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr key={emp.id} className="border-b border-gray-700/50 last:border-0">
              <td className="sticky left-0 z-10 bg-gray-800/80 px-3 py-2 font-medium text-gray-300 whitespace-nowrap">
                {emp.nom}
              </td>
              {dates.map((d) => {
                const matching = emp.absences.find((a) =>
                  isDateInRange(d, a.dateDebut, a.dateFin)
                );
                let cellCls = "px-1 py-1 text-center";
                if (matching) {
                  if (matching.statut === "accepte") {
                    cellCls += " bg-green-900/30";
                  } else {
                    cellCls += " bg-amber-900/30";
                  }
                }
                return (
                  <td key={d} className={cellCls}>
                    {matching && (
                      <div
                        className={`mx-auto h-5 w-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                          matching.statut === "accepte"
                            ? "bg-green-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                        title={`${TYPE_LABELS[matching.type] || matching.type} (${matching.statut})`}
                      >
                        {matching.statut === "accepte" ? "V" : "?"}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
