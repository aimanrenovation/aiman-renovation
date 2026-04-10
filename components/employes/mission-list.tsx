"use client";

import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { MissionCard, type MissionCardProps } from "./mission-card";

interface MissionsListProps {
  missions: MissionCardProps["mission"][];
  currentEmployeId: string;
}

export function MissionsList({ missions, currentEmployeId }: MissionsListProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  function handleRefresh() {
    setRefreshing(true);
    router.refresh();
    // Reset spinner after a short delay since router.refresh() doesn't return a promise
    setTimeout(() => setRefreshing(false), 1000);
  }

  if (missions.length === 0) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
