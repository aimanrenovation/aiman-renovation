/**
 * FAQ data for each city page.
 * Each city gets 3-5 locally relevant questions about renovation services.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_VILLES: Record<string, FaqItem[]> = {
  "saint-louis": [
    {
      question: "Quel est le prix moyen d'une rénovation complète à Saint-Louis ?",
      answer:
        "À Saint-Louis (68300), le prix moyen d'une rénovation complète se situe entre 800 et 1 200 €/m² selon l'état du logement et le niveau de finition souhaité. Pour un appartement de 70 m², comptez entre 56 000 et 84 000 €. Aiman Renovation vous propose un devis gratuit et détaillé sous 48h.",
    },
    {
      question: "Quelles aides financières pour rénover à Saint-Louis en 2026 ?",
      answer:
        "Les habitants de Saint-Louis peuvent bénéficier de MaPrimeRénov', de l'éco-PTZ, des CEE (Certificats d'Économie d'Énergie) et des aides de la Collectivité européenne d'Alsace. Pour une isolation ou un changement de chauffage, les aides peuvent couvrir jusqu'à 60 % du montant des travaux selon vos revenus.",
    },
    {
      question: "Intervenez-vous pour des rénovations de commerces à Saint-Louis ?",
      answer:
        "Oui, Aiman Renovation intervient pour les locaux commerciaux à Saint-Louis et dans toute l'agglomération des Trois Frontières. Nous réalisons des aménagements de boutiques, restaurants et bureaux dans le respect des normes ERP (Établissements Recevant du Public).",
    },
    {
      question: "Quel est le délai d'intervention pour des travaux à Saint-Louis ?",
      answer:
        "Basés à Saint-Louis même, nous pouvons intervenir sous 24 à 48h pour un diagnostic et établir un devis gratuit. Pour les travaux, le délai dépend de l'ampleur du projet : comptez 1 à 2 semaines pour une salle de bain, 2 à 4 semaines pour une cuisine, et 2 à 4 mois pour une rénovation complète.",
    },
    {
      question: "Proposez-vous des rénovations adaptées aux logements transfrontaliers ?",
      answer:
        "Absolument. Saint-Louis étant à la frontière suisse et allemande, nous accompagnons de nombreux propriétaires transfrontaliers. Nous comprenons les attentes en matière de qualité suisse et proposons des finitions haut de gamme à des tarifs français compétitifs.",
    },
  ],
  huningue: [
    {
      question: "Combien coûte une rénovation de salle de bain à Huningue ?",
      answer:
        "À Huningue (68330), une rénovation complète de salle de bain coûte entre 6 000 et 18 000 € selon la configuration et les équipements choisis. Une douche à l'italienne avec carrelage grand format représente un budget moyen de 9 000 à 12 000 €.",
    },
    {
      question: "Rénovez-vous les immeubles anciens du quartier de la gare à Huningue ?",
      answer:
        "Oui, nous intervenons régulièrement dans le quartier réhabilité de la gare à Huningue. Nos artisans maîtrisent les contraintes du bâti ancien : planchers bois, murs en pierre, réseaux vétustes. Nous rénovons dans le respect du cachet architectural tout en apportant le confort moderne.",
    },
    {
      question: "Intervenez-vous en copropriété à Huningue ?",
      answer:
        "Oui, nous réalisons des travaux en copropriété à Huningue : rénovation de parties privatives (cuisine, salle de bain, sols) et coordination avec le syndic pour les parties communes si nécessaire. Nous respectons les horaires de chantier et protégeons les espaces communs.",
    },
    {
      question: "Quel est votre délai de déplacement jusqu'à Huningue ?",
      answer:
        "Huningue est à seulement 2 km de notre siège à Saint-Louis, soit 5 minutes en voiture. Nous pouvons nous déplacer le jour même pour un diagnostic gratuit ou une urgence plomberie/électricité.",
    },
  ],
  "village-neuf": [
    {
      question: "Rénovez-vous les pavillons récents à Village-Neuf ?",
      answer:
        "Oui, Village-Neuf (68128) compte de nombreux lotissements pavillonnaires récents. Nous intervenons pour moderniser les cuisines, salles de bain, ajouter des extensions ou améliorer l'isolation. Même les maisons de 10-20 ans bénéficient d'une mise à jour des équipements.",
    },
    {
      question: "Quel budget prévoir pour rénover une cuisine à Village-Neuf ?",
      answer:
        "Pour une rénovation de cuisine complète à Village-Neuf, comptez entre 8 000 et 25 000 € selon la superficie et les matériaux choisis. Un projet clé en main avec meubles, plan de travail en quartz et électroménager intégré se situe autour de 15 000 à 20 000 €.",
    },
    {
      question: "Proposez-vous des travaux d'aménagement extérieur à Village-Neuf ?",
      answer:
        "Oui, nous réalisons terrasses, allées, clôtures et aménagements paysagers à Village-Neuf. Le cadre naturel en bord de Rhin se prête particulièrement bien aux terrasses en bois composite et aux jardins paysagés.",
    },
  ],
  hesingue: [
    {
      question: "Quel est le coût d'une isolation thermique à Hésingue ?",
      answer:
        "À Hésingue (68220), l'isolation thermique par l'extérieur (ITE) coûte entre 80 et 200 €/m², et l'isolation intérieure (ITI) entre 30 et 80 €/m². Pour une maison individuelle de 120 m² au sol, l'ITE représente un budget de 15 000 à 30 000 € avant aides.",
    },
    {
      question: "Rénovez-vous les lotissements récents de Hésingue ?",
      answer:
        "Oui, Hésingue compte de nombreux lotissements haut de gamme que nous rénovons régulièrement. Modernisation de cuisines, salles de bain design, pose de carrelage grand format, peinture décorative — nous proposons des prestations adaptées aux standards élevés de la commune.",
    },
    {
      question: "Intervenez-vous rapidement à Hésingue en cas d'urgence ?",
      answer:
        "Hésingue est à seulement 4 km de Saint-Louis. En cas d'urgence (fuite d'eau, panne électrique), nous pouvons intervenir dans l'heure. Appelez-nous directement pour un dépannage rapide.",
    },
  ],
  hegenheim: [
    {
      question: "Pouvez-vous rénover une maison à colombages à Hégenheim ?",
      answer:
        "Oui, Hégenheim (68220) possède de nombreuses maisons alsaciennes à colombages. Nos artisans sont formés à la rénovation du bâti traditionnel : rejointoiement, traitement des boiseries, isolation par l'intérieur respectueuse des structures anciennes, et mise aux normes électriques et sanitaires.",
    },
    {
      question: "Quel prix pour refaire une façade à Hégenheim ?",
      answer:
        "Le ravalement de façade à Hégenheim coûte entre 30 et 80 €/m² pour un ravalement simple, et entre 60 et 120 €/m² avec réparations. Pour une maison alsacienne typique, comptez 8 000 à 18 000 € selon l'état et les finitions souhaitées.",
    },
    {
      question: "Proposez-vous l'installation de bornes de recharge à Hégenheim ?",
      answer:
        "Oui, nous installons des bornes de recharge pour véhicules électriques à Hégenheim et environs. Le coût se situe entre 1 200 et 2 500 € pose comprise (avant crédit d'impôt). La proximité de la frontière suisse rend ce service particulièrement demandé.",
    },
  ],
  bartenheim: [
    {
      question: "Quel est le prix d'une rénovation d'appartement à Bartenheim ?",
      answer:
        "À Bartenheim (68870), la rénovation d'un appartement coûte en moyenne 500 à 1 000 €/m² selon les travaux. Pour un T3 de 65 m², comptez entre 32 000 et 65 000 € pour une rénovation complète incluant cuisine, salle de bain, sols et peinture.",
    },
    {
      question: "Intervenez-vous dans les zones pavillonnaires de Bartenheim ?",
      answer:
        "Oui, Bartenheim connaît une forte expansion résidentielle. Nous intervenons dans les nouveaux lotissements comme dans les maisons du centre-bourg pour tous travaux de rénovation intérieure : cuisine, salle de bain, carrelage, peinture, électricité.",
    },
    {
      question: "Combien de temps faut-il pour refaire une cuisine à Bartenheim ?",
      answer:
        "La rénovation complète d'une cuisine à Bartenheim dure en moyenne 2 à 4 semaines, incluant dépose, plomberie, électricité, carrelage et pose des meubles. Nous sommes à 6 km de Bartenheim, ce qui garantit une présence quotidienne sur le chantier.",
    },
  ],
  blotzheim: [
    {
      question: "Rénovez-vous des logements locatifs à Blotzheim ?",
      answer:
        "Oui, Blotzheim (68730) a une forte demande en rénovation locative liée à la zone aéroportuaire. Nous proposons des rénovations complètes ou partielles pour propriétaires bailleurs : rafraîchissement peinture, remplacement sols, mise aux normes électriques, rénovation salle de bain.",
    },
    {
      question: "Quel budget pour rénover un studio à Blotzheim ?",
      answer:
        "La rénovation d'un studio de 25-30 m² à Blotzheim coûte entre 12 000 et 25 000 € selon l'ampleur des travaux. Un rafraîchissement (peinture + sols) se situe autour de 5 000 à 8 000 €, tandis qu'une rénovation complète avec salle d'eau neuve démarre à 15 000 €.",
    },
    {
      question: "À quelle distance êtes-vous de Blotzheim ?",
      answer:
        "Blotzheim est à 5 km de notre siège à Saint-Louis, soit environ 8 minutes en voiture. Nous intervenons quotidiennement à Blotzheim et dans la zone EuroAirport pour des travaux de rénovation de toute envergure.",
    },
  ],
  kembs: [
    {
      question: "Pouvez-vous restaurer une maison ancienne à Kembs ?",
      answer:
        "Oui, Kembs (68680) possède un patrimoine bâti ancien riche, notamment les maisons de pêcheurs en bord du Grand Canal d'Alsace. Nous sommes spécialisés dans la restauration de bâti ancien : façades, charpentes, isolation adaptée, mise aux normes tout en préservant le cachet historique.",
    },
    {
      question: "Quel prix pour la rénovation d'un gîte à Kembs ?",
      answer:
        "La rénovation d'un gîte ou hébergement touristique à Kembs coûte entre 800 et 1 500 €/m² selon le niveau de confort visé. Kembs étant une destination touristique rhénane, nous avons l'habitude de rénover des hébergements avec des finitions soignées et des matériaux durables.",
    },
    {
      question: "Réalisez-vous des travaux de façade à Kembs ?",
      answer:
        "Oui, le ravalement de façade est l'un de nos services phares à Kembs. Nous traitons les façades traditionnelles alsaciennes, les enduits à la chaux et les crépis modernes. Budget : 30 à 120 €/m² selon l'état et les réparations nécessaires.",
    },
  ],
  sierentz: [
    {
      question: "Quel est le coût d'une rénovation de cuisine à Sierentz ?",
      answer:
        "À Sierentz (68510), une rénovation de cuisine complète coûte entre 8 000 et 25 000 € selon la superficie et les matériaux. Le centre-bourg actif attire de nouveaux résidents et la demande en rénovation est forte dans les communes environnantes.",
    },
    {
      question: "Intervenez-vous dans les communes autour de Sierentz ?",
      answer:
        "Oui, depuis Sierentz nous couvrons tout le canton : Bartenheim, Kembs, Habsheim, Blotzheim et Ottmarsheim. Sierentz est à 10 km de Saint-Louis, notre zone d'intervention naturelle.",
    },
    {
      question: "Proposez-vous des solutions d'isolation à Sierentz ?",
      answer:
        "Oui, l'isolation est essentielle dans le secteur de Sierentz où les hivers alsaciens sont rigoureux. Nous proposons l'ITE (80-200 €/m²), l'ITI (30-80 €/m²) et l'isolation des combles (20-50 €/m²). Les aides MaPrimeRénov' peuvent couvrir jusqu'à 60 % du coût.",
    },
  ],
  rixheim: [
    {
      question: "Rénovez-vous les appartements des années 60-80 à Rixheim ?",
      answer:
        "Oui, Rixheim (68170) compte de nombreux immeubles des années 1960-1980 qui nécessitent une rénovation complète. Nous intervenons pour la mise aux normes électriques, le remplacement de la plomberie, la rénovation des salles de bain et cuisines, et l'amélioration de l'isolation.",
    },
    {
      question: "Quel budget pour rénover un 3 pièces à Rixheim ?",
      answer:
        "La rénovation complète d'un T3 de 65-70 m² à Rixheim coûte entre 35 000 et 70 000 € selon l'état initial et le niveau de finition. Un rafraîchissement (peinture, sols, cuisine) se situe entre 15 000 et 25 000 €.",
    },
    {
      question: "Intervenez-vous près du Musée du Papier Peint à Rixheim ?",
      answer:
        "Oui, nous intervenons dans tout Rixheim, y compris le centre historique près de la Commanderie et du Musée du Papier Peint. Nous adaptons nos techniques au bâti ancien et patrimonial tout en apportant le confort contemporain.",
    },
  ],
  habsheim: [
    {
      question: "Pouvez-vous rénover les pavillons des années 70-90 à Habsheim ?",
      answer:
        "Oui, Habsheim (68440) compte de nombreux pavillons des années 1970-1990 qui nécessitent une remise au goût du jour : isolation par l'extérieur, remplacement des fenêtres, rénovation cuisine et salle de bain, modernisation de l'électricité. Nous proposons des rénovations complètes ou par étapes.",
    },
    {
      question: "Quel est le prix d'une peinture intérieure à Habsheim ?",
      answer:
        "La peinture intérieure à Habsheim coûte entre 20 et 45 €/m² murs et plafonds, incluant la préparation des supports et deux couches de finition. Pour une maison de 100 m² habitables, comptez entre 4 000 et 8 000 € pour l'ensemble des pièces.",
    },
    {
      question: "Êtes-vous proches de Habsheim ?",
      answer:
        "Habsheim est à 15 km de Saint-Louis, soit environ 15 minutes de trajet. Nous intervenons régulièrement à Habsheim et dans le sud de l'agglomération mulhousienne pour tous types de travaux de rénovation.",
    },
  ],
  riedisheim: [
    {
      question: "Rénovez-vous les immeubles collectifs à Riedisheim ?",
      answer:
        "Oui, Riedisheim (68400) possède un tissu dense mêlant immeubles collectifs et maisons de ville. Nous rénovons les appartements en copropriété : cuisine, salle de bain, sols, peinture, électricité. Nous coordonnons avec le syndic et respectons les règles de la copropriété.",
    },
    {
      question: "Combien coûte une rénovation de salle de bain à Riedisheim ?",
      answer:
        "À Riedisheim, une rénovation de salle de bain coûte entre 6 000 et 18 000 € selon la taille et les équipements. Une douche à l'italienne avec meuble vasque et carrelage grand format se situe entre 8 000 et 12 000 €. Devis gratuit sous 48h.",
    },
    {
      question: "Proposez-vous des rénovations énergétiques à Riedisheim ?",
      answer:
        "Oui, nous réalisons des rénovations énergétiques complètes à Riedisheim : isolation thermique, remplacement de fenêtres, installation de panneaux photovoltaïques. Les aides MaPrimeRénov' et CEE permettent de réduire significativement le coût des travaux.",
    },
  ],
  mulhouse: [
    {
      question: "Quel est le prix d'une rénovation d'appartement à Mulhouse ?",
      answer:
        "À Mulhouse (68100), le prix d'une rénovation complète d'appartement se situe entre 600 et 1 200 €/m². Pour un T3 de 70 m² dans le quartier Drouot ou au Nouveau Bassin, comptez entre 42 000 et 84 000 € pour une rénovation intégrale.",
    },
    {
      question: "Rénovez-vous les lofts et ateliers industriels à Mulhouse ?",
      answer:
        "Oui, Mulhouse regorge d'anciens espaces industriels reconvertis en lofts. Nous sommes spécialisés dans la rénovation de ces volumes atypiques : création de mezzanines, verrières industrielles, béton ciré, installations électriques apparentes style indus. Nous préservons le cachet industriel tout en apportant le confort moderne.",
    },
    {
      question: "Intervenez-vous pour la rénovation locative à Mulhouse ?",
      answer:
        "Oui, Mulhouse étant la deuxième ville d'Alsace avec une forte demande locative, nous accompagnons de nombreux investisseurs. Rénovation de studios, T2, T3 — nous optimisons le budget pour maximiser la rentabilité locative tout en offrant un logement de qualité.",
    },
    {
      question: "Êtes-vous assurés pour intervenir à Mulhouse ?",
      answer:
        "Oui, Aiman Renovation dispose d'une assurance responsabilité civile professionnelle et d'une garantie décennale couvrant l'ensemble du Haut-Rhin, Mulhouse inclus. Tous nos chantiers sont couverts, pour votre tranquillité.",
    },
  ],
  ottmarsheim: [
    {
      question: "Pouvez-vous restaurer du bâti ancien à Ottmarsheim ?",
      answer:
        "Oui, Ottmarsheim (68490) possède un patrimoine historique remarquable avec son abbaye octogonale du XIe siècle. Nous intervenons pour la restauration de maisons anciennes du village rhénan : façades, toitures, intérieurs, dans le respect du caractère patrimonial.",
    },
    {
      question: "Quel est le prix d'une rénovation de façade à Ottmarsheim ?",
      answer:
        "Le ravalement de façade à Ottmarsheim coûte entre 30 et 80 €/m² pour un ravalement simple, et 60 à 120 €/m² avec réparations structurelles. Pour une maison de village typique, le budget se situe entre 6 000 et 15 000 €.",
    },
    {
      question: "Installez-vous des panneaux photovoltaïques à Ottmarsheim ?",
      answer:
        "Oui, nous installons des panneaux photovoltaïques à Ottmarsheim et environs. Pour une installation de 3 à 6 kWc, comptez 7 000 à 15 000 € avant prime d'autoconsommation (1 000 à 2 500 €). Le bord du Rhin bénéficie d'un bon ensoleillement annuel.",
    },
  ],
  rosenau: [
    {
      question: "Rénovez-vous les maisons de campagne alsaciennes à Rosenau ?",
      answer:
        "Oui, Rosenau (68128) est une commune rurale avec un habitat individuel typiquement alsacien. Nous rénovons les maisons de campagne : cuisines rustiques modernisées, salles de bain contemporaines, isolation thermique et ravalement de façade.",
    },
    {
      question: "Quel budget pour rénover une maison à Rosenau ?",
      answer:
        "La rénovation d'une maison à Rosenau coûte entre 800 et 1 200 €/m² pour une rénovation complète. Pour une maison de 100 m², comptez entre 80 000 et 120 000 €. Des rénovations partielles (cuisine ou salle de bain seule) sont possibles dès 6 000 €.",
    },
    {
      question: "Quelle est votre distance de Rosenau ?",
      answer:
        "Rosenau est à 5 km de Saint-Louis, soit 7 minutes de trajet. Nous intervenons régulièrement dans cette commune en bord de Rhin pour des travaux de rénovation intérieure et extérieure.",
    },
  ],
  buschwiller: [
    {
      question: "Pouvez-vous rénover les maisons alsaciennes typiques de Buschwiller ?",
      answer:
        "Oui, Buschwiller (68220) est un village perché avec des maisons typiques alsaciennes. Nous rénovons ces habitations en préservant leur charme : restauration de façades, modernisation des intérieurs, isolation respectueuse du bâti ancien, mise aux normes électriques et sanitaires.",
    },
    {
      question: "Quel est le coût d'une peinture intérieure à Buschwiller ?",
      answer:
        "La peinture intérieure à Buschwiller coûte entre 20 et 45 €/m², préparation et deux couches comprises. Pour une maison typique de 90 m² habitables, comptez entre 3 500 et 7 000 € pour l'ensemble des pièces.",
    },
    {
      question: "Intervenez-vous rapidement à Buschwiller ?",
      answer:
        "Buschwiller est à 4 km de Saint-Louis, soit 6 minutes de trajet. Nous pouvons intervenir le jour même pour un diagnostic gratuit ou une urgence. La proximité nous permet d'assurer un suivi quotidien de votre chantier.",
    },
  ],
  folgensbourg: [
    {
      question: "Rénovez-vous les fermes et corps de ferme à Folgensbourg ?",
      answer:
        "Oui, Folgensbourg (68220) est un village du Sundgau avec un caractère rural préservé. Nous avons l'expérience de la rénovation de fermes alsaciennes : transformation de granges en habitation, restauration de corps de ferme, création de gîtes ruraux.",
    },
    {
      question: "Quel budget pour refaire une cuisine dans une ferme à Folgensbourg ?",
      answer:
        "La rénovation d'une cuisine dans une ferme sundgauvienne à Folgensbourg coûte entre 10 000 et 25 000 €. Les contraintes spécifiques (murs épais, sols irréguliers, aménagement de l'espace) nécessitent un savoir-faire adapté que nous maîtrisons.",
    },
    {
      question: "Proposez-vous l'isolation des combles à Folgensbourg ?",
      answer:
        "Oui, l'isolation des combles est particulièrement pertinente à Folgensbourg vu les hivers rigoureux du Sundgau. Comptez 20 à 50 €/m² pour une isolation performante. Les aides MaPrimeRénov' et CEE réduisent significativement le reste à charge.",
    },
  ],
  "hagenthal-le-bas": [
    {
      question: "Pouvez-vous rénover les maisons à colombages de Hagenthal-le-Bas ?",
      answer:
        "Oui, Hagenthal-le-Bas (68220) compte des maisons à colombages typiques du Sundgau. Nous intervenons avec des techniques adaptées au bâti ancien : isolation par l'intérieur avec frein-vapeur, enduits à la chaux, restauration des boiseries et mise aux normes modernes.",
    },
    {
      question: "Quel est le coût d'une rénovation de salle de bain à Hagenthal-le-Bas ?",
      answer:
        "Une rénovation de salle de bain à Hagenthal-le-Bas coûte entre 6 000 et 15 000 €. Dans les maisons anciennes de la vallée de la Birsig, il faut parfois adapter la plomberie aux contraintes du bâti, ce qui peut influencer le budget.",
    },
    {
      question: "Êtes-vous proches de Hagenthal-le-Bas ?",
      answer:
        "Hagenthal-le-Bas est à 6 km de Saint-Louis, soit environ 10 minutes de trajet. Nous intervenons régulièrement dans la vallée de la Birsig et le Sundgau pour des travaux de rénovation de toute envergure.",
    },
  ],
  leymen: [
    {
      question: "Rénovez-vous les maisons près du Château du Landskron à Leymen ?",
      answer:
        "Oui, Leymen (68220) est un village historique au pied du Château du Landskron. Nous rénovons les maisons du village et des environs en respectant le cadre patrimonial. Restauration de façades, intérieurs modernes, isolation thermique adaptée au bâti ancien.",
    },
    {
      question: "Quel est le prix d'une isolation thermique à Leymen ?",
      answer:
        "L'isolation thermique à Leymen coûte entre 80 et 200 €/m² par l'extérieur (ITE) et 30 à 80 €/m² par l'intérieur (ITI). Le cadre naturel boisé de Leymen impose parfois des contraintes architecturales que nous intégrons dans nos projets.",
    },
    {
      question: "Intervenez-vous pour des travaux d'électricité à Leymen ?",
      answer:
        "Oui, nous réalisons la mise aux normes NF C 15-100 et la rénovation électrique complète à Leymen. Pour une maison ancienne, comptez 5 000 à 12 000 € selon la surface et l'état de l'installation existante.",
    },
  ],
  wentzwiller: [
    {
      question: "Pouvez-vous rénover les maisons à colombages de Wentzwiller ?",
      answer:
        "Oui, Wentzwiller (68220) possède un patrimoine de maisons à colombages typiques du Sundgau rural. Nous intervenons pour la rénovation intérieure et extérieure : restauration de façades, modernisation des cuisines et salles de bain, isolation adaptée.",
    },
    {
      question: "Quel budget pour refaire les sols dans une maison à Wentzwiller ?",
      answer:
        "La pose de carrelage ou parquet à Wentzwiller coûte entre 40 et 120 €/m² pose comprise. Pour une maison de 90 m² au sol, le budget sols se situe entre 3 600 et 10 800 € selon le type de revêtement choisi.",
    },
    {
      question: "Proposez-vous des rénovations complètes à Wentzwiller ?",
      answer:
        "Oui, nous proposons des rénovations complètes clé en main à Wentzwiller : de la conception à la livraison, nous coordonnons tous les corps de métier. Budget indicatif : 30 000 à 120 000 € selon la superficie et le niveau de finition.",
    },
  ],
  "michelbach-le-bas": [
    {
      question: "Rénovez-vous les pavillons des années 90-2010 à Michelbach-le-Bas ?",
      answer:
        "Oui, Michelbach-le-Bas (68730) est composé principalement de lotissements des années 1990-2010. Nous modernisons ces pavillons : rénovation de cuisine et salle de bain, pose de carrelage moderne, peinture tendance, amélioration de l'isolation.",
    },
    {
      question: "Quel est le prix d'une rénovation de cuisine à Michelbach-le-Bas ?",
      answer:
        "Une rénovation de cuisine complète à Michelbach-le-Bas coûte entre 8 000 et 20 000 €. Les pavillons récents ont souvent des cuisines fonctionnelles mais datées : un relooking avec plan de travail neuf et crédence moderne peut se faire dès 5 000 €.",
    },
    {
      question: "À quelle distance êtes-vous de Michelbach-le-Bas ?",
      answer:
        "Michelbach-le-Bas est à 8 km de Saint-Louis, soit environ 10 minutes de route. Nous intervenons régulièrement dans ce secteur entre Saint-Louis et Bartenheim pour tous travaux de rénovation.",
    },
  ],
  ferrette: [
    {
      question: "Pouvez-vous restaurer les maisons médiévales de Ferrette ?",
      answer:
        "Oui, Ferrette (68480) est la capitale historique du Sundgau avec une vieille ville classée. Nous sommes expérimentés dans la restauration de maisons à colombages et de bâti médiéval : enduits à la chaux, restauration de pierres de taille, menuiseries traditionnelles, tout en intégrant le confort moderne.",
    },
    {
      question: "Rénovez-vous les gîtes et hôtels à Ferrette ?",
      answer:
        "Oui, Ferrette est un pôle touristique patrimonial fort et nous accompagnons les propriétaires de gîtes, chambres d'hôtes et hôtels dans leurs projets de rénovation. Salles de bain contemporaines, cuisines équipées, décoration soignée — tout en respectant le cachet historique.",
    },
    {
      question: "Quel budget pour rénover une maison à Ferrette ?",
      answer:
        "La rénovation d'une maison ancienne à Ferrette coûte entre 1 000 et 1 500 €/m² en raison des contraintes du bâti historique. Pour une maison de 80 m², comptez entre 80 000 et 120 000 €. Les aides de la Fondation du Patrimoine peuvent compléter les financements classiques.",
    },
    {
      question: "Intervenez-vous jusqu'à Ferrette depuis Saint-Louis ?",
      answer:
        "Ferrette est à 20 km de Saint-Louis, soit environ 25 minutes de route. Nous intervenons régulièrement dans le Sundgau et organisons nos déplacements pour assurer une présence quotidienne sur le chantier.",
    },
  ],
};
