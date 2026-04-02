export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  features: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "cuisine",
    title: "Rénovation de cuisine",
    shortTitle: "Cuisine",
    description: "Transformez votre cuisine en un espace moderne et fonctionnel. Du plan de travail aux finitions, nous prenons en charge l'intégralité de votre projet.",
    icon: "🍳",
    features: ["Démolition et dépose", "Plomberie et électricité", "Pose de meubles et plan de travail", "Carrelage et crédence", "Peinture et finitions"],
  },
  {
    slug: "salle-de-bain",
    title: "Rénovation salle de bain",
    shortTitle: "Salle de bain",
    description: "Créez la salle de bain de vos rêves. Douche à l'italienne, baignoire, vasque design — nous réalisons tous les styles.",
    icon: "🚿",
    features: ["Plomberie complète", "Étanchéité et isolation", "Carrelage mural et sol", "Installation sanitaires", "Ventilation"],
  },
  {
    slug: "electricite",
    title: "Électricité",
    shortTitle: "Électricité",
    description: "Mise aux normes, rénovation complète ou extension de votre installation électrique. Sécurité et conformité garanties.",
    icon: "⚡",
    features: ["Mise aux normes NF C 15-100", "Tableau électrique", "Prises et interrupteurs", "Éclairage LED", "Domotique"],
  },
  {
    slug: "plomberie",
    title: "Plomberie",
    shortTitle: "Plomberie",
    description: "Installation et rénovation de vos réseaux d'eau. Du remplacement de tuyauterie à la création de nouveaux points d'eau.",
    icon: "🔧",
    features: ["Remplacement tuyauterie", "Installation chauffe-eau", "Création points d'eau", "Réparation fuites", "Raccordements"],
  },
  {
    slug: "carrelage",
    title: "Carrelage et revêtement de sol",
    shortTitle: "Carrelage",
    description: "Pose de carrelage, parquet, vinyle ou béton ciré. Un sol neuf transforme une pièce entière.",
    icon: "🏗️",
    features: ["Carrelage intérieur/extérieur", "Parquet massif et stratifié", "Vinyle et PVC", "Béton ciré", "Ragréage et préparation"],
  },
  {
    slug: "facade-isolation",
    title: "Façades et isolation",
    shortTitle: "Façades",
    description: "Ravalement de façade, isolation thermique par l'extérieur (ITE) ou l'intérieur (ITI). Améliorez le confort et réduisez vos factures.",
    icon: "🏛️",
    features: ["Ravalement de façade", "ITE", "ITI", "Enduit et crépi", "Peinture extérieure"],
  },
  {
    slug: "paysager",
    title: "Aménagement paysager",
    shortTitle: "Paysager",
    description: "Conception et réalisation de vos espaces extérieurs. Terrasses, allées, plantations, clôtures.",
    icon: "🌿",
    features: ["Création de terrasses", "Allées et bordures", "Plantations et engazonnement", "Clôtures et portails", "Éclairage extérieur"],
  },
  {
    slug: "peinture-finitions",
    title: "Peinture et finitions",
    shortTitle: "Peinture",
    description: "Peinture intérieure et extérieure, enduits décoratifs, papier peint. La touche finale qui fait toute la différence.",
    icon: "🎨",
    features: ["Peinture intérieure", "Peinture extérieure", "Enduits décoratifs", "Papier peint", "Préparation des supports"],
  },
  {
    slug: "borne-recharge",
    title: "Borne de recharge véhicule électrique",
    shortTitle: "Borne IRVE",
    description: "Installation de bornes de recharge pour véhicules électriques. À domicile ou en copropriété.",
    icon: "🔌",
    features: ["Borne murale (wallbox)", "Installation en copropriété", "Mise aux normes", "Certification IRVE", "Aide et subventions"],
  },
  {
    slug: "panneaux-photovoltaiques",
    title: "Panneaux photovoltaïques",
    shortTitle: "Photovoltaïque",
    description: "Produisez votre propre électricité. Installation de panneaux solaires sur toiture.",
    icon: "☀️",
    features: ["Étude de faisabilité", "Installation sur toiture", "Raccordement réseau", "Autoconsommation", "Aide et subventions"],
  },
];
