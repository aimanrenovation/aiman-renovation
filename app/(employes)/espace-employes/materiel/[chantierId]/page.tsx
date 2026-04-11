"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { MaterielSuivi } from "@/components/employes/materiel-suivi";
import { MaterielBilan } from "@/components/employes/materiel-bilan";

export default function MaterielChantierPage(props: {
  params: Promise<{ chantierId: string }>;
}) {
  const { chantierId } = use(props.params);
  const [chantierNom, setChantierNom] = useState("");
  const [showBilan, setShowBilan] = useState(false);

  useEffect(() => {
    // Fetch chantier name from suivi data or fallback
    fetch(`/api/employes/materiel/suivi?chantier_id=${chantierId}`)
      .then((r) => r.json())
      .then(() => {
        // Name will be displayed from the suivi component
      })
      .catch(() => {});
  }, [chantierId]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <a
          href="/espace-employes/materiel"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors active:bg-neutral-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </a>
        <h1 className="text-xl font-bold truncate">Suivi materiel</h1>
      </div>

      {/* Toggle suivi / bilan */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowBilan(false)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            !showBilan
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Suivi
        </button>
        <button
          onClick={() => setShowBilan(true)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            showBilan
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          Bilan
        </button>
      </div>

      {showBilan ? (
        <MaterielBilan chantierId={chantierId} />
      ) : (
        <MaterielSuivi chantierId={chantierId} chantierNom={chantierNom} />
      )}
    </div>
  );
}
