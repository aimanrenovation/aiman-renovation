"use client";

import { useCallback, useEffect, useState } from "react";
import { ManagerWeekNav } from "@/components/employes/manager/manager-week-nav";
import {
  ManagerTeamSummary,
  type TeamMember,
} from "@/components/employes/manager/manager-team-summary";
import { ManagerPointageTable } from "@/components/employes/manager/manager-pointage-table";
import { type PointageData } from "@/components/employes/manager/manager-pointage-row";
import { Loader2, AlertCircle } from "lucide-react";

// ── Week helpers ──────────────────────────────────────────────

function getWeekString(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

function shiftWeek(weekStr: string, delta: number): string {
  const match = weekStr.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return weekStr;
  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  // Approximate: go to the Monday of that ISO week, then shift
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setDate(monday.getDate() + delta * 7);
  return getWeekString(monday);
}

// ── Team stats builder ────────────────────────────────────────

function buildTeamStats(
  team: Array<{ id: string; firstname: string; lastname: string; avatarUrl: string | null }>,
  pointages: PointageData[]
): TeamMember[] {
  return team.map((member) => {
    const memberPointages = pointages.filter(
      (p) => p.employeId === member.id
    );
    const totalMinutes = memberPointages.reduce(
      (acc, p) => acc + p.dureeMinutes,
      0
    );
    const brutCount = memberPointages.filter(
      (p) => p.statut === "brut"
    ).length;
    const valideCount = memberPointages.filter(
      (p) => p.statut !== "brut"
    ).length;

    return {
      id: member.id,
      firstname: member.firstname,
      lastname: member.lastname,
      avatarUrl: member.avatarUrl,
      totalHours: totalMinutes / 60,
      brutCount,
      valideCount,
    };
  });
}

// ── Main component ────────────────────────────────────────────

export default function ManagerPage() {
  const [week, setWeek] = useState(() => getWeekString(new Date()));
  const [team, setTeam] = useState<
    Array<{ id: string; firstname: string; lastname: string; avatarUrl: string | null }>
  >([]);
  const [pointages, setPointages] = useState<PointageData[]>([]);
  const [selectedEmployeId, setSelectedEmployeId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch team list (once) ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/employes/manager/equipe");
        if (!res.ok) throw new Error("Impossible de charger l'équipe");
        const data = await res.json();
        if (!cancelled) setTeam(data);
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erreur de chargement"
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Fetch pointages (when week changes) ──
  const fetchPointages = useCallback(async (w: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/employes/manager/pointages?week=${encodeURIComponent(w)}`
      );
      if (!res.ok) throw new Error("Impossible de charger les pointages");
      const data = await res.json();
      setPointages(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur de chargement"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPointages(week);
  }, [week, fetchPointages]);

  // ── Actions ──

  async function handleValidate(id: string) {
    const res = await fetch(
      `/api/employes/manager/pointages/${id}/validate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "valide" }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Erreur de validation");
    }
    // Refresh list
    await fetchPointages(week);
  }

  async function handleCorrect(
    id: string,
    data: {
      heureDebut: string;
      heureFin: string;
      pauseMinutes: number;
      notes: string;
    }
  ) {
    const res = await fetch(
      `/api/employes/manager/pointages/${id}/validate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "corriger",
          heureDebut: data.heureDebut,
          heureFin: data.heureFin,
          pauseMinutes: data.pauseMinutes,
          notes: data.notes,
        }),
      }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Erreur de correction");
    }
    await fetchPointages(week);
  }

  async function handleValidateAll() {
    const brutPointages = filteredPointages.filter(
      (p) => p.statut === "brut"
    );
    await Promise.all(brutPointages.map((p) => handleValidate(p.id)));
  }

  // ── Derived data ──

  const teamStats = buildTeamStats(team, pointages);

  const filteredPointages = selectedEmployeId
    ? pointages.filter((p) => p.employeId === selectedEmployeId)
    : pointages;

  // ── Render ──

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-neutral-900">
          Validation des heures
        </h1>
        <ManagerWeekNav
          weekString={week}
          onPrev={() => setWeek((w) => shiftWeek(w, -1))}
          onNext={() => setWeek((w) => shiftWeek(w, 1))}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Team summary cards */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Équipe
        </h2>
        <ManagerTeamSummary
          team={teamStats}
          selectedEmployeId={selectedEmployeId}
          onSelect={setSelectedEmployeId}
        />
      </section>

      {/* Pointages table */}
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Pointages
          {selectedEmployeId && (
            <button
              type="button"
              onClick={() => setSelectedEmployeId(null)}
              className="ml-2 text-xs font-normal normal-case text-blue-600 hover:underline"
            >
              Voir tous
            </button>
          )}
        </h2>
        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white py-12 shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <ManagerPointageTable
            pointages={filteredPointages}
            onValidate={handleValidate}
            onCorrect={handleCorrect}
            onValidateAll={handleValidateAll}
          />
        )}
      </section>
    </div>
  );
}
