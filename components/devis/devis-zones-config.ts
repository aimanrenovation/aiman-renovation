import type { ZoneConfig, ZoneId } from "./devis-types";

export const ZONES_CONFIG: ZoneConfig[] = [
  // --- INTERIEUR (9 zones) --- Layout Gemini blueprint ---
  {
    id: "cuisine",
    labelKey: "cuisine",
    category: "interieur",
    workItems: [
      { id: "sol", labelKey: "sol" },
      { id: "murs-credence", labelKey: "murs-credence" },
      { id: "plomberie-evier", labelKey: "plomberie-evier" },
      { id: "electricite", labelKey: "electricite" },
      { id: "meubles-cuisine", labelKey: "meubles-cuisine" },
      { id: "plan-travail", labelKey: "plan-travail" },
      { id: "electromenager", labelKey: "electromenager" },
    ],
    bounds: { x: 130, y: 100, w: 260, h: 190 },
    camera3D: { position: [-5, 8, -3], target: [-5, 0, -3] },
  },
  {
    id: "sdb",
    labelKey: "sdb",
    category: "interieur",
    workItems: [
      { id: "sol", labelKey: "sol" },
      { id: "murs-faience", labelKey: "murs-faience" },
      { id: "douche", labelKey: "douche" },
      { id: "baignoire", labelKey: "baignoire" },
      { id: "lavabo", labelKey: "lavabo" },
      { id: "plomberie", labelKey: "plomberie" },
      { id: "vmc", labelKey: "vmc" },
      { id: "seche-serviettes", labelKey: "seche-serviettes" },
    ],
    bounds: { x: 390, y: 100, w: 90, h: 190 },
    camera3D: { position: [-1, 6, -3], target: [-1, 0, -3] },
  },
  {
    id: "wc",
    labelKey: "wc",
    category: "interieur",
    workItems: [
      { id: "sol", labelKey: "sol" },
      { id: "murs-faience", labelKey: "murs-faience" },
      { id: "wc-suspendu", labelKey: "wc-suspendu" },
      { id: "lave-mains", labelKey: "lave-mains" },
      { id: "plomberie", labelKey: "plomberie" },
    ],
    bounds: { x: 480, y: 100, w: 60, h: 190 },
    camera3D: { position: [0, 5, -3], target: [0, 0, -3] },
  },
  {
    id: "garage",
    labelKey: "garage",
    category: "interieur",
    workItems: [
      { id: "sol-resine", labelKey: "sol-resine" },
      { id: "murs", labelKey: "murs" },
      { id: "porte-garage", labelKey: "porte-garage" },
      { id: "electricite", labelKey: "electricite" },
      { id: "borne-recharge", labelKey: "borne-recharge" },
      { id: "isolation", labelKey: "isolation" },
    ],
    bounds: { x: 540, y: 100, w: 290, h: 190 },
    camera3D: { position: [4, 8, -3], target: [4, 0, -3] },
  },
  {
    id: "salon",
    labelKey: "salon",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", labelKey: "sol-parquet" },
      { id: "murs-peinture", labelKey: "murs-peinture" },
      { id: "plafond", labelKey: "plafond" },
      { id: "electricite", labelKey: "electricite" },
      { id: "menuiserie", labelKey: "menuiserie" },
      { id: "chauffage", labelKey: "chauffage" },
    ],
    bounds: { x: 130, y: 340, w: 180, h: 170 },
    camera3D: { position: [-5, 8, 3], target: [-5, 0, 3] },
  },
  {
    id: "sam",
    labelKey: "sam",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", labelKey: "sol-parquet" },
      { id: "murs-peinture", labelKey: "murs-peinture" },
      { id: "plafond", labelKey: "plafond" },
      { id: "electricite", labelKey: "electricite" },
      { id: "menuiserie", labelKey: "menuiserie" },
      { id: "chauffage", labelKey: "chauffage" },
    ],
    bounds: { x: 310, y: 340, w: 130, h: 170 },
    camera3D: { position: [-2, 8, 3], target: [-2, 0, 3] },
  },
  {
    id: "chambre1",
    labelKey: "chambre1",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", labelKey: "sol-parquet" },
      { id: "murs-peinture", labelKey: "murs-peinture" },
      { id: "plafond", labelKey: "plafond" },
      { id: "electricite", labelKey: "electricite" },
      { id: "menuiserie", labelKey: "menuiserie" },
      { id: "placard", labelKey: "placard" },
    ],
    bounds: { x: 440, y: 340, w: 160, h: 170 },
    camera3D: { position: [1, 8, 3], target: [1, 0, 3] },
  },
  {
    id: "chambre2",
    labelKey: "chambre2",
    category: "interieur",
    workItems: [
      { id: "sol-parquet", labelKey: "sol-parquet" },
      { id: "murs-peinture", labelKey: "murs-peinture" },
      { id: "plafond", labelKey: "plafond" },
      { id: "electricite", labelKey: "electricite" },
      { id: "menuiserie", labelKey: "menuiserie" },
      { id: "placard", labelKey: "placard" },
    ],
    bounds: { x: 600, y: 340, w: 230, h: 170 },
    camera3D: { position: [5, 8, 3], target: [5, 0, 3] },
  },
  {
    id: "vestibule",
    labelKey: "vestibule",
    category: "interieur",
    workItems: [
      { id: "sol", labelKey: "sol" },
      { id: "murs-peinture", labelKey: "murs-peinture" },
      { id: "porte-entree", labelKey: "porte-entree" },
      { id: "eclairage", labelKey: "eclairage" },
    ],
    bounds: { x: 200, y: 290, w: 100, h: 50 },
    camera3D: { position: [-4, 5, 0], target: [-4, 0, 0] },
  },

  // --- EXTERIEUR (5 zones) ---
  {
    id: "terrasse",
    labelKey: "terrasse",
    category: "exterieur",
    workItems: [
      { id: "dalle-beton", labelKey: "dalle-beton" },
      { id: "carrelage-ext", labelKey: "carrelage-ext" },
      { id: "bois-composite", labelKey: "bois-composite" },
      { id: "garde-corps", labelKey: "garde-corps" },
      { id: "eclairage-ext", labelKey: "eclairage-ext" },
    ],
    bounds: { x: 130, y: 515, w: 700, h: 65 },
    camera3D: { position: [0, 6, 6], target: [0, 0, 5] },
  },
  {
    id: "jardin",
    labelKey: "jardin",
    category: "exterieur",
    workItems: [
      { id: "entretien-jardin", labelKey: "entretien-jardin" },
      { id: "engazonnement", labelKey: "engazonnement" },
      { id: "plantation", labelKey: "plantation" },
      { id: "allee-chemin", labelKey: "allee-chemin" },
      { id: "eclairage-jardin", labelKey: "eclairage-jardin" },
      { id: "arrosage", labelKey: "arrosage" },
      { id: "abri-jardin", labelKey: "abri-jardin" },
    ],
    bounds: { x: 50, y: 40, w: 900, h: 640 },
    camera3D: { position: [0, 20, 0], target: [0, 0, 0] },
  },
  {
    id: "haie",
    labelKey: "haie",
    category: "exterieur",
    workItems: [
      { id: "haie-vegetale", labelKey: "haie-vegetale" },
      { id: "cloture-pvc", labelKey: "cloture-pvc" },
      { id: "grillage", labelKey: "grillage" },
      { id: "portail", labelKey: "portail" },
      { id: "portillon", labelKey: "portillon" },
    ],
    bounds: { x: 42, y: 32, w: 916, h: 656 },
    camera3D: { position: [0, 22, 0], target: [0, 0, 0] },
  },
  {
    id: "facades",
    labelKey: "facades",
    category: "exterieur",
    workItems: [
      { id: "enduit-facade", labelKey: "enduit-facade" },
      { id: "peinture-facade", labelKey: "peinture-facade" },
      { id: "ite", labelKey: "ite" },
      { id: "volets", labelKey: "volets" },
      { id: "fenetres", labelKey: "fenetres" },
      { id: "traitement-humidite", labelKey: "traitement-humidite" },
    ],
    bounds: { x: 125, y: 95, w: 710, h: 420 },
    camera3D: { position: [0, 8, 10], target: [0, 2, 0] },
  },
  {
    id: "toiture",
    labelKey: "toiture",
    category: "exterieur",
    workItems: [
      { id: "couverture-tuiles", labelKey: "couverture-tuiles" },
      { id: "charpente", labelKey: "charpente" },
      { id: "isolation-combles", labelKey: "isolation-combles" },
      { id: "gouttieres", labelKey: "gouttieres" },
      { id: "velux", labelKey: "velux" },
      { id: "zinguerie", labelKey: "zinguerie" },
    ],
    bounds: { x: 125, y: 95, w: 710, h: 420 },
    camera3D: { position: [0, 20, 5], target: [0, 5, 0] },
  },
];

// --- Helpers ---

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
