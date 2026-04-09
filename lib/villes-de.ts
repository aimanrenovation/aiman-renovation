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
  {
    slug: "rheinfelden-baden",
    name: "Rheinfelden (Baden)",
    nameFr: "Rheinfelden (Bade)",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 33000,
    distance: 25,
    featuredImage: "/images/villes/rheinfelden-baden.webp",
    specificitesDE: [
      "Drittgrößte Stadt im Landkreis Lörrach",
      "Direkt am Rhein gelegen — Grenzstadt zur Schweizer Schwesterstadt",
      "Industriegeschichte mit Aluminiumindustrie und Wasserkraftwerk",
      "Vielfältiger Wohnbestand: Reihenhäuser, Wohnblöcke, Einfamilienhäuser",
      "Wachsende Wohnnachfrage durch Pendler nach Basel",
      "Energetische Sanierungen mit KfW-Förderung sehr verbreitet",
    ],
    specificitesFR: [
      "Troisième ville du Landkreis Lörrach",
      "Sur le Rhin, ville frontière jumelée à Rheinfelden Suisse",
      "Histoire industrielle (aluminium, hydroélectricité)",
      "Parc immobilier varié — maisons mitoyennes, immeubles, individuelles",
      "Demande croissante des pendulaires bâlois",
      "Rénovations énergétiques avec aide KfW fréquentes",
    ],
    seoTitleDE:
      "Renovierung Rheinfelden (Baden) | AIMAN — Französische Handwerker",
    seoDescriptionDE:
      "Renovierungen in Rheinfelden (Baden): Bad, Küche, energetische Sanierung, Fassade. Französische Qualität aus Saint-Louis — 25 km. Kostenlose Offerte.",
    seoTitleFR:
      "Rénovation Rheinfelden Baden | Artisan français Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Rheinfelden (Bade) : salle de bains, cuisine, isolation, façade. Artisan français à 25 km. Devis gratuit en 48h.",
  },
  {
    slug: "schopfheim",
    name: "Schopfheim",
    nameFr: "Schopfheim",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 19500,
    distance: 30,
    featuredImage: "/images/villes/schopfheim.webp",
    specificitesDE: [
      "Mittelzentrum im Wiesental",
      "Historische Altstadt mit gut erhaltenen Fachwerkhäusern",
      "Wohngebiete aus den 1960-1980er Jahren mit Renovierungsbedarf",
      "Tor zum Schwarzwald und Wandertourismus",
      "Pendlerstadt für Basel und Lörrach",
      "Gemischte Bevölkerung Familien und Senioren",
    ],
    specificitesFR: [
      "Centre régional du Wiesental",
      "Vieille ville historique avec maisons à colombages",
      "Quartiers résidentiels 1960-1980 à rénover",
      "Porte de la Forêt-Noire — tourisme",
      "Ville-dortoir pour Bâle et Lörrach",
      "Population familles + seniors",
    ],
    seoTitleDE:
      "Renovierung Schopfheim | AIMAN RENOVATION — Wiesental Baden",
    seoDescriptionDE:
      "Renovierung in Schopfheim (Wiesental): Fachwerk, Bad, Küche, Wärmedämmung. Französische Handwerker aus Saint-Louis — 30 km. Offerte in 48h.",
    seoTitleFR:
      "Rénovation Schopfheim (Wiesental) | Artisan français Alsace",
    seoDescriptionFR:
      "Rénovation à Schopfheim : colombages, salle de bain, cuisine, isolation. Artisan français du tri-frontière. Devis gratuit en 48h.",
  },
  {
    slug: "steinen",
    name: "Steinen",
    nameFr: "Steinen",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 10000,
    distance: 22,
    featuredImage: "/images/villes/steinen.webp",
    specificitesDE: [
      "Gemeinde im unteren Wiesental — direkt zwischen Lörrach und Schopfheim",
      "Charakteristische Reihenhäuser und Mehrfamilienhäuser der 1960-1970er",
      "Hoher Anteil Pendler nach Basel und Lörrach",
      "Erschwingliche Wohnpreise im Vergleich zur Schweiz",
      "Gut angebundene Lage an der B317",
      "Wachsendes Interesse an Sanierungen und Anbauten",
    ],
    specificitesFR: [
      "Commune du bas Wiesental, entre Lörrach et Schopfheim",
      "Maisons mitoyennes et collectifs 1960-1970",
      "Forte proportion de pendulaires Bâle/Lörrach",
      "Prix immobiliers abordables vs Suisse",
      "Bonne desserte par la B317",
      "Demande croissante en rénovation et extensions",
    ],
    seoTitleDE:
      "Renovierung Steinen (Wiesental) | AIMAN RENOVATION Frankreich",
    seoDescriptionDE:
      "Renovierung in Steinen: Reihenhäuser, Bad, Küche, Anbauten. Französische Qualität aus Saint-Louis — 22 km. Kostenlose Offerte.",
    seoTitleFR:
      "Rénovation Steinen (Wiesental) | Artisan français Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Steinen : maisons mitoyennes, salle de bain, cuisine, extensions. Artisan français à 22 km. Devis gratuit.",
  },
  {
    slug: "maulburg",
    name: "Maulburg",
    nameFr: "Maulburg",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 4000,
    distance: 26,
    featuredImage: "/images/villes/maulburg.webp",
    specificitesDE: [
      "Kleingemeinde im Wiesental",
      "Mehrheitlich Einfamilien- und Reihenhäuser",
      "Industrietradition (Brauerei, Maschinenbau)",
      "Wachstum durch Pendlerbewegung",
      "Sehr ruhige Wohnlage für Familien",
    ],
    specificitesFR: [
      "Petite commune du Wiesental",
      "Maisons individuelles et mitoyennes en majorité",
      "Tradition industrielle (brasserie, mécanique)",
      "Croissance liée aux pendulaires",
      "Cadre résidentiel calme pour familles",
    ],
    seoTitleDE:
      "Renovierung Maulburg | AIMAN RENOVATION — Wiesental Baden",
    seoDescriptionDE:
      "Renovierungen in Maulburg: Einfamilienhäuser, Bad, Küche, Wärmedämmung. Französische Handwerker — 26 km. Kostenlose Offerte in 48h.",
    seoTitleFR:
      "Rénovation Maulburg (Wiesental) | Artisan français Alsace",
    seoDescriptionFR:
      "Rénovation à Maulburg : maisons individuelles, salle de bain, cuisine, isolation. Artisan français à 26 km. Devis gratuit en 48h.",
  },
  {
    slug: "wehr",
    name: "Wehr",
    nameFr: "Wehr",
    bundesland: "Baden-Württemberg",
    kreis: "Lörrach",
    population: 13000,
    distance: 35,
    featuredImage: "/images/villes/wehr.webp",
    specificitesDE: [
      "Stadt im Hotzenwald, am Rand des Schwarzwalds",
      "Historische Altstadt mit traditionellen Häusern",
      "Vielfältiger Wohnbestand mit Altbauten und 1970er-Jahre-Häusern",
      "Tor zum Naturpark Südschwarzwald",
      "Geringere Immobilienpreise als in der Region Basel",
      "Familien suchen ruhiges Wohnen im Grünen",
    ],
    specificitesFR: [
      "Ville dans le Hotzenwald, en lisière de Forêt-Noire",
      "Vieille ville historique aux maisons traditionnelles",
      "Parc immobilier varié, anciens et années 1970",
      "Porte du parc naturel du sud de la Forêt-Noire",
      "Prix immobiliers plus bas que la région bâloise",
      "Familles cherchant calme et nature",
    ],
    seoTitleDE:
      "Renovierung Wehr (Hotzenwald) | AIMAN RENOVATION Frankreich",
    seoDescriptionDE:
      "Renovierungen in Wehr: Altbauten, Bad, Küche, Fassade, Sanierung. Französische Qualität aus Saint-Louis — 35 km. Offerte in 48h.",
    seoTitleFR:
      "Rénovation Wehr (Hotzenwald) | Artisan français Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Wehr : anciens bâtiments, salle de bain, cuisine, façade. Artisan français à 35 km. Devis gratuit.",
  },
  {
    slug: "bad-saeckingen",
    name: "Bad Säckingen",
    nameFr: "Bad Säckingen",
    bundesland: "Baden-Württemberg",
    kreis: "Waldshut",
    population: 17000,
    distance: 45,
    featuredImage: "/images/villes/bad-saeckingen.webp",
    specificitesDE: [
      "Kurstadt am Hochrhein — Thermalbad und Gesundheitstourismus",
      "Längste gedeckte Holzbrücke Europas (Alte Holzbrücke zum Stein AG)",
      "Trompeter von Säckingen — literarisches Erbe und Stadtidentität",
      "Historische Altstadt mit gut erhaltenen Barockgebäuden",
      "Wachsende Wohnnachfrage durch Pendler nach Basel und Zürich",
      "Vielfältiger Wohnbestand: Altbauten, Gründerzeithäuser, Neubauten",
    ],
    specificitesFR: [
      "Ville thermale sur le Haut-Rhin — thermes et tourisme de santé",
      "Plus long pont couvert en bois d'Europe (Alte Holzbrücke)",
      "Vieille ville historique avec bâtiments baroques",
      "Parc immobilier varié : anciens, Gründerzeit, neufs",
      "Demande résidentielle croissante des pendulaires bâlois",
    ],
    seoTitleDE:
      "Renovierung Bad Säckingen | AIMAN RENOVATION — Französische Handwerker",
    seoDescriptionDE:
      "Renovierungen in Bad Säckingen: Altbauten, Bad, Küche, Fassade. Französische Qualität aus Saint-Louis — 45 km. Kostenlose Offerte in 48h.",
    seoTitleFR:
      "Rénovation Bad Säckingen | Artisan français Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Bad Säckingen : bâtiments anciens, salle de bain, cuisine, façade. Artisan français à 45 km. Devis gratuit en 48h.",
  },
  {
    slug: "muellheim",
    name: "Müllheim",
    nameFr: "Müllheim",
    bundesland: "Baden-Württemberg",
    kreis: "Breisgau-Hochschwarzwald",
    population: 19000,
    distance: 30,
    featuredImage: "/images/villes/muellheim.webp",
    specificitesDE: [
      "Zentrum des Markgräflerlandes — Weinbau und Lebensqualität",
      "Historische Altstadt mit Fachwerkhäusern und Marktplatz",
      "Gutedel-Wein — regionaler Charakter und Weintourismus",
      "Kaserne und ehemalige Militärflächen in Wohngebiete umgewandelt",
      "Gute Verkehrsanbindung (A5, Bahnhof Müllheim-Neuenburg)",
      "Wachsende Wohngemeinde mit Zuzug aus dem Raum Freiburg und Basel",
    ],
    specificitesFR: [
      "Centre du Markgräflerland — vignoble et qualité de vie",
      "Vieille ville historique avec maisons à colombages",
      "Vin Gutedel — caractère régional et oenotourisme",
      "Anciennes casernes reconverties en zones résidentielles",
      "Bonne desserte (A5, gare Müllheim-Neuenburg)",
      "Commune résidentielle en croissance, arrivées de Fribourg et Bâle",
    ],
    seoTitleDE:
      "Renovierung Müllheim (Markgräflerland) | AIMAN RENOVATION Frankreich",
    seoDescriptionDE:
      "Renovierungen in Müllheim: Fachwerk, Bad, Küche, Fassade, Malerarbeiten. Französische Qualität aus Saint-Louis — 30 km. Offerte in 48h.",
    seoTitleFR:
      "Rénovation Müllheim (Markgräflerland) | Artisan français Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Müllheim : colombages, salle de bain, cuisine, peinture. Artisan français à 30 km. Devis gratuit en 48h.",
  },
];
