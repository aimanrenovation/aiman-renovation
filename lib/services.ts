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
  /** Titre SEO optimisé (50-60 chars), mot-clé + localisation */
  seoTitle?: string;
  /** Description SEO (150-160 chars), incitation au clic */
  seoDescription?: string;
  /** Slugs des services liés pour le maillage interne */
  relatedSlugs?: string[];
  /** FAQ pour schema FAQPage + section visible sur la page service */
  faq?: { question: string; answer: string }[];
}

export const PHOTO_MAP: Record<string, string> = {
  cuisine: "/images/photo-cuisine.jpg",
  "salle-de-bain": "/images/photo-salle-de-bain.jpg",
  electricite: "/images/photo-electricite.jpg",
  plomberie: "/images/photo-plomberie.jpg",
  "sols-carrelage": "/images/photo-carrelage.jpg",
  facade: "/images/photo-facade.jpg",
  isolation: "/images/photo-facade.jpg",
  paysager: "/images/photo-paysager.jpg",
  peinture: "/images/photo-peinture.jpg",
  "borne-recharge": "/images/photo-borne-recharge.jpg",
  "panneaux-photovoltaiques": "/images/photo-photovoltaique.jpg",
  "entretien-exterieur": "/images/photo-entretien-exterieur.jpg",
  "depannage-urgence": "/images/photo-depannage.jpg",
  "renovation-complete": "/images/ambiance-resultat.jpg",
  "nettoyage-haute-pression": "/images/services/nettoyage-haute-pression.jpg",
};

