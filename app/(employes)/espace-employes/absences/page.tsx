"use client";

import { useState } from "react";
import { AbsenceSolde } from "@/components/employes/absence-solde";
import { AbsenceForm } from "@/components/employes/absence-form";
import { AbsenceList } from "@/components/employes/absence-list";

export default function AbsencesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-lg font-bold text-neutral-900">Absences</h1>

      <AbsenceSolde />

      <AbsenceForm onSuccess={() => setRefreshKey((k) => k + 1)} />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">Mes demandes</h2>
        <AbsenceList refreshKey={refreshKey} />
      </div>
    </div>
  );
}
