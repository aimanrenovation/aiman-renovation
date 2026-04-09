"use client";

import { ExportControls } from "@/components/employes/admin/export-controls";

export default function ExportPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Export des donnees</h1>
        <p className="mt-1 text-sm text-gray-400">
          Telecharger les heures, pointages ou generer un recapitulatif PDF.
        </p>
      </div>
      <ExportControls />
    </div>
  );
}
