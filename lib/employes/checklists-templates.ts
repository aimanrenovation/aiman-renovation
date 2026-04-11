export const CHECKLIST_TEMPLATES: Record<string, { label: string; items: string[] }> = {
  sdb: {
    label: "Salle de bain",
    items: [
      "Étanchéité vérifiée (douche, baignoire)",
      "Joints propres et réguliers",
      "Robinetterie testée (eau chaude/froide)",
      "Évacuations testées (pas de fuite)",
      "Carrelage propre et sans éclats",
      "Nettoyage complet effectué",
    ],
  },
  facade: {
    label: "Façade",
    items: [
      "Enduit uniforme sans défauts",
      "Pas de fissures visibles",
      "Raccords fenêtres/portes propres",
      "Gouttières dégagées",
      "Nettoyage des abords",
    ],
  },
  cuisine: {
    label: "Cuisine",
    items: [
      "Plan de travail bien fixé et de niveau",
      "Raccordements eau/gaz testés",
      "Électricité fonctionnelle (prises, éclairage)",
      "Crédence posée correctement",
      "Nettoyage complet",
    ],
  },
  electricite: {
    label: "Électricité",
    items: [
      "Tous les circuits testés",
      "Tableau électrique conforme",
      "Interrupteurs et prises fonctionnels",
      "Pas de fil apparent",
      "Test différentiel OK",
    ],
  },
  general: {
    label: "Général",
    items: [
      "Travaux conformes au devis",
      "Finitions propres",
      "Zone de travail nettoyée",
      "Déchets évacués",
      "Client informé de l'avancement",
    ],
  },
};

/**
 * Detect the checklist type from the chantier name.
 * Falls back to "general" if no keyword matches.
 */
export function detectChecklistType(chantierNom: string): string {
  const lower = chantierNom.toLowerCase();
  if (lower.includes("sdb") || lower.includes("salle de bain")) return "sdb";
  if (lower.includes("facade") || lower.includes("façade")) return "facade";
  if (lower.includes("cuisine")) return "cuisine";
  if (lower.includes("electri") || lower.includes("électri")) return "electricite";
  return "general";
}
