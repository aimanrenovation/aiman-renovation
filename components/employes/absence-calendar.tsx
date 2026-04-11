"use client";

import { useState, useEffect, useMemo } from "react";

interface Absence {
  id: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
}

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getFirstDayOffset(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // getDay() returns 0=Sun, we want Mon=0
  return day === 0 ? 6 : day - 1;
}

type DayStatus = "approuve" | "en_attente" | "refuse" | null;

function buildStatusMap(absences: Absence[]): Map<string, DayStatus> {
  const map = new Map<string, DayStatus>();

  // Priority: approuve > en_attente > refuse
  const priority: Record<string, number> = {
    accepte: 3,
    en_attente: 2,
    refuse: 1,
  };

  for (const a of absences) {
    const start = new Date(a.dateDebut + "T00:00:00");
    const end = new Date(a.dateFin + "T00:00:00");
    const current = new Date(start);

    while (current <= end) {
      const key = toDateStr(current);
      const existing = map.get(key);
      const existingPriority = existing
        ? priority[existing === "approuve" ? "accepte" : existing] ?? 0
        : 0;
      const newStatus =
        a.statut === "accepte"
          ? "approuve"
          : a.statut === "en_attente"
            ? "en_attente"
            : "refuse";
      const newPriority = priority[a.statut] ?? 0;

      if (newPriority > existingPriority) {
        map.set(key, newStatus);
      }
      current.setDate(current.getDate() + 1);
    }
  }
  return map;
}

export function AbsenceCalendar() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  useEffect(() => {
    fetch("/api/employes/absences")
      .then((r) => (r.ok ? r.json() : { absences: [] }))
      .then((d) => setAbsences(d.absences ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusMap = useMemo(() => buildStatusMap(absences), [absences]);

  const days = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);
  const todayStr = toDateStr(new Date());

  function goPrev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const monthLabel = new Date(year, month).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-neutral-200 bg-white" />
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      {/* Header navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-lg px-3 py-1 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          &larr;
        </button>
        <h3 className="text-sm font-semibold capitalize text-neutral-900">
          {monthLabel}
        </h3>
        <button
          type="button"
          onClick={goNext}
          className="rounded-lg px-3 py-1 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          &rarr;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {JOURS.map((j, i) => (
          <div key={i} className="text-xs font-medium text-neutral-400 py-1">
            {j}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty offset cells */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((d) => {
          const key = toDateStr(d);
          const status = statusMap.get(key);
          const isToday = key === todayStr;

          let cellClass =
            "flex h-8 w-full items-center justify-center rounded-md text-xs transition-colors";

          if (status === "approuve") {
            cellClass += " bg-green-100 text-green-800 font-semibold";
          } else if (status === "en_attente") {
            cellClass += " bg-amber-100 text-amber-800 font-medium";
          } else if (status === "refuse") {
            cellClass += " bg-red-50 text-red-400 line-through";
          } else {
            cellClass += " text-neutral-600";
          }

          if (isToday) {
            cellClass += " ring-2 ring-[#E50000] ring-offset-1";
          }

          return (
            <div key={key} className={cellClass}>
              {d.getDate()}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-green-100" />
          Approuve
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-amber-100" />
          En attente
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-red-50 border border-red-200" />
          Refuse
        </span>
      </div>
    </div>
  );
}
