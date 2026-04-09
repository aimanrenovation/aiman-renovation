"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { MissionForm } from "./mission-form";

interface PlanningEntry {
  id: string;
  employeId: string;
  employeNom: string;
  chantierId: string;
  chantierNom: string;
  date: string;
  heureDebut: string | null;
  heureFin: string | null;
  mission: string | null;
  statut: string;
}

interface EmployeOption {
  id: string;
  firstname: string;
  lastname: string;
}

interface ChantierOption {
  id: string;
  nom: string;
}

function getWeekDates(refDate: Date): string[] {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(d).toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function getMonthDates(refDate: Date): string[] {
  const year = refDate.getFullYear();
  const month = refDate.getMonth();
  const dates: string[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    dates.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const DAY_NAMES = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const SHORT_MONTHS = [
  "Jan", "Fev", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Aout", "Sep", "Oct", "Nov", "Dec",
];

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const dayIdx = (d.getDay() + 6) % 7; // Mon=0
  return `${DAY_NAMES[dayIdx]} ${d.getDate()}`;
}

export function PlanningGrid() {
  const [view, setView] = useState<"week" | "month">("week");
  const [groupBy, setGroupBy] = useState<"employe" | "chantier">("employe");
  const [refDate, setRefDate] = useState(new Date());
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [employes, setEmployes] = useState<EmployeOption[]>([]);
  const [chantiers, setChantiers] = useState<ChantierOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formDate, setFormDate] = useState<string | undefined>(undefined);

  const dates =
    view === "week" ? getWeekDates(refDate) : getMonthDates(refDate);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const debut = dates[0];
    const fin = dates[dates.length - 1];
    try {
      const [planRes, empRes, chRes] = await Promise.all([
        fetch(`/api/employes/admin/plannings?debut=${debut}&fin=${fin}`),
        fetch("/api/employes/admin/employes"),
        fetch("/api/employes/admin/chantiers"),
      ]);
      if (planRes.ok) {
        const data = await planRes.json();
        setEntries(data.plannings || data || []);
      }
      if (empRes.ok) {
        const data = await empRes.json();
        setEmployes(data.employes || data || []);
      }
      if (chRes.ok) {
        const data = await chRes.json();
        setChantiers(data.chantiers || data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dates[0], dates[dates.length - 1]]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function navigate(dir: -1 | 1) {
    const d = new Date(refDate);
    if (view === "week") {
      d.setDate(d.getDate() + dir * 7);
    } else {
      d.setMonth(d.getMonth() + dir);
    }
    setRefDate(d);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette mission ?")) return;
    await fetch(`/api/employes/admin/plannings/${id}`, { method: "DELETE" });
    fetchData();
  }

  // Group rows
  const rowGroups: { key: string; label: string }[] = [];
  if (groupBy === "employe") {
    const seen = new Set<string>();
    for (const e of entries) {
      if (!seen.has(e.employeId)) {
        seen.add(e.employeId);
        rowGroups.push({ key: e.employeId, label: e.employeNom });
      }
    }
    // Add employes with no entries
    for (const emp of employes) {
      if (!seen.has(emp.id)) {
        rowGroups.push({ key: emp.id, label: `${emp.firstname} ${emp.lastname}` });
      }
    }
  } else {
    const seen = new Set<string>();
    for (const e of entries) {
      if (!seen.has(e.chantierId)) {
        seen.add(e.chantierId);
        rowGroups.push({ key: e.chantierId, label: e.chantierNom });
      }
    }
    for (const ch of chantiers) {
      if (!seen.has(ch.id)) {
        rowGroups.push({ key: ch.id, label: ch.nom });
      }
    }
  }

  function getCellEntries(rowKey: string, date: string) {
    return entries.filter((e) => {
      const matchRow =
        groupBy === "employe" ? e.employeId === rowKey : e.chantierId === rowKey;
      return matchRow && e.date === date;
    });
  }

  const periodLabel =
    view === "week"
      ? `Semaine du ${new Date(dates[0] + "T12:00:00").getDate()} ${SHORT_MONTHS[new Date(dates[0] + "T12:00:00").getMonth()]}`
      : `${SHORT_MONTHS[refDate.getMonth()]} ${refDate.getFullYear()}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-0.5">
          <button
            onClick={() => setView("week")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "week" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView("month")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              view === "month" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Mois
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800 p-0.5">
          <button
            onClick={() => setGroupBy("employe")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              groupBy === "employe" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Par employe
          </button>
          <button
            onClick={() => setGroupBy("chantier")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              groupBy === "chantier" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Par chantier
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[140px] text-center text-sm font-medium text-white">
            {periodLabel}
          </span>
          <button onClick={() => navigate(1)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => {
            setFormDate(new Date().toISOString().slice(0, 10));
            setShowForm(true);
          }}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter mission
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          Chargement...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-800/50">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="sticky left-0 z-10 bg-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {groupBy === "employe" ? "Employe" : "Chantier"}
                </th>
                {dates.map((d) => (
                  <th
                    key={d}
                    className={`min-w-[100px] px-2 py-2 text-center text-xs font-medium ${
                      d === new Date().toISOString().slice(0, 10)
                        ? "bg-red-600/10 text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {formatDayLabel(d)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowGroups.length === 0 ? (
                <tr>
                  <td
                    colSpan={dates.length + 1}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Aucune donnee
                  </td>
                </tr>
              ) : (
                rowGroups.map((row) => (
                  <tr key={row.key} className="border-b border-gray-700/50 last:border-0">
                    <td className="sticky left-0 z-10 bg-gray-800/80 px-3 py-2 font-medium text-gray-300">
                      {row.label}
                    </td>
                    {dates.map((d) => {
                      const cellItems = getCellEntries(row.key, d);
                      return (
                        <td
                          key={d}
                          className={`px-1 py-1 align-top ${
                            d === new Date().toISOString().slice(0, 10) ? "bg-red-600/5" : ""
                          }`}
                        >
                          {cellItems.map((item) => (
                            <div
                              key={item.id}
                              className="group mb-1 rounded-md border border-gray-600/50 bg-gray-700/50 px-2 py-1.5"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div>
                                  <div className="font-medium text-gray-200">
                                    {groupBy === "employe" ? item.chantierNom : item.employeNom}
                                  </div>
                                  {item.heureDebut && (
                                    <div className="text-[10px] text-gray-500">
                                      {item.heureDebut.slice(0, 5)}
                                      {item.heureFin ? ` - ${item.heureFin.slice(0, 5)}` : ""}
                                    </div>
                                  )}
                                  {item.mission && (
                                    <div className="mt-0.5 text-[10px] text-gray-400 line-clamp-2">
                                      {item.mission}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-3 w-3 text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Mission form modal */}
      {showForm && (
        <MissionForm
          employes={employes}
          chantiers={chantiers}
          defaultDate={formDate}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
