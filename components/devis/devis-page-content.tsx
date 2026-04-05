"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { canRender3D } from "./gpu-detector";
import { DevisBlueprint } from "./devis-blueprint";
import { Blueprint2D } from "./blueprint/blueprint-2d";

const Blueprint3D = dynamic(
  () =>
    import("./blueprint/blueprint-3d").then((mod) => ({
      default: mod.Blueprint3D,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E50000] border-t-transparent" />
          <p className="text-lg text-white">
            Chargement de l&apos;experience 3D...
          </p>
        </div>
      </div>
    ),
  },
);

export function DevisPageContent() {
  const [use3D, setUse3D] = useState<boolean | null>(null);

  useEffect(() => {
    setUse3D(canRender3D());
  }, []);

  // Detection in progress
  if (use3D === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0A0A]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E50000] border-t-transparent" />
      </div>
    );
  }

  return (
    <DevisBlueprint BlueprintComponent={use3D ? Blueprint3D : Blueprint2D} />
  );
}
