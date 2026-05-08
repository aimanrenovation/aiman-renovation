export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_SERVICES: Record<string, FaqItem[]> = {
  cuisine: [
    {
      question: "Combien coûte une rénovation de cuisine à Saint-Louis ?",
      answer:
        "Le prix d'une rénovation de cuisine à Saint-Louis varie entre 8 000 € et 25 000 € selon la superficie et les matériaux choisis. Un simple rafraîchissement (peinture, crédence, plan de travail) peut coûter 3 000 à 6 000 €, tandis qu'une rénovation complète avec plomberie, électricité, carrelage et nouveaux meubles se situe plutôt entre 12 000 et 25 000 €. Nous proposons un devis gratuit et précis après visite technique.",
    },
    {
      question: "Combien de temps dure une rénovation de cuisine ?",
      answer:
        "Une rénovation de cuisine complète dure en moyenne 2 à 4 semaines selon l'ampleur des travaux. Un simple relooking (façades, plan de travail) peut être réalisé en 3 à 5 jours. La phase la plus longue est celle des travaux techniques (plomberie, électricité, carrelage). Nous planifions le chantier pour réduire au maximum les nuisances.",
    },
    {
      question: "Peut-on rénover une cuisine en restant dans le logement ?",
      answer:
        "Oui, dans la plupart des cas il est possible de rester dans le logement pendant les travaux. Nous organisons le chantier par phases pour maintenir un accès aux sanitaires. En revanche, certaines phases impliquent une coupure d'eau et d'électricité de quelques heures. Nous vous informons à l'avance du planning détaillé.",
    },
    {
      question: "Faites-vous la cuisine clé en main ou seulement une partie des travaux ?",
      answer:
        "Aiman Renovation propose la rénovation de cuisine clé en main à Saint-Louis et dans le Haut-Rhin. Nous coordonnons tous les corps de métier : démolition, plomberie, électricité, carrelage, menuiserie, peinture et installation des équipements. Vous avez un seul interlocuteur pour l'intégralité du projet.",
    },
    {
      question: "Quels types de cuisines rénovez-vous dans le Haut-Rhin ?",
      answer:
        "Nous rénovons tous les types de cuisines : cuisine ouverte sur le séjour, cuisine fermée, cuisine en L ou en U, cuisine avec îlot central. Nous intervenons dans les appartements et maisons de Saint-Louis, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Mulhouse et la zone frontalière Bâle/Alsace.",
    },
    {
      question: "Travaillez-vous avec des matériaux écologiques pour les cuisines ?",
      answer:
        "Oui, nous proposons des matériaux écologiques et durables sur demande : plans de travail en bois certifié FSC, carrelage en grès cérame à faible émission, peintures sans solvant à base d'eau. Nous vous conseillons en fonction de votre budget et de vos priorités environnementales.",
    },
  ],

  "salle-de-bain": [
    {
      question: "Quel est le prix d'une rénovation de salle de bain à Saint-Louis ?",
      answer:
        "Le coût d'une rénovation de salle de bain à Saint-Louis varie entre 6 000 € et 18 000 € selon la taille et les équipements. Une salle de bain de 5 m² avec douche à l'italienne, carrelage et meuble vasque revient en moyenne à 8 000–12 000 €. Une grande salle de bain familiale avec baignoire, double vasque et sol chauffant peut atteindre 15 000–18 000 €. Devis gratuit après visite.",
    },
    {
      question: "Combien de temps dure la rénovation d'une salle de bain ?",
      answer:
        "Une rénovation complète de salle de bain dure en général 8 à 15 jours ouvrés. Les principales phases sont : démolition et dépose (1–2 jours), plomberie et étanchéité (2–3 jours), carrelage (3–4 jours), pose des sanitaires et finitions (2–3 jours). Nous pouvons installer des sanitaires provisoires pendant les travaux si nécessaire.",
    },
    {
      question: "Installez-vous des douches à l'italienne à Saint-Louis et dans le Haut-Rhin ?",
      answer:
        "Oui, la douche à l'italienne est notre spécialité. Nous réalisons les receveurs de douche italienne sur mesure en béton lissé ou carrelage, avec système d'étanchéité SPEC certifié DTU. Nous intervenons à Saint-Louis, Huningue, Hégenheim, Bartenheim et dans toute la zone Bâle/Haut-Rhin.",
    },
    {
      question: "Proposez-vous des salles de bain accessibles aux personnes à mobilité réduite ?",
      answer:
        "Absolument. Nous concevons des salles de bain accessibles PMR : douche plain-pied sans ressaut, barres d'appui, siège de douche rabattable, robinetterie thermostatique, sol antidérapant R11. Ces aménagements peuvent être financés via MaPrimeAdapt' (aide jusqu'à 70 % du montant des travaux).",
    },
    {
      question: "Quelle garantie sur les travaux de salle de bain ?",
      answer:
        "Tous nos travaux de plomberie, d'étanchéité et de carrelage sont couverts par la garantie décennale, valable 10 ans à compter de la réception du chantier. L'étanchéité sous carrelage (SPEC) est réalisée selon les DTU 26.2 et 52.2. Nous vous remettons un procès-verbal de réception à la fin des travaux.",
    },
    {
      question: "Peut-on transformer une baignoire en douche à Saint-Louis ?",
      answer:
        "Oui, c'est l'une de nos interventions les plus fréquentes. Nous déposons la baignoire existante, réalisons l'étanchéité et le receveur de douche à l'italienne, puis posons le carrelage. L'opération prend généralement 3 à 5 jours. C'est un excellent investissement : la douche italienne est très appréciée et valorise le logement.",
    },
  ],

  electricite: [
    {
      question: "Combien coûte une mise aux normes électrique à Saint-Louis ?",
      answer:
        "Le prix d'une mise aux normes électrique à Saint-Louis varie entre 3 000 € et 12 000 € selon la superficie du logement et l'état de l'installation existante. Un appartement de 60 m² revient en moyenne à 4 000–6 000 €. Une maison de 120 m² avec remplacement complet du tableau et du câblage peut atteindre 8 000–12 000 €. Diagnostic et devis gratuits.",
    },
    {
      question: "Mon installation électrique est-elle aux normes NF C 15-100 ?",
      answer:
        "La norme NF C 15-100 impose notamment : un tableau électrique récent avec disjoncteurs différentiels, une mise à la terre de toutes les prises, des circuits dédiés pour les équipements puissants (four, lave-linge), des prises courant en salles de bain hors zone 0/1. Nous réalisons un diagnostic gratuit pour identifier les points de non-conformité.",
    },
    {
      question: "Êtes-vous certifiés pour les travaux électriques dans le Haut-Rhin ?",
      answer:
        "Oui, nos électriciens sont qualifiés pour tous les travaux d'installation et de rénovation électrique. Nous fournissons une attestation de conformité Consuel à l'issue des travaux importants, obligatoire pour déclarer les travaux à votre assurance et indispensable en cas de vente du bien.",
    },
    {
      question: "Installez-vous la domotique à Saint-Louis et dans le Haut-Rhin ?",
      answer:
        "Oui, nous proposons des solutions de domotique : pilotage de l'éclairage, des volets roulants et du chauffage depuis smartphone ou tablette. Nous travaillons avec les marques Legrand, Schneider et Somfy, compatibles avec les assistants vocaux (Google Home, Amazon Alexa). Idéal pour les maisons neuves comme pour la rénovation.",
    },
    {
      question: "Quelle est la durée des travaux pour une rénovation électrique complète ?",
      answer:
        "Une rénovation électrique complète d'un appartement de 70 m² prend généralement 5 à 8 jours ouvrés. Pour une maison, comptez 8 à 15 jours selon la surface et la complexité. Nous effectuons les travaux de câblage avant la pose des revêtements (carrelage, peinture) pour ne pas devoir reprendre.",
    },
  ],

  plomberie: [
    {
      question: "Combien coûte une rénovation de plomberie à Saint-Louis ?",
      answer:
        "Le coût d'une rénovation de plomberie à Saint-Louis varie de 2 000 € à 10 000 € selon le nombre de points d'eau et la complexité. Le remplacement d'un chauffe-eau coûte 800–1 500 € fourni et posé. La rénovation complète du réseau d'une maison de 120 m² (remplacement des canalisations en plomb par du PER) revient à 5 000–8 000 €.",
    },
    {
      question: "Intervenez-vous en urgence pour les fuites d'eau à Saint-Louis ?",
      answer:
        "Oui, nous proposons un service de dépannage d'urgence 24h/24 et 7j/7 pour les fuites d'eau et les dégâts des eaux à Saint-Louis et dans le Haut-Rhin. Appelez le 06 33 49 69 25 pour une intervention rapide. Nous stoppons le sinistre et établissons un devis de remise en état.",
    },
    {
      question: "Remplacez-vous les tuyaux en plomb dans les logements anciens ?",
      answer:
        "Absolument. De nombreux logements anciens du Haut-Rhin (construits avant les années 1980) possèdent encore des canalisations en plomb, dangereuses pour la santé. Nous remplaçons entièrement ces réseaux vétustes par des canalisations modernes en PER ou multicouche, conformes aux normes sanitaires en vigueur.",
    },
    {
      question: "Installez-vous des chauffe-eau thermodynamiques dans le Haut-Rhin ?",
      answer:
        "Oui, nous installons des chauffe-eau thermodynamiques (CET) et des ballons d'eau chaude solaires. Le CET peut diviser par 3 votre consommation électrique pour l'eau chaude sanitaire. Ces équipements sont éligibles à MaPrimeRénov' et aux Certificats d'Économie d'Énergie (CEE). Nous constituons les dossiers d'aides pour vous.",
    },
    {
      question: "Quelle garantie proposez-vous sur vos travaux de plomberie ?",
      answer:
        "Tous nos travaux de plomberie sont couverts par la garantie décennale. En cas de fuite survenant dans les 10 ans suivant la réception du chantier, nous intervenons pour réparer sans frais. Nous réalisons également des tests de pression à la fin de chaque chantier pour valider l'étanchéité du réseau.",
    },
  ],

  peinture: [
    {
      question: "Quel est le tarif d'un peintre à Saint-Louis et dans le Haut-Rhin ?",
      answer:
        "Le prix d'un peintre professionnel à Saint-Louis varie entre 20 € et 45 € par m² de murs et plafonds, préparation et 2 couches comprises. Pour un appartement de 70 m² (environ 250 m² de surfaces à peindre), comptez entre 5 000 € et 8 000 €. Ce tarif inclut la protection du mobilier, le rebouchage, le primaire et les finitions. Devis gratuit sous 48h.",
    },
    {
      question: "Travaillez-vous en dehors des heures de bureau pour réduire les nuisances ?",
      answer:
        "Oui, nous adaptons nos horaires de chantier à votre situation. Pour les locaux commerciaux, nous pouvons intervenir en soirée ou le week-end. Pour les appartements occupés, nous organisons les travaux par pièce pour maintenir un espace de vie fonctionnel. Nous utilisons des peintures à faible émission de COV pour la qualité de l'air intérieur.",
    },
    {
      question: "Proposez-vous des enduits décoratifs à Saint-Louis ?",
      answer:
        "Oui, nous réalisons tous les enduits décoratifs : tadelakt (effet hammam), stuc vénitien, béton ciré mural, badigeon à la chaux. Ces techniques artisanales s'appliquent sur des supports sains et bien préparés. Elles sont idéales pour les salles de bain, cuisines et séjours qui recherchent un caractère unique. Sur devis selon la surface et la complexité.",
    },
    {
      question: "Posez-vous du papier peint et des revêtements muraux ?",
      answer:
        "Oui, nous posons toutes sortes de revêtements muraux : papier peint traditionnel, papier intissé, revêtements vinyliques, toile de verre, lambris. Nous préparons soigneusement les murs (enlevage de l'ancien papier, ragréage, primaire) pour garantir un résultat sans décollements ni bulles.",
    },
    {
      question: "Quelles marques de peinture utilisez-vous ?",
      answer:
        "Nous utilisons exclusivement des peintures de marques professionnelles : Tollens, Sikkens, Zolpan, Dulux. Ces gammes professionnelles offrent une meilleure couvrance, une durabilité supérieure et une finition plus homogène que les peintures grand public. Nous sélectionnons le produit adapté à chaque support et à chaque pièce.",
    },
  ],

  "sols-carrelage": [
    {
      question: "Quel est le prix de la pose de carrelage à Saint-Louis ?",
      answer:
        "Le prix de pose de carrelage à Saint-Louis varie de 40 € à 120 € par m² selon le type de revêtement et la complexité de la pose. Un carrelage standard (30x30) posé droit coûte 40–55 €/m². Un grand format (80x80 ou 120x60) avec ragréage revient à 70–100 €/m². Le béton ciré ou la résine de sol se situe entre 80–120 €/m². Prix pose comprise, matériaux non fournis.",
    },
    {
      question: "Posez-vous du parquet massif et du parquet contrecollé ?",
      answer:
        "Oui, nous posons tous les types de parquet : parquet massif cloué ou collé, parquet contrecollé flottant, parquet stratifié. Nous réalisons également le ponçage et la vitrification de parquets anciens. L'installation commence toujours par un contrôle de la planéité et de l'humidité du support pour garantir la durabilité.",
    },
    {
      question: "Réalisez-vous le ragréage avant la pose du sol ?",
      answer:
        "Le ragréage est une étape essentielle que nous réalisons systématiquement si le support présente des irrégularités. Nous utilisons des chapes fluides autonivelantes pour obtenir une surface parfaitement plane sous laser. Sans ce travail préparatoire, le carrelage craque et le parquet grince. C'est une garantie de durabilité incluse dans nos devis.",
    },
    {
      question: "Intervenez-vous pour des sols extérieurs et des terrasses ?",
      answer:
        "Oui, nous posons des carrelages extérieurs sur terrasses, allées et espaces de vie en plein air. Nous sélectionnons des grès cérame certifiés antidérapants (classe R11-R13) et des colle et joint adaptés au gel (-30 °C). Pose sur plots réglables ou en collage selon votre configuration. Devis gratuit sur site.",
    },
    {
      question: "Que comprend votre prestation de pose de sols ?",
      answer:
        "Notre prestation inclut : évaluation et préparation du support (ragréage si nécessaire), plan de calepinage, découpe à l'outillage diamant, pose du revêtement, jointoiement avec joint de couleur assortie, pose des plinthes et barres de seuil inox, nettoyage approfondi du chantier. Garantie conforme aux DTU 52.1 et 52.2.",
    },
  ],

  "renovation-complete": [
    {
      question: "Quel est le prix d'une rénovation complète à Saint-Louis ?",
      answer:
        "Le prix d'une rénovation complète à Saint-Louis varie de 30 000 € à 120 000 € selon la superficie, l'état du logement et le niveau de finition. Un appartement de 60 m² à rénover entièrement (électricité, plomberie, carrelage, peinture, salle de bain, cuisine) revient en moyenne à 40 000–65 000 €. Nous établissons un devis global détaillé après visite technique gratuite.",
    },
    {
      question: "Gérez-vous toute la coordination des artisans ?",
      answer:
        "Oui, c'est le principal avantage de notre offre clé en main. Aiman Renovation coordonne l'ensemble des corps de métier : maçonnerie, plomberie, électricité, carrelage, parquet, peinture, cuisine et salle de bain. Un seul interlocuteur, un seul devis global, un planning de chantier tenu. Vous n'avez pas à chercher et gérer plusieurs artisans.",
    },
    {
      question: "Pouvez-vous abattre des cloisons pour ouvrir mon espace de vie ?",
      answer:
        "Oui, nous réalisons la démolition de cloisons non-porteuses pour créer des espaces ouverts. Avant toute démolition, nous vérifions la nature des murs (porteurs ou non) et réalisons si nécessaire un diagnostic structurel. Pour les murs porteurs, nous posons un linteau métallique (IPN) avec les autorisations nécessaires.",
    },
    {
      question: "Obtenez-vous les autorisations d'urbanisme nécessaires ?",
      answer:
        "Oui, nous prenons en charge les démarches administratives : déclaration préalable de travaux en mairie pour les modifications de façade, demande de permis de construire si les travaux dépassent certains seuils. En copropriété, nous rédigeons la demande d'autorisation à soumettre en assemblée générale.",
    },
    {
      question: "Intervenez-vous sur des maisons alsaciennes à colombages ?",
      answer:
        "Oui, nos équipes connaissent les spécificités des constructions alsaciennes : structures à colombages, enduits à la chaux, planchers bois anciens, isolation par l'intérieur sans dénaturer le bâti. Nous travaillons en conformité avec les règles des Architectes des Bâtiments de France pour les zones protégées du Haut-Rhin.",
    },
    {
      question: "Proposez-vous des solutions de financement pour les grandes rénovations ?",
      answer:
        "Oui, nous vous orientons vers les aides disponibles : MaPrimeRénov' (jusqu'à 70 % pour les rénovations énergétiques), éco-PTZ (prêt à taux zéro jusqu'à 50 000 €), Certificats d'Économie d'Énergie (CEE), TVA à 10 % pour les travaux de rénovation. Nous montons les dossiers d'aides en partenariat avec des conseillers France Rénov'.",
    },
  ],

  isolation: [
    {
      question: "Combien coûte une isolation thermique par l'extérieur (ITE) dans le Haut-Rhin ?",
      answer:
        "Le prix d'une ITE dans le Haut-Rhin varie entre 80 € et 200 € par m² de façade selon l'isolant choisi (polystyrène graphité, laine de roche ou fibre de bois) et la finition (enduit, bardage). Avant aides, une maison de 100 m² avec 150 m² de façade revient à 12 000–25 000 €. Avec MaPrimeRénov', jusqu'à 75 €/m² sont remboursés. Devis gratuit.",
    },
    {
      question: "Quelles aides sont disponibles pour une isolation en Alsace ?",
      answer:
        "Les aides cumulables pour l'isolation en Alsace en 2026 : MaPrimeRénov' (jusqu'à 75 €/m² pour une ITE, selon les revenus), CEE (Certificats d'Économie d'Énergie versés par les fournisseurs d'énergie), éco-PTZ (prêt sans intérêts jusqu'à 50 000 €), TVA à 5,5 %. Aiman Renovation est qualifié RGE, condition obligatoire pour accéder à ces aides.",
    },
    {
      question: "Quelle différence entre isolation par l'extérieur (ITE) et par l'intérieur (ITI) ?",
      answer:
        "L'ITE est plus performante car elle supprime les ponts thermiques et n'empiète pas sur la surface habitable. Elle est idéale pour les maisons individuelles. L'ITI est choisie quand l'ITE n'est pas possible (façade classée, copropriété, contraintes architecturales). Elle réduit légèrement la surface des pièces (5–8 cm par mur). Nous vous conseillons la solution optimale lors de la visite.",
    },
    {
      question: "Isolez-vous les combles à Saint-Louis et dans le Haut-Rhin ?",
      answer:
        "Oui, l'isolation des combles perdus par soufflage de ouate de cellulose ou de laine minérale est l'investissement le plus rentable en isolation. À partir de 20–50 €/m², le retour sur investissement est inférieur à 3 ans. En Alsace, les combles représentent 25 à 30 % des déperditions thermiques. Nous réalisons aussi l'isolation des combles aménagés.",
    },
    {
      question: "Êtes-vous certifiés RGE pour les travaux d'isolation ?",
      answer:
        "Oui, Aiman Renovation est qualifié RGE (Reconnu Garant de l'Environnement), certification obligatoire pour que vos travaux d'isolation soient éligibles aux aides financières (MaPrimeRénov', CEE, éco-PTZ). Nous vous accompagnons dans le montage des dossiers de subvention pour maximiser vos aides.",
    },
  ],

  facade: [
    {
      question: "Quel est le prix d'un ravalement de façade dans le Haut-Rhin ?",
      answer:
        "Le prix d'un ravalement de façade dans le Haut-Rhin varie entre 30 € et 120 € par m² selon l'état de la façade, le type d'enduit et la nécessité de réparations. Un ravalement simple (nettoyage + enduit) coûte 30–50 €/m². Un ravalement avec traitement de fissures et enduit de finition revient à 60–120 €/m². Échafaudage inclus dans nos devis.",
    },
    {
      question: "Faut-il une autorisation pour rénover sa façade à Saint-Louis ?",
      answer:
        "Pour un simple ravalement à l'identique (même couleur et même aspect), une déclaration préalable de travaux en mairie de Saint-Louis est requise au-delà de 20 m². Si vous changez la couleur ou l'aspect de la façade, l'autorisation est systématiquement nécessaire. Nous gérons les démarches administratives à votre place.",
    },
    {
      question: "Intervenez-vous sur les maisons alsaciennes avec enduit à la chaux ?",
      answer:
        "Oui, nous maîtrisons les techniques de ravalement sur maisons alsaciennes traditionnelles : enduit à la chaux naturelle NHL, badigeon chaux, rejointoiement de pierres apparentes. Ces matériaux respirants sont essentiels pour les bâtiments anciens afin d'éviter les problèmes d'humidité et de condensation intérieure.",
    },
    {
      question: "Traitez-vous les fissures avant le ravalement ?",
      answer:
        "Oui, le traitement des fissures est une étape incontournable avant tout ravalement. Nous distinguons les fissures passives (rebouchage à l'enduit fibré) des fissures actives ou structurelles (pose de bandelettes armées, injection de résine). Les infiltrations d'eau au niveau des fissures sont systématiquement traitées pour éviter toute récidive.",
    },
    {
      question: "Combien de temps dure un ravalement de façade ?",
      answer:
        "Un ravalement de façade d'une maison individuelle prend généralement 1 à 3 semaines selon la superficie et les travaux de réparation nécessaires. La durée inclut le montage et le démontage de l'échafaudage, le nettoyage, les réparations et la projection de l'enduit. Nous planifions les travaux en tenant compte des conditions météo.",
    },
  ],

  "borne-recharge": [
    {
      question: "Combien coûte l'installation d'une borne de recharge à Saint-Louis ?",
      answer:
        "L'installation d'une borne de recharge (wallbox) à Saint-Louis coûte entre 1 200 € et 2 500 € pose comprise, avant aides. Après le crédit d'impôt de 300 € (30 % du coût total, plafond 3 000 €) et la prime ADVENIR en copropriété (jusqu'à 1 730 € par point de charge), le coût réel peut descendre à 700–1 500 €.",
    },
    {
      question: "Êtes-vous certifiés IRVE dans le Haut-Rhin ?",
      answer:
        "Oui, Aiman Renovation dispose de la certification IRVE (Infrastructure de Recharge pour Véhicule Électrique), obligatoire pour les bornes supérieures à 3,7 kW et nécessaire pour bénéficier du crédit d'impôt et de la prime ADVENIR. Notre certification garantit une installation conforme et sécurisée.",
    },
    {
      question: "Installez-vous des bornes de recharge en copropriété ?",
      answer:
        "Oui, nous prenons en charge les projets d'installation en copropriété, y compris l'étude technique, le passage en assemblée générale et le raccordement individuel au tableau de chaque appartement. La loi oblige les copropriétés à ne pas s'opposer à l'installation d'une borne individuelle. Nous vous guidons dans toutes les démarches.",
    },
    {
      question: "Quelle puissance choisir pour sa borne de recharge ?",
      answer:
        "Pour une utilisation domestique standard (recharge nocturne), une wallbox de 7,4 kW est suffisante et compatible avec la plupart des installations électriques. Si vous avez deux véhicules électriques ou un camping-car, une borne de 11 à 22 kW est recommandée sous réserve de la puissance du compteur. Nous évaluons votre installation lors de la visite.",
    },
  ],

  "panneaux-photovoltaiques": [
    {
      question: "Quel est le prix des panneaux solaires à Saint-Louis en 2026 ?",
      answer:
        "L'installation de panneaux photovoltaïques à Saint-Louis coûte entre 7 000 € et 15 000 € pour une installation de 3 à 6 kWc (avant aides). Avec la prime à l'autoconsommation (jusqu'à 1 500 € pour 3 kWc) et la TVA réduite à 10 %, le coût réel est significativement réduit. Le retour sur investissement est généralement de 8 à 12 ans.",
    },
    {
      question: "Le Haut-Rhin est-il adapté à l'énergie solaire ?",
      answer:
        "Oui, le Haut-Rhin bénéficie d'un ensoleillement favorable avec plus de 1 700 heures de soleil par an, supérieur à la moyenne nationale. Une installation de 3 kWc à Saint-Louis produit en moyenne 2 800 à 3 200 kWh par an, soit 30 à 50 % de la consommation annuelle d'un foyer de 4 personnes.",
    },
    {
      question: "Êtes-vous certifiés RGE pour les panneaux solaires dans le Haut-Rhin ?",
      answer:
        "Oui, Aiman Renovation est qualifié RGE, certification indispensable pour que votre installation soit éligible à la prime à l'autoconsommation, à la TVA réduite à 10 % et au tarif de rachat EDF OA garanti sur 20 ans. Sans installateur RGE, vous ne pouvez pas bénéficier de ces aides significatives.",
    },
    {
      question: "Gérez-vous les démarches avec Enedis et EDF pour le raccordement ?",
      answer:
        "Oui, nous prenons en charge toutes les démarches administratives : déclaration préalable en mairie, demande de raccordement Enedis, contrat d'obligation d'achat avec EDF OA. Vous n'avez aucune démarche à effectuer. Nous suivons le dossier jusqu'à la mise en service et vous remettons le dossier technique complet.",
    },
  ],

  paysager: [
    {
      question: "Quel est le prix d'un aménagement paysager à Saint-Louis ?",
      answer:
        "Le prix d'un aménagement paysager à Saint-Louis varie de 5 000 € à 30 000 € selon la surface et les aménagements souhaités. Une terrasse en dalles de 20 m² revient à 3 000–6 000 €. Un aménagement complet (terrasse, allée, plantations, éclairage) pour un jardin de 200 m² peut atteindre 15 000–25 000 €. Devis gratuit sur site.",
    },
    {
      question: "Quels matériaux utilisez-vous pour les terrasses en Alsace ?",
      answer:
        "Nous sélectionnons des matériaux adaptés au climat alsacien (gel, pluie) : dalles en grès cérame grand format, dallage en pierre reconstituée, terrasse en bois composite résistant aux UV et au gel, carreaux de béton sur plots réglables. Chaque matériau est testé pour résister aux cycles gel/dégel spécifiques au Haut-Rhin.",
    },
    {
      question: "Intervenez-vous à Bâle et dans la zone transfrontalière pour l'aménagement extérieur ?",
      answer:
        "Oui, nous intervenons dans la zone trinationale Bâle/Alsace/Sud-Bade pour l'aménagement paysager. Notre équipe connaît les contraintes réglementaires de chaque côté de la frontière et les essences végétales adaptées à ce microenvironnement. Nos devis peuvent être établis en euros ou en francs suisses selon votre préférence.",
    },
  ],

  "depannage-urgence": [
    {
      question: "Intervenez-vous en urgence la nuit et le week-end à Saint-Louis ?",
      answer:
        "Oui, notre service de dépannage est disponible 24h/24, 7j/7, y compris les nuits, week-ends et jours fériés. Pour toute urgence plomberie ou électricité à Saint-Louis, Huningue, Hégenheim et dans le Haut-Rhin, appelez le 06 33 49 69 25. Un technicien se déplace dans les meilleurs délais pour stopper le sinistre.",
    },
    {
      question: "Quel est le tarif d'un dépannage d'urgence à Saint-Louis ?",
      answer:
        "Le déplacement et le diagnostic d'urgence sont facturés à partir de 90 €. La réparation est ensuite devisée sur place selon la complexité du problème. En cas de dégât des eaux, nous vous aidons à constituer votre dossier d'assurance pour obtenir le remboursement des frais de remise en état.",
    },
    {
      question: "Intervenez-vous pour les dégâts des eaux à Bâle et en Suisse ?",
      answer:
        "Oui, nous intervenons pour les urgences plomberie et les dégâts des eaux dans la zone transfrontalière : Saint-Louis, Huningue, Village-Neuf, Hégenheim côté français, et dans la région de Bâle côté suisse. Notre connaissance du terrain nous permet d'intervenir rapidement de part et d'autre de la frontière.",
    },
  ],

  "entretien-exterieur": [
    {
      question: "Proposez-vous des contrats d'entretien annuels pour les jardins à Saint-Louis ?",
      answer:
        "Oui, nous proposons des abonnements d'entretien annuels adaptés à votre jardin : fréquence hebdomadaire, bimensuelle ou mensuelle, avec un programme de soins saisonniers (tonte, taille, traitement, ramassage). À partir de 150 €/mois, vous bénéficiez d'un suivi régulier sans vous en préoccuper.",
    },
    {
      question: "Faites-vous le nettoyage haute pression des terrasses ?",
      answer:
        "Oui, nous disposons d'un équipement professionnel de nettoyage haute pression eau chaude (jusqu'à 250 bars, 90 °C) pour redonner un aspect neuf à vos terrasses, allées, façades et toitures. L'eau chaude élimine mousses, lichens et graisses sans produits chimiques agressifs. À partir de 8 €/m².",
    },
    {
      question: "Intervenez-vous pour l'entretien des jardins dans toute la zone frontalière ?",
      answer:
        "Oui, nous intervenons pour l'entretien des espaces extérieurs à Saint-Louis, Huningue, Hégenheim, Bartenheim, Blotzheim, Kembs, Rixheim, Habsheim et dans les communes frontalières côté Bâle. Contactez-nous pour un devis d'abonnement annuel ou une intervention ponctuelle.",
    },
  ],

  "nettoyage-haute-pression": [
    {
      question: "Quelle est la différence entre nettoyage haute pression eau froide et eau chaude ?",
      answer:
        "L'eau chaude (jusqu'à 90 °C) est nettement plus efficace pour éliminer les graisses, lichens incrustés et mousses récalcitrantes. Un nettoyage à eau chaude produit un résultat équivalent à 2–3 passages à eau froide, dans un temps deux fois moins long. C'est aussi plus écologique : moins besoin de produits chimiques dégraissants.",
    },
    {
      question: "Combien coûte le nettoyage haute pression à Saint-Louis ?",
      answer:
        "Nos tarifs démarrent à 8 €/m² pour les dalles et allées, 10–18 €/m² pour les façades et 12–20 €/m² pour les toitures. Le nettoyage d'une terrasse de 50 m² revient à 400–600 €, une façade de maison de 150 m² à 1 500–2 700 €. Devis gratuit sur site, avec visite d'évaluation des surfaces.",
    },
    {
      question: "Le nettoyage haute pression peut-il abîmer les façades fragiles ?",
      answer:
        "Entre les mains de professionnels, non. Nous adaptons systématiquement la pression et la température à chaque type de surface : 60–80 bars pour les enduits fragiles et les toitures, 120–250 bars pour le béton, les dalles et les allées. Nos techniciens sont formés pour tester la pression sur une zone cachée avant d'intervenir sur toute la surface.",
    },
    {
      question: "Intervenez-vous à Bâle et dans la région trinationale pour le nettoyage ?",
      answer:
        "Oui, nous couvrons la zone Saint-Louis / Bâle / Lörrach / Mulhouse pour le nettoyage haute pression. Peu d'artisans de la région proposent le nettoyage à eau chaude industrielle — c'est notre spécialité. Nous intervenons sur façades, toitures, terrasses et sols extérieurs côté français comme côté suisse.",
    },
  ],
};
