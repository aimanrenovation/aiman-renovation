"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import { MissionCard, type MissionCardProps } from "./mission-card";

interface MissionsListProps {
  missions: MissionCardProps["mission"][];
  currentEmployeId: string;
}

/* ---- Classement types ---- */
interface ClassementEntry {
  employeId: string;
  nom: string;
  count: number;
}

function formatBonus(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const MEDALS = ["gold", "silver", "bronze"] as const;
const MEDAL_ICONS: Record<string, string> = {
  gold: "\uD83E\uDD47",
  silver: "\uD83E\uDD48",
  bronze: "\uD83E\uDD49",
};

export function MissionsList({ missions, currentEmployeId }: MissionsListProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [classementLoading, setClassementLoading] = useState(true);

  // Fetch classement
  useEffect(() => {
    fetch("/api/employes/missions/classement")
      .then((r) => (r.ok ? r.json() : { classement: [] }))
      .then((d) => setClassement(d.classement ?? []))
      .catch(() => {})
      .finally(() => setClassementLoading(false));
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => setRefreshing(false), 1000);
  }

  // Separate missions into categories
  const myAccepted = missions.filter(
    (m) => m.statut === "prise" && m.acceptePar === currentEmployeId,
  );
  const totalBonus = myAccepted.reduce(
    (acc, m) => acc + (m.bonusMontantCents ?? 0),
    0,
  );

  if (missions.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-5xl">&#128526;</span>
          <p className="text-sm text-neutral-500">
            Pas de mission urgente pour le moment
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <RotateCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>

        {/* Still show historique and classement even when no active missions */}
        <ChallengesSection missions={myAccepted} totalBonus={totalBonus} />
        <ClassementSection
          classement={classement}
          loading={classementLoading}
          currentEmployeId={currentEmployeId}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {missions.length} mission{missions.length > 1 ? "s" : ""}
        </p>
        <button
          type="button"
          onClick={handleRefresh}
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
        >
          <RotateCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Actualiser
        </button>
      </div>

      {/* Cards */}
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          currentEmployeId={currentEmployeId}
        />
      ))}

      {/* Historique challenges */}
      <ChallengesSection missions={myAccepted} totalBonus={totalBonus} />

      {/* Classement */}
      <ClassementSection
        classement={classement}
        loading={classementLoading}
        currentEmployeId={currentEmployeId}
      />
    </div>
  );
}

/* ---- Challenges section ---- */

function ChallengesSection({
  missions,
  totalBonus,
}: {
  missions: MissionCardProps["mission"][];
  totalBonus: number;
}) {
  if (missions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-neutral-900">
        Mes challenges gagnes
      </h3>
      <div className="mt-3 space-y-2">
        {missions.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-green-900">
                {m.titre}
              </p>
              {m.chantierNom && (
                <p className="text-xs text-green-600">{m.chantierNom}</p>
              )}
            </div>
            {m.bonusMontantCents != null && m.bonusMontantCents > 0 && (
              <span className="ml-2 shrink-0 rounded-full bg-green-200 px-2 py-0.5 text-xs font-bold text-green-800">
                +{formatBonus(m.bonusMontantCents)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Total bonus */}
      {totalBonus > 0 && (
        <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
          <span className="text-sm font-medium text-neutral-600">
            Total bonus cumule
          </span>
          <span className="text-lg font-bold text-green-700">
            {formatBonus(totalBonus)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---- Classement section ---- */

function ClassementSection({
  classement,
  loading,
  currentEmployeId,
}: {
  classement: ClassementEntry[];
  loading: boolean;
  currentEmployeId: string;
}) {
  if (loading) {
    return (
      <div className="h-40 animate-pulse rounded-xl border border-neutral-200 bg-white" />
    );
  }

  if (classement.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-bold text-neutral-900">
        Classement de l&apos;equipe
      </h3>
      <div className="mt-3 space-y-2">
        {classement.map((entry, idx) => {
          const isMe = entry.employeId === currentEmployeId;
          const medal = idx < 3 ? MEDALS[idx] : null;
          return (
            <div
              key={entry.employeId}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                isMe ? "bg-amber-50 ring-1 ring-amber-200" : "bg-neutral-50"
              }`}
            >
              <span className="w-8 text-center text-lg">
                {medal ? MEDAL_ICONS[medal] : `#${idx + 1}`}
              </span>
              <span
                className={`flex-1 text-sm ${
                  isMe ? "font-bold text-neutral-900" : "text-neutral-700"
                }`}
              >
                {entry.nom}
                {isMe && (
                  <span className="ml-1.5 text-xs text-amber-600">(toi)</span>
                )}
              </span>
              <span className="text-sm font-semibold text-neutral-500">
                {entry.count} mission{entry.count > 1 ? "s" : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
