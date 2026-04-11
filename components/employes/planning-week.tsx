"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PlanningEntry {
  id: string;
  date: string;
  heureDebut: string | null;
  heureFin: string | null;
  mission: string | null;
  statut: string;
  chantierId: string;
  chantierNom: string;
  chantierVille: string | null;
}

const BADGE_MAP: Record<string, { label: string; cls: string }> = {
  prevu: { label: "Prévu", cls: "bg-blue-100 text-blue-700" },
  confirme: { label: "Confirmé", cls: "bg-green-100 text-green-700" },
  fait: { label: "Fait", cls: "bg-neutral-200 text-neutral-600" },
  annule: { label: "Annulé", cls: "bg-red-100 text-red-700" },
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Return the Monday of the week containing `d`. */
function getMonday(d: Date): Date {
  const copy = new Date(d);
  const day = copy.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${monday.toLocaleDateString("fr-FR", opts)} — ${sunday.toLocaleDateString("fr-FR", opts)}`;
}

export function PlanningWeek() {
  const [monday, setMonday] = useState(() => getMonday(new Date()));
  const [entries, setEntries] = useState<PlanningEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = formatDate(new Date());

  const fetchWeek = useCallback(async (mon: Date) => {
    setLoading(true);
    try {
      // We fetch the full month that contains this week, then filter client-side
      const month = formatDate(mon).slice(0, 7);
      const res = await fetch(`/api/employes/planning?month=${month}`);
      if (!res.ok) throw new Error("fetch_failed");
      const data = await res.json();
      const sunday = addDays(mon, 6);
      const fromStr = formatDate(mon);
      const toStr = formatDate(sunday);
      const filtered = (data.plannings as PlanningEntry[]).filter(
        (p) => p.date >= fromStr && p.date <= toStr
      );
      setEntries(filtered);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeek(monday);
  }, [monday, fetchWeek]);

  const prevWeek = () => setMonday((m) => addDays(m, -7));
  const nextWeek = () => setMonday((m) => addDays(m, 7));
  const goToday = () => setMonday(getMonday(new Date()));

  // Build a map: dateStr -> entries[]
  const byDate = new Map<string, PlanningEntry[]>();
  for (const e of entries) {
    const list = byDate.get(e.date) ?? [];
    list.push(e);
    byDate.set(e.date, list);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Week navigation header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevWeek}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 text-lg"
          aria-label="Semaine précédente"
        >
          &lsaquo;
        </button>
        <button
          type="button"
          onClick={goToday}
          className="text-sm font-semibold text-neutral-700"
        >
          {formatWeekLabel(monday)}
        </button>
        <button
          type="button"
          onClick={nextWeek}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-300 text-lg"
          aria-label="Semaine suivante"
        >
          &rsaquo;
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(monday, i);
            const dateStr = formatDate(day);
            const isToday = dateStr === todayStr;
            const dayEntries = byDate.get(dateStr) ?? [];

            return (
              <div
                key={dateStr}
                className={`rounded-2xl border p-3 shadow-sm ${
                  isToday
                    ? "border-[#E50000] bg-red-50/40"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase ${
                      isToday ? "text-[#E50000]" : "text-neutral-500"
                    }`}
                  >
                    {DAY_LABELS[i]}
                  </span>
                  <span
                    className={`text-xs ${
                      isToday ? "font-semibold text-[#E50000]" : "text-neutral-400"
                    }`}
                  >
                    {day.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {isToday && (
                    <span className="rounded-full bg-[#E50000] px-2 py-0.5 text-[10px] font-bold text-white">
                      Aujourd&apos;hui
                    </span>
                  )}
                </div>

                {dayEntries.length === 0 ? (
                  <div className="py-1 text-xs text-neutral-400">—</div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {dayEntries.map((e) => {
                      const badge = BADGE_MAP[e.statut] ?? BADGE_MAP.prevu;
                      return (
                        <Link
                          key={e.id}
                          href={`/espace-employes/mission/${e.chantierId}`}
                          className="flex items-start justify-between gap-2 rounded-xl bg-white/80 px-3 py-2 transition-colors active:bg-neutral-100"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-medium">
                                {e.chantierNom}
                              </span>
                              <span
                                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${badge.cls}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            {e.chantierVille && (
                              <div className="truncate text-[11px] text-neutral-500">
                                {e.chantierVille}
                              </div>
                            )}
                            {e.mission && (
                              <div className="mt-0.5 truncate text-[11px] text-neutral-600">
                                {e.mission}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 text-right text-[11px] font-medium text-neutral-600">
                            {e.heureDebut?.slice(0, 5) ?? "--"}
                            {e.heureFin ? ` → ${e.heureFin.slice(0, 5)}` : ""}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
