"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/lib/employes/use-toast";

interface ChecklistItem {
  label: string;
  checked: boolean;
}

interface Props {
  pointageId: string;
  chantierId: string;
  chantierNom: string;
  onComplete: () => void;
}

export function ChecklistQualite({ pointageId, chantierNom, onComplete }: Props) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/employes/checklist?pointage_id=${pointageId}`);
        if (!res.ok) throw new Error("Erreur chargement checklist");
        const data = await res.json();
        if (cancelled) return;

        if (data.checklist) {
          setItems(data.checklist.items as ChecklistItem[]);
        } else if (data.template) {
          setItems(data.template.items as ChecklistItem[]);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger la checklist");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [pointageId]);

  function toggleItem(index: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
    setError(null);
  }

  async function handleValidate() {
    const allChecked = items.every((i) => i.checked);
    if (!allChecked) {
      setError("Complétez tous les points de contrôle");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/employes/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pointage_id: pointageId, items }),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde checklist");
      showToast("Checklist validée", "success");
      onComplete();
    } catch {
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  const checkedCount = items.filter((i) => i.checked).length;
  const total = items.length;
  const progress = total > 0 ? (checkedCount / total) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-[#E50000]" />
        <span className="text-sm text-neutral-500">Chargement de la checklist...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <div>
        <h3 className="text-base font-semibold text-neutral-900">
          Checklist qualité
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">{chantierNom}</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-[#E50000] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-neutral-600 tabular-nums">
          {checkedCount}/{total}
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <label
            key={i}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
              item.checked
                ? "border-green-300 bg-green-50"
                : "border-neutral-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(i)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#E50000]"
            />
            <span
              className={`text-sm ${
                item.checked ? "text-green-800" : "text-neutral-700"
              }`}
            >
              {item.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleValidate}
        disabled={saving}
        className="h-14 rounded-2xl bg-[#E50000] text-base font-semibold text-white disabled:opacity-50"
      >
        {saving ? "Validation…" : "Valider la checklist"}
      </button>
    </div>
  );
}
