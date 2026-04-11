"use client";

import { useCallback, useEffect, useState } from "react";
import { showToast } from "@/lib/employes/use-toast";

interface BilanItem {
  id: string;
  materiau: string;
  prevu: number;
  utilise: number;
  unite: string;
  ecart: number;
  gaspillage: boolean;
}

interface BilanData {
  items: BilanItem[];
  totalGaspillage: number;
  totalEconomie: number;
}

interface Props {
  chantierId: string;
}

export function MaterielBilan({ chantierId }: Props) {
  const [data, setData] = useState<BilanData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBilan = useCallback(async () => {
    try {
      const res = await fetch(`/api/employes/materiel/suivi/bilan?chantier_id=${chantierId}`);
      if (res.ok) {
        setData(await res.json());
      } else {
        showToast("Erreur de chargement du bilan", "error");
      }
    } catch {
      showToast("Erreur reseau", "error");
    } finally {
      setLoading(false);
    }
  }, [chantierId]);

  useEffect(() => {
    fetchBilan();
  }, [fetchBilan]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-8 text-center">
        <p className="text-sm text-neutral-500">Aucun materiau a afficher dans le bilan.</p>
      </div>
    );
  }

  // Score global : % ecart moyen
  const totalItems = data.items.length;
  const ecartMoyenPct =
    totalItems > 0
      ? data.items.reduce((acc, item) => {
          if (item.prevu === 0) return acc;
          return acc + ((item.utilise - item.prevu) / item.prevu) * 100;
        }, 0) / data.items.filter((i) => i.prevu > 0).length || 0
      : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#E50000]">{data.totalGaspillage}</div>
          <div className="mt-1 text-xs text-neutral-500">Gaspillage</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">{data.totalEconomie}</div>
          <div className="mt-1 text-xs text-neutral-500">Economie</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">
          <div
            className={`text-2xl font-bold ${
              ecartMoyenPct > 0 ? "text-[#E50000]" : ecartMoyenPct < 0 ? "text-green-600" : "text-neutral-600"
            }`}
          >
            {ecartMoyenPct > 0 ? "+" : ""}
            {ecartMoyenPct.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-neutral-500">Ecart moyen</div>
        </div>
      </div>

      {/* Progress bars per materiau */}
      <div className="flex flex-col gap-3">
        {data.items.map((item) => {
          const pct = item.prevu > 0 ? (item.utilise / item.prevu) * 100 : 0;
          const isOver = pct > 100;
          const barWidth = Math.min(pct, 100);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{item.materiau}</div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.gaspillage
                      ? "bg-red-50 text-[#E50000]"
                      : item.ecart < 0
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {item.ecart > 0 ? "+" : ""}
                  {item.ecart} {item.unite}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-neutral-500 mb-1">
                  <span>{item.utilise} / {item.prevu} {item.unite}</span>
                  <span>{pct.toFixed(0)}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? "bg-[#E50000]" : "bg-green-500"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>

              {/* Overflow indicator */}
              {isOver && (
                <div className="mt-2 text-xs text-[#E50000] font-medium">
                  Depassement de {(pct - 100).toFixed(0)}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary text */}
      <div className="rounded-2xl bg-neutral-50 p-4 text-center text-sm text-neutral-600">
        {data.totalGaspillage > 0 && (
          <span className="text-[#E50000] font-medium">
            {data.totalGaspillage} materiau{data.totalGaspillage > 1 ? "x" : ""} en gaspillage
          </span>
        )}
        {data.totalGaspillage > 0 && data.totalEconomie > 0 && <span> &middot; </span>}
        {data.totalEconomie > 0 && (
          <span className="text-green-700 font-medium">
            {data.totalEconomie} en economie
          </span>
        )}
        {data.totalGaspillage === 0 && data.totalEconomie === 0 && (
          <span>Tous les materiaux sont dans les previsions.</span>
        )}
      </div>
    </div>
  );
}
