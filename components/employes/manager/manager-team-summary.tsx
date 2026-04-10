"use client";

import { User } from "lucide-react";

export interface TeamMember {
  id: string;
  firstname: string;
  lastname: string;
  avatarUrl: string | null;
  totalHours: number;
  brutCount: number;
  valideCount: number;
}

interface ManagerTeamSummaryProps {
  team: TeamMember[];
  selectedEmployeId: string | null;
  onSelect: (id: string | null) => void;
}

export function ManagerTeamSummary({ team, selectedEmployeId, onSelect }: ManagerTeamSummaryProps) {
  if (team.length === 0) {
    return (
      <p className="text-sm text-neutral-500">Aucun membre dans votre équipe.</p>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {team.map((member) => {
        const isSelected = selectedEmployeId === member.id;
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(isSelected ? null : member.id)}
            className={`flex min-w-[160px] flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
              isSelected
                ? "border-blue-400 ring-2 ring-blue-200"
                : "border-neutral-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
                  <User className="h-4 w-4" />
                </div>
              )}
              <span className="text-sm font-medium text-neutral-800">
                {member.firstname} {member.lastname.charAt(0)}.
              </span>
            </div>
            <div className="text-left text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">
                {member.totalHours.toFixed(1)}h
              </span>{" "}
              cette semaine
            </div>
            <div className="flex gap-2 text-xs">
              {member.brutCount > 0 && (
                <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium text-orange-800">
                  {member.brutCount} brut
                </span>
              )}
              {member.valideCount > 0 && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-800">
                  {member.valideCount} validé
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
