export interface VilleCH {
  slug: string;
  name: string; // nom allemand (Basel, Allschwil, ...)
  nameFr: string; // nom français (Bâle, ...)
  canton: "BS" | "BL" | "SO";
  population?: number;
  distance: number; // km depuis Saint-Louis
  featuredImage: string;
  specificitesDE: string[]; // 3-5 points en allemand (SEO allemand)
  specificitesFR: string[];
  seoTitleDE: string; // priorité allemand
  seoDescriptionDE: string;
  seoTitleFR: string;
  seoDescriptionFR: string;
}

export const VILLES_CH: VilleCH[] = [
  {
    slug: "basel",
    name: "Basel",
    nameFr: "Bâle",
    canton: "BS",
    population: 170000,
    distance: 5,
    featuredImage: "/images/villes/basel.webp",
    specificitesDE: [
      "Historische Altstadt mit Basler Münster und mittelalterlichen Gassen",
      "Quartiere St. Johann und Kleinbasel mit hohem Renovierungsbedarf",
      "Novartis-Campus und Roche-Türme — moderne Umgebung, hochwertige Standards",
      "Direkte Grenzlage zu Frankreich: kurze Anfahrt von Saint-Louis (5 Min.)",
      "Kunstmuseum und Kulturerbe — Eigentümer mit hohen Ansprüchen an Handwerksqualität",
    ],
    specificitesFR: [
      "Vieille ville historique avec la cathédrale de Bâle",
      "Quartiers St. Johann et Kleinbasel en pleine rénovation",
      "Campus Novartis et Tours Roche — standards élevés",
      "Accès direct depuis Saint-Louis en 5 minutes",
    ],
    seoTitleDE: "Renovierung in Basel | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Basel: Ihr französischer Handwerker aus Saint-Louis. Küche, Bad, Böden, Fassade. 30–40% günstiger als Schweizer Betriebe. Offerte kostenlos.",
    seoTitleFR: "Rénovation à Bâle | Artisan frontalier Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Bâle (BS) : artisan français qualifié depuis Saint-Louis. Cuisine, salle de bain, sols, façade. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "allschwil",
    name: "Allschwil",
    nameFr: "Allschwil",
    canton: "BL",
    population: 21000,
    distance: 5,
    featuredImage: "/images/villes/allschwil.webp",
    specificitesDE: [
      "Direkte Grenzgemeinde zu Hégenheim — kürzeste Anfahrt aus dem Elsass",
      "Pharma- und Biotech-Standort: viele Fachkräfte mit Anspruch an gehobene Renovierungen",
      "Zahlreiche Einfamilienhäuser der 1980er-Jahre mit Sanierungsbedarf",
      "Ruhige Wohngemeinde, Familien und Eigenheimbesitzer als Hauptzielgruppe",
    ],
    specificitesFR: [
      "Commune frontalière avec Hégenheim — accès immédiat depuis le Haut-Rhin",
      "Pôle pharma et biotech : clientèle exigeante",
      "Nombreuses maisons individuelles des années 80 à rénover",
    ],
    seoTitleDE: "Renovierung Allschwil | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Allschwil (BL): Handwerker aus Saint-Louis, direkte Grenzgemeinde. Küche, Bad, Böden, Malerarbeiten. Offerte in CHF. Kostenlos und unverbindlich.",
    seoTitleFR: "Rénovation à Allschwil | Artisan frontalier 68",
    seoDescriptionFR:
      "Rénovation à Allschwil (BL) : artisan français depuis Saint-Louis, commune frontalière. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "binningen",
    name: "Binningen",
    nameFr: "Binningen",
    canton: "BL",
    population: 15000,
    distance: 7,
    featuredImage: "/images/villes/binningen.webp",
    specificitesDE: [
      "Gehobene Wohngemeinde direkt an Basel angrenzend",
      "Zahlreiche Reihenhäuser aus den 1960er und 1970er Jahren — hoher Renovierungsbedarf",
      "Mittelschicht und Fachkräfte aus der Pharmabranche als typische Auftraggeber",
      "Ruhige Hanglage mit Blick auf Basel — attraktive Wohnqualität",
    ],
    specificitesFR: [
      "Commune résidentielle haut de gamme adjacente à Bâle",
      "Maisons mitoyennes des années 60-70 à rénover",
      "Clientèle cadres et professions libérales",
    ],
    seoTitleDE: "Renovierung Binningen | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Binningen (BL): erfahrener Handwerker aus Saint-Louis. Badezimmer, Küche, Dämmung, Malerarbeiten. Offerte in CHF — schnell und zuverlässig.",
    seoTitleFR: "Rénovation à Binningen | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Binningen (BL) : artisan qualifié depuis Saint-Louis. Salle de bain, cuisine, isolation. Devis gratuit en CHF.",
  },
  {
    slug: "bottmingen",
    name: "Bottmingen",
    nameFr: "Bottmingen",
    canton: "BL",
    population: 6000,
    distance: 8,
    featuredImage: "/images/villes/bottmingen.webp",
    specificitesDE: [
      "Schloss Bottmingen — historisches Wasserschloss prägt das Ortsbild",
      "Gehobene Wohnlage mit hochwertigen Immobilien und anspruchsvollen Eigentümern",
      "Kleine, exklusive Gemeinde mit starkem Heimwerkerbedarf bei denkmalgeschützten Objekten",
      "Ruhiges Villenquartier, Eigenheimbesitzer legen Wert auf Qualität",
    ],
    specificitesFR: [
      "Château de Bottmingen — village historique avec propriétés d'exception",
      "Commune résidentielle haut de gamme",
      "Propriétaires exigeants sur la qualité des travaux",
    ],
    seoTitleDE: "Renovierung Bottmingen | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Bottmingen (BL): Qualitätshandwerker aus Saint-Louis für gehobene Objekte. Innen- und Aussenrenovierung, Fassade, Bad. Offerte kostenlos.",
    seoTitleFR: "Rénovation à Bottmingen | Artisan frontalier qualifié",
    seoDescriptionFR:
      "Rénovation à Bottmingen (BL) : artisan français pour travaux haut de gamme. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "riehen",
    name: "Riehen",
    nameFr: "Riehen",
    canton: "BS",
    population: 21000,
    distance: 8,
    featuredImage: "/images/villes/riehen.webp",
    specificitesDE: [
      "Vornehmes Quartier von Basel-Stadt mit alten Villen und Kirschenplantagen",
      "Fondation Beyeler — internationales Kunstflair, wohlhabende Einwohner",
      "Historische Bürgerhäuser und Altbauten mit Renovierungspotenzial",
      "Grenzgemeinde zu Deutschland (Weil am Rhein) — Dreiländereck-Lage",
      "Hohe Kaufkraft, Eigentümer schätzen französisches Handwerk und Sorgfalt",
    ],
    specificitesFR: [
      "Quartier huppé de Bâle-Ville avec villas historiques",
      "Fondation Beyeler — habitants aisés et exigeants",
      "Maisons de maître et bâtiments anciens à rénover",
    ],
    seoTitleDE: "Renovierung Riehen | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Riehen (BS): Handwerker aus Saint-Louis für anspruchsvolle Objekte. Altbausanierung, Küche, Bad, Fassade. Offerte kostenlos in CHF.",
    seoTitleFR: "Rénovation à Riehen | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Riehen (BS) : artisan qualifié pour villas et bâtiments anciens. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "birsfelden",
    name: "Birsfelden",
    nameFr: "Birsfelden",
    canton: "BL",
    population: 10000,
    distance: 8,
    featuredImage: "/images/villes/birsfelden.webp",
    specificitesDE: [
      "Rheinhafen und Industriestandort — Umnutzung von Lagerhallen und Gewerbeflächen",
      "Arbeiterquartiere mit Mehrfamilienhäusern aus den 1950er–1970er Jahren",
      "Grosse Nachfrage nach Gesamtsanierungen bei älteren Wohngebäuden",
      "Gute Anbindung an Basel und an das Elsass",
    ],
    specificitesFR: [
      "Port rhénan et zone industrielle en reconversion",
      "Immeubles des années 50-70 à rénover",
      "Forte demande de rénovation complète",
    ],
    seoTitleDE: "Renovierung Birsfelden | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Birsfelden (BL): erfahrener Handwerker für Wohn- und Gewerbeimmobilien. Gesamtsanierung, Böden, Bad, Malerarbeiten. Offerte kostenlos.",
    seoTitleFR: "Rénovation à Birsfelden | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Birsfelden (BL) : artisan français pour immeubles et maisons. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "muttenz",
    name: "Muttenz",
    nameFr: "Muttenz",
    canton: "BL",
    population: 17000,
    distance: 10,
    featuredImage: "/images/villes/muttenz.webp",
    specificitesDE: [
      "St.-Arbogast-Kirche mit historischen Fresken — UNESCO-würdiges Kulturerbe",
      "Mischung aus Industrie- und Wohngemeinde mit starkem Wachstum",
      "Neue Wohnquartiere neben alten Bauernhäusern — breites Renovierungsspektrum",
      "Gute S-Bahn-Anbindung an Basel — attraktiv für Pendler",
    ],
    specificitesFR: [
      "Église St-Arbogast avec fresques historiques remarquables",
      "Commune mixte industrie/résidentiel en expansion",
      "Large éventail de rénovations : neufs et anciens",
    ],
    seoTitleDE: "Renovierung Muttenz | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Muttenz (BL): Ihr Handwerker aus Saint-Louis für Wohn- und Gewerbeimmobilien. Küche, Bad, Böden, Fassade. Kostenlose Offerte in CHF.",
    seoTitleFR: "Rénovation à Muttenz | Artisan frontalier qualifié",
    seoDescriptionFR:
      "Rénovation à Muttenz (BL) : artisan depuis Saint-Louis. Cuisine, salle de bain, sol, façade. Devis gratuit en CHF.",
  },
  {
    slug: "reinach-bl",
    name: "Reinach",
    nameFr: "Reinach",
    canton: "BL",
    population: 19000,
    distance: 12,
    featuredImage: "/images/villes/reinach-bl.webp",
    specificitesDE: [
      "Grosse Wohnvorstadt mit zahlreichen Mehrfamilienhäusern aus den 1970er–1980er Jahren",
      "Hoher Sanierungsbedarf: Fassaden, Fenster, Böden, Bäder",
      "Zweitgrösste Gemeinde des Kantons BL — breite Kundenbasis",
      "Gute Verkehrsanbindung über die A18 Richtung Basel und Lörrach",
    ],
    specificitesFR: [
      "Grande banlieue résidentielle avec nombreux immeubles des années 70-80",
      "Fort besoin de rénovation : façades, sols, salles de bain",
      "Deuxième commune du canton BL",
    ],
    seoTitleDE: "Renovierung Reinach BL | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Reinach (BL): Handwerker aus Saint-Louis für Mehrfamilienhäuser und Einfamilienhäuser. Gesamtsanierung, Bad, Fassade. Offerte in CHF.",
    seoTitleFR: "Rénovation à Reinach BL | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Reinach (BL) : artisan français pour appartements et maisons. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "oberwil-bl",
    name: "Oberwil",
    nameFr: "Oberwil",
    canton: "BL",
    population: 11000,
    distance: 9,
    featuredImage: "/images/villes/oberwil-bl.webp",
    specificitesDE: [
      "Historisches Dorfzentrum mit Fachwerkgebäuden und alten Bauernhäusern",
      "Ruhige Wohngemeinde im Leimental, beliebt bei Familien",
      "Gemischte Bebauung: Neubauten neben historischen Altbauten",
      "Nähe zum Naturschutzgebiet Leimental — grüne Wohnlage",
    ],
    specificitesFR: [
      "Centre village historique avec maisons à colombages",
      "Commune résidentielle calme du Leimental",
      "Mélange de constructions neuves et anciennes",
    ],
    seoTitleDE: "Renovierung Oberwil BL | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Oberwil (BL): erfahrener Handwerker aus Saint-Louis. Altbausanierung, Küche, Bad, Böden. Offerte kostenlos in CHF oder EUR.",
    seoTitleFR: "Rénovation à Oberwil | Artisan frontalier depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Oberwil (BL) : artisan qualifié pour maisons et appartements. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "therwil",
    name: "Therwil",
    nameFr: "Therwil",
    canton: "BL",
    population: 10000,
    distance: 12,
    featuredImage: "/images/villes/therwil.webp",
    specificitesDE: [
      "Ruhige Wohngemeinde im Leimental, sehr beliebt bei Familien",
      "Zahlreiche Einfamilienhäuser der 1980er–1990er Jahre — Renovierungsbedarf wächst",
      "Gute Schulen und Infrastruktur — stabile Eigentümerstruktur",
      "S-Bahn-Anschluss nach Basel in 15 Minuten",
    ],
    specificitesFR: [
      "Commune résidentielle calme et familiale",
      "Nombreuses maisons individuelles des années 80-90 à rénover",
      "Infrastructure scolaire de qualité — propriétaires stables",
    ],
    seoTitleDE: "Renovierung Therwil | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Therwil (BL): Handwerker aus Saint-Louis für Einfamilienhäuser und Wohnungen. Bad, Küche, Böden, Fassade. Kostenlose Offerte in CHF.",
    seoTitleFR: "Rénovation à Therwil | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Therwil (BL) : artisan français pour maisons individuelles. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "muenchenstein",
    name: "Münchenstein",
    nameFr: "Münchenstein",
    canton: "BL",
    population: 12000,
    distance: 10,
    featuredImage: "/images/villes/muenchenstein.webp",
    specificitesDE: [
      "Wohngemeinde direkt an Basel, bekannt als Standort von SBB-Regionalbahn",
      "Viaduc de Münchenstein — historisches Eisenbahnviadukt prägt das Ortsbild",
      "Gemischte Bebauung: Altbauten entlang der Birs und Neubauten am Hang",
      "Gute Verbindung nach Basel Innenstadt — attraktiv für Pendler",
    ],
    specificitesFR: [
      "Commune résidentielle adjacente à Bâle",
      "Viaduc historique de Münchenstein",
      "Habitat mixte : anciens et neufs",
    ],
    seoTitleDE: "Renovierung Münchenstein | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Münchenstein (BL): Ihr Handwerker aus Saint-Louis. Altbausanierung, Küche, Bad, Böden. Offerte kostenlos in CHF oder EUR.",
    seoTitleFR: "Rénovation à Münchenstein | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Münchenstein (BL) : artisan qualifié depuis Saint-Louis. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "arlesheim",
    name: "Arlesheim",
    nameFr: "Arlesheim",
    canton: "BL",
    population: 9000,
    distance: 12,
    featuredImage: "/images/villes/arlesheim.webp",
    specificitesDE: [
      "Dom St. Maria — barocke Kathedrale mit herausragendem Kulturwert",
      "Goetheanum in der Nachbargemeinde Dornach — Anthroposophie-Zentrum, kulturreiches Umfeld",
      "Historisches Dorfzentrum mit gut erhaltenen Bürgerhäusern aus dem 18. Jahrhundert",
      "Gehobene Wohnlage, viele renovierungsbedürftige historische Gebäude",
      "Kleinbaselbieter Naturpark — grünes Umfeld, hohe Lebensqualität",
    ],
    specificitesFR: [
      "Cathédrale St-Marie — patrimoine baroque exceptionnel",
      "Village historique du XVIIIe siècle",
      "Environnement verdoyant, haute qualité de vie",
    ],
    seoTitleDE: "Renovierung Arlesheim | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Arlesheim (BL): Handwerker aus Saint-Louis für historische und moderne Objekte. Altbausanierung, Bad, Küche, Fassade. Offerte kostenlos.",
    seoTitleFR: "Rénovation à Arlesheim | Artisan frontalier qualifié",
    seoDescriptionFR:
      "Rénovation à Arlesheim (BL) : artisan depuis Saint-Louis pour bâtiments historiques et modernes. Devis gratuit en CHF.",
  },
  {
    slug: "pratteln",
    name: "Pratteln",
    nameFr: "Pratteln",
    canton: "BL",
    population: 16000,
    distance: 13,
    featuredImage: "/images/villes/pratteln.webp",
    specificitesDE: [
      "Industriegemeinde mit grosser Logistik- und Gewerbezone am Rhein",
      "Umnutzung von Lagerhallen und Bürogebäuden — wachsender Markt",
      "Wohngebiete neben Industrieflächen — breites Renovierungspotenzial",
      "Rheinhäfen und Chemiepark Schweizerhalle in der Nähe",
    ],
    specificitesFR: [
      "Commune industrielle et logistique en reconversion",
      "Reconversion d'entrepôts et bureaux",
      "Zones résidentielles à fort potentiel de rénovation",
    ],
    seoTitleDE: "Renovierung Pratteln | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Pratteln (BL): Handwerker für Wohn- und Gewerbeimmobilien. Aus Saint-Louis — schnelle Anfahrt. Offerte kostenlos in CHF oder EUR.",
    seoTitleFR: "Rénovation à Pratteln | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Pratteln (BL) : artisan français pour logements et locaux. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "aesch-bl",
    name: "Aesch",
    nameFr: "Aesch",
    canton: "BL",
    population: 10000,
    distance: 14,
    featuredImage: "/images/villes/aesch-bl.webp",
    specificitesDE: [
      "Weinbaugemeinde — alte Bauernhäuser und historische Weinkeller mit Renovierungspotenzial",
      "Ruhige Wohngemeinde im Birseck-Tal",
      "Gemischte Bebauung: Landwirtschaft neben modernen Wohnsiedlungen",
      "Historischer Dorfkern mit gut erhaltenen Altbauten",
    ],
    specificitesFR: [
      "Commune viticole avec fermes et caves historiques",
      "Village calme de la vallée de la Birse",
      "Mixte agriculture et habitat moderne",
    ],
    seoTitleDE: "Renovierung Aesch BL | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Aesch (BL): Handwerker aus Saint-Louis für Bauernhäuser, Altbauten und Neubauten. Bad, Küche, Böden, Fassade. Offerte kostenlos.",
    seoTitleFR: "Rénovation à Aesch BL | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Aesch (BL) : artisan qualifié pour fermes, maisons anciennes et neuves. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "dornach",
    name: "Dornach",
    nameFr: "Dornach",
    canton: "SO",
    population: 6000,
    distance: 13,
    featuredImage: "/images/villes/dornach.webp",
    specificitesDE: [
      "Goetheanum — Hauptsitz der Anthroposophischen Gesellschaft, einzigartige Rudolf-Steiner-Architektur",
      "Kanton Solothurn — spezielles Steuerumfeld, eigenständige Bauvorschriften",
      "Denkmalgeschützte Gebäude mit organischen Formen erfordern spezialisiertes Handwerk",
      "Kleines Dorf mit internationaler Ausstrahlung durch das Goetheanum",
      "Grenzlage zwischen BL und SO — vielfältige Kundschaft",
    ],
    specificitesFR: [
      "Goetheanum — siège mondial de l'anthroposophie, architecture Rudolf Steiner unique",
      "Canton de Soleure — réglementation et fiscalité propres",
      "Bâtiments classés aux formes organiques",
    ],
    seoTitleDE: "Renovierung Dornach | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Dornach (SO): erfahrener Handwerker aus Saint-Louis. Goetheanum-Region, Altbauten, Denkmalschutz. Offerte kostenlos in CHF oder EUR.",
    seoTitleFR: "Rénovation à Dornach | Artisan frontalier depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Dornach (SO) : artisan qualifié pour bâtiments anciens et classés. Devis gratuit en CHF ou EUR.",
  },
  {
    slug: "liestal",
    name: "Liestal",
    nameFr: "Liestal",
    canton: "BL",
    population: 14000,
    distance: 20,
    featuredImage: "/images/villes/liestal.webp",
    specificitesDE: [
      "Kantonshauptort von Basel-Landschaft — politisches und wirtschaftliches Zentrum",
      "Historische Altstadt mit gut erhaltenen Bürgerhäusern und Stadttor",
      "Schöne Fachwerkhäuser und Jugendstilgebäude mit Renovierungsbedarf",
      "Regierungsgebäude und öffentliche Einrichtungen — anspruchsvolles Umfeld",
      "Gute Erreichbarkeit über die Autobahn A2 und S-Bahn",
    ],
    specificitesFR: [
      "Chef-lieu du canton de Bâle-Campagne",
      "Vieille ville historique avec maisons bourgeoises et porte médiévale",
      "Maisons à colombages et Art Nouveau à rénover",
    ],
    seoTitleDE: "Renovierung Liestal | Handwerker Basel Umgebung",
    seoDescriptionDE:
      "Renovierung in Liestal (BL): Handwerker aus Saint-Louis für Altbauten, Bürgerhäuser und moderne Objekte. Offerte kostenlos in CHF oder EUR.",
    seoTitleFR: "Rénovation à Liestal | Artisan depuis Saint-Louis",
    seoDescriptionFR:
      "Rénovation à Liestal (BL) : artisan qualifié pour bâtiments historiques et modernes. Devis gratuit en CHF ou EUR.",
  },
];
