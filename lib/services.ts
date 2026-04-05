export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  features: string[];
  longDescription: string;
  process: { step: string; detail: string }[];
  whyPro: string;
  priceRange: string;
}

export const PHOTO_MAP: Record<string, string> = {
  "cuisine": "/images/photo-cuisine.jpg",
  "salle-de-bain": "/images/photo-salle-de-bain.jpg",
  "electricite": "/images/photo-electricite.jpg",
  "plomberie": "/images/photo-plomberie.jpg",
  "carrelage": "/images/photo-carrelage.jpg",
  "facade-isolation": "/images/photo-facade.jpg",
  "paysager": "/images/photo-paysager.jpg",
  "peinture-finitions": "/images/photo-peinture.jpg",
  "borne-recharge": "/images/photo-borne-recharge.jpg",
  "panneaux-photovoltaiques": "/images/photo-photovoltaique.jpg",
  "entretien-exterieur": "/images/photo-entretien-exterieur.jpg",
  "depannage-urgence": "/images/photo-depannage.jpg",
};

export const ICON_MAP: Record<string, string> = {
  "cuisine": "/images/icon-cuisine.png",
  "salle-de-bain": "/images/icon-salle-de-bain.png",
  "electricite": "/images/icon-electricite.png",
  "plomberie": "/images/icon-plomberie.png",
  "carrelage": "/images/icon-carrelage.png",
  "facade-isolation": "/images/icon-facade.png",
  "paysager": "/images/icon-paysager.png",
  "peinture-finitions": "/images/icon-peinture.png",
  "borne-recharge": "/images/icon-borne-recharge.png",
  "panneaux-photovoltaiques": "/images/icon-photovoltaique.png",
};

