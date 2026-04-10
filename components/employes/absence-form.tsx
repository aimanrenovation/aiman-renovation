"use client";

import { useState } from "react";

const TYPES = [
  { value: "conge_paye", label: "Congé payé" },
  { value: "maladie", label: "Maladie" },
  { value: "accident_travail", label: "Accident du travail" },
  { value: "sans_solde", label: "Sans solde" },
  { value: "formation", label: "Formation" },
  { value: "evenement_familial", label: "Événement familial" },
  { value: "autre", label: "Autre" },
] as const;

export function AbsenceForm({ onSuccess }: { onSuccess: () => void }) {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [type, setType] = useState("conge_paye");
  const [raison, setRaison] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dateDebut || !dateFin) {
      setError("Sélectionnez les dates");
      return;
    }
    if (dateDebut > dateFin) {
      setError("La date de fin doit être après la date de début");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("dateDebut", dateDebut);
      fd.append("dateFin", dateFin);
      fd.append("type", type);
      if (raison) fd.append("raison", raison);
      if (file) fd.append("justificatif", file);

      const res = await fetch("/api/employes/absences", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur");
      }
      setDateDebut("");
      setDateFin("");
      setType("conge_paye");
      setRaison("");
      setFile(null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold text-neutral-900">Nouvelle demande</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Date début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Date fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs text-neutral-500">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {type === "autre" && (
        <div className="mt-3">
          <label className="mb-1 block text-xs text-neutral-500">Raison</label>
          <textarea
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            rows={2}
            placeholder="Précisez la raison..."
          />
        </div>
      )}

      <div className="mt-3">
        <label className="mb-1 block text-xs text-neutral-500">Justificatif (optionnel)</label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-xs text-neutral-500 file:mr-2 file:rounded-md file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium"
        />
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-[#E50000] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Envoi..." : "Soumettre la demande"}
      </button>
    </form>
  );
}
