export interface VilleDE {
  slug: string;
  name: string;
  nameFr: string;
  bundesland: string;
  kreis: string;
  population?: number;
  distance: number; // km depuis Saint-Louis
  featuredImage: string;
  specificitesDE: string[];
  specificitesFR: string[];
  seoTitleDE: string;
  seoDescriptionDE: string;
  seoTitleFR: string;
  seoDescriptionFR: string;
}

export const VILLES_DE: VilleDE[] = [
  {
    slug: "weil-am-rhein",
    name: "Weil am Rhein",
    nameFr: "Weil-am-Rhein",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 30000,
    distance: 3,
    featuredImage: "/images/villes/weil-am-rhein.webp",
    specificitesDE: [
      "Direkt an der französischen Grenze gelegen",
      "Vitra Design Museum — international bekannte Architektur",
      "Dreiländereck Deutschland–Frankreich–Schweiz",
      "Dreiländerbrücke über den Rhein",
      "Neue Wohnquartiere in Wachstumsstadtgebiet",
      "Pharma-Umgebung (Novartis & Roche nahe Basel)",
    ],
    specificitesFR: [
      "Directement à la frontière française",
      "Musée du design Vitra",
      "Triangle des trois pays",
      "Nouveaux quartiers résidentiels en expansion",
      "Environnement pharma (Novartis / Roche)",
    ],
    seoTitleDE: "Renovierung Weil am Rhein – Handwerker aus Frankreich",
    seoDescriptionDE:
      "Aiman Renovation renoviert Ihre Immobilie in Weil am Rhein. Nur 3 km von Saint-Louis: Küche, Bad, Fliesen, Fassade. Kostenloser Kostenvoranschlag in EUR.",
    seoTitleFR: "Rénovation Weil am Rhein | Artisan frontalier France",
    seoDescriptionFR:
      "Artisan français à 3 km de Weil am Rhein. Rénovation cuisine, salle de bain, carrelage, façade. Devis gratuit en euros. Qualité française, prix compétitifs.",
  },
  {
    slug: "loerrach",
    name: "Lörrach",
    nameFr: "Lörrach",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 48000,
    distance: 10,
    featuredImage: "/images/villes/loerrach.webp",
    specificitesDE: [
      "Große Kreisstadt des Landkreises Lörrach",
      "Historische Altstadt mit Fachwerkhäusern",
      "Dreiländereck-Region mit starkem Wirtschaftsraum",
      "Lörracher Hinterland und Schwarzwaldhänge",
      "Stadtteil Stetten mit Wohnbebauung",
      "Kulturzentrum mit Burgruine Rötteln",
    ],
    specificitesFR: [
      "Grande ville du Landkreis Lörrach",
      "Centre historique avec maisons à colombages",
      "Région économique Dreiländereck",
      "Quartier Stetten résidentiel",
      "Ruine du château de Rötteln",
    ],
    seoTitleDE: "Renovierung Lörrach – Französischer Handwerker",
    seoDescriptionDE:
      "Ihr Renovierungspartner in Lörrach: Küche, Bad, Malerarbeiten, Fassade. Aiman Renovation aus Saint-Louis — 10 km Anfahrt, faire Preise in EUR.",
    seoTitleFR: "Rénovation Lörrach (Bade-Wurtemberg) | Artisan français",
    seoDescriptionFR:
      "Artisan français pour vos travaux à Lörrach. Rénovation complète, cuisine, salle de bain, peinture, façade. À 10 km de Saint-Louis. Devis gratuit.",
  },
  {
    slug: "grenzach-wyhlen",
    name: "Grenzach-Wyhlen",
    nameFr: "Grenzach-Wyhlen",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 14000,
    distance: 10,
    featuredImage: "/images/villes/grenzach-wyhlen.webp",
    specificitesDE: [
      "Direkt am Rheinufer gelegen",
      "DSM Nutritional Products — großer Industriestandort",
      "Attraktive Wohngemeinde mit gutem Infrastrukturanschluss",
      "Zwei historische Ortsteile: Grenzach und Wyhlen",
      "Nahe zu Basel und Rheinfelden",
      "Familiäre Wohnlage mit Einfamilienhäusern",
    ],
    specificitesFR: [
      "Au bord du Rhin",
      "Site industriel DSM Nutritional Products",
      "Commune résidentielle attractive",
      "Deux villages historiques fusionnés",
      "Proche de Bâle et Rheinfelden",
    ],
    seoTitleDE: "Renovierung Grenzach-Wyhlen – Artisan Saint-Louis",
    seoDescriptionDE:
      "Renovierungsarbeiten in Grenzach-Wyhlen: Badezimmer, Küche, Böden, Fassade. Aiman Renovation aus Saint-Louis — 10 km, kostenloser Kostenvoranschlag.",
    seoTitleFR: "Rénovation Grenzach-Wyhlen | Artisan français voisin",
    seoDescriptionFR:
      "Travaux de rénovation à Grenzach-Wyhlen par artisan français. Salle de bain, cuisine, sols, façade. Devis gratuit en euros. À 10 km de Saint-Louis.",
  },
  {
    slug: "binzen",
    name: "Binzen",
    nameFr: "Binzen",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 3000,
    distance: 8,
    featuredImage: "/images/villes/binzen.webp",
    specificitesDE: [
      "Traditionelles Weindorf im Markgräflerland",
      "Historische Fachwerkhäuser im Ortskern",
      "Weinbau und ländliche Atmosphäre",
      "Markgräflerwein — regionaler Charakter",
      "Ruhige Wohnlage nahe der Grenze",
      "Einfamilienhäuser und Hofgüter",
    ],
    specificitesFR: [
      "Village viticole traditionnel du Markgräflerland",
      "Maisons à colombages historiques",
      "Vignoble et ambiance rurale",
      "Habitat pavillonnaire et fermes",
    ],
    seoTitleDE: "Renovierung Binzen – Handwerker Markgräflerland",
    seoDescriptionDE:
      "Renovierungsarbeiten in Binzen im Markgräflerland. Fachwerk, Küche, Bad, Malerarbeiten. Aiman Renovation aus Saint-Louis — 8 km. Gratis Kostenvoranschlag.",
    seoTitleFR: "Rénovation Binzen Markgräflerland | Artisan frontalier",
    seoDescriptionFR:
      "Artisan français pour vos travaux à Binzen. Rénovation colombages, cuisine, salle de bain, peinture. À 8 km de Saint-Louis. Devis gratuit en euros.",
  },
  {
    slug: "eimeldingen",
    name: "Eimeldingen",
    nameFr: "Eimeldingen",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 2000,
    distance: 7,
    featuredImage: "/images/villes/eimeldingen.webp",
    specificitesDE: [
      "Kleines ländliches Dorf im Landkreis Lörrach",
      "Weinbau und Obstbau prägen das Landschaftsbild",
      "Typische Einfamilienhäuser und Bestandsgebäude",
      "Ruhige Wohnlage mit Grünflächen",
      "Nähe zu Weil am Rhein und Grenzach",
      "Lokale Gemeinschaft und Vereinsleben",
    ],
    specificitesFR: [
      "Petit village rural du Landkreis",
      "Vignoble et arboriculture",
      "Maisons individuelles typiques",
      "Cadre résidentiel paisible",
    ],
    seoTitleDE: "Renovierung Eimeldingen – Handwerker aus Saint-Louis",
    seoDescriptionDE:
      "Renovierungspartner für Eimeldingen: Innenrenovierung, Bad, Küche, Malerarbeiten. Aiman Renovation — nur 7 km von Saint-Louis. Kostenvoranschlag gratis.",
    seoTitleFR: "Rénovation Eimeldingen | Artisan français à 7 km",
    seoDescriptionFR:
      "Artisan français pour vos travaux à Eimeldingen. Cuisine, salle de bain, peinture, sols. À seulement 7 km de Saint-Louis. Devis gratuit en euros.",
  },
  {
    slug: "kandern",
    name: "Kandern",
    nameFr: "Kandern",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 8000,
    distance: 18,
    featuredImage: "/images/villes/kandern.webp",
    specificitesDE: [
      "Historische Kleinstadt im Markgräflerland",
      "Rosenfels-Park — bekannter Stadtpark mit Ruine",
      "Historische Altstadt mit Steingebäuden",
      "Weinbau und Tourismus als Wirtschaftsfaktoren",
      "Schwarzwald-Ausläufer und Wanderwege",
      "Keramik- und Töpfertradition",
    ],
    specificitesFR: [
      "Petite ville historique du Markgräflerland",
      "Parc de Rosenfels avec ruine",
      "Vieille ville en pierres",
      "Vignoble, tourisme et céramique",
      "Contreforts de la Forêt-Noire",
    ],
    seoTitleDE: "Renovierung Kandern – Handwerker Markgräflerland BW",
    seoDescriptionDE:
      "Renovierungsarbeiten in Kandern: Historische Altbauten, Küche, Bad, Fassade, Steinarbeiten. Aiman Renovation aus Saint-Louis — 18 km. Kostenlos anfragen.",
    seoTitleFR: "Rénovation Kandern (Markgräflerland) | Artisan français",
    seoDescriptionFR:
      "Artisan français pour rénovation à Kandern. Bâtiments anciens, cuisine, salle de bain, façade, pierre. À 18 km de Saint-Louis. Devis gratuit en euros.",
  },
];
