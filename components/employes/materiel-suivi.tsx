"use client";

import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/lib/employes/use-toast";

interface SuiviItem {
  id: string;
  materiau: string;
  quantitePrevue: number;
  quantiteUtilisee: number;
  unite: string;
  notes: string | null;
}

const UNITES = ["unité", "kg", "m²", "litre", "sac"];

interface Props {
  chantierId: string;
  chantierNom: string;
}

export function MaterielSuivi({ chantierId, chantierNom }: Props) {
  const [items, setItems] = useState<SuiviItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [materiau, setMateriau] = useState("");
  const [quantitePrevue, setQuantitePrevue] = useState("");
  const [quantiteUtilisee, setQuantiteUtilisee] = useState("");
  const [unite, setUnite] = useState("unité");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/employes/materiel/suivi?chantier_id=${chantierId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } catch {
      showToast("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  }, [chantierId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function resetForm() {
    setMateriau("");
    setQuantitePrevue("");
    setQuantiteUtilisee("");
    setUnite("unité");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item: SuiviItem) {
    setMateriau(item.materiau);
    setQuantitePrevue(String(item.quantitePrevue));
    setQuantiteUtilisee(String(item.quantiteUtilisee));
    setUnite(item.unite);
    setNotes(item.notes ?? "");
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!materiau.trim()) {
      showToast("Nom du materiau requis", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/employes/materiel/suivi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chantier_id: chantierId,
          materiau: materiau.trim(),
          quantite_prevue: Number(quantitePrevue) || 0,
          quantite_utilisee: Number(quantiteUtilisee) || 0,
          unite,
          notes: notes.trim() || undefined,
          ...(editingId ? { id: editingId } : {}),
        }),
      });

      if (res.ok) {
        showToast(editingId ? "Materiau mis a jour" : "Materiau ajoute", "success");
        resetForm();
        fetchItems();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error ?? "Erreur", "error");
      }
    } catch {
      showToast("Erreur reseau", "error");
    } finally {
      setSaving(false);
    }
  }

  function getEcart(item: SuiviItem) {
    return item.quantiteUtilisee - item.quantitePrevue;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Items list */}
      {items.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
          <p className="text-sm text-neutral-500">Aucun materiau suivi pour ce chantier.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="hidden sm:grid sm:grid-cols-6 gap-2 px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            <span className="col-span-2">Materiau</span>
            <span className="text-right">Prevu</span>
            <span className="text-right">Utilise</span>
            <span className="text-right">Ecart</span>
            <span className="text-right">Statut</span>
          </div>

          {items.map((item) => {
            const ecart = getEcart(item);
            const isGaspillage = ecart > 0;
            const isEconomie = ecart < 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => startEdit(item)}
                className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm text-left transition-colors active:bg-neutral-50"
              >
                {/* Mobile layout */}
                <div className="flex items-start justify-between sm:hidden">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">{item.materiau}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                      <span>Prevu: {item.quantitePrevue} {item.unite}</span>
                      <span>Utilise: {item.quantiteUtilisee} {item.unite}</span>
                    </div>
                    {item.notes && (
                      <div className="mt-1 text-xs text-neutral-400 truncate">{item.notes}</div>
                    )}
                  </div>
                  <div className="ml-3 flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        isGaspillage
                          ? "bg-red-50 text-[#E50000]"
                          : isEconomie
                            ? "bg-green-50 text-green-700"
                            : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {isGaspillage ? "+" : ""}{ecart} {item.unite}
                    </span>
                    <span className="text-xs">
                      {isGaspillage ? "\u26A0\uFE0F" : isEconomie ? "\u2713" : "\u2014"}
                    </span>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden sm:grid sm:grid-cols-6 sm:items-center gap-2">
                  <div className="col-span-2">
                    <span className="text-sm font-semibold">{item.materiau}</span>
                    {item.notes && (
                      <span className="ml-2 text-xs text-neutral-400">{item.notes}</span>
                    )}
                  </div>
                  <span className="text-right text-sm">{item.quantitePrevue} {item.unite}</span>
                  <span className="text-right text-sm">{item.quantiteUtilisee} {item.unite}</span>
                  <span
                    className={`text-right text-sm font-medium ${
                      isGaspillage
                        ? "text-[#E50000]"
                        : isEconomie
                          ? "text-green-700"
                          : "text-neutral-500"
                    }`}
                  >
                    {isGaspillage ? "+" : ""}{ecart}
                  </span>
                  <span className="text-right text-sm">
                    {isGaspillage ? "\u26A0\uFE0F Gaspillage" : isEconomie ? "\u2713 Economie" : "\u2014 Neutre"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Inline form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
          <h3 className="text-sm font-semibold">
            {editingId ? "Modifier le materiau" : "Ajouter un materiau"}
          </h3>

          <input
            type="text"
            placeholder="Nom du materiau"
            value={materiau}
            onChange={(e) => setMateriau(e.target.value)}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Quantite prevue</label>
              <input
                type="number"
                min="0"
                value={quantitePrevue}
                onChange={(e) => setQuantitePrevue(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-500">Quantite utilisee</label>
              <input
                type="number"
                min="0"
                value={quantiteUtilisee}
                onChange={(e) => setQuantiteUtilisee(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-neutral-500">Unite</label>
            <select
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
            >
              {UNITES.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Notes (optionnel)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-400 focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 active:bg-neutral-700"
            >
              {saving
                ? "Enregistrement..."
                : editingId
                  ? "Mettre a jour"
                  : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors active:bg-neutral-200"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-2xl border-2 border-dashed border-neutral-300 py-3 text-sm font-medium text-neutral-500 transition-colors active:bg-neutral-50"
        >
          + Ajouter un materiau
        </button>
      )}
    </div>
  );
}
