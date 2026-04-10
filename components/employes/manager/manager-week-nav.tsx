"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface ManagerWeekNavProps {
  weekString: string; // "2026-W15"
  onPrev: () => void;
  onNext: () => void;
}

function weekLabel(weekString: string): string {
  const match = weekString.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return weekString;
  return `Semaine ${parseInt(match[2], 10)}`;
}

export function ManagerWeekNav({ weekString, onPrev, onNext }: ManagerWeekNavProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100"
        aria-label="Semaine précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[120px] text-center text-sm font-semibold text-neutral-800">
        {weekLabel(weekString)}
      </span>
      <button
        type="button"
        onClick={onNext}
        className="rounded-lg border border-neutral-200 p-2 text-neutral-600 transition hover:bg-neutral-100"
        aria-label="Semaine suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
