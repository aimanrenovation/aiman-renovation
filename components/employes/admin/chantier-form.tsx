"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ChantierFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ChantierForm({ onClose, onSuccess }: ChantierFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      nom: fd.get("nom") as string,
      clientNom: fd.get("clientNom") as string,
      adresse: fd.get("adresse") as string,
      ville: (fd.get("ville") as string) || undefined,
      codePostal: (fd.get("codePostal") as string) || undefined,
      dateDebut: (fd.get("dateDebut") as string) || undefined,
      dateFinPrevue: (fd.get("dateFinPrevue") as string) || undefined,
      budgetPrevuCents: fd.get("budget")
        ? Math.round(Number(fd.get("budget")) * 100)
        : undefined,
    };

    try {
      const res = await fetch("/api/employes/admin/chantiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la creation");
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
      <div className="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Creer un chantier</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Nom du chantier</span>
              <input
                name="nom"
                required
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Renovation Dupont"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Client</span>
              <input
                name="clientNom"
                required
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="M. Dupont"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Adresse</span>
            <input
              name="adresse"
              required
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="12 rue de la Paix"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Ville</span>
              <input
                name="ville"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Paris"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Code postal</span>
              <input
                name="codePostal"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="75001"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Date debut</span>
              <input
                name="dateDebut"
                type="date"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Date fin prevue</span>
              <input
                name="dateFinPrevue"
                type="date"
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Budget prevu (EUR)</span>
            <input
              name="budget"
              type="number"
              step="0.01"
              min="0"
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="10000.00"
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
              {loading ? "Creation..." : "Creer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
