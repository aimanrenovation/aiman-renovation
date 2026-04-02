import type { ZoneConfig } from "./devis-types";

export const ZONES_CONFIG: ZoneConfig[] = [
  {
    id: "cuisine",
    label: "Cuisine",
    icon: "ChefHat",
    cameraPosition: [2, 2, 4],
    cameraTarget: [0, 0.5, 0],
    problems: [
      { id: "murs-fissures", label: "Murs fissures", position3D: [-1, 1.5, 0] },
      { id: "carrelage-casse", label: "Carrelage casse", position3D: [0, 0.1, 1] },
      { id: "electricite-vetuste", label: "Electricite vetuste", position3D: [1, 2, 0] },
      { id: "plomberie-defaillante", label: "Plomberie defaillante", position3D: [-0.5, 0.5, 0.5] },
      { id: "meubles-abimes", label: "Meubles abimes", position3D: [0.5, 1, -0.5] },
    ],
    renovationOptions: [
      { id: "nouveau-carrelage", label: "Nouveau carrelage", description: "Pose de carrelage moderne" },
      { id: "peinture-murs", label: "Peinture murs", description: "Peinture fraiche et finitions" },
      { id: "electricite-normes", label: "Electricite aux normes", description: "Mise aux normes electriques" },
      { id: "plomberie-neuve", label: "Plomberie neuve", description: "Remplacement tuyauterie" },
      { id: "meubles-cuisine", label: "Mobilier de cuisine", description: "Cuisine equipee moderne" },
    ],
  },
  {
    id: "salle-de-bain",
    label: "Salle de bain",
    icon: "Bath",
    cameraPosition: [-2, 2, 4],
    cameraTarget: [0, 0.5, 0],
    problems: [
      { id: "carrelage-fissure", label: "Carrelage fissure", position3D: [0, 0.1, 1] },
      { id: "joints-moisis", label: "Joints moisis", position3D: [1, 1, 0] },
      { id: "robinetterie-vetuste", label: "Robinetterie vetuste", position3D: [-0.5, 1, 0.5] },
      { id: "ventilation-absente", label: "Ventilation absente", position3D: [0, 2, -0.5] },
      { id: "baignoire-abimee", label: "Baignoire / douche abimee", position3D: [0.5, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "douche-italienne", label: "Douche a l'italienne", description: "Douche moderne sans seuil" },
      { id: "carrelage-sdb", label: "Nouveau carrelage", description: "Carrelage sol et murs" },
      { id: "meuble-vasque", label: "Meuble vasque", description: "Meuble vasque contemporain" },
      { id: "robinetterie", label: "Robinetterie neuve", description: "Mitigeurs et douchette neufs" },
      { id: "vmc", label: "VMC", description: "Ventilation mecanique controlee" },
    ],
  },
  {
    id: "facade",
    label: "Facade / Isolation",
    icon: "Building",
    cameraPosition: [0, 3, 8],
    cameraTarget: [0, 2, 0],
    problems: [
      { id: "enduit-decolle", label: "Enduit decolle", position3D: [-2, 3, 0] },
      { id: "fissures-facade", label: "Fissures facade", position3D: [1, 2, 0] },
      { id: "isolation-absente", label: "Isolation absente", position3D: [0, 1.5, 0] },
      { id: "humidite", label: "Problemes d'humidite", position3D: [-1, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "ite", label: "Isolation par l'exterieur (ITE)", description: "Isolation thermique facade" },
      { id: "enduit-facade", label: "Enduit de facade", description: "Ravalement complet" },
      { id: "peinture-facade", label: "Peinture facade", description: "Mise en peinture exterieure" },
      { id: "traitement-humidite", label: "Traitement humidite", description: "Traitement des remontees capillaires" },
    ],
  },
  {
    id: "toit",
    label: "Toiture",
    icon: "Home",
    cameraPosition: [0, 6, 6],
    cameraTarget: [0, 4, 0],
    problems: [
      { id: "tuiles-cassees", label: "Tuiles cassees", position3D: [0, 4.5, 0] },
      { id: "charpente-abimee", label: "Charpente abimee", position3D: [-1, 4, 0] },
      { id: "gouttiere-defaillante", label: "Gouttiere defaillante", position3D: [2, 3, 0] },
      { id: "isolation-combles", label: "Isolation combles absente", position3D: [0, 3.5, 0] },
    ],
    renovationOptions: [
      { id: "refection-toiture", label: "Refection toiture", description: "Remplacement couverture complete" },
      { id: "isolation-toiture", label: "Isolation toiture", description: "Isolation sous rampants ou combles" },
      { id: "gouttiere-neuve", label: "Gouttieres neuves", description: "Remplacement gouttieres et descentes" },
      { id: "velux", label: "Fenetre de toit", description: "Pose de Velux" },
    ],
  },
  {
    id: "garage",
    label: "Garage",
    icon: "Car",
    cameraPosition: [4, 2, 4],
    cameraTarget: [2, 1, 0],
    problems: [
      { id: "sol-abime", label: "Sol abime", position3D: [2, 0.1, 1] },
      { id: "porte-defaillante", label: "Porte defaillante", position3D: [3, 1.5, 0] },
      { id: "electricite-garage", label: "Electricite vetuste", position3D: [1.5, 2, 0] },
      { id: "humidite-garage", label: "Humidite", position3D: [2.5, 0.5, 0] },
    ],
    renovationOptions: [
      { id: "sol-resine", label: "Sol resine", description: "Revetement sol resine epoxy" },
      { id: "porte-garage", label: "Porte de garage", description: "Porte sectionnelle motorisee" },
      { id: "borne-recharge", label: "Borne de recharge IRVE", description: "Installation borne vehicule electrique" },
      { id: "electricite-garage-opt", label: "Electricite aux normes", description: "Mise aux normes electrique" },
    ],
  },
  {
    id: "exterieur",
    label: "Exterieur / Jardin",
    icon: "Trees",
    cameraPosition: [-4, 3, 6],
    cameraTarget: [-2, 0, 0],
    problems: [
      { id: "terrain-friche", label: "Terrain en friche", position3D: [-3, 0.1, 2] },
      { id: "cloture-abimee", label: "Cloture abimee", position3D: [-4, 1, 0] },
      { id: "terrasse-degradee", label: "Terrasse degradee", position3D: [-2, 0.2, 1] },
      { id: "eclairage-absent", label: "Eclairage absent", position3D: [-1, 1.5, 1] },
    ],
    renovationOptions: [
      { id: "amenagement-jardin", label: "Amenagement jardin", description: "Creation espaces verts" },
      { id: "terrasse", label: "Terrasse", description: "Construction terrasse bois ou carrelage" },
      { id: "cloture-neuve", label: "Cloture neuve", description: "Pose cloture et portail" },
      { id: "eclairage-ext", label: "Eclairage exterieur", description: "Mise en lumiere du jardin" },
    ],
  },
];

export function getZoneConfig(zoneId: string): ZoneConfig | undefined {
  return ZONES_CONFIG.find((z) => z.id === zoneId);
}