export const SERVICES: Service[] = [
  {
    slug: "cuisine",
    title: "Rénovation de cuisine",
    shortTitle: "Cuisine",
    description:
      "Transformez votre cuisine en un espace moderne et fonctionnel. Du plan de travail aux finitions, nous prenons en charge l'intégralité de votre projet.",
    icon: "🍳",
    features: [
      "Démolition et dépose",
      "Plomberie et électricité",
      "Pose de meubles et plan de travail",
      "Carrelage et crédence",
      "Peinture et finitions",
    ],
    longDescription:
      "La cuisine est le coeur de votre maison — l'endroit où l'on prépare, partage et se retrouve. Chez Aiman Renovation, nous concevons des cuisines qui allient esthétique et praticité, adaptées à votre mode de vie et à votre budget. Que vous souhaitiez une cuisine ouverte sur le séjour, un îlot central, ou simplement moderniser vos façades et plan de travail, nous vous accompagnons de A à Z.\n\nNos équipes maîtrisent tous les corps de métier nécessaires : plomberie, électricité, carrelage, menuiserie, peinture. Nous coordonnons l'ensemble du chantier pour vous offrir un résultat clé en main, sans que vous ayez à gérer plusieurs artisans. Chaque cuisine est pensée sur mesure, en tenant compte de l'agencement existant, de la luminosité et de vos habitudes.\n\nNous travaillons avec des fournisseurs reconnus pour la qualité de leurs matériaux : plans de travail en quartz, granit ou stratifié haute résistance, crédences en faïence ou en verre, robinetterie durable. Le résultat : une cuisine qui dure dans le temps et valorise votre bien.",
    process: [
      { step: "Prise de mesures", detail: "Visite technique pour relever les dimensions exactes et identifier les contraintes (arrivées d'eau, électricité, ventilation)." },
      { step: "Conception du projet", detail: "Plan d'aménagement en 2D/3D, choix des matériaux, coloris et équipements avec vous." },
      { step: "Dépose de l'ancienne cuisine", detail: "Démontage soigné, évacuation des gravats et préparation des murs et sols." },
      { step: "Travaux techniques", detail: "Réfection de la plomberie, mise aux normes électriques, pose du carrelage et de la crédence." },
      { step: "Installation et finitions", detail: "Montage des meubles, pose du plan de travail, raccordements, peinture et nettoyage final." },
    ],
    whyPro:
      "Une rénovation de cuisine implique de la plomberie, de l'électricité, du carrelage et de la menuiserie — autant de métiers qui exigent un savoir-faire précis. Un défaut d'étanchéité sous l'évier, un circuit électrique sous-dimensionné ou un plan de travail mal ajusté peuvent engendrer des problèmes coûteux. Faire appel à un professionnel, c'est la garantie d'un travail conforme aux normes, d'une coordination fluide entre les différents corps de métier et d'un résultat à la hauteur de vos attentes. De plus, notre garantie décennale vous protège pendant 10 ans.",
    priceRange: "8 000 € – 25 000 € selon la superficie et les matériaux choisis",
  },
  {
    slug: "salle-de-bain",
    title: "Rénovation salle de bain",
    shortTitle: "Salle de bain",
    description:
      "Créez la salle de bain de vos rêves. Douche à l'italienne, baignoire, vasque design — nous réalisons tous les styles.",
    icon: "🚿",
    features: [
      "Plomberie complète",
      "Étanchéité et isolation",
      "Carrelage mural et sol",
      "Installation sanitaires",
      "Ventilation",
    ],
    longDescription:
      "Votre salle de bain doit être un espace de bien-être, fonctionnel et agréable au quotidien. Qu'il s'agisse de remplacer une baignoire vieillissante par une douche à l'italienne, de moderniser le carrelage ou de repenser entièrement l'agencement, Aiman Renovation vous propose des solutions sur mesure adaptées à votre espace et à votre budget.\n\nL'étanchéité est au coeur de nos préoccupations : nous utilisons des systèmes d'étanchéité sous carrelage (SPEC) conformes aux DTU en vigueur, pour vous garantir une salle de bain sans infiltrations pendant des années. Nos plombiers réalisent les raccordements avec soin, en privilégiant des matériaux durables (PER, multicouche).\n\nDe la vasque suspendue au meuble double vasque, du carrelage grand format aux mosaïques, nous vous aidons à choisir les équipements et finitions qui correspondent à vos goûts. Nous installons également des solutions d'accessibilité (barres d'appui, douche plain-pied) pour les personnes à mobilité réduite.",
    process: [
      { step: "Diagnostic et relevé", detail: "Inspection de la plomberie existante, contrôle de l'étanchéité, mesures précises de la pièce." },
      { step: "Choix des équipements", detail: "Sélection des sanitaires, robinetterie, carrelage et accessoires selon vos envies et votre budget." },
      { step: "Dépose et préparation", detail: "Retrait des anciens équipements, mise à nu des murs et sols, vérification des supports." },
      { step: "Plomberie et étanchéité", detail: "Refonte du réseau d'eau chaude/froide et évacuations, pose du système d'étanchéité (SPEC)." },
      { step: "Pose et finitions", detail: "Carrelage mural et sol, installation des sanitaires, joints silicone, peinture et ventilation." },
    ],
    whyPro:
      "La salle de bain est la pièce la plus technique de votre logement. Une mauvaise étanchéité peut entraîner des infiltrations, des moisissures et des dégâts structurels graves. La plomberie doit être irréprochable pour éviter les fuites. Nos artisans maîtrisent les normes DTU et les techniques d'étanchéité sous carrelage. Avec Aiman Renovation, vous bénéficiez d'une garantie décennale et de la tranquillité d'esprit.",
    priceRange: "6 000 € – 18 000 € selon la configuration et les équipements",
  },
  {
    slug: "electricite",
    title: "Électricité",
    shortTitle: "Électricité",
    description:
      "Mise aux normes, rénovation complète ou extension de votre installation électrique. Sécurité et conformité garanties.",
    icon: "⚡",
    features: [
      "Mise aux normes NF C 15-100",
      "Tableau électrique",
      "Prises et interrupteurs",
      "Éclairage LED",
      "Domotique",
    ],
    longDescription:
      "Une installation électrique vétuste ou non conforme représente un risque majeur pour votre sécurité. En Alsace, de nombreux logements anciens nécessitent une mise aux normes pour répondre à la réglementation NF C 15-100. Aiman Renovation prend en charge la rénovation complète ou partielle de votre installation électrique, du tableau aux prises, en passant par l'éclairage.\n\nNous réalisons le diagnostic de votre installation existante, identifions les points de non-conformité et proposons un plan de rénovation adapté. Remplacement du tableau électrique, passage de nouveaux câbles, ajout de prises et interrupteurs, installation d'un éclairage LED performant — chaque intervention est réalisée dans le respect des normes en vigueur.\n\nNous proposons également des solutions de domotique pour piloter votre éclairage, volets roulants et chauffage depuis votre smartphone. Une maison plus intelligente, plus économe et plus confortable.",
    process: [
      { step: "Diagnostic électrique", detail: "Inspection complète de l'installation existante, identification des non-conformités et des risques." },
      { step: "Plan de rénovation", detail: "Schéma électrique détaillé avec positionnement des points lumineux, prises et circuits dédiés." },
      { step: "Travaux de câblage", detail: "Passage des gaines et câbles, encastrement ou pose en apparent selon la configuration." },
      { step: "Installation du tableau", detail: "Pose du nouveau tableau électrique avec disjoncteurs différentiels et protection parafoudre." },
      { step: "Contrôle et mise en service", detail: "Tests de conformité, vérification des terres, mise en service et remise du schéma électrique." },
    ],
    whyPro:
      "L'électricité ne pardonne pas les approximations. Une installation mal réalisée peut provoquer des courts-circuits, des incendies ou des électrocutions. La norme NF C 15-100 impose des règles strictes que seul un professionnel qualifié peut appliquer correctement. De plus, une attestation de conformité (Consuel) est obligatoire pour les rénovations lourdes. Confiez vos travaux électriques à Aiman Renovation pour une installation sûre et conforme.",
    priceRange: "3 000 € – 12 000 € selon l'ampleur de la rénovation (appartement ou maison)",
  },
  {
    slug: "plomberie",
    title: "Plomberie",
    shortTitle: "Plomberie",
    description:
      "Installation et rénovation de vos réseaux d'eau. Du remplacement de tuyauterie à la création de nouveaux points d'eau.",
    icon: "🔧",
    features: [
      "Remplacement tuyauterie",
      "Installation chauffe-eau",
      "Création points d'eau",
      "Réparation fuites",
      "Raccordements",
    ],
    longDescription:
      "La plomberie est l'ossature invisible de votre habitat. Une tuyauterie vétuste en plomb ou en acier galvanisé peut nuire à la qualité de votre eau et provoquer des fuites insidieuses. Aiman Renovation intervient pour rénover, remplacer ou créer vos réseaux d'alimentation et d'évacuation, avec des matériaux modernes et durables.\n\nNous remplaçons les anciennes canalisations par du PER ou du multicouche, installons des chauffe-eau thermodynamiques ou classiques, et créons de nouveaux points d'eau là où vous en avez besoin : buanderie, WC supplémentaire, cuisine d'été. Chaque intervention est pensée pour optimiser votre confort tout en réduisant votre consommation d'eau.\n\nEn copropriété comme en maison individuelle, nous intervenons sur les colonnes montantes, les compteurs divisionnaires et les raccordements au réseau public. Notre connaissance du terrain en Haut-Rhin nous permet de travailler efficacement avec les services des eaux locaux.",
    process: [
      { step: "Diagnostic plomberie", detail: "Inspection visuelle et test de pression pour évaluer l'état du réseau existant." },
      { step: "Proposition technique", detail: "Devis détaillé avec choix des matériaux (PER, multicouche, cuivre) et plan du réseau." },
      { step: "Dépose et remplacement", detail: "Retrait des anciennes canalisations, pose du nouveau réseau avec vannes d'arrêt par zone." },
      { step: "Raccordements", detail: "Branchement des équipements sanitaires, chauffe-eau, machine à laver et lave-vaisselle." },
      { step: "Mise en eau et contrôle", detail: "Tests d'étanchéité sous pression, vérification des débits et absence de fuites." },
    ],
    whyPro:
      "Une fuite d'eau peut causer des dégâts considérables en quelques heures : plafonds endommagés, moisissures, courts-circuits. Les raccordements en plomberie exigent une maîtrise des techniques de soudure, de sertissage et des normes sanitaires. Faire appel à Aiman Renovation, c'est l'assurance d'un réseau fiable, d'une eau saine et d'une couverture par notre garantie décennale en cas de sinistre.",
    priceRange: "2 000 € – 10 000 € selon le nombre de points d'eau et la complexité",
  },
  {
    slug: "carrelage",
    title: "Carrelage et revêtement de sol",
    shortTitle: "Carrelage",
    description:
      "Pose de carrelage, parquet, vinyle ou béton ciré. Un sol neuf transforme une pièce entière.",
    icon: "🏗️",
    features: [
      "Carrelage intérieur/extérieur",
      "Parquet massif et stratifié",
      "Vinyle et PVC",
      "Béton ciré",
      "Ragréage et préparation",
    ],
    longDescription:
      "Le sol est le premier élément que l'on remarque en entrant dans une pièce. Un carrelage bien posé, un parquet chaleureux ou un béton ciré contemporain transforment instantanément l'atmosphère de votre intérieur. Aiman Renovation maîtrise la pose de tous types de revêtements de sol, du carrelage grand format au parquet massif en passant par le vinyle haut de gamme.\n\nChaque chantier commence par une préparation minutieuse du support : ragréage, mise à niveau, traitement de l'humidité si nécessaire. C'est cette étape invisible qui garantit un résultat parfait et durable. Nous posons ensuite le revêtement de votre choix avec une attention particulière aux coupes, aux joints et aux finitions de seuil.\n\nPour l'extérieur, nous réalisons des terrasses en grès cérame, des allées en pierre naturelle et des plages de piscine antidérapantes. Nos carreleurs d'expérience interviennent aussi bien dans les appartements du centre de Saint-Louis que dans les maisons des villages environnants.",
    process: [
      { step: "Évaluation du support", detail: "Contrôle de la planéité, du taux d'humidité et de la solidité du sol existant." },
      { step: "Préparation du support", detail: "Ragréage, primaire d'accrochage, chape fluide si nécessaire pour obtenir un sol parfaitement plan." },
      { step: "Choix du calepinage", detail: "Définition du sens de pose, de la taille des joints et du motif (droit, diagonal, décalé)." },
      { step: "Pose du revêtement", detail: "Collage ou pose flottante selon le matériau, découpes précises autour des obstacles." },
      { step: "Jointage et finitions", detail: "Joints de couleur assortie, plinthes, barres de seuil, nettoyage en profondeur." },
    ],
    whyPro:
      "Un carrelage mal posé se fissure, sonne creux et se décolle en quelques années. La préparation du support, le choix de la colle et le respect des joints de dilatation sont des étapes techniques qui nécessitent un vrai savoir-faire. Nos carreleurs cumulent des années d'expérience et utilisent des outils professionnels (coupe-carreaux diamant, niveau laser) pour un résultat impeccable et garanti.",
    priceRange: "40 € – 120 € / m² pose comprise, selon le type de revêtement",
  },
  {
    slug: "facade-isolation",
    title: "Façades et isolation",
    shortTitle: "Façades",
    description:
      "Ravalement de façade, isolation thermique par l'extérieur (ITE) ou l'intérieur (ITI). Améliorez le confort et réduisez vos factures.",
    icon: "🏛️",
    features: [
      "Ravalement de façade",
      "ITE",
      "ITI",
      "Enduit et crépi",
      "Peinture extérieure",
    ],
    longDescription:
      "En Alsace, les hivers rigoureux rendent l'isolation thermique indispensable. Une façade mal isolée, c'est jusqu'à 25% de déperditions de chaleur et des factures de chauffage qui s'envolent. Aiman Renovation est spécialisé dans le ravalement de façade et l'isolation thermique, que ce soit par l'extérieur (ITE) ou par l'intérieur (ITI).\n\nL'isolation thermique par l'extérieur (ITE) est la solution la plus performante : elle supprime les ponts thermiques, protège la structure du bâtiment contre les intempéries et embellit la façade en même temps. Nous posons des panneaux isolants (polystyrène, laine de roche ou fibre de bois) recouverts d'un enduit de finition dans le coloris de votre choix.\n\nPour les copropriétés, nous réalisons des ravalements complets incluant la réparation des fissures, le traitement des remontées d'humidité et l'application d'enduits respirants adaptés au bâti alsacien. Nos chantiers respectent les réglementations locales et les prescriptions des Architectes des Bâtiments de France quand c'est nécessaire.",
    process: [
      { step: "Diagnostic façade", detail: "Inspection de l'état de la façade, identification des fissures, des infiltrations et des ponts thermiques." },
      { step: "Montage de l'échafaudage", detail: "Installation sécurisée de l'échafaudage avec protection des abords (filets, bâches)." },
      { step: "Préparation des murs", detail: "Nettoyage haute pression, réparation des fissures, traitement anti-mousse et anti-humidité." },
      { step: "Pose de l'isolant", detail: "Fixation mécanique et collage des panneaux isolants, pose des profilés de départ et d'angle." },
      { step: "Finition et enduit", detail: "Application de l'enduit de finition (gratté, taloché ou ribbé), peinture, nettoyage du chantier." },
    ],
    whyPro:
      "L'isolation et le ravalement de façade sont des travaux techniques qui engagent la durabilité de votre bâtiment. Une ITE mal posée peut entraîner des infiltrations, des décollements et une perte d'efficacité thermique. Ces travaux sont éligibles à MaPrimeRénov' et aux CEE, mais uniquement si réalisés par un professionnel qualifié RGE. Aiman Renovation vous accompagne dans le montage des dossiers d'aides pour réduire votre reste à charge.",
    priceRange: "80 € – 200 € / m² pour une ITE complète, 30 € – 80 € / m² pour un ravalement simple",
  },
  {
    slug: "paysager",
    title: "Aménagement paysager",
    shortTitle: "Paysager",
    description:
      "Conception et réalisation de vos espaces extérieurs. Terrasses, allées, plantations, clôtures.",
    icon: "🌿",
    features: [
      "Création de terrasses",
      "Allées et bordures",
      "Plantations et engazonnement",
      "Clôtures et portails",
      "Éclairage extérieur",
    ],
    longDescription:
      "Votre extérieur est la première impression que l'on a de votre maison. Un aménagement paysager bien pensé valorise votre bien, agrandit votre espace de vie et vous offre un cadre agréable tout au long de l'année. Aiman Renovation conçoit et réalise des jardins, terrasses et espaces extérieurs adaptés au climat alsacien et à vos envies.\n\nTerrasse en bois composite, en dalles sur plots ou en pierre naturelle, allées en pavés autobloquants, murets de soutènement, clôtures en aluminium ou en bois — nous maîtrisons tous les matériaux et toutes les techniques. Nous intégrons également l'éclairage extérieur (spots encastrés, bornes, guirlandes LED) pour profiter de votre jardin même en soirée.\n\nNos réalisations tiennent compte du terrain (pente, drainage, nature du sol), de l'exposition et de votre budget. Nous plantons des essences locales résistantes au gel et installons des systèmes d'arrosage automatique si nécessaire. De la pelouse fraîchement semée aux massifs fleuris, votre extérieur prend vie.",
    process: [
      { step: "Étude du terrain", detail: "Analyse du sol, des pentes, du drainage naturel et de l'exposition solaire." },
      { step: "Plan d'aménagement", detail: "Conception du projet avec implantation de la terrasse, des allées, des plantations et de l'éclairage." },
      { step: "Terrassement", detail: "Décaissement, nivellement, pose du géotextile et préparation des fondations." },
      { step: "Construction", detail: "Réalisation de la terrasse, des allées, murets, clôtures et portails." },
      { step: "Plantations et finitions", detail: "Mise en terre des végétaux, engazonnement, installation de l'éclairage et nettoyage." },
    ],
    whyPro:
      "Un aménagement extérieur mal conçu se détériore rapidement : terrasse qui se soulève avec le gel, allée qui s'affaisse, stagnation d'eau. La maîtrise du terrassement, du drainage et des fondations est essentielle pour un résultat durable. Nos équipes connaissent les contraintes spécifiques du climat alsacien (gel, pluies abondantes) et sélectionnent des matériaux adaptés. Garantie décennale incluse sur les ouvrages de maçonnerie paysagère.",
    priceRange: "5 000 € – 30 000 € selon la surface et les aménagements souhaités",
  },
  {
    slug: "peinture-finitions",
    title: "Peinture et finitions",
    shortTitle: "Peinture",
    description:
      "Peinture intérieure et extérieure, enduits décoratifs, papier peint. La touche finale qui fait toute la différence.",
    icon: "🎨",
    features: [
      "Peinture intérieure",
      "Peinture extérieure",
      "Enduits décoratifs",
      "Papier peint",
      "Préparation des supports",
    ],
    longDescription:
      "La peinture est bien plus qu'un coup de rouleau : c'est l'art de sublimer vos espaces. Une peinture appliquée dans les règles de l'art, sur un support parfaitement préparé, transforme radicalement l'ambiance d'une pièce. Aiman Renovation réalise tous vos travaux de peinture intérieure et extérieure avec un soin artisanal.\n\nNous commençons toujours par la préparation des supports : rebouchage des fissures, ponçage, lessivage, application d'un primaire d'accrochage. Cette étape représente 70% du temps de travail et fait toute la différence entre un résultat amateur et un rendu professionnel. Nous utilisons des peintures de marques reconnues (Tollens, Sikkens, Zolpan) avec des finitions mat, satiné ou brillant selon l'effet recherché.\n\nEnduits décoratifs (tadelakt, stuc, béton ciré mural), papier peint design, effets de matière — nous réalisons également des finitions créatives pour donner du caractère à votre intérieur. Pour l'extérieur, nous appliquons des peintures microporeuses qui laissent respirer les murs tout en les protégeant des intempéries.",
    process: [
      { step: "Protection du chantier", detail: "Bâchage des sols et meubles, pose de ruban de masquage sur les encadrements et plinthes." },
      { step: "Préparation des supports", detail: "Rebouchage, ponçage, lessivage, application du primaire. Traitement des taches et moisissures." },
      { step: "Application de la sous-couche", detail: "Première couche d'accroche pour uniformiser le support et optimiser la tenue de la finition." },
      { step: "Couches de finition", detail: "Application de 2 couches de peinture avec un rendu uniforme, sans traces ni coulures." },
      { step: "Retouches et nettoyage", detail: "Vérification sous éclairage rasant, retouches si nécessaire, retrait des protections et nettoyage." },
    ],
    whyPro:
      "Un travail de peinture réussi repose à 70% sur la préparation du support. Sans ponçage, sans rebouchage et sans primaire adaptés, la peinture cloque, s'écaille et jaunit prématurément. Nos peintres professionnels maîtrisent les techniques de préparation, choisissent les produits adaptés à chaque support (plâtre, bois, métal, ciment) et appliquent la peinture avec des outils professionnels pour un rendu impeccable.",
    priceRange: "20 € – 45 € / m² murs et plafonds, préparation et 2 couches comprises",
  },
  {
    slug: "borne-recharge",
    title: "Borne de recharge véhicule électrique",
    shortTitle: "Borne IRVE",
    description:
      "Installation de bornes de recharge pour véhicules électriques. À domicile ou en copropriété.",
    icon: "🔌",
    features: [
      "Borne murale (wallbox)",
      "Installation en copropriété",
      "Mise aux normes",
      "Certification IRVE",
      "Aide et subventions",
    ],
    longDescription:
      "Le véhicule électrique se démocratise et avec lui, le besoin de solutions de recharge fiables à domicile. Aiman Renovation dispose de la certification IRVE (Infrastructure de Recharge pour Véhicule Électrique) et installe des bornes de recharge dans les maisons individuelles comme dans les copropriétés du Haut-Rhin.\n\nNous installons des wallbox de 7,4 kW à 22 kW selon la puissance de votre compteur et vos besoins de recharge. En maison individuelle, l'installation est généralement simple : tirage de câble depuis le tableau, pose de la borne au garage ou en extérieur (IP54). En copropriété, nous prenons en charge l'étude technique, le passage en assemblée générale et le raccordement individuel.\n\nLa certification IRVE est obligatoire pour l'installation de bornes de plus de 3,7 kW et conditionne l'accès aux aides financières. Avec Aiman Renovation, vous bénéficiez d'un installateur certifié, d'un matériel garanti et d'un accompagnement complet pour obtenir le crédit d'impôt (jusqu'à 300 €) et la prime ADVENIR en copropriété.",
    process: [
      { step: "Étude de faisabilité", detail: "Vérification de la puissance du compteur, distance tableau-borne, choix du type de borne adapté." },
      { step: "Devis et aides", detail: "Proposition tarifaire détaillée avec simulation des aides (crédit d'impôt, prime ADVENIR)." },
      { step: "Installation électrique", detail: "Tirage de ligne dédiée depuis le tableau, pose du disjoncteur et du différentiel adaptés." },
      { step: "Pose de la borne", detail: "Fixation murale ou sur pied, raccordement électrique, paramétrage et test de charge." },
      { step: "Mise en service", detail: "Configuration de la borne (puissance, horaires), remise de l'attestation IRVE et du mode d'emploi." },
    ],
    whyPro:
      "L'installation d'une borne de recharge touche à l'électricité haute puissance et nécessite une certification IRVE obligatoire au-delà de 3,7 kW. Un câblage inadapté peut provoquer une surchauffe, un disjoncteur qui saute ou pire, un incendie. La certification IRVE est également une condition pour bénéficier du crédit d'impôt et de la prime ADVENIR. Ne prenez aucun risque : faites appel à un installateur certifié.",
    priceRange: "1 200 € – 2 500 € pose comprise (avant aides), 900 € – 1 800 € après crédit d'impôt",
  },
  {
    slug: "panneaux-photovoltaiques",
    title: "Panneaux photovoltaïques",
    shortTitle: "Photovoltaïque",
    description:
      "Produisez votre propre électricité. Installation de panneaux solaires sur toiture.",
    icon: "☀️",
    features: [
      "Étude de faisabilité",
      "Installation sur toiture",
      "Raccordement réseau",
      "Autoconsommation",
      "Aide et subventions",
    ],
    longDescription:
      "Le Haut-Rhin bénéficie d'un ensoleillement favorable à la production d'énergie solaire, avec plus de 1 700 heures de soleil par an. Installer des panneaux photovoltaïques sur votre toiture, c'est produire votre propre électricité, réduire vos factures et contribuer à la transition énergétique. Aiman Renovation vous accompagne dans cette démarche, de l'étude de faisabilité à la mise en service.\n\nNous installons des panneaux monocristallins de dernière génération, offrant un rendement optimal même par temps nuageux. En autoconsommation avec revente du surplus à EDF OA, vous rentabilisez votre installation en 8 à 12 ans tout en augmentant la valeur de votre bien immobilier. Pour une maison type de 100 m², une installation de 3 kWc (8 panneaux) couvre 30 à 50% de votre consommation annuelle.\n\nLes aides sont nombreuses et cumulables : prime à l'autoconsommation (jusqu'à 1 500 € pour 3 kWc), obligation d'achat EDF OA à tarif garanti pendant 20 ans, TVA réduite à 10% pour les installations de moins de 3 kWc. Nous montons votre dossier complet et gérons les démarches administratives (mairie, Enedis, EDF OA).",
    process: [
      { step: "Étude solaire", detail: "Analyse de l'orientation et de l'inclinaison de votre toiture, calcul du productible et simulation financière." },
      { step: "Démarches administratives", detail: "Déclaration préalable en mairie, demande de raccordement Enedis, contrat EDF OA." },
      { step: "Installation des panneaux", detail: "Pose des rails de fixation, installation des panneaux et des micro-onduleurs sur toiture." },
      { step: "Raccordement électrique", detail: "Câblage, pose du coffret AC/DC, raccordement au tableau et au compteur Linky." },
      { step: "Mise en service", detail: "Test de production, mise en service du monitoring, remise du dossier technique complet." },
    ],
    whyPro:
      "L'installation de panneaux photovoltaïques implique des travaux en toiture (risque de chute) et des raccordements électriques haute tension. Une pose non conforme peut provoquer des infiltrations en toiture, des risques d'incendie ou une production sous-optimale. Pour bénéficier des aides (prime autoconsommation, TVA réduite), l'installation doit être réalisée par un professionnel qualifié RGE. Aiman Renovation gère l'intégralité du projet pour vous.",
    priceRange: "7 000 € – 15 000 € pour 3 à 6 kWc (avant prime autoconsommation de 1 000 € à 2 500 €)",
  },
  {
    slug: "entretien-exterieur",
    title: "Entretien des espaces extérieurs",
    shortTitle: "Entretien extérieur",
    description:
      "Gardez votre extérieur impeccable toute l'année. Tonte, taille, débroussaillage, nettoyage — en intervention ponctuelle ou en abonnement annuel.",
    icon: "🌳",
    features: [
      "Tonte et scarification",
      "Taille de haies et arbustes",
      "Débroussaillage",
      "Nettoyage haute pression eau chaude/froide",
      "Nettoyage façades et toitures",
      "Abonnement annuel",
    ],
    longDescription:
      "Un beau jardin, ça s'entretient. Mais entre le travail, la famille et le quotidien, qui a le temps de tondre chaque semaine, tailler les haies deux fois par an et nettoyer la terrasse avant l'été ? Aiman Renovation prend en charge l'entretien complet de vos espaces extérieurs pour que vous puissiez en profiter sans lever le petit doigt.\n\nNous proposons des interventions ponctuelles — tonte, taille de haies, débroussaillage, ramassage de feuilles, traitement anti-mousse — mais surtout des abonnements annuels. Vous choisissez la fréquence (hebdomadaire, bimensuel ou mensuel), nous planifions les passages et vous n'avez plus à y penser.\n\nNous disposons également d'un équipement professionnel de nettoyage haute pression à eau chaude et froide. Terrasses, allées, façades, toitures — nous redonnons un coup de neuf à toutes les surfaces extérieures de votre propriété. Le nettoyage à eau chaude est particulièrement efficace contre les mousses, lichens et taches de graisse incrustées.\n\nNos abonnements incluent un bilan saisonnier : au printemps, on prépare (scarification, désherbage, fertilisation) ; en été, on entretient ; à l'automne, on protège (ramassage, taille, paillage) ; en hiver, on surveille. C'est la tranquillité d'esprit, clé en main.",
    process: [
      { step: "Visite d'évaluation", detail: "Nous évaluons votre terrain : superficie, type de végétation, état actuel, besoins spécifiques." },
      { step: "Proposition sur mesure", detail: "Devis détaillé avec le programme d'entretien adapté : fréquence des passages, prestations incluses, tarif mensuel ou annuel." },
      { step: "Planning des passages", detail: "Un calendrier de passages est défini selon les saisons. Vous êtes prévenu à l'avance de chaque intervention." },
      { step: "Interventions régulières", detail: "Nos équipes interviennent selon le planning : tonte, taille, nettoyage, traitements saisonniers." },
      { step: "Bilan et ajustement", detail: "Un point annuel pour ajuster les prestations selon l'évolution de votre jardin et vos besoins." },
    ],
    whyPro:
      "Un entretien régulier par un professionnel préserve la valeur de votre propriété et la santé de vos végétaux. Une haie mal taillée devient envahissante, une pelouse non scarifiée s'étouffe, une terrasse non traitée devient glissante et dangereuse. Nos équipes connaissent les essences locales alsaciennes et adaptent les soins aux saisons. Avec un abonnement, vous avez la garantie d'un suivi constant sans avoir à y penser.",
    priceRange: "À partir de 80 € / intervention ponctuelle, abonnement annuel à partir de 150 € / mois",
  },
  {
    slug: "depannage-urgence",
    title: "SAV et dépannage d'urgence",
    shortTitle: "Dépannage",
    description:
      "Fuite d'eau, panne électrique, débouchage — nous intervenons 24h/24, 7j/7 pour sécuriser et réparer.",
    icon: "🚨",
    features: [
      "Fuite d'eau urgente",
      "Panne électrique",
      "Dégât des eaux",
      "Débouchage haute pression",
      "24h/24, 7j/7",
      "SAV chantiers réalisés",
    ],
    longDescription:
      "Une fuite d'eau à 22h, un court-circuit un dimanche, un dégât des eaux qui menace votre appartement — les urgences n'attendent pas et nous non plus. Aiman Renovation intervient 24h/24, 7j/7 pour sécuriser votre logement avant que les dégâts ne s'aggravent.\n\nNotre service couvre toutes les urgences : plomberie (fuite sur canalisation, robinet, chasse d'eau, chauffe-eau, dégât des eaux), électricité (disjoncteur qui saute, prise brûlée, panne de courant, court-circuit), débouchage de canalisations par hydrocurage haute pression, et tout ce qui nécessite une intervention rapide. Nous intervenons pour stopper le sinistre, sécuriser les installations et vous proposer un devis de remise en état.\n\nPour nos clients existants, nous assurons également un SAV sur les chantiers que nous avons réalisés. Un problème sur une installation que nous avons posée ? Nous revenons, nous diagnostiquons et nous réparons. C'est ça, la relation de confiance sur le long terme.",
    process: [
      { step: "Appel d'urgence", detail: "Vous nous appelez, nous évaluons la situation par téléphone et vous donnons les premiers gestes à faire en attendant." },
      { step: "Intervention rapide", detail: "Un technicien se déplace dans les meilleurs délais pour sécuriser et stopper le sinistre." },
      { step: "Diagnostic sur place", detail: "Identification précise de la cause : fuite, court-circuit, infiltration. Photos et rapport." },
      { step: "Réparation d'urgence", detail: "Réparation immédiate si possible, ou mise en sécurité temporaire avec devis de remise en état définitive." },
      { step: "Suivi et remise en état", detail: "Planification des travaux de remise en état si nécessaire. Accompagnement pour la déclaration d'assurance." },
    ],
    whyPro:
      "En cas d'urgence, chaque minute compte. Une fuite non traitée peut provoquer des milliers d'euros de dégâts en quelques heures. Un circuit électrique défaillant représente un risque d'incendie. Faire appel à un professionnel qualifié garantit une intervention sûre, conforme aux normes et documentée pour votre assurance. Notre connaissance du terrain à Saint-Louis et dans le Haut-Rhin nous permet d'intervenir rapidement.",
    priceRange: "Déplacement + diagnostic : à partir de 90 €, réparation sur devis",
  },
];
