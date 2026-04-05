"use client";

import { DevisBlueprint } from "./devis-blueprint";
import { BlueprintInteractive } from "./blueprint/blueprint-interactive";

export function DevisPageContent() {
  return <DevisBlueprint BlueprintComponent={BlueprintInteractive} />;
}
