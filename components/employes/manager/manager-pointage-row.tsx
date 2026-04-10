"use client";

import { useState } from "react";
import { Check, Pencil, X, Loader2 } from "lucide-react";

export interface PointageData {
  id: string;
  date: string;
  employeId: string;
  employeNom: string;
  chantierNom: string;
  heureDebut: string;
  heureFin: string | null;
  pauseMinutes: number;
  dureeMinutes: number;
  statut: "brut" | "valide_manager" | "valide_patron" | "transmis_comptabilite";
  correctedHeureDebut?: string | null;
  correctedHeureFin?: string | null;
  correctedPauseMinutes?: number | null;
  correctionNotes?: string | null;
}

interface ManagerPointageRowProps {
  pointage: PointageData;
  onValidate: (id: string) => Promise<void>;
  onCorrect: (
    id: string,
    data: {
      heureDebut: string;
      heureFin: string;
      pauseMinutes: number;
      notes: string;
    }
  ) => Promise<void>;
}

const STATUT_BADGE: Record<string, string> = {
  brut: "bg-orange-100 text-orange-800",
  valide_manager: "bg-blue-100 text-blue-800",
  valide_patron: "bg-green-100 text-green-800",
  transmis_comptabilite: "bg-gray-100 text-gray-600",
};

const STATUT_LABEL: Record<string, string> = {
  brut: "Brut",
  valide_manager: "Validé manager",
  valide_patron: "Validé patron",
  transmis_comptabilite: "Transmis",
};

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m > 0 ? String(m).padStart(2, "0") : ""}`;
}

function formatDateShort(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

export function ManagerPointageRow({
  pointage,
  onValidate,
  onCorrect,
}: ManagerPointageRowProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editDebut, setEditDebut] = useState(
    formatTime(pointage.heureDebut)
  );
  const [editFin, setEditFin] = useState(
    formatTime(pointage.heureFin)
  );
  const [editPause, setEditPause] = useState(
    String(pointage.pauseMinutes)
  );
  const [editNotes, setEditNotes] = useState(
    pointage.correctionNotes ?? ""
  );

  const isBrut = pointage.statut === "brut";
  const hasCorrected =
    pointage.correctedHeureDebut ||
    pointage.correctedHeureFin ||
    pointage.correctedPauseMinutes != null;

  async function handleValidate() {
    setLoading(true);
    try {
      await onValidate(pointage.id);
    } finally {
      setLoading(false);
    }
  }

  async function handleCorrectSubmit() {
    setLoading(true);
    try {
      await onCorrect(pointage.id, {
        heureDebut: editDebut,
        heureFin: editFin,
        pauseMinutes: parseInt(editPause, 10) || 0,
        notes: editNotes,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <tr className="border-b border-neutral-100 text-sm hover:bg-neutral-50">
        <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600">
          {formatDateShort(pointage.date)}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5 font-medium text-neutral-800">
          {pointage.employeNom}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5 text-neutral-600">
          {pointage.chantierNom}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          {hasCorrected && pointage.correctedHeureDebut ? (
            <span>
              <span className="text-neutral-400 line-through">
                {formatTime(pointage.heureDebut)}
              </span>{" "}
              <span className="font-medium text-green-700">
                {formatTime(pointage.correctedHeureDebut)}
              </span>
            </span>
          ) : (
            formatTime(pointage.heureDebut)
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          {hasCorrected && pointage.correctedHeureFin ? (
            <span>
              <span className="text-neutral-400 line-through">
                {formatTime(pointage.heureFin)}
              </span>{" "}
              <span className="font-medium text-green-700">
                {formatTime(pointage.correctedHeureFin)}
              </span>
            </span>
          ) : (
            formatTime(pointage.heureFin)
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5 text-center">
          {hasCorrected && pointage.correctedPauseMinutes != null ? (
            <span>
              <span className="text-neutral-400 line-through">
                {pointage.pauseMinutes}′
              </span>{" "}
              <span className="font-medium text-green-700">
                {pointage.correctedPauseMinutes}′
              </span>
            </span>
          ) : (
            <span>{pointage.pauseMinutes}′</span>
          )}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5 font-medium text-neutral-800">
          {formatDuration(pointage.dureeMinutes)}
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
              STATUT_BADGE[pointage.statut] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {STATUT_LABEL[pointage.statut] ?? pointage.statut}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          {isBrut && (
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleValidate}
                disabled={loading}
                className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Valider
              </button>
              <button
                type="button"
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-yellow-600"
              >
                <Pencil className="h-3 w-3" />
                Corriger
              </button>
            </div>
          )}
        </td>
      </tr>

      {/* Inline edit row */}
      {editing && (
        <tr className="border-b border-neutral-100 bg-yellow-50/50">
          <td colSpan={9} className="px-3 py-3">
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1 text-xs text-neutral-600">
                Début
                <input
                  type="time"
                  value={editDebut}
                  onChange={(e) => setEditDebut(e.target.value)}
                  className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-neutral-600">
                Fin
                <input
                  type="time"
                  value={editFin}
                  onChange={(e) => setEditFin(e.target.value)}
                  className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-neutral-600">
                Pause (min)
                <input
                  type="number"
                  min={0}
                  value={editPause}
                  onChange={(e) => setEditPause(e.target.value)}
                  className="w-20 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-neutral-600">
                Notes
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Raison de la correction..."
                  className="w-48 rounded-lg border border-neutral-300 px-2 py-1.5 text-sm"
                />
              </label>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleCorrectSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-yellow-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50"
                >
                  <X className="h-3 w-3" />
                  Annuler
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
