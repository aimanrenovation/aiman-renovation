export interface VilleFR {
  slug: string;
  name: string;
  codePostal: string;
  population?: number;
  distance: number; // km depuis Saint-Louis
  featuredImage: string;
  specificites: string[]; // 3-5 points uniques (histoire, architecture, économie)
  communesAlentours: string[];
  seoTitle: string;
  seoDescription: string;
}

export const VILLES_FR: VilleFR[] = [
  {
    slug: "saint-louis",
    name: "Saint-Louis",
    codePostal: "68300",
    population: 21000,
    distance: 0,
    featuredImage: "/images/villes/saint-louis.webp",
    specificites: [
      "À 2 minutes en voiture de Bâle (Suisse) et de l'autoroute A35",
      "Port rhénan actif, canal du Rhône au Rhin",
      "Quartier République avec immeubles XVIIIe et XIXe siècles",
      "Proximité directe de l'EuroAirport Bâle-Mulhouse",
      "Zone franche et tissu économique transfrontalier fort",
    ],
    communesAlentours: ["Huningue", "Village-Neuf", "Hésingue", "Hégenheim", "Blotzheim"],
    seoTitle: "Rénovation Saint-Louis (68300) | Artisan AIMAN",
    seoDescription:
      "Artisan rénovation à Saint-Louis 68300 — cuisine, salle de bain, carrelage, peinture. 19 ans d'expérience. Devis gratuit sous 48h, intervention rapide.",
  },
  {
    slug: "huningue",
    name: "Huningue",
    codePostal: "68330",
    population: 7000,
    distance: 2,
    featuredImage: "/images/villes/huningue.webp",
    specificites: [
      "Frontière suisse directe, pont du Rhin vers Bâle",
      "Parc des Eaux Vives en bord de Rhin",
      "Architecture XIXe marquée par l'histoire militaire (citadelle de Vauban)",
      "Quartier gare réhabilité, forte pression immobilière transfrontalière",
    ],
    communesAlentours: ["Saint-Louis", "Village-Neuf", "Rosenau", "Kembs", "Hégenheim"],
    seoTitle: "Rénovation Huningue (68330) | Artisan AIMAN",
    seoDescription:
      "Rénovation intérieure et extérieure à Huningue 68330. Artisan qualifié proche frontière suisse. Cuisine, salle de bain, peinture. Devis gratuit.",
  },
  {
    slug: "village-neuf",
    name: "Village-Neuf",
    codePostal: "68128",
    population: 3000,
    distance: 3,
    featuredImage: "/images/villes/village-neuf.webp",
    specificites: [
      "Commune riveraine du Grand Canal d'Alsace",
      "Zones résidentielles récentes avec lotissements pavillonnaires",
      "Cadre naturel en bord de Rhin, espace vert classé",
    ],
    communesAlentours: ["Huningue", "Saint-Louis", "Rosenau", "Ottmarsheim", "Kembs"],
    seoTitle: "Rénovation Village-Neuf (68128) | Artisan AIMAN",
    seoDescription:
      "Artisan rénovation à Village-Neuf 68128, bord du Rhin. Travaux intérieurs et extérieurs. Devis gratuit sous 48h, intervention rapide.",
  },
  {
    slug: "hesingue",
    name: "Hésingue",
    codePostal: "68220",
    population: 2000,
    distance: 4,
    featuredImage: "/images/villes/hesingue.webp",
    specificites: [
      "Commune résidentielle aisée en périphérie de Saint-Louis",
      "Proximité immédiate de l'EuroAirport Bâle-Mulhouse (2 km)",
      "Lotissements récents, maisons individuelles à hauts standards",
    ],
    communesAlentours: ["Saint-Louis", "Blotzheim", "Hégenheim", "Bartenheim", "Buschwiller"],
    seoTitle: "Rénovation Hésingue (68220) | Artisan AIMAN",
    seoDescription:
      "Rénovation maison à Hésingue 68220, proche EuroAirport. Peinture, carrelage, isolation, salle de bain. Artisan local. Devis gratuit.",
  },
  {
    slug: "hegenheim",
    name: "Hégenheim",
    codePostal: "68220",
    population: 3000,
    distance: 4,
    featuredImage: "/images/villes/hegenheim.webp",
    specificites: [
      "Village à la frontière directe avec la Suisse (Canton de Bâle-Ville)",
      "Maisons alsaciennes à colombages caractéristiques",
      "Tissu pavillonnaire mixte, ancienne ferme viticole reconvertie",
    ],
    communesAlentours: ["Saint-Louis", "Hésingue", "Buschwiller", "Blotzheim", "Folgensbourg"],
    seoTitle: "Rénovation Hégenheim (68220) | Artisan AIMAN",
    seoDescription:
      "Artisan rénovation à Hégenheim 68220. Maisons alsaciennes, rénovation cuisine et salle de bain. Devis gratuit, intervention rapide depuis Saint-Louis.",
  },
  {
    slug: "bartenheim",
    name: "Bartenheim",
    codePostal: "68870",
    population: 3000,
    distance: 6,
    featuredImage: "/images/villes/bartenheim.webp",
    specificites: [
      "Commune du Sundgau avec gare TER ligne Mulhouse–Bâle",
      "Zones pavillonnaires en expansion, population croissante",
      "Centre bourg alsacien avec mairie et commerces de proximité",
    ],
    communesAlentours: ["Sierentz", "Hésingue", "Blotzheim", "Saint-Louis", "Michelbach-le-Bas"],
    seoTitle: "Rénovation Bartenheim (68870) | Artisan AIMAN",
    seoDescription:
      "Rénovation intérieure à Bartenheim 68870 (Sundgau). Cuisine, peinture, carrelage, isolation. Artisan de confiance. Devis gratuit sous 48h.",
  },
  {
    slug: "blotzheim",
    name: "Blotzheim",
    codePostal: "68730",
    population: 4000,
    distance: 5,
    featuredImage: "/images/villes/blotzheim.webp",
    specificites: [
      "Commune attenante à l'EuroAirport Bâle-Mulhouse",
      "Tissu résidentiel dense, forte demande en rénovation locative",
      "Développement économique lié à la zone aéroportuaire",
    ],
    communesAlentours: ["Saint-Louis", "Hésingue", "Bartenheim", "Michelbach-le-Bas", "Hégenheim"],
    seoTitle: "Rénovation Blotzheim (68730) | Artisan AIMAN",
    seoDescription:
      "Artisan rénovation à Blotzheim 68730, proche aéroport Bâle-Mulhouse. Tous travaux intérieurs. Devis gratuit, réponse sous 48h.",
  },
  {
    slug: "kembs",
    name: "Kembs",
    codePostal: "68680",
    population: 5000,
    distance: 8,
    featuredImage: "/images/villes/kembs.webp",
    specificites: [
      "Écluse historique du Rhin, patrimoine industriel hydraulique classé",
      "Bord du Grand Canal d'Alsace, pisciculture traditionnelle",
      "Maisons de pêcheurs et bâti ancien à restaurer",
      "Destination touristique rhénane avec hébergements à rénover",
    ],
    communesAlentours: ["Sierentz", "Village-Neuf", "Huningue", "Ottmarsheim", "Bartenheim"],
    seoTitle: "Rénovation Kembs (68680) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation bâti ancien et maisons à Kembs 68680, bord du Rhin. Artisan qualifié. Façade, peinture, carrelage. Devis gratuit.",
  },
  {
    slug: "sierentz",
    name: "Sierentz",
    codePostal: "68510",
    population: 3000,
    distance: 10,
    featuredImage: "/images/villes/sierentz.webp",
    specificites: [
      "Chef-lieu de canton du Haut-Rhin, centre bourg actif",
      "Église Saint-Laurent du XIXe siècle, architecture religieuse alsacienne",
      "Communes rurales environnantes en plein développement résidentiel",
    ],
    communesAlentours: ["Bartenheim", "Kembs", "Habsheim", "Blotzheim", "Ottmarsheim"],
    seoTitle: "Rénovation Sierentz (68510) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Sierentz 68510, chef-lieu de canton. Cuisine, salle de bain, peinture, isolation. Devis gratuit sous 48h.",
  },
  {
    slug: "rixheim",
    name: "Rixheim",
    codePostal: "68170",
    population: 14000,
    distance: 18,
    featuredImage: "/images/villes/rixheim.webp",
    specificites: [
      "Musée du Papier Peint, unique en Europe, bâtiment historique classé",
      "Commanderie teutonique du XIIIe siècle, patrimoine médiéval",
      "Banlieue résidentielle de Mulhouse, immeubles des années 1960–1980",
    ],
    communesAlentours: ["Mulhouse", "Habsheim", "Riedisheim", "Sierentz", "Ottmarsheim"],
    seoTitle: "Rénovation Rixheim (68170) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation appartement et maison à Rixheim 68170, proche Mulhouse. Carrelage, cuisine, peinture. Artisan local. Devis gratuit.",
  },
  {
    slug: "habsheim",
    name: "Habsheim",
    codePostal: "68440",
    population: 5000,
    distance: 15,
    featuredImage: "/images/villes/habsheim.webp",
    specificites: [
      "Commune résidentielle sud de l'agglomération mulhousienne",
      "Aérodrome d'Habsheim, base de vol à moteur et ULM",
      "Pavillons individuels des années 1970–1990 en besoin de rénovation",
    ],
    communesAlentours: ["Sierentz", "Rixheim", "Mulhouse", "Riedisheim", "Kembs"],
    seoTitle: "Rénovation Habsheim (68440) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Habsheim 68440. Travaux cuisine, salle de bain, sols, peinture. Intervention rapide depuis Saint-Louis. Devis gratuit.",
  },
  {
    slug: "riedisheim",
    name: "Riedisheim",
    codePostal: "68400",
    population: 12000,
    distance: 18,
    featuredImage: "/images/villes/riedisheim.webp",
    specificites: [
      "Banlieue résidentielle directe de Mulhouse, tissu dense",
      "Parc Alfred Wallach, espace vert majeur du secteur",
      "Mix immeubles collectifs et maisons de ville à rénover",
    ],
    communesAlentours: ["Mulhouse", "Rixheim", "Habsheim", "Ottmarsheim", "Sierentz"],
    seoTitle: "Rénovation Riedisheim (68400) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation intérieure à Riedisheim 68400. Artisan qualifié, cuisine, salle de bain, carrelage, peinture. Devis gratuit sous 48h.",
  },
  {
    slug: "mulhouse",
    name: "Mulhouse",
    codePostal: "68100",
    population: 110000,
    distance: 20,
    featuredImage: "/images/villes/mulhouse.webp",
    specificites: [
      "Cité de l'Automobile — Musée national de l'automobile, plus grande collection au monde",
      "Immeubles Art Nouveau remarquables, quartier Drouot",
      "Nouveau Bassin et quartier Dornach, projets de rénovation urbaine",
      "Tissu industriel reconverti, lofts et ateliers à rénover",
      "Deuxième ville d'Alsace, forte demande en rénovation locative",
    ],
    communesAlentours: ["Riedisheim", "Rixheim", "Habsheim", "Illzach", "Wittenheim"],
    seoTitle: "Rénovation Mulhouse (68100) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Mulhouse 68. Appartements, maisons, commerces. Cuisine, salle de bain, peinture, carrelage. Devis gratuit.",
  },
  {
    slug: "ottmarsheim",
    name: "Ottmarsheim",
    codePostal: "68490",
    population: 2000,
    distance: 12,
    featuredImage: "/images/villes/ottmarsheim.webp",
    specificites: [
      "Abbaye octogonale du XIe siècle classée Monument Historique",
      "Centrale hydroélectrique du Rhin, patrimoine industriel du XXe",
      "Village rhénan avec bâti ancien à restaurer",
    ],
    communesAlentours: ["Kembs", "Village-Neuf", "Rixheim", "Sierentz", "Habsheim"],
    seoTitle: "Rénovation Ottmarsheim (68490) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation maison et bâti ancien à Ottmarsheim 68490, bord du Rhin. Artisan qualifié. Peinture, carrelage, façade. Devis gratuit.",
  },
  {
    slug: "rosenau",
    name: "Rosenau",
    codePostal: "68128",
    population: 2000,
    distance: 5,
    featuredImage: "/images/villes/rosenau.webp",
    specificites: [
      "Commune rurale en bord du Rhin, zones naturelles protégées",
      "Habitat individuel et maisons de campagne alsaciennes",
      "Environnement calme, proximité directe de Saint-Louis",
    ],
    communesAlentours: ["Village-Neuf", "Huningue", "Saint-Louis", "Kembs", "Ottmarsheim"],
    seoTitle: "Rénovation Rosenau (68128) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Rosenau 68128, bord du Rhin. Travaux intérieurs et extérieurs. Devis gratuit, intervention depuis Saint-Louis.",
  },
  {
    slug: "buschwiller",
    name: "Buschwiller",
    codePostal: "68220",
    population: 800,
    distance: 4,
    featuredImage: "/images/villes/buschwiller.webp",
    specificites: [
      "Petit village perché sur une colline avec vue sur Bâle et le Rhin",
      "Maisons typiques alsaciennes, cadre résidentiel calme",
    ],
    communesAlentours: ["Saint-Louis", "Hégenheim", "Hésingue", "Folgensbourg", "Hagenthal-le-Bas"],
    seoTitle: "Rénovation Buschwiller (68220) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation maison à Buschwiller 68220, vue sur Bâle. Peinture, carrelage, salle de bain. Artisan local. Devis gratuit.",
  },
  {
    slug: "folgensbourg",
    name: "Folgensbourg",
    codePostal: "68220",
    population: 1000,
    distance: 7,
    featuredImage: "/images/villes/folgensbourg.webp",
    specificites: [
      "Village du Sundgau avec vignoble alsacien",
      "Caractère rural préservé, fermes et corps de ferme à rénover",
    ],
    communesAlentours: ["Hégenheim", "Buschwiller", "Hagenthal-le-Bas", "Wentzwiller", "Saint-Louis"],
    seoTitle: "Rénovation Folgensbourg (68220) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Folgensbourg 68220 (Sundgau). Fermes alsaciennes, intérieurs. Peinture, carrelage, cuisine. Devis gratuit.",
  },
  {
    slug: "hagenthal-le-bas",
    name: "Hagenthal-le-Bas",
    codePostal: "68220",
    population: 1000,
    distance: 6,
    featuredImage: "/images/villes/hagenthal-le-bas.webp",
    specificites: [
      "Commune en vallée de la Birsig, à la frontière suisse",
      "Paysage bocager typique du Sundgau, maisons à colombages",
    ],
    communesAlentours: ["Buschwiller", "Folgensbourg", "Hégenheim", "Leymen", "Wentzwiller"],
    seoTitle: "Rénovation Hagenthal-le-Bas (68220) | Artisan AIMAN",
    seoDescription:
      "Rénovation maison à Hagenthal-le-Bas 68220, vallée de la Birsig. Artisan local. Peinture, sols, salle de bain. Devis gratuit.",
  },
  {
    slug: "leymen",
    name: "Leymen",
    codePostal: "68220",
    population: 1000,
    distance: 10,
    featuredImage: "/images/villes/leymen.webp",
    specificites: [
      "Château du Landskron, patrimoine médiéval du XIIe siècle",
      "Village frontière Sundgau-Suisse, cadre naturel boisé",
    ],
    communesAlentours: ["Hagenthal-le-Bas", "Wentzwiller", "Folgensbourg", "Hégenheim", "Buschwiller"],
    seoTitle: "Rénovation Leymen (68220) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Artisan rénovation à Leymen 68220 (Sundgau). Château du Landskron, village historique. Cuisine, peinture, carrelage. Devis gratuit.",
  },
  {
    slug: "wentzwiller",
    name: "Wentzwiller",
    codePostal: "68220",
    population: 800,
    distance: 9,
    featuredImage: "/images/villes/wentzwiller.webp",
    specificites: [
      "Sundgau rural, maisons à colombages typiques",
      "Commune préservée, habitat individuel à rénover",
    ],
    communesAlentours: ["Leymen", "Hagenthal-le-Bas", "Folgensbourg", "Michelbach-le-Bas", "Bartenheim"],
    seoTitle: "Rénovation Wentzwiller (68220) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation maison à Wentzwiller 68220. Maisons alsaciennes, peinture, carrelage, cuisine. Artisan local. Devis gratuit.",
  },
  {
    slug: "michelbach-le-bas",
    name: "Michelbach-le-Bas",
    codePostal: "68730",
    population: 1000,
    distance: 8,
    featuredImage: "/images/villes/michelbach-le-bas.webp",
    specificites: [
      "Petit village résidentiel entre Saint-Louis et Bartenheim",
      "Habitat pavillonnaire récent, lotissements des années 1990–2010",
    ],
    communesAlentours: ["Bartenheim", "Blotzheim", "Hésingue", "Wentzwiller", "Sierentz"],
    seoTitle: "Rénovation Michelbach-le-Bas (68730) | Artisan AIMAN",
    seoDescription:
      "Artisan rénovation à Michelbach-le-Bas 68730. Peinture, carrelage, salle de bain, cuisine. Intervention rapide. Devis gratuit.",
  },
  {
    slug: "ferrette",
    name: "Ferrette",
    codePostal: "68480",
    population: 800,
    distance: 20,
    featuredImage: "/images/villes/ferrette.webp",
    specificites: [
      "Capitale historique du Sundgau, ville médiévale authentique",
      "Château de Ferrette, ruines du XIIe siècle avec vue panoramique",
      "Maisons à colombages typiques, vieille ville classée",
      "Tourisme patrimonial fort, hôtels et gîtes à rénover",
    ],
    communesAlentours: ["Leymen", "Folgensbourg", "Wentzwiller", "Hagenthal-le-Bas", "Rosenau"],
    seoTitle: "Rénovation Ferrette (68480) | Artisan AIMAN Haut-Rhin",
    seoDescription:
      "Rénovation maison et bâti ancien à Ferrette 68480, capitale du Sundgau. Artisan qualifié. Peinture, carrelage, façade. Devis gratuit.",
  },
];
