"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { canRender3D } from "./gpu-detector";
import { DevisWizard2D } from "./devis-wizard-2d";

// Import dynamique du wizard 3D (evite le chargement de Three.js si inutile)
const DevisWizard3D = dynamic(
  () => import("./devis-wizard-3d").then((mod) => ({ default: mod.DevisWizard3D })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Chargement de l&apos;experience 3D...</p>
        </div>
      </div>
    ),
  }
);

export function DevisPageContent() {
  const [use3D, setUse3D] = useState<boolean | null>(null);

  useEffect(() => {
    setUse3D(canRender3D());
  }, []);

  // En attente de detection
  if (use3D === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#E50000] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback 2D
  if (!use3D) {
    return <DevisWizard2D />;
  }

  // Experience 3D
  return <DevisWizard3D />;
}