export const ICON_MAP: Record<string, string> = {
  cuisine: "/images/icon-cuisine.png",
  "salle-de-bain": "/images/icon-salle-de-bain.png",
  electricite: "/images/icon-electricite.png",
  plomberie: "/images/icon-plomberie.png",
  "sols-carrelage": "/images/icon-carrelage.png",
  facade: "/images/icon-facade.png",
  isolation: "/images/icon-facade.png",
  paysager: "/images/icon-paysager.png",
  peinture: "/images/icon-peinture.png",
  "borne-recharge": "/images/icon-borne-recharge.png",
  "panneaux-photovoltaiques": "/images/icon-photovoltaique.png",
  "renovation-complete": "/images/icon-cuisine.png",
  "nettoyage-haute-pression": "/images/icon-facade.png",
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
      "La cuisine est le coeur de votre maison — l'endroit où l'on prépare, partage et se retrouve. Chez Aiman Renovation, nous concevons des cuisines qui allient esthétique et praticité, adaptées à votre mode de vie et à votre budget. Que vous souhaitiez une cuisine ouverte sur le séjour, un îlot central, ou simplement moderniser vos façades et plan de travail, nous vous accompagnons de A à Z.\n\nNos équipes maîtrisent tous les corps de métier nécessaires : plomberie, électricité, carrelage, menuiserie, peinture. Nous coordonnons l'ensemble du chantier pour vous offrir un résultat clé en main, sans que vous ayez à gérer plusieurs artisans. Chaque cuisine est pensée sur mesure, en tenant compte de l'agencement existant, de la luminosité et de vos habitudes.\n\nNous travaillons avec des fournisseurs reconnus pour la qualité de leurs matériaux : plans de travail en quartz, granit ou stratifié haute résistance, crédences en faïence ou en verre, robinetterie durable. Le résultat : une cuisine qui dure dans le temps et valorise votre bien.\n\nArtisans basés à Saint-Louis 68300, nous intervenons dans tout le Haut-Rhin : Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Sierentz, Village-Neuf, Mulhouse et toutes les communes frontalières avec la Suisse (Bâle/Basel) et l'Allemagne (Lörrach). Nos devis de rénovation cuisine sont détaillés, sans surprise, remis sous 48 à 72 heures. Durée moyenne d'un chantier cuisine : 5 à 10 jours selon la superficie et les aménagements. Garantie décennale sur l'ensemble des travaux.",
    process: [
      {
        step: "Prise de mesures",
        detail:
          "Visite technique pour relever les dimensions exactes et identifier les contraintes (arrivées d'eau, électricité, ventilation).",
      },
      {
        step: "Conception du projet",
        detail:
          "Plan d'aménagement en 2D/3D, choix des matériaux, coloris et équipements avec vous.",
      },
      {
        step: "Dépose de l'ancienne cuisine",
        detail:
          "Démontage soigné, évacuation des gravats et préparation des murs et sols.",
      },
      {
        step: "Travaux techniques",
        detail:
          "Réfection de la plomberie, mise aux normes électriques, pose du carrelage et de la crédence.",
      },
      {
        step: "Installation et finitions",
        detail:
          "Montage des meubles, pose du plan de travail, raccordements, peinture et nettoyage final.",
      },
    ],
    whyPro:
      "Une rénovation de cuisine implique de la plomberie, de l'électricité, du carrelage et de la menuiserie — autant de métiers qui exigent un savoir-faire précis. Un défaut d'étanchéité sous l'évier, un circuit électrique sous-dimensionné ou un plan de travail mal ajusté peuvent engendrer des problèmes coûteux. Faire appel à un professionnel, c'est la garantie d'un travail conforme aux normes, d'une coordination fluide entre les différents corps de métier et d'un résultat à la hauteur de vos attentes. De plus, notre garantie décennale vous protège pendant 10 ans.",
    priceRange:
      "8 000 € – 25 000 € selon la superficie et les matériaux choisis",
    seoTitle: "Rénovation Cuisine Saint-Louis 68 | Devis Gratuit",
    seoDescription:
      "Artisan rénovation cuisine à Saint-Louis 68300 et Haut-Rhin. Cuisine clé en main : plomberie, électricité, carrelage, menuiserie. Devis gratuit sous 48h.",
    faq: [
      {
        question: "Combien coûte une rénovation de cuisine à Saint-Louis ?",
        answer:
          "Le budget d'une rénovation de cuisine à Saint-Louis et dans le Haut-Rhin varie entre 8 000 € et 25 000 € selon la superficie, les matériaux et les équipements. Une cuisine de 10 m² avec meubles, plan de travail en quartz, carrelage et électroménager intégré coûte en moyenne 12 000 à 18 000 €. Nous établissons un devis détaillé et gratuit après visite technique.",
      },
      {
        question: "Combien de temps dure une rénovation de cuisine ?",
        answer:
          "Une rénovation complète de cuisine prend entre 3 et 6 semaines. La démolition et la préparation prennent 1 à 2 jours, les travaux techniques (plomberie, électricité) 3 à 5 jours, et la pose des meubles, carrelage et finitions 2 à 3 semaines. Nous établissons un planning précis avant le démarrage.",
      },
      {
        question: "Intervenez-vous à Mulhouse et dans tout le Haut-Rhin ?",
        answer:
          "Oui. Nous rénovons des cuisines à Saint-Louis, Mulhouse, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Rixheim, Habsheim, Sierentz et dans toute la zone frontalière Bâle/Alsace. Déplacement gratuit pour la visite technique.",
      },
      {
        question: "Peut-on ouvrir la cuisine sur le salon ?",
        answer:
          "Oui, sous réserve que la cloison ne soit pas porteuse. Nous réalisons le diagnostic structurel, obtenons les autorisations nécessaires si besoin, et créons votre cuisine ouverte avec ou sans îlot central. C'est une prestation que nous réalisons régulièrement à Saint-Louis et dans le Haut-Rhin.",
      },
    ],
    relatedSlugs: ["salle-de-bain", "sols-carrelage", "plomberie"],
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
      "Votre salle de bain doit être un espace de bien-être, fonctionnel et agréable au quotidien. Qu'il s'agisse de remplacer une baignoire vieillissante par une douche à l'italienne, de moderniser le carrelage ou de repenser entièrement l'agencement, Aiman Renovation vous propose des solutions sur mesure adaptées à votre espace et à votre budget.\n\nL'étanchéité est au coeur de nos préoccupations : nous utilisons des systèmes d'étanchéité sous carrelage (SPEC) conformes aux DTU en vigueur, pour vous garantir une salle de bain sans infiltrations pendant des années. Nos plombiers réalisent les raccordements avec soin, en privilégiant des matériaux durables (PER, multicouche).\n\nDe la vasque suspendue au meuble double vasque, du carrelage grand format aux mosaïques, nous vous aidons à choisir les équipements et finitions qui correspondent à vos goûts. Nous installons également des solutions d'accessibilité (barres d'appui, douche plain-pied) pour les personnes à mobilité réduite.\n\nNous connaissons les typologies de logements du Haut-Rhin : petites salles de bain des appartements des années 60-70 à Mulhouse ou Huningue à réorganiser, volumes généreux des maisons alsaciennes de Bartenheim, Blotzheim ou Kembs, salle d'eau compacte des pavillons récents de la zone Saint-Louis / Hégenheim. Durée moyenne : 7 à 14 jours selon la superficie. Devis gratuit sous 48h. Garantie décennale.",
    process: [
      {
        step: "Diagnostic et relevé",
        detail:
          "Inspection de la plomberie existante, contrôle de l'étanchéité, mesures précises de la pièce.",
      },
      {
        step: "Choix des équipements",
        detail:
          "Sélection des sanitaires, robinetterie, carrelage et accessoires selon vos envies et votre budget.",
      },
      {
        step: "Dépose et préparation",
        detail:
          "Retrait des anciens équipements, mise à nu des murs et sols, vérification des supports.",
      },
      {
        step: "Plomberie et étanchéité",
        detail:
          "Refonte du réseau d'eau chaude/froide et évacuations, pose du système d'étanchéité (SPEC).",
      },
      {
        step: "Pose et finitions",
        detail:
          "Carrelage mural et sol, installation des sanitaires, joints silicone, peinture et ventilation.",
      },
    ],
    whyPro:
      "La salle de bain est la pièce la plus technique de votre logement. Une mauvaise étanchéité peut entraîner des infiltrations, des moisissures et des dégâts structurels graves. La plomberie doit être irréprochable pour éviter les fuites. Nos artisans maîtrisent les normes DTU et les techniques d'étanchéité sous carrelage. Avec Aiman Renovation, vous bénéficiez d'une garantie décennale et de la tranquillité d'esprit.",
    priceRange: "6 000 € – 18 000 € selon la configuration et les équipements",
    seoTitle: "Rénovation Salle de Bain Saint-Louis 68 | Artisan",
    seoDescription:
      "Rénovation salle de bain à Saint-Louis et Haut-Rhin. Douche italienne, carrelage, plomberie complète, étanchéité DTU. Artisan qualifié, devis gratuit.",
    faq: [
      {
        question: "Quel est le prix d'une rénovation de salle de bain à Saint-Louis ?",
        answer:
          "Le coût d'une rénovation de salle de bain à Saint-Louis 68300 varie de 6 000 € à 18 000 € selon la configuration. Une salle de bain de 5 m² avec douche italienne, carrelage grand format, meuble vasque et plomberie complète coûte en moyenne 8 000 à 12 000 €. Nous proposons un devis gratuit sous 48h après visite.",
      },
      {
        question: "Combien de temps dure la rénovation d'une salle de bain ?",
        answer:
          "Une rénovation complète de salle de bain prend entre 2 et 4 semaines. Le planning type est : démolition (1-2 jours), plomberie et étanchéité (3-4 jours), carrelage (4-6 jours), installation des sanitaires et finitions (2-3 jours). Nous protégeons votre logement pendant toute la durée du chantier.",
      },
      {
        question: "Qu'est-ce que l'étanchéité sous carrelage (SPEC) ?",
        answer:
          "Le Système de Protection à l'Eau sous Carrelage (SPEC) est une membrane imperméable appliquée sur les murs et le sol de la douche avant la pose du carrelage. C'est une exigence des DTU (Document Technique Unifié) que nous respectons scrupuleusement pour garantir l'absence d'infiltrations pendant des années.",
      },
      {
        question: "Rénovez-vous les salles de bain à Mulhouse et Bâle ?",
        answer:
          "Oui, nous intervenons à Mulhouse, Saint-Louis, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs et dans toute la zone frontalière avec la Suisse (Bâle, Riehen) et l'Allemagne (Lörrach, Weil am Rhein). Devis gratuit sur place.",
      },
    ],
    relatedSlugs: ["cuisine", "plomberie", "sols-carrelage"],
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
      "Une installation électrique vétuste ou non conforme représente un risque majeur pour votre sécurité. En Alsace, de nombreux logements anciens nécessitent une mise aux normes pour répondre à la réglementation NF C 15-100. Aiman Renovation prend en charge la rénovation complète ou partielle de votre installation électrique, du tableau aux prises, en passant par l'éclairage.\n\nNous réalisons le diagnostic de votre installation existante, identifions les points de non-conformité et proposons un plan de rénovation adapté. Remplacement du tableau électrique, passage de nouveaux câbles, ajout de prises et interrupteurs, installation d'un éclairage LED performant — chaque intervention est réalisée dans le respect des normes en vigueur.\n\nNous proposons également des solutions de domotique pour piloter votre éclairage, volets roulants et chauffage depuis votre smartphone. Une maison plus intelligente, plus économe et plus confortable.\n\nDans le Haut-Rhin, de nombreux logements d'avant 1990 (Mulhouse, Huningue, Saint-Louis) sont équipés d'installations vétustes : tableaux fusibles, câbles sans différentiel 30 mA, circuits surchargés. Une mise aux normes NF C 15-100 sécurise le logement et prépare la recharge d'un véhicule électrique (IRVE) ou l'intégration de panneaux solaires. Attestation Consuel fournie. Zone d'intervention : Saint-Louis, Hégenheim, Bartenheim, Blotzheim, Kembs, Village-Neuf, Sierentz, Mulhouse.",
    process: [
      {
        step: "Diagnostic électrique",
        detail:
          "Inspection complète de l'installation existante, identification des non-conformités et des risques.",
      },
      {
        step: "Plan de rénovation",
        detail:
          "Schéma électrique détaillé avec positionnement des points lumineux, prises et circuits dédiés.",
      },
      {
        step: "Travaux de câblage",
        detail:
          "Passage des gaines et câbles, encastrement ou pose en apparent selon la configuration.",
      },
      {
        step: "Installation du tableau",
        detail:
          "Pose du nouveau tableau électrique avec disjoncteurs différentiels et protection parafoudre.",
      },
      {
        step: "Contrôle et mise en service",
        detail:
          "Tests de conformité, vérification des terres, mise en service et remise du schéma électrique.",
      },
    ],
    whyPro:
      "L'électricité ne pardonne pas les approximations. Une installation mal réalisée peut provoquer des courts-circuits, des incendies ou des électrocutions. La norme NF C 15-100 impose des règles strictes que seul un professionnel qualifié peut appliquer correctement. De plus, une attestation de conformité (Consuel) est obligatoire pour les rénovations lourdes. Confiez vos travaux électriques à Aiman Renovation pour une installation sûre et conforme.",
    priceRange:
      "3 000 € – 12 000 € selon l'ampleur de la rénovation (appartement ou maison)",
    seoTitle: "Électricien Saint-Louis 68300 | Mise aux Normes",
    seoDescription:
      "Électricien qualifié à Saint-Louis 68300, Mulhouse et Haut-Rhin. Mise aux normes NF C 15-100, tableau électrique, domotique. Attestation Consuel fournie.",
    faq: [
      {
        question: "Quel est le coût d'une mise aux normes électriques à Saint-Louis ?",
        answer:
          "La mise aux normes électriques NF C 15-100 coûte entre 3 000 € et 12 000 € selon la superficie et l'état de l'installation. Pour un appartement de 60 m², comptez 4 000 à 6 000 €. Pour une maison de 120 m² avec remplacement du tableau et reprise de tous les circuits, le budget est de 8 000 à 12 000 €. Devis gratuit après diagnostic.",
      },
      {
        question: "Qu'est-ce que l'attestation Consuel et est-elle obligatoire ?",
        answer:
          "Le Consuel (Comité National pour la Sécurité des Usagers de l'Électricité) délivre une attestation de conformité obligatoire pour toute rénovation électrique complète dans un logement existant. Sans cette attestation, EDF/Enedis peut refuser de mettre en service votre installation. Aiman Renovation vous accompagne dans cette démarche.",
      },
      {
        question: "Intervenez-vous en urgence pour les pannes électriques ?",
        answer:
          "Oui, nous proposons un service de dépannage électrique à Saint-Louis et dans le Haut-Rhin. Pour les urgences (panne totale, court-circuit, odeur de brûlé), contactez-nous au 06 33 49 69 25. Nous intervenons également à Mulhouse, Huningue, Hégenheim et dans la zone frontalière suisse et allemande.",
      },
    ],
    relatedSlugs: ["plomberie", "borne-recharge", "renovation-complete"],
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
      "La plomberie est l'ossature invisible de votre habitat. Une tuyauterie vétuste en plomb ou en acier galvanisé peut nuire à la qualité de votre eau et provoquer des fuites insidieuses. Aiman Renovation intervient pour rénover, remplacer ou créer vos réseaux d'alimentation et d'évacuation, avec des matériaux modernes et durables.\n\nNous remplaçons les anciennes canalisations par du PER ou du multicouche, installons des chauffe-eau thermodynamiques ou classiques, et créons de nouveaux points d'eau là où vous en avez besoin : buanderie, WC supplémentaire, cuisine d'été. Chaque intervention est pensée pour optimiser votre confort tout en réduisant votre consommation d'eau.\n\nEn copropriété comme en maison individuelle, nous intervenons sur les colonnes montantes, les compteurs divisionnaires et les raccordements au réseau public. Notre connaissance du terrain en Haut-Rhin nous permet de travailler efficacement avec les services des eaux locaux.\n\nDans le Haut-Rhin, de nombreux logements construits avant 1980 présentent encore des canalisations en plomb ou en acier galvanisé corrodé — risque sanitaire (saturnisme) et risque de fuite avéré. Nous intervenons pour remplacement complet par PER ou multicouche à Saint-Louis, Huningue, Village-Neuf, Hégenheim, Bartenheim, Blotzheim, Kembs, Sierentz, Rixheim, Habsheim, Mulhouse et toute la zone tri-frontière Bâle / Lörrach / Alsace.",
    process: [
      {
        step: "Diagnostic plomberie",
        detail:
          "Inspection visuelle et test de pression pour évaluer l'état du réseau existant.",
      },
      {
        step: "Proposition technique",
        detail:
          "Devis détaillé avec choix des matériaux (PER, multicouche, cuivre) et plan du réseau.",
      },
      {
        step: "Dépose et remplacement",
        detail:
          "Retrait des anciennes canalisations, pose du nouveau réseau avec vannes d'arrêt par zone.",
      },
      {
        step: "Raccordements",
        detail:
          "Branchement des équipements sanitaires, chauffe-eau, machine à laver et lave-vaisselle.",
      },
      {
        step: "Mise en eau et contrôle",
        detail:
          "Tests d'étanchéité sous pression, vérification des débits et absence de fuites.",
      },
    ],
    whyPro:
      "Une fuite d'eau peut causer des dégâts considérables en quelques heures : plafonds endommagés, moisissures, courts-circuits. Les raccordements en plomberie exigent une maîtrise des techniques de soudure, de sertissage et des normes sanitaires. Faire appel à Aiman Renovation, c'est l'assurance d'un réseau fiable, d'une eau saine et d'une couverture par notre garantie décennale en cas de sinistre.",
    priceRange:
      "2 000 € – 10 000 € selon le nombre de points d'eau et la complexité",
    seoTitle: "Plombier Saint-Louis 68300 | Dépannage Haut-Rhin",
    seoDescription:
      "Plombier à Saint-Louis 68300 et Haut-Rhin. Rénovation tuyauterie, installation chauffe-eau, fuites, raccordements. Intervention rapide. Devis gratuit.",
    faq: [
      {
        question: "Comment trouver un plombier qualifié à Saint-Louis 68300 ?",
        answer:
          "Aiman Renovation est votre plombier de confiance à Saint-Louis 68300 et dans tout le Haut-Rhin. Nous intervenons pour la rénovation de tuyauterie, l'installation de chauffe-eau, la création de points d'eau et la réparation de fuites. Contactez-nous au 06 33 49 69 25 pour un devis gratuit sous 48h.",
      },
      {
        question: "Quel est le prix d'un remplacement de chauffe-eau à Saint-Louis ?",
        answer:
          "Le remplacement d'un chauffe-eau à Saint-Louis coûte entre 800 € et 2 500 €, fourniture et pose comprises, selon le modèle (chauffe-eau classique, thermodynamique ou instantané) et l'accessibilité. Un chauffe-eau thermodynamique éligible à MaPrimeRénov' peut réduire significativement votre reste à charge.",
      },
      {
        question: "Intervenez-vous aussi en Suisse et en Allemagne pour la plomberie ?",
        answer:
          "Nous intervenons principalement en France (Haut-Rhin, Bas-Rhin) et ponctuellement dans la zone frontalière. Pour les chantiers de rénovation complète incluant la plomberie à Bâle ou Lörrach, contactez-nous pour évaluer la faisabilité. Notre zone principale est Saint-Louis, Mulhouse et un rayon de 30 km.",
      },
    ],
    relatedSlugs: ["salle-de-bain", "electricite", "depannage-urgence"],
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
      {
        step: "Étude du terrain",
        detail:
          "Analyse du sol, des pentes, du drainage naturel et de l'exposition solaire.",
      },
      {
        step: "Plan d'aménagement",
        detail:
          "Conception du projet avec implantation de la terrasse, des allées, des plantations et de l'éclairage.",
      },
      {
        step: "Terrassement",
        detail:
          "Décaissement, nivellement, pose du géotextile et préparation des fondations.",
      },
      {
        step: "Construction",
        detail:
          "Réalisation de la terrasse, des allées, murets, clôtures et portails.",
      },
      {
        step: "Plantations et finitions",
        detail:
          "Mise en terre des végétaux, engazonnement, installation de l'éclairage et nettoyage.",
      },
    ],
    whyPro:
      "Un aménagement extérieur mal conçu se détériore rapidement : terrasse qui se soulève avec le gel, allée qui s'affaisse, stagnation d'eau. La maîtrise du terrassement, du drainage et des fondations est essentielle pour un résultat durable. Nos équipes connaissent les contraintes spécifiques du climat alsacien (gel, pluies abondantes) et sélectionnent des matériaux adaptés. Garantie décennale incluse sur les ouvrages de maçonnerie paysagère.",
    priceRange:
      "5 000 € – 30 000 € selon la surface et les aménagements souhaités",
    faq: [
      {
        question: "Combien coûte l'aménagement d'une terrasse à Saint-Louis ?",
        answer:
          "Le prix d'une terrasse à Saint-Louis et dans le Haut-Rhin varie de 80 à 250 €/m² selon les matériaux (bois composite, dalles sur plots, pierre naturelle) et la complexité du chantier. Une terrasse de 30 m² en dalles sur plots coûte entre 3 000 et 5 500 €, terrasse finie, évacuation des eaux et éclairage compris. Devis gratuit.",
      },
      {
        question: "Réalisez-vous des jardins et espaces verts dans le Haut-Rhin ?",
        answer:
          "Oui. Nous créons et aménageons des espaces extérieurs complets : terrasses, allées en pavés, murets de soutènement, clôtures en aluminium ou bois, éclairage extérieur LED, plantations d'essences locales résistantes au gel alsacien. Nous intervenons à Saint-Louis, Mulhouse, Huningue, Hégenheim, Bartenheim, Blotzheim et Kembs.",
      },
    ],
    seoTitle: "Aménagement Paysager Haut-Rhin | Saint-Louis 68300",
    seoDescription:
      "Création et aménagement de jardins, terrasses et allées à Saint-Louis 68300 et Haut-Rhin. Dallage, clôtures, plantations, éclairage extérieur. Devis gratuit.",
    relatedSlugs: ["entretien-exterieur", "facade"],
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
      {
        step: "Étude de faisabilité",
        detail:
          "Vérification de la puissance du compteur, distance tableau-borne, choix du type de borne adapté.",
      },
      {
        step: "Devis et aides",
        detail:
          "Proposition tarifaire détaillée avec simulation des aides (crédit d'impôt, prime ADVENIR).",
      },
      {
        step: "Installation électrique",
        detail:
          "Tirage de ligne dédiée depuis le tableau, pose du disjoncteur et du différentiel adaptés.",
      },
      {
        step: "Pose de la borne",
        detail:
          "Fixation murale ou sur pied, raccordement électrique, paramétrage et test de charge.",
      },
      {
        step: "Mise en service",
        detail:
          "Configuration de la borne (puissance, horaires), remise de l'attestation IRVE et du mode d'emploi.",
      },
    ],
    whyPro:
      "L'installation d'une borne de recharge touche à l'électricité haute puissance et nécessite une certification IRVE obligatoire au-delà de 3,7 kW. Un câblage inadapté peut provoquer une surchauffe, un disjoncteur qui saute ou pire, un incendie. La certification IRVE est également une condition pour bénéficier du crédit d'impôt et de la prime ADVENIR. Ne prenez aucun risque : faites appel à un installateur certifié.",
    priceRange:
      "1 200 € – 2 500 € pose comprise (avant aides), 900 € – 1 800 € après crédit d'impôt",
    faq: [
      {
        question: "Quel est le prix d'installation d'une borne de recharge à Saint-Louis ?",
        answer:
          "L'installation d'une borne de recharge pour voiture électrique (IRVE) à Saint-Louis et dans le Haut-Rhin coûte entre 600 et 1 800 €, borne fournie et posée. Des aides financières existent : crédit d'impôt Résidence Principale (jusqu'à 300 €) et prime Advenir pour les copropriétés. Devis gratuit, installation certifiée IRVE.",
      },
      {
        question: "Quelle borne de recharge choisir pour une maison dans le Haut-Rhin ?",
        answer:
          "Pour une maison individuelle, nous recommandons une borne de 7,4 kW (monophasé) ou 11 kW (triphasé) selon votre tableau électrique. Elle permet de recharger complètement une voiture électrique en 4 à 8 heures. Nous installons les principales marques (Wallbox, Schneider, Hager) et vous conseillons selon votre véhicule et votre usage.",
      },
    ],
    seoTitle: "Borne Recharge Voiture Électrique Saint-Louis 68",
    seoDescription:
      "Installation borne IRVE à Saint-Louis 68300 et Haut-Rhin. Wallbox 7,4 à 22 kW, copropriété ou maison. Crédit d'impôt 300 €, prime ADVENIR. Devis gratuit.",
    relatedSlugs: ["electricite", "panneaux-photovoltaiques"],
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
      {
        step: "Étude solaire",
        detail:
          "Analyse de l'orientation et de l'inclinaison de votre toiture, calcul du productible et simulation financière.",
      },
      {
        step: "Démarches administratives",
        detail:
          "Déclaration préalable en mairie, demande de raccordement Enedis, contrat EDF OA.",
      },
      {
        step: "Installation des panneaux",
        detail:
          "Pose des rails de fixation, installation des panneaux et des micro-onduleurs sur toiture.",
      },
      {
        step: "Raccordement électrique",
        detail:
          "Câblage, pose du coffret AC/DC, raccordement au tableau et au compteur Linky.",
      },
      {
        step: "Mise en service",
        detail:
          "Test de production, mise en service du monitoring, remise du dossier technique complet.",
      },
    ],
    whyPro:
      "L'installation de panneaux photovoltaïques implique des travaux en toiture (risque de chute) et des raccordements électriques haute tension. Une pose non conforme peut provoquer des infiltrations en toiture, des risques d'incendie ou une production sous-optimale. Pour bénéficier des aides (prime autoconsommation, TVA réduite), l'installation doit être réalisée par un professionnel qualifié RGE. Aiman Renovation gère l'intégralité du projet pour vous.",
    priceRange:
      "7 000 € – 15 000 € pour 3 à 6 kWc (avant prime autoconsommation de 1 000 € à 2 500 €)",
    faq: [
      {
        question: "Quel est le prix d'une installation solaire photovoltaïque dans le Haut-Rhin ?",
        answer:
          "Une installation photovoltaïque à Saint-Louis et dans le Haut-Rhin coûte entre 8 000 et 20 000 € selon la puissance (3 à 9 kWc). Après déduction des aides (prime à l'autoconsommation, TVA à 10 %), le retour sur investissement est de 8 à 12 ans. L'Alsace bénéficie d'un ensoleillement favorable, surtout en été.",
      },
      {
        question: "L'installation solaire est-elle compatible avec une rénovation de toiture ?",
        answer:
          "Oui. Nous coordonnons l'installation photovoltaïque avec les travaux de toiture ou de façade. Idéalement, si vous envisagez un ravalement ou une réfection de toiture, c'est le moment d'intégrer les panneaux solaires pour optimiser les coûts d'échafaudage et de déplacement. Devis combiné disponible.",
      },
    ],
    seoTitle: "Panneaux Solaires Saint-Louis 68 | Aiman Renovation",
    seoDescription:
      "Installation panneaux photovoltaïques à Saint-Louis 68300 et Haut-Rhin. RGE certifié, autoconsommation, aide MaPrimeRénov'. Devis solaire gratuit.",
    relatedSlugs: ["borne-recharge", "electricite", "isolation"],
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
      {
        step: "Visite d'évaluation",
        detail:
          "Nous évaluons votre terrain : superficie, type de végétation, état actuel, besoins spécifiques.",
      },
      {
        step: "Proposition sur mesure",
        detail:
          "Devis détaillé avec le programme d'entretien adapté : fréquence des passages, prestations incluses, tarif mensuel ou annuel.",
      },
      {
        step: "Planning des passages",
        detail:
          "Un calendrier de passages est défini selon les saisons. Vous êtes prévenu à l'avance de chaque intervention.",
      },
      {
        step: "Interventions régulières",
        detail:
          "Nos équipes interviennent selon le planning : tonte, taille, nettoyage, traitements saisonniers.",
      },
      {
        step: "Bilan et ajustement",
        detail:
          "Un point annuel pour ajuster les prestations selon l'évolution de votre jardin et vos besoins.",
      },
    ],
    whyPro:
      "Un entretien régulier par un professionnel préserve la valeur de votre propriété et la santé de vos végétaux. Une haie mal taillée devient envahissante, une pelouse non scarifiée s'étouffe, une terrasse non traitée devient glissante et dangereuse. Nos équipes connaissent les essences locales alsaciennes et adaptent les soins aux saisons. Avec un abonnement, vous avez la garantie d'un suivi constant sans avoir à y penser.",
    priceRange:
      "À partir de 80 € / intervention ponctuelle, abonnement annuel à partir de 150 € / mois",
    faq: [
      {
        question: "Proposez-vous un contrat d'entretien de jardin à Saint-Louis ?",
        answer:
          "Oui. Nous proposons des interventions ponctuelles et des contrats d'entretien annuels pour vos espaces verts à Saint-Louis, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs et dans le Haut-Rhin. Tonte, taille des haies, débroussaillage, désherbage, traitement des allées — tout est inclus selon votre formule.",
      },
      {
        question: "Réalisez-vous du nettoyage de terrasse et d'allées dans le Haut-Rhin ?",
        answer:
          "Oui. Nous proposons le nettoyage haute pression de terrasses, allées, pavés et dalles extérieures à Saint-Louis et dans le Haut-Rhin. Mousse, lichens, graisses et salissures sont éliminés efficacement. Un traitement anti-mousse préventif prolonge l'effet de 3 à 5 ans. Tarif à partir de 8 €/m².",
      },
    ],
    seoTitle: "Entretien Jardin Saint-Louis 68 | Espaces Verts Alsace",
    seoDescription:
      "Entretien jardins et espaces extérieurs à Saint-Louis 68 et Haut-Rhin. Tonte, taille, nettoyage haute pression, abonnement annuel. Devis gratuit.",
    relatedSlugs: ["paysager", "facade"],
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
      {
        step: "Appel d'urgence",
        detail:
          "Vous nous appelez, nous évaluons la situation par téléphone et vous donnons les premiers gestes à faire en attendant.",
      },
      {
        step: "Intervention rapide",
        detail:
          "Un technicien se déplace dans les meilleurs délais pour sécuriser et stopper le sinistre.",
      },
      {
        step: "Diagnostic sur place",
        detail:
          "Identification précise de la cause : fuite, court-circuit, infiltration. Photos et rapport.",
      },
      {
        step: "Réparation d'urgence",
        detail:
          "Réparation immédiate si possible, ou mise en sécurité temporaire avec devis de remise en état définitive.",
      },
      {
        step: "Suivi et remise en état",
        detail:
          "Planification des travaux de remise en état si nécessaire. Accompagnement pour la déclaration d'assurance.",
      },
    ],
    whyPro:
      "En cas d'urgence, chaque minute compte. Une fuite non traitée peut provoquer des milliers d'euros de dégâts en quelques heures. Un circuit électrique défaillant représente un risque d'incendie. Faire appel à un professionnel qualifié garantit une intervention sûre, conforme aux normes et documentée pour votre assurance. Notre connaissance du terrain à Saint-Louis et dans le Haut-Rhin nous permet d'intervenir rapidement.",
    priceRange:
      "Déplacement + diagnostic : à partir de 90 €, réparation sur devis",
    faq: [
      {
        question: "Intervenez-vous en urgence le week-end à Saint-Louis ?",
        answer:
          "Oui. Notre service de dépannage urgence est disponible 7j/7 à Saint-Louis 68300 et dans le Haut-Rhin. En cas de fuite d'eau, de panne électrique, de dégât des eaux ou de canalisation bouchée, appelez le 06 33 49 69 25. Nous nous engageons à intervenir dans les meilleurs délais.",
      },
      {
        question: "Quel est le tarif d'un dépannage en urgence dans le Haut-Rhin ?",
        answer:
          "Le tarif d'un dépannage urgence varie selon la nature de l'intervention et l'heure d'appel. Un déplacement de nuit ou le week-end est majoré. Nous vous communiquons le devis estimatif avant toute intervention. Pour les urgences absolues (fuite importante, risque électrique), nous intervenons sans délai.",
      },
    ],
    seoTitle: "Dépannage Urgence Saint-Louis 68 | 24h/24 Haut-Rhin",
    seoDescription:
      "Dépannage urgence plomberie et électricité à Saint-Louis 68300, 24h/24 7j/7. Fuite, panne, dégât des eaux. Intervention rapide Haut-Rhin et Bâle.",
    relatedSlugs: ["plomberie", "electricite"],
  },
  {
    slug: "peinture",
    title: "Peinture intérieure et extérieure",
    shortTitle: "Peinture",
    description:
      "Travaux de peinture réalisés par des peintres professionnels. Préparation des supports, sous-couche, finitions impeccables dans tout le Haut-Rhin.",
    icon: "🎨",
    features: [
      "Peinture intérieure (murs, plafonds, boiseries)",
      "Peinture extérieure microporeuse",
      "Enduits décoratifs (tadelakt, stuc vénitien)",
      "Papier peint et revêtements muraux",
      "Préparation des supports : rebouchage, ponçage, primaire",
      "Peinture sur bois, métal et béton",
    ],
    longDescription:
      "La peinture est le premier signe d'un intérieur soigné — et le dernier poste sur lequel il ne faut pas lésiner. Chez Aiman Renovation, nos peintres professionnels interviennent à Saint-Louis et dans tout le Haut-Rhin pour vous garantir un résultat durable, uniforme et esthétique.\n\nTout commence par la préparation des supports, étape qui représente 70 % du travail et que beaucoup d'amateurs négligent. Rebouchage des fissures avec enduit de lissage, ponçage fin, dépoussiérage et application d'un primaire d'accrochage adapté au support (plâtre, BA13, brique, béton) : sans cette base, même la meilleure peinture cloque en moins de 5 ans. Nous utilisons des peintures de marques professionnelles — Tollens, Sikkens, Zolpan — en finition mate, satinée ou brillante selon l'usage de chaque pièce.\n\nPour les espaces humides (cuisine, salle de bain), nous choisissons des peintures antifongiques résistantes à la vapeur. Pour les couloirs et escaliers soumis aux chocs, des peintures glycéro ou acrylique haute résistance. Pour vos extérieurs, des peintures microporeuses qui laissent respirer les murs tout en les protégeant des intempéries alsaciennes.\n\nNous réalisons également des finitions décoratives : enduit tadelakt pour un effet hammam, stuc vénitien nacré, béton ciré mural, badigeon à la chaux pour les maisons anciennes. Ces techniques artisanales donnent un caractère unique à votre intérieur. Que ce soit pour un appartement à Huningue, une maison à Bartenheim ou un bureau à Saint-Louis, nous vous accompagnons du choix des couleurs jusqu'au nettoyage final.",
    process: [
      {
        step: "Protection du chantier",
        detail:
          "Bâchage des sols, meubles et menuiseries. Pose de rubans de masquage sur les plinthes, encadrements et prises.",
      },
      {
        step: "Préparation des supports",
        detail:
          "Rebouchage des fissures et trous, ponçage, lessivage des surfaces grasses, traitement des taches et moisissures.",
      },
      {
        step: "Application du primaire",
        detail:
          "Impression adaptée au support pour uniformiser l'absorption et garantir l'adhérence de la finition.",
      },
      {
        step: "Couches de peinture",
        detail:
          "Deux couches minimum de peinture de finition appliquées au rouleau, pinceau ou airless selon les surfaces.",
      },
      {
        step: "Retouches et livraison",
        detail:
          "Inspection sous éclairage rasant, retouches des éventuels défauts, retrait des protections et nettoyage complet.",
      },
    ],
    whyPro:
      "Un travail de peinture réussi repose à 70% sur la préparation du support. Sans ponçage, rebouchage et primaire adaptés, la peinture cloque, s'écaille et jaunit en 2 à 3 ans. Nos peintres maîtrisent les supports alsaciens (enduit à la chaux, crépi, béton) et choisissent les produits appropriés à chaque cas. Outils professionnels, finitions irréprochables, délais tenus : c'est la différence entre un amateur et Aiman Renovation. Garantie de résultat, sans mauvaise surprise.",
    priceRange:
      "20 € – 45 € / m² murs et plafonds, préparation et 2 couches comprises",
    seoTitle: "Peintre Bâtiment Saint-Louis 68 | Haut-Rhin Alsace",
    seoDescription:
      "Peintre professionnel à Saint-Louis 68300 et Haut-Rhin. Peinture intérieure/extérieure, enduits décoratifs, préparation soignée. Devis gratuit sous 48h.",
    faq: [
      {
        question: "Quel est le prix de la peinture intérieure à Saint-Louis ?",
        answer:
          "Le prix d'une peinture intérieure à Saint-Louis 68300 est de 20 à 45 € / m² de surface à peindre, préparation et deux couches comprises. Pour un appartement de 70 m² (murs et plafonds), comptez entre 3 500 € et 6 500 € selon l'état des supports et le type de peinture. Devis gratuit après visite.",
      },
      {
        question: "La préparation des murs est-elle incluse dans votre devis ?",
        answer:
          "Oui, systématiquement. La préparation représente 70 % d'un travail de peinture réussi : rebouchage des fissures et trous, ponçage, dépoussiérage et application d'un primaire adapté au support. Sans cette étape, la peinture cloque en quelques années. Nos devis incluent toujours la préparation complète.",
      },
      {
        question: "Réalisez-vous des enduits décoratifs (béton ciré, tadelakt) dans le Haut-Rhin ?",
        answer:
          "Oui. Nous réalisons des finitions décoratives artisanales (tadelakt, stuc vénitien, béton ciré mural, badigeon à la chaux) dans tout le Haut-Rhin : Saint-Louis, Mulhouse, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs et la zone frontalière avec Bâle. Ces techniques donnent un caractère unique à votre intérieur.",
      },
    ],
    relatedSlugs: ["sols-carrelage", "facade", "renovation-complete"],
  },
  {
    slug: "sols-carrelage",
    title: "Sols et carrelage",
    shortTitle: "Sols & Carrelage",
    description:
      "Pose de carrelage, parquet, vinyle, béton ciré. Préparation des supports et finitions soignées pour tous vos sols intérieurs et extérieurs.",
    icon: "🏗️",
    features: [
      "Carrelage grand format (60x60, 80x80, 120x60)",
      "Parquet massif et parquet contrecollé",
      "Sol vinyle LVT et PVC haute résistance",
      "Béton ciré et résine de sol",
      "Carrelage extérieur antidérapant",
      "Ragréage et préparation du support",
    ],
    longDescription:
      "Le sol est la première surface que l'on ressent sous les pieds et l'un des éléments qui définit le style d'une pièce. Un carrelage grand format en grès cérame pour une salle de bain épurée, un parquet en chêne huilé pour un salon chaleureux, un béton ciré pour une cuisine contemporaine — Aiman Renovation pose tous les types de revêtements de sol avec le soin artisanal qui garantit un résultat durable.\n\nChaque chantier commence par une évaluation rigoureuse du support : contrôle de la planéité au niveau laser, mesure du taux d'humidité, test d'adhérence. Si le sol n'est pas parfaitement plan — ce qui est souvent le cas dans les logements anciens du Haut-Rhin — nous procédons à un ragréage avec une chape fluide autonivelante. Cette étape invisible est pourtant déterminante : un carrelage posé sur un support défectueux se fissure et se décolle inévitablement.\n\nPour le carrelage, nous maîtrisons toutes les techniques de calepinage : pose droite, décalée, en chevron, en diagonale. Nous travaillons les grands formats avec des outils professionnels (coupe-carreaux diamant, table de découpe laser) pour des joints parfaitement alignés. Pour les parquets, nous proposons la pose à colle pour un résultat massif et silencieux, ou la pose flottante pour les installations plus légères.\n\nSur les terrasses et espaces extérieurs, nous posons des carreaux de grès cérame antidérapants (R11-R13) sur plots réglables ou en collage direct sur dalle béton. Nos interventions couvrent Saint-Louis, Huningue, Hegenheim, Kembs, Rixheim, Habsheim et toute la zone frontalière Bâle/Alsace.",
    process: [
      {
        step: "Évaluation du support",
        detail:
          "Contrôle de la planéité au niveau laser, mesure du taux d'humidité, identification des défauts structurels.",
      },
      {
        step: "Préparation du support",
        detail:
          "Ragréage autonivelant si nécessaire, primaire d'accrochage, traitement des fissures et joints de dilatation.",
      },
      {
        step: "Choix du calepinage",
        detail:
          "Plan de pose définissant le sens, la taille des joints, le point de départ et les motifs spécifiques.",
      },
      {
        step: "Pose du revêtement",
        detail:
          "Collage ou pose flottante selon le matériau, découpes précises avec outils diamant, respect des joints de dilatation.",
      },
      {
        step: "Jointoiement et finitions",
        detail:
          "Joints de couleur assortie, plinthes, barres de seuil inox, nettoyage approfondi et protection du revêtement.",
      },
    ],
    whyPro:
      "Un carrelage mal posé se fissure, sonne creux et se décolle en quelques années. La préparation du support, la sélection de la colle adaptée au format et au support, et le respect des joints de dilatation sont des étapes techniques qui exigent un savoir-faire réel. Nos carreleurs utilisent des outils professionnels et cumulant des années d'expérience dans le Haut-Rhin. Résultat garanti, conforme aux DTU 52.1 et 52.2.",
    priceRange:
      "40 € – 120 € / m² pose comprise, selon le type de revêtement et la complexité",
    seoTitle: "Carreleur Saint-Louis 68 | Parquet & Sols Haut-Rhin",
    seoDescription:
      "Pose carrelage, parquet, béton ciré à Saint-Louis 68300 et Haut-Rhin. Grand format, ragréage, finitions DTU. Artisan qualifié — devis gratuit.",
    faq: [
      {
        question: "Quel est le prix de la pose de carrelage à Saint-Louis 68 ?",
        answer:
          "La pose de carrelage à Saint-Louis et dans le Haut-Rhin coûte entre 40 et 120 € / m², pose comprise, selon le type de revêtement et la complexité du chantier. Un carrelage grand format (80x80 cm) posé en salle de bain avec ragréage est autour de 80 à 100 €/m². Devis précis après visite gratuite.",
      },
      {
        question: "Quelle est la différence entre carrelage grand format et carrelage standard ?",
        answer:
          "Le carrelage grand format (60x60, 80x80 ou 120x60 cm) donne un effet épuré avec moins de joints, mais exige un support parfaitement plan et une colle adaptée. Nous maîtrisons la pose grand format avec des outils diamant professionnels pour des joints millimétriques et un résultat sans défaut, conforme DTU 52.1.",
      },
      {
        question: "Posez-vous du parquet dans le Haut-Rhin ?",
        answer:
          "Oui, nous posons tous types de parquets : parquet massif, parquet contrecollé, sol vinyle LVT haute résistance. Nous intervenons à Saint-Louis, Mulhouse, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Rixheim, Habsheim et dans toute la zone frontalière. Mise en œuvre à la colle ou flottante selon les supports.",
      },
    ],
    relatedSlugs: ["peinture", "salle-de-bain", "renovation-complete"],
  },
  {
    slug: "renovation-complete",
    title: "Rénovation complète",
    shortTitle: "Rénovation complète",
    description:
      "Rénovation totale de votre logement, de A à Z. Un interlocuteur unique qui coordonne tous les corps de métier pour un résultat clé en main.",
    icon: "🏠",
    features: [
      "Coordination de tous les corps de métier",
      "Démolition et gros œuvre léger",
      "Électricité, plomberie, chauffage",
      "Isolation thermique et acoustique",
      "Carrelage, parquet, peinture",
      "Cuisine et salle de bain",
    ],
    longDescription:
      "Rénover entièrement un appartement ou une maison est un projet complexe qui implique une dizaine de corps de métier différents, des délais à coordonner et un budget à maîtriser. Aiman Renovation vous propose une solution clé en main : un interlocuteur unique qui prend en charge l'intégralité des travaux, de la démolition aux finitions, sans que vous ayez à gérer la coordination entre artisans.\n\nNous intervenons sur tous types de logements : appartements des années 70 à Saint-Louis ou Mulhouse, maisons alsaciennes à colombages dans les villages du Haut-Rhin, pavillons récents des communes frontalières (Hegenheim, Blotzheim, Kembs, Rixheim, Habsheim). Chaque rénovation complète débute par une visite technique approfondie et l'établissement d'un planning de chantier détaillé.\n\nNos équipes maîtrisent tous les corps de métier nécessaires : démolition (cloisons, revêtements, sanitaires), mise aux normes électriques NF C 15-100, plomberie (remplacement des réseaux vétustes en plomb ou acier galvanisé), isolation thermique et phonique, carrelage, parquet, peinture, pose de cuisines et salles de bain. Nous travaillons avec un réseau de sous-traitants qualifiés pour les travaux spécialisés (charpente, couverture, menuiseries extérieures).\n\nLa rénovation complète est aussi l'occasion de repenser la distribution des pièces. Supprimer une cloison pour ouvrir le séjour sur la cuisine, créer une salle de bain supplémentaire, aménager les combles — nous vous conseillons sur les modifications structurelles possibles et obtenons les autorisations nécessaires (déclaration préalable, permis de construire si requis).",
    process: [
      {
        step: "Visite technique et diagnostic",
        detail:
          "Évaluation complète du logement : état des structures, réseaux électriques et sanitaires, isolation, revêtements.",
      },
      {
        step: "Plan de rénovation et devis",
        detail:
          "Programme de travaux détaillé, plans d'aménagement, planning de chantier et devis global avec phasage des coûts.",
      },
      {
        step: "Démolition et gros œuvre",
        detail:
          "Dépose des anciens revêtements, démolition des cloisons prévues, évacuation des gravats, préparation des supports.",
      },
      {
        step: "Travaux techniques",
        detail:
          "Électricité, plomberie, chauffage, isolation — interventions réalisées dans l'ordre logique du chantier pour éviter les reprises.",
      },
      {
        step: "Finitions et livraison",
        detail:
          "Carrelage, parquet, peinture, pose des équipements (cuisine, salle de bain), nettoyage de chantier et remise des clés.",
      },
    ],
    whyPro:
      "Gérer soi-même une rénovation complète en faisant appel à plusieurs artisans séparément est une source de stress, de dépassements de budget et de délais allongés. Un artisan qui attend un autre, des plannings qui se télescopent, des finitions reprises parce que le plâtre n'était pas sec — ces situations coûtent du temps et de l'argent. Aiman Renovation coordonne tout. Un devis global, un planning tenu, une garantie décennale sur l'ensemble des travaux.",
    priceRange:
      "30 000 € – 120 000 € selon la superficie, l'état du logement et le niveau de finition",
    seoTitle: "Rénovation Complète Appartement Maison Saint-Louis 68",
    seoDescription:
      "Rénovation complète clé en main à Saint-Louis, Mulhouse et Haut-Rhin. Un interlocuteur unique, tous corps de métier. Garantie décennale. Devis gratuit.",
    faq: [
      {
        question: "Quel est le budget d'une rénovation complète à Saint-Louis ?",
        answer:
          "Le coût d'une rénovation complète à Saint-Louis et dans le Haut-Rhin varie de 30 000 € à 120 000 € selon la superficie, l'état du logement et le niveau de finition. Pour un appartement de 60 m² en rénovation totale (électricité, plomberie, cuisine, salle de bain, carrelage, peinture), comptez entre 40 000 et 70 000 €. Devis détaillé gratuit après visite.",
      },
      {
        question: "Combien de temps dure une rénovation complète d'appartement ?",
        answer:
          "Une rénovation complète d'appartement de 60 à 80 m² prend entre 6 et 14 semaines selon l'ampleur des travaux. Nous établissons un planning de chantier précis avant le démarrage, avec des étapes clairement définies. Vous n'avez qu'un interlocuteur unique pour toute la coordination.",
      },
      {
        question: "Rénovez-vous aussi les maisons alsaciennes à colombages dans le Haut-Rhin ?",
        answer:
          "Oui. Nous intervenons sur tous types de logements : appartements des années 60-80 à Saint-Louis ou Mulhouse, maisons alsaciennes à colombages dans les villages du Haut-Rhin, pavillons récents dans les communes frontalières (Hégenheim, Blotzheim, Kembs, Rixheim, Habsheim). Chaque chantier est adapté aux spécificités du bâtiment.",
      },
      {
        question: "Proposez-vous un service clé en main pour les investisseurs à Mulhouse ?",
        answer:
          "Oui. Nous accompagnons les investisseurs immobiliers à Mulhouse, Saint-Louis et dans le Haut-Rhin pour la rénovation de biens locatifs : remise aux normes, optimisation du DPE, aménagement pour maximiser le loyer. Devis global incluant tous les corps de métier, planning fixé à l'avance.",
      },
    ],
    relatedSlugs: ["cuisine", "salle-de-bain", "electricite"],
  },
  {
    slug: "isolation",
    title: "Isolation thermique et acoustique",
    shortTitle: "Isolation",
    description:
      "Isolation par l'extérieur (ITE), par l'intérieur (ITI) et isolation acoustique. Réduisez vos factures de chauffage et améliorez votre confort.",
    icon: "🏛️",
    features: [
      "Isolation thermique par l'extérieur (ITE)",
      "Isolation thermique par l'intérieur (ITI)",
      "Isolation des combles perdus et aménagés",
      "Isolation acoustique inter-logements",
      "Isolation des planchers bas sur vide sanitaire",
      "Éligibilité MaPrimeRénov' et CEE",
    ],
    longDescription:
      "En Alsace, les hivers rigoureux et les étés de plus en plus chauds rendent l'isolation thermique indispensable. Une maison mal isolée perd jusqu'à 30 % de sa chaleur par les murs, 25 % par les combles et 15 % par le sol. Aiman Renovation est spécialisé dans l'isolation thermique, que ce soit par l'extérieur (ITE) ou par l'intérieur (ITI), pour réduire significativement vos factures de chauffage et améliorer votre confort quotidien.\n\nL'isolation thermique par l'extérieur (ITE) est la solution la plus performante pour les maisons individuelles : elle supprime les ponts thermiques, protège la structure du bâtiment contre les cycles gel/dégel et embellit la façade simultanément. Nous posons des panneaux isolants de 80 à 200 mm (polystyrène graphité, laine de roche ou fibre de bois pour les constructions écologiques), recouverts d'un enduit de finition dans le coloris de votre choix.\n\nL'isolation par l'intérieur (ITI) est privilégiée lorsque l'ITE n'est pas possible (contraintes architecturales, copropriété, bâtiment classé). Nous utilisons des doublages en laine de verre, laine de roche ou polyuréthane, fixés sur rail métallique avec un plaquistage en plaque de plâtre haute performance. L'isolation des combles perdus, réalisée par soufflage de ouate de cellulose ou de laine minérale en vrac, est l'investissement le plus rentable : dès 1 €/m², avec un retour sur investissement en moins de 3 ans.\n\nTravaux éligibles à MaPrimeRénov' (jusqu'à 75 € / m² pour une ITE), aux Certificats d'Économie d'Énergie (CEE) et à l'éco-PTZ. Aiman Renovation vous accompagne dans le montage des dossiers d'aides pour minimiser votre reste à charge.",
    process: [
      {
        step: "Audit thermique",
        detail:
          "Bilan thermique du logement, identification des zones de déperditions prioritaires, simulation des économies d'énergie.",
      },
      {
        step: "Choix de la solution",
        detail:
          "ITE, ITI ou isolation des combles : sélection de la solution optimale selon le bâtiment, le budget et les aides disponibles.",
      },
      {
        step: "Montage des aides",
        detail:
          "Constitution du dossier MaPrimeRénov', CEE et éco-PTZ. Sélection des matériaux éligibles aux certifications Acermi.",
      },
      {
        step: "Travaux d'isolation",
        detail:
          "Pose des panneaux isolants, fixation mécanique et collage, traitement des ponts thermiques, jointement.",
      },
      {
        step: "Finition et contrôle",
        detail:
          "Application de l'enduit de finition ou plaquistage, contrôle de la continuité de l'isolant, nettoyage du chantier.",
      },
    ],
    whyPro:
      "Une isolation mal exécutée peut créer des ponts thermiques, des condensations internes et des moisissures, aggravant la situation plutôt qu'en l'améliorant. Les matériaux doivent être certifiés Acermi et les travaux réalisés par un professionnel RGE (Reconnu Garant de l'Environnement) pour être éligibles aux aides financières. Aiman Renovation est qualifié RGE et vous accompagne de l'audit thermique jusqu'à la réception du chantier.",
    priceRange:
      "80 € – 200 € / m² pour une ITE, 30 € – 80 € / m² pour une ITI, 20 € – 50 € / m² pour les combles",
    seoTitle: "Isolation Thermique Haut-Rhin | ITE ITI Saint-Louis 68",
    seoDescription:
      "Isolation thermique et acoustique à Saint-Louis et Haut-Rhin. ITE, ITI, combles — MaPrimeRénov' éligible. Artisan RGE qualifié. Devis gratuit.",
    faq: [
      {
        question: "Quelles aides financières pour l'isolation en Alsace ?",
        answer:
          "En Alsace, vous pouvez bénéficier de MaPrimeRénov' (jusqu'à 75 €/m² pour une ITE), des Certificats d'Économie d'Énergie (CEE), de l'éco-PTZ (prêt à taux zéro jusqu'à 50 000 €) et de la TVA à 5,5 % sur les travaux. Aiman Renovation est qualifié RGE et vous accompagne dans le montage complet des dossiers d'aides.",
      },
      {
        question: "Quelle est la différence entre ITE et ITI pour une maison dans le Haut-Rhin ?",
        answer:
          "L'isolation thermique par l'extérieur (ITE) est plus performante car elle supprime les ponts thermiques et ne réduit pas la surface habitable. L'isolation par l'intérieur (ITI) est utilisée quand l'ITE est impossible (copropriété, bâtiment classé, contraintes architecturales). Pour les maisons individuelles du Haut-Rhin, nous recommandons l'ITE.",
      },
      {
        question: "Combien coûte une isolation par l'extérieur à Saint-Louis ?",
        answer:
          "Une isolation thermique par l'extérieur (ITE) coûte entre 80 et 200 €/m² à Saint-Louis et dans le Haut-Rhin, selon l'épaisseur de l'isolant et la finition choisie. Après déduction de MaPrimeRénov' et des CEE, le reste à charge peut être réduit de 40 à 70 %. Devis et simulation d'aides gratuits sur demande.",
      },
    ],
    relatedSlugs: ["facade", "renovation-complete", "peinture"],
  },
  {
    slug: "facade",
    title: "Ravalement de façade",
    shortTitle: "Façade",
    description:
      "Ravalement de façade, enduits, crépis et peinture extérieure. Redonnez de l'éclat à votre bâtiment tout en le protégeant des intempéries.",
    icon: "🏛️",
    features: [
      "Ravalement de façade enduit et crépi",
      "Peinture extérieure microporeuse",
      "Traitement des fissures et infiltrations",
      "Nettoyage haute pression et anti-mousse",
      "Réparation des balcons et corniches",
      "Échafaudage et balisage de sécurité",
    ],
    longDescription:
      "La façade est la première image de votre maison. Un ravalement soigné restitue l'éclat d'origine d'un bâtiment tout en le protégeant durablement contre les intempéries, les pollutions et les UV. En Alsace, le climat marqué (gel en hiver, chaleurs en été, pluies abondantes au printemps) exige des matériaux spécifiques et une mise en œuvre rigoureuse.\n\nAiman Renovation réalise des ravalements de façade complets sur maisons individuelles, pavillons et immeubles de petite taille dans tout le Haut-Rhin : Saint-Louis, Huningue, Hegenheim, Bartenheim, Blotzheim, Kembs, Rixheim, Habsheim, Mulhouse. Nos équipes interviennent sur tous les types de supports : enduit monocouche, enduit traditionnel à la chaux, crépi projeté, bardage, brique ou pierre.\n\nChaque ravalement commence par un nettoyage haute pression (150 à 250 bars) pour éliminer les salissures, mousses et lichens incrustés. Vient ensuite la réparation des fissures (bouchage à l'enduit fibré, pose de bandelettes armées pour les fissures structurelles), le traitement des remontées d'humidité et des joints de dilatation. L'enduit de finition est ensuite appliqué : gratté, taloché, ribbé ou projeté selon l'effet désiré, en monocouche ou bicouche, avec un revêtement de façade souple (RFS) pour absorber les micro-fissures.\n\nNous respectons scrupuleusement les prescriptions des Architectes des Bâtiments de France pour les secteurs protégés, et obtenons les autorisations nécessaires (déclaration préalable en mairie) avant tout démarrage de chantier. Nos interventions sont encadrées par des échafaudages certifiés et des bâches de protection des riverains.",
    process: [
      {
        step: "Diagnostic de façade",
        detail:
          "Inspection de l'état des enduits, identification des fissures, des zones de décollement et des infiltrations potentielles.",
      },
      {
        step: "Montage de l'échafaudage",
        detail:
          "Installation sécurisée de l'échafaudage, bâchage des ouvertures et protection des espaces verts adjacents.",
      },
      {
        step: "Nettoyage et décapage",
        detail:
          "Nettoyage haute pression (150-250 bars), grattage des zones décollées, brossage et traitement anti-mousse.",
      },
      {
        step: "Réparation et préparation",
        detail:
          "Rebouchage des fissures avec enduit fibré, pose d'armatures sur les fissures actives, traitement des joints.",
      },
      {
        step: "Application de l'enduit",
        detail:
          "Sous-couche d'accrochage, application de l'enduit de finition (gratté, taloché ou ribbé), coloris selon votre choix.",
      },
    ],
    whyPro:
      "Un ravalement mal exécuté peut entraîner des décollements d'enduit en 2 à 3 ans, des infiltrations d'eau dans les murs et une dégradation accélérée du bâtiment. Le montage d'un échafaudage, le choix des enduits adaptés au support et la gestion des fissures structurelles nécessitent un savoir-faire professionnel. De plus, au-delà de 20 m² de façade, le ravalement doit être déclaré en mairie. Aiman Renovation gère toutes les démarches et vous garantit un résultat qui tient dans le temps.",
    priceRange:
      "30 € – 80 € / m² pour un ravalement simple, 60 € – 120 € / m² pour un ravalement avec réparations",
    seoTitle: "Ravalement Façade Saint-Louis 68 | Haut-Rhin Alsace",
    seoDescription:
      "Ravalement de façade à Saint-Louis 68300, Mulhouse et Haut-Rhin. Enduit, crépi, peinture extérieure, traitement fissures. Artisan qualifié. Devis gratuit.",
    faq: [
      {
        question: "Quel est le prix d'un ravalement de façade dans le Haut-Rhin ?",
        answer:
          "Le coût d'un ravalement de façade à Saint-Louis et dans le Haut-Rhin varie de 30 à 80 €/m² pour un ravalement simple (nettoyage + enduit), et de 60 à 120 €/m² avec réparation de fissures et traitement des infiltrations. Pour une maison de 150 m² de façade, comptez entre 8 000 et 15 000 €. Devis gratuit après diagnostic.",
      },
      {
        question: "Faut-il une autorisation en mairie pour un ravalement de façade ?",
        answer:
          "Oui, au-delà de 20 m² de façade, une déclaration préalable de travaux en mairie est obligatoire. Dans les secteurs protégés (centre historique), l'Architecte des Bâtiments de France doit valider les matériaux et les coloris. Aiman Renovation gère toutes ces démarches administratives pour vous.",
      },
      {
        question: "Intervenez-vous pour les ravalements à Mulhouse et dans la zone frontalière ?",
        answer:
          "Oui. Nous réalisons des ravalements de façade à Saint-Louis, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Rixheim, Habsheim, Mulhouse et dans toute la zone frontalière Bâle/Alsace. Notre expérience en Alsace nous permet de choisir les enduits adaptés au climat local (cycles gel/dégel, pluies fréquentes).",
      },
    ],
    relatedSlugs: ["isolation", "peinture", "nettoyage-haute-pression"],
  },
  {
    slug: "nettoyage-haute-pression",
    title: "Nettoyage Haute Pression Eau Chaude",
    shortTitle: "Nettoyage HP",
    description:
      "Façades, toitures et sols extérieurs comme neufs grâce au nettoyage haute pression à eau chaude industrielle. Élimination garantie des mousses, lichens, algues et graffitis.",
    icon: "💧",
    features: [
      "Nettoyage haute pression eau chaude industrielle (jusqu'à 250 bars, 90°C)",
      "Façades crépies, peintes, pierre et bardage",
      "Toitures tuiles et ardoises",
      "Terrasses, dalles béton, allées, pavés",
      "Mobilier extérieur et clôtures",
      "Façades commerciales et bâtiments industriels",
      "Traitement anti-mousse / anti-algues post-nettoyage",
      "Préparation avant peinture ou ravalement",
    ],
    longDescription:
      "Le nettoyage haute pression à eau chaude industrielle est la solution la plus efficace pour redonner un aspect neuf à vos surfaces extérieures. Contrairement à un nettoyage à eau froide classique, l'eau chaude (jusqu'à 90°C) dissout instantanément les graisses, les mousses incrustées, les lichens et les salissures tenaces sans nécessiter de produits chimiques agressifs. Résultat : un nettoyage plus rapide, plus profond et plus respectueux de l'environnement.\n\nAiman Renovation intervient avec un équipement professionnel haute pression thermique dans toute la zone Saint-Louis / Bâle / Mulhouse / Lörrach. Nos techniciens adaptent la pression et la température à chaque type de surface pour un résultat optimal sans endommager le support : 60 à 100 bars pour les toitures fragiles, 150 à 250 bars pour les dalles béton et les allées.\n\nNous traitons tous les types de surfaces extérieures : façades en crépi, pierre naturelle, brique, béton, bardage bois ou composite, toitures en tuiles, ardoises ou bac acier, terrasses et allées en béton, dalle, pavés autobloquants ou grès cérame, mobilier extérieur, clôtures et murs de clôture, façades commerciales et vitrines. Un traitement préventif anti-mousse / anti-algues appliqué en fin de prestation prolonge l'effet du nettoyage de 3 à 5 ans.\n\nDans la région tri-frontalière Saint-Louis / Bâle (CH) / Lörrach (DE) / Mulhouse, peu d'artisans proposent ce service à l'eau chaude — la plupart n'utilisent que de l'eau froide. C'est une opportunité rare : une façade propre augmente la valeur perçue d'un bien, prépare idéalement un ravalement ou une peinture extérieure, et évite la dégradation prématurée des enduits par les mousses acides. Le rapport qualité/prix est imbattable : à partir de 8 €/m², soit 5 à 10 fois moins cher qu'un ravalement.",
    process: [
      {
        step: "Évaluation des surfaces",
        detail:
          "Visite technique pour identifier les types de surfaces, les salissures (mousses, lichens, graffitis, graisses), et définir la pression et la température adaptées à chaque zone.",
      },
      {
        step: "Protection des abords",
        detail:
          "Bâchage des végétaux, mobilier et ouvertures. Mise en place des protections pour éviter toute projection sur les vitres, menuiseries et voisinage.",
      },
      {
        step: "Nettoyage haute pression eau chaude",
        detail:
          "Application méthodique par zones avec équipement thermique professionnel. Pression et température adaptées à chaque surface pour éliminer 100 % des salissures sans endommager le support.",
      },
      {
        step: "Rinçage et inspection",
        detail:
          "Rinçage à l'eau froide pour éliminer les résidus. Inspection visuelle complète et retouches sur les zones récalcitrantes.",
      },
      {
        step: "Traitement préventif (en option)",
        detail:
          "Application d'un traitement anti-mousse et anti-algues longue durée (3 à 5 ans) pour prévenir la reprise de la végétation sur les façades, toitures et dalles.",
      },
    ],
    whyPro:
      "Un nettoyage haute pression mal maîtrisé peut fissurer un enduit fragile, déloger des ardoises, décoller un carrelage ou endommager les joints d'une façade. La pression et la température doivent être rigoureusement adaptées à chaque support — ce qui exige un équipement professionnel et une expérience terrain. De plus, travailler en hauteur (toitures, façades de 2e étage) nécessite un équipement de sécurité conforme. Aiman Renovation garantit un résultat impeccable sans dégradation du support, avec assurance décennale.",
    priceRange:
      "À partir de 8 €/m² pour dalles et allées, 10 à 18 €/m² pour façades, 12 à 20 €/m² pour toitures",
    faq: [
      {
        question: "Pourquoi choisir le nettoyage à eau chaude plutôt qu'à eau froide ?",
        answer:
          "L'eau chaude (jusqu'à 90°C) dissout instantanément les graisses, mousses incrustées et lichens sans produits chimiques agressifs. Le résultat est 3 à 5 fois plus profond qu'un nettoyage à eau froide classique, et les surfaces restent propres plus longtemps. Peu d'artisans dans la région tri-frontalière proposent ce service professionnel.",
      },
      {
        question: "Quel est le prix d'un nettoyage haute pression à Saint-Louis ?",
        answer:
          "Le tarif du nettoyage haute pression eau chaude à Saint-Louis et dans le Haut-Rhin commence à 8 €/m² pour les dalles et allées, de 10 à 18 €/m² pour les façades, et de 12 à 20 €/m² pour les toitures. Intervention rapide, résultat garanti. Devis gratuit après évaluation des surfaces.",
      },
      {
        question: "Nettoyez-vous les façades dans la zone Bâle/Mulhouse/Lörrach ?",
        answer:
          "Oui. Nous intervenons pour le nettoyage haute pression de façades, toitures et dalles à Saint-Louis, Mulhouse, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs et dans la zone tri-frontalière (Bâle, Lörrach, Weil am Rhein). Devis sur place, intervention rapide.",
      },
    ],
    seoTitle:
      "Nettoyage Haute Pression Eau Chaude Saint-Louis 68 | Façades Toitures",
    seoDescription:
      "Nettoyage haute pression eau chaude à Saint-Louis 68300, Mulhouse, Bâle et Lörrach. Façades, toitures, terrasses, dalles. Résultat garanti dès 8 €/m².",
    relatedSlugs: ["facade", "entretien-exterieur", "paysager"],
  },
];
