import type { ZoneConfig, ZoneId } from "./devis-types";

export const ZONES_CONFIG: ZoneConfig[] = [
  // ─── INTÉRIEUR (9 zones) ───────────────────────────────────────────
  {
    id: "salon",
    label: "Salon",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", label: "Sol / Parquet" },
      { id: "murs-peinture", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité" },
      { id: "menuiserie", label: "Menuiserie" },
      { id: "chauffage", label: "Chauffage" },
    ],
    bounds: { x: 160, y: 175, w: 200, h: 160 },
    camera3D: { position: [-3, 3, 5], target: [-2, 0.5, 0] },
  },
  {
    id: "sam",
    label: "Salle à manger",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", label: "Sol / Parquet" },
      { id: "murs-peinture", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité" },
      { id: "menuiserie", label: "Menuiserie" },
      { id: "chauffage", label: "Chauffage" },
    ],
    bounds: { x: 360, y: 175, w: 180, h: 160 },
    camera3D: { position: [0, 3, 5], target: [0, 0.5, 0] },
  },
  {
    id: "cuisine",
    label: "Cuisine",
    category: "interieur",
    workItems: [
      { id: "sol", label: "Sol" },
      { id: "murs-credence", label: "Murs / Crédence" },
      { id: "plomberie-evier", label: "Plomberie / Évier" },
      { id: "electricite", label: "Électricité" },
      { id: "meubles-cuisine", label: "Meubles cuisine" },
      { id: "plan-travail", label: "Plan de travail" },
      { id: "electromenager", label: "Électroménager" },
    ],
    bounds: { x: 160, y: 335, w: 150, h: 130 },
    camera3D: { position: [-3, 3, 3], target: [-2, 0.5, -1] },
  },
  {
    id: "vestibule",
    label: "Vestibule / Entrée",
    category: "interieur",
    workItems: [
      { id: "sol", label: "Sol" },
      { id: "murs-peinture", label: "Murs / Peinture" },
      { id: "porte-entree", label: "Porte d'entrée" },
      { id: "eclairage", label: "Éclairage" },
    ],
    bounds: { x: 310, y: 385, w: 80, h: 80 },
    camera3D: { position: [-1, 2, 4], target: [-0.5, 0.5, 0] },
  },
  {
    id: "wc",
    label: "WC",
    category: "interieur",
    workItems: [
      { id: "sol", label: "Sol" },
      { id: "murs-faience", label: "Murs / Faïence" },
      { id: "wc-suspendu", label: "WC suspendu" },
      { id: "lave-mains", label: "Lave-mains" },
      { id: "plomberie", label: "Plomberie" },
    ],
    bounds: { x: 310, y: 335, w: 80, h: 50 },
    camera3D: { position: [-0.5, 2, 3], target: [-0.5, 0.5, -1] },
  },
  {
    id: "sdb",
    label: "Salle de bain",
    category: "interieur",
    workItems: [
      { id: "sol", label: "Sol" },
      { id: "murs-faience", label: "Murs / Faïence" },
      { id: "douche", label: "Douche" },
      { id: "baignoire", label: "Baignoire" },
      { id: "lavabo", label: "Lavabo" },
      { id: "plomberie", label: "Plomberie" },
      { id: "vmc", label: "VMC" },
      { id: "seche-serviettes", label: "Sèche-serviettes" },
    ],
    bounds: { x: 390, y: 335, w: 150, h: 130 },
    camera3D: { position: [1, 3, 4], target: [0.5, 0.5, -1] },
  },
  {
    id: "chambre1",
    label: "Chambre 1",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", label: "Sol / Parquet" },
      { id: "murs-peinture", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité" },
      { id: "menuiserie", label: "Menuiserie / Fenêtres" },
      { id: "placard", label: "Placard / Rangement" },
    ],
    bounds: { x: 540, y: 335, w: 110, h: 130 },
    camera3D: { position: [2, 3, 4], target: [2, 0.5, -1] },
  },
  {
    id: "chambre2",
    label: "Chambre 2",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", label: "Sol / Parquet" },
      { id: "murs-peinture", label: "Murs / Peinture" },
      { id: "plafond", label: "Plafond" },
      { id: "electricite", label: "Électricité" },
      { id: "menuiserie", label: "Menuiserie / Fenêtres" },
      { id: "placard", label: "Placard / Rangement" },
    ],
    bounds: { x: 540, y: 175, w: 110, h: 160 },
    camera3D: { position: [3, 3, 5], target: [2, 0.5, 0] },
  },
  {
    id: "garage",
    label: "Garage",
    category: "interieur",
    workItems: [
      { id: "sol-resine", label: "Sol / Résine" },
      { id: "murs", label: "Murs" },
      { id: "porte-garage", label: "Porte de garage" },
      { id: "electricite", label: "Électricité" },
      { id: "borne-recharge", label: "Borne de recharge IRVE" },
      { id: "isolation", label: "Isolation" },
    ],
    bounds: { x: 650, y: 175, w: 110, h: 365 },
    camera3D: { position: [4, 3, 5], target: [3, 0.5, 0] },
  },

  // ─── EXTÉRIEUR (5 zones) ──────────────────────────────────────────
  {
    id: "terrasse",
    label: "Terrasse",
    category: "exterieur",
    workItems: [
      { id: "dalle-beton", label: "Dalle béton" },
      { id: "carrelage-ext", label: "Carrelage extérieur" },
      { id: "bois-composite", label: "Bois / Composite" },
      { id: "garde-corps", label: "Garde-corps" },
      { id: "eclairage-ext", label: "Éclairage extérieur" },
    ],
    bounds: { x: 160, y: 540, w: 250, h: 80 },
    camera3D: { position: [-2, 2, 7], target: [-1, 0, 2] },
  },
  {
    id: "jardin",
    label: "Jardin",
    category: "exterieur",
    workItems: [
      { id: "engazonnement", label: "Engazonnement" },
      { id: "plantation", label: "Plantations" },
      { id: "allee-chemin", label: "Allée / Chemin" },
      { id: "eclairage-jardin", label: "Éclairage jardin" },
      { id: "arrosage", label: "Arrosage automatique" },
      { id: "abri-jardin", label: "Abri de jardin" },
    ],
    bounds: { x: 50, y: 100, w: 900, h: 600 },
    camera3D: { position: [0, 6, 10], target: [0, 0, 0] },
  },
  {
    id: "haie",
    label: "Haie / Clôture",
    category: "exterieur",
    workItems: [
      { id: "haie-vegetale", label: "Haie végétale" },
      { id: "cloture-pvc", label: "Clôture PVC / Alu" },
      { id: "grillage", label: "Grillage" },
      { id: "portail", label: "Portail" },
      { id: "portillon", label: "Portillon" },
    ],
    bounds: { x: 30, y: 80, w: 940, h: 640 },
    camera3D: { position: [0, 4, 12], target: [0, 0, 0] },
  },
  {
    id: "facades",
    label: "Façades",
    category: "exterieur",
    workItems: [
      { id: "enduit-facade", label: "Enduit de façade" },
      { id: "peinture-facade", label: "Peinture façade" },
      { id: "ite", label: "Isolation par l'extérieur (ITE)" },
      { id: "volets", label: "Volets" },
      { id: "fenetres", label: "Fenêtres" },
      { id: "traitement-humidite", label: "Traitement humidité" },
    ],
    bounds: { x: 155, y: 170, w: 610, h: 375 },
    camera3D: { position: [0, 3, 8], target: [0, 2, 0] },
  },
  {
    id: "toiture",
    label: "Toiture",
    category: "exterieur",
    workItems: [
      { id: "couverture-tuiles", label: "Couverture / Tuiles" },
      { id: "charpente", label: "Charpente" },
      { id: "isolation-combles", label: "Isolation combles" },
      { id: "gouttieres", label: "Gouttières" },
      { id: "velux", label: "Fenêtre de toit / Velux" },
      { id: "zinguerie", label: "Zinguerie" },
    ],
    bounds: { x: 160, y: 90, w: 600, h: 90 },
    camera3D: { position: [0, 6, 6], target: [0, 4, 0] },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────

export function getZoneConfig(zoneId: ZoneId): ZoneConfig | undefined {
  return ZONES_CONFIG.find((z) => z.id === zoneId);
}

export function getZonesWithWorks(
  selectedWorks: Record<ZoneId, string[]>,
): ZoneConfig[] {
  return ZONES_CONFIG.filter(
    (z) => selectedWorks[z.id] && selectedWorks[z.id].length > 0,
  );
}
