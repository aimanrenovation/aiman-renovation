import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/middleware";

import type { FicheMission } from "@/lib/employes/types-mission";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function fallbackMission(id: string): FicheMission {
  return {
    chantierId: id,
    chantierNom: "Rénovation appartement Haussmannien",
    adresse: "12 rue de Rivoli",
    ville: "Paris",
    codePostal: "75001",
    lat: 48.8606,
    lng: 2.3376,
    clientNom: "M. Dupont",
    description:
      "Rénovation complète d'un appartement de 85 m² — dépose, plomberie, électricité, plâtrerie, peinture et sols.",
    etapes: [
      { numero: 1, titre: "Protection des sols", description: "Bâches + scotch sur parquet existant", done: true },
      { numero: 2, titre: "Dépose cloisons", description: "Abattre cloison cuisine / salon", done: true },
      { numero: 3, titre: "Passage gaines élec", description: "Saignées + gaines ICTA", done: false },
      { numero: 4, titre: "Plomberie", description: "Reprise alimentation + évacuation cuisine", done: false },
      { numero: 5, titre: "Plâtrerie", description: "BA13 sur rails + bandes", done: false },
    ],
    materiel: [
      { nom: "Plaques BA13 (lot 10)", quantite: 4, checked: false },
      { nom: "Rails R48", quantite: 20, checked: false },
      { nom: "Gaine ICTA 20mm (100m)", quantite: 2, checked: true },
      { nom: "Sac enduit (25kg)", quantite: 6, checked: false },
    ],
    photos: [
      { url: "/placeholder-photo-1.jpg", caption: "Vue salon avant dépose" },
      { url: "/placeholder-photo-2.jpg", caption: "Cuisine existante" },
    ],
    documents: [
      { nom: "Plan architecte v2", url: "#", type: "pdf" },
      { nom: "Devis validé client", url: "#", type: "pdf" },
      { nom: "Fiche technique BA13", url: "#", type: "pdf" },
    ],
    contraintes: [
      "Immeuble classé — pas de percement façade",
      "Travaux bruyants interdits 12h-14h (règlement copro)",
      "Stationnement livraison : badge gardien nécessaire",
    ],
    tempsTrajet: { minutes: 35, km: 18 },
    meteo: { temp: 14, conditions: "Couvert", alerte: undefined },
  };
}

export const GET = requireAuth<RouteContext>(async (_request, ctx, _session) => {
  const { id } = await ctx.params;
  const apiUrl = process.env.JARVIS_API_URL;

  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/api/mission/${id}`, {
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data: FicheMission = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // API indisponible — fallback dev ci-dessous
    }
  }

  return NextResponse.json(fallbackMission(id));
});
