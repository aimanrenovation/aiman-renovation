"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EmployeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: "employe", label: "Employe" },
  { value: "chef_chantier", label: "Chef de chantier" },
  { value: "patron", label: "Patron" },
];

export function EmployeForm({ onClose, onSuccess }: EmployeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const body = {
      firstname: fd.get("firstname") as string,
      lastname: fd.get("lastname") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || undefined,
      role: fd.get("role") as string,
      hourlyRateCents: fd.get("hourlyRate")
        ? Math.round(Number(fd.get("hourlyRate")) * 100)
        : undefined,
    };

    try {
      const res = await fetch("/api/employes/admin/employes", {
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
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Creer un employe</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Prenom</span>
              <input
                name="firstname"
                required
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Jean"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Nom</span>
              <input
                name="lastname"
                required
                className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Dupont"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Email</span>
            <input
              name="email"
              type="email"
              required
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="jean@exemple.fr"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Telephone</span>
            <input
              name="phone"
              type="tel"
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="06 12 34 56 78"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Role</span>
            <select
              name="role"
              defaultValue="employe"
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white focus:border-red-500 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Taux horaire (EUR)</span>
            <input
              name="hourlyRate"
              type="number"
              step="0.01"
              min="0"
              className="h-10 rounded-lg border border-gray-700 bg-gray-800 px-3 text-sm text-white placeholder:text-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="15.00"
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
