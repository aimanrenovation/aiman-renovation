"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface MissionFormProps {
  employes: { id: string; firstname: string; lastname: string }[];
  chantiers: { id: string; nom: string }[];
  defaultDate?: string;
  editData?: {
    id: string;
    employeId: string;
    chantierId: string;
    date: string;
    heureDebut: string;
    heureFin: string;
    mission: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function MissionForm({
  employes,
  chantiers,
  defaultDate,
  editData,
  onClose,
  onSuccess,
}: MissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!editData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      employeId: fd.get("employeId") as string,
      chantierId: fd.get("chantierId") as string,
      date: fd.get("date") as string,
      heureDebut: (fd.get("heureDebut") as string) || undefined,
      heureFin: (fd.get("heureFin") as string) || undefined,
      mission: (fd.get("mission") as string) || undefined,
    };

    try {
      const url = isEdit
        ? `/api/employes/admin/plannings/${editData.id}`
        : "/api/employes/admin/plannings";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? "Modifier la mission" : "Ajouter une mission"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Employe</span>
            <select
              name="employeId"
              required
              defaultValue={editData?.employeId || ""}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              <option value="" disabled>
                Choisir...
              </option>
              {employes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.firstname} {e.lastname}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Chantier</span>
            <select
              name="chantierId"
              required
              defaultValue={editData?.chantierId || ""}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              <option value="" disabled>
                Choisir...
              </option>
              {chantiers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Date</span>
            <input
              name="date"
              type="date"
              required
              defaultValue={editData?.date || defaultDate || ""}
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Heure debut</span>
              <input
                name="heureDebut"
                type="time"
                defaultValue={editData?.heureDebut || "08:00"}
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Heure fin</span>
              <input
                name="heureFin"
                type="time"
                defaultValue={editData?.heureFin || "17:00"}
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Description de la mission</span>
            <textarea
              name="mission"
              rows={3}
              defaultValue={editData?.mission || ""}
              className="rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Pose carrelage, salle de bain..."
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-400">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : isEdit ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
