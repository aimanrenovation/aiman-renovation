export interface Testimonial {
  id: string;
  author: string;
  location: string;
  country: "FR" | "CH" | "DE";
  rating: 1 | 2 | 3 | 4 | 5;
  date: string; // YYYY-MM-DD
  serviceSlug: string;
  commentFR: string;
  commentDE?: string;
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t01",
    author: "Marie L.",
    location: "Saint-Louis",
    country: "FR",
    rating: 5,
    date: "2026-03-15",
    serviceSlug: "salle-de-bain",
    commentFR:
      "Rénovation complète de notre salle de bain en 10 jours. Équipe sérieuse, ponctuelle, travail irréprochable. Le carrelage est posé au millimètre. Prix respecté, aucune mauvaise surprise. Je recommande vivement.",
    verified: true,
  },
  {
    id: "t02",
    author: "Thomas K.",
    location: "Basel",
    country: "CH",
    rating: 5,
    date: "2026-02-20",
    serviceSlug: "cuisine",
    commentFR:
      "Cuisine équipée installée dans notre appartement bâlois. Qualité française, prix 35% moins cher qu'un artisan suisse. Communication parfaite en français et allemand. Chantier livré à la date prévue.",
    commentDE:
      "Küche in unserer Basler Wohnung eingebaut. Französische Qualität, 35% günstiger als Schweizer Handwerker. Perfekte Kommunikation auf Französisch und Deutsch. Baustelle pünktlich übergeben.",
    verified: true,
  },
  {
    id: "t03",
    author: "Laurent D.",
    location: "Huningue",
    country: "FR",
    rating: 5,
    date: "2026-01-28",
    serviceSlug: "peinture",
    commentFR:
      "Peinture de tout l'appartement (4 pièces) en 3 jours. Les finitions aux angles sont parfaites, les murs sont lisses comme du papier. Équipe propre : pas une tache sur les parquets. Très satisfait.",
    verified: true,
  },
  {
    id: "t04",
    author: "Sabine W.",
    location: "Riehen",
    country: "CH",
    rating: 5,
    date: "2025-12-10",
    serviceSlug: "sols-carrelage",
    commentFR:
      "Pose de carrelage grand format dans notre salon à Riehen. Joint parfait, aucune tuile cassée lors de la pose. Le résultat est époustouflant pour un prix très raisonnable par rapport au marché suisse.",
    commentDE:
      "Großformatige Fliesen im Wohnzimmer in Riehen verlegt. Perfekte Fugen, keine Brüche beim Verlegen. Das Ergebnis ist beeindruckend, zu einem sehr vernünftigen Preis im Vergleich zum Schweizer Markt.",
    verified: true,
  },
  {
    id: "t05",
    author: "Sophie M.",
    location: "Bartenheim",
    country: "FR",
    rating: 5,
    date: "2025-11-18",
    serviceSlug: "renovation-complete",
    commentFR:
      "Rénovation complète de notre maison alsacienne : cuisine, salle de bain, peinture, parquet et électricité. 3 semaines de chantier, coordination impeccable. Aiman est présent chaque matin. On a adoré l'expérience.",
    verified: true,
  },
  {
    id: "t06",
    author: "Martin B.",
    location: "Weil am Rhein",
    country: "DE",
    rating: 5,
    date: "2025-10-30",
    serviceSlug: "electricite",
    commentFR:
      "Mise aux normes électriques de notre maison à Weil am Rhein. Tableau électrique refait, nouvelles prises et interrupteurs. Travail soigné, conforme aux normes françaises et allemandes. Très bon rapport qualité-prix.",
    commentDE:
      "Elektrische Sanierung unseres Hauses in Weil am Rhein. Neue Schalttafel, neue Steckdosen und Schalter. Sorgfältige Arbeit, konform mit deutschen und französischen Normen. Sehr gutes Preis-Leistungs-Verhältnis.",
    verified: true,
  },
  {
    id: "t07",
    author: "Julie P.",
    location: "Mulhouse",
    country: "FR",
    rating: 5,
    date: "2025-10-05",
    serviceSlug: "plomberie",
    commentFR:
      "Remplacement complet de la plomberie dans un appartement ancien. Tous les tuyaux refaits, nouvelle installation sanitaire. Pas de fuite, travail garanti. Délai tenu, facture conforme au devis. Bravo à l'équipe.",
    verified: true,
  },
  {
    id: "t08",
    author: "Nicolas F.",
    location: "Hégenheim",
    country: "FR",
    rating: 4,
    date: "2025-09-20",
    serviceSlug: "facade",
    commentFR:
      "Ravalement de façade de notre pavillon. Nettoyage haute pression, rebouchage des fissures, peinture hydrofuge. Rendu propre et esthétique. Légèrement au-dessus du devis initial à cause de fissures supplémentaires découvertes, mais c'était justifié.",
    verified: true,
  },
  {
    id: "t09",
    author: "Caroline V.",
    location: "Saint-Louis",
    country: "FR",
    rating: 5,
    date: "2025-08-14",
    serviceSlug: "salle-de-bain",
    commentFR:
      "Transformation de notre ancienne salle de bain en douche à l'italienne. Receveur extra-plat, robinetterie haut de gamme, carrelage imitation marbre. Résultat digne d'un showroom. L'équipe a travaillé proprement et vite.",
    verified: true,
  },
  {
    id: "t10",
    author: "Andreas H.",
    location: "Basel",
    country: "CH",
    rating: 5,
    date: "2025-07-22",
    serviceSlug: "isolation",
    commentFR:
      "Isolation thermique par l'extérieur de notre immeuble à Bâle. Économie de chauffage visible dès le premier hiver. L'équipe a travaillé avec soin sans gêner les locataires. Excellent professionnel, tarif imbattable côté suisse.",
    commentDE:
      "Außendämmung unseres Mehrfamilienhauses in Basel. Heizkosten schon im ersten Winter spürbar gesunken. Das Team arbeitete sorgfältig ohne die Mieter zu stören. Hervorragend, unschlagbarer Preis auf Schweizer Seite.",
    verified: true,
  },
  {
    id: "t11",
    author: "Olivier R.",
    location: "Blotzheim",
    country: "FR",
    rating: 5,
    date: "2025-06-30",
    serviceSlug: "cuisine",
    commentFR:
      "Nouvelle cuisine ouverte sur le séjour, îlot central inclus. Plan de travail en quartz blanc, crédence en verre grise. La pose des meubles est parfaite, aucun jeu. Le cuisiniste qui livrait a complimenté le travail de pose.",
    verified: true,
  },
  {
    id: "t12",
    author: "Sandrine T.",
    location: "Kembs",
    country: "FR",
    rating: 5,
    date: "2025-06-08",
    serviceSlug: "peinture",
    commentFR:
      "Peinture intérieure complète d'une maison de 120 m². Préparation des murs soignée, enduits sur les craquelures, deux couches impeccables. La teinte qu'on avait choisie ensemble est exactement celle rendue. Magnifique résultat.",
    verified: true,
  },
  {
    id: "t13",
    author: "Philippe C.",
    location: "Sierentz",
    country: "FR",
    rating: 5,
    date: "2025-05-14",
    serviceSlug: "sols-carrelage",
    commentFR:
      "Dépose de l'ancien parquet et pose de carrelage imitation bois dans tout le rez-de-chaussée. Chape parfaite, pose en chevron très bien réalisée. Le résultat est spectaculaire. Équipe ponctuelle et propre, chantier livré comme prévu.",
    verified: true,
  },
  {
    id: "t14",
    author: "Delphine A.",
    location: "Huningue",
    country: "FR",
    rating: 5,
    date: "2025-04-25",
    serviceSlug: "electricite",
    commentFR:
      "Mise aux normes électriques complète d'un appartement des années 70. Nouveau tableau Hager, câblage en apparent gainé, prises et interrupteurs Legrand encastrés. Travail soigné, aucune saignée visible après. Très pro.",
    verified: true,
  },
  {
    id: "t15",
    author: "Petra S.",
    location: "Lörrach",
    country: "DE",
    rating: 4,
    date: "2025-03-18",
    serviceSlug: "salle-de-bain",
    commentFR:
      "Rénovation de la salle de bain de notre appartement à Lörrach. Carrelage, sanitaires et robinetterie changés. Bon travail, quelques jours de retard dus à un problème de livraison des matériaux, mais résultat final très satisfaisant.",
    commentDE:
      "Badrenovierung in unserer Wohnung in Lörrach. Fliesen, Sanitär und Armaturen erneuert. Gute Arbeit, einige Tage Verzögerung durch Materiallieferungsprobleme, aber das Endergebnis ist sehr zufriedenstellend.",
    verified: true,
  },
  {
    id: "t16",
    author: "Éric M.",
    location: "Saint-Louis",
    country: "FR",
    rating: 5,
    date: "2025-02-10",
    serviceSlug: "renovation-complete",
    commentFR:
      "On a confié la rénovation complète de notre appartement à Aiman avant d'emménager. Résultat : on a récupéré un logement clé en main, peinture fraîche, parquet poncé, cuisine posée, salle de bain neuve. Tout en 4 semaines. Impressionnant.",
    verified: true,
  },
  {
    id: "t17",
    author: "Valérie B.",
    location: "Rosenau",
    country: "FR",
    rating: 5,
    date: "2025-01-20",
    serviceSlug: "isolation",
    commentFR:
      "Isolation des combles aménagés et des murs intérieurs. Travail rapide et propre, bâches de protection partout. La différence de température est immédiatement perceptible. Économie sur la facture de gaz constatée dès le premier mois.",
    verified: true,
  },
  {
    id: "t18",
    author: "Jean-Marc P.",
    location: "Saint-Louis",
    country: "FR",
    rating: 5,
    date: "2024-12-05",
    serviceSlug: "depannage-urgence",
    commentFR:
      "Fuite sous l'évier un vendredi soir, Aiman est passé dans la soirée. Réparation efficace, pas de dégât des eaux. Prix honnête pour une intervention d'urgence. Vraiment rassurant d'avoir un artisan réactif dans le secteur.",
    verified: true,
  },
  {
    id: "t19",
    author: "Isabelle R.",
    location: "Bartenheim",
    country: "FR",
    rating: 5,
    date: "2024-11-15",
    serviceSlug: "peinture",
    commentFR:
      "Peinture de la façade intérieure d'un escalier en colimaçon, travail délicat demandant précision et équipements adaptés. Résultat impeccable. L'équipe a même soigné les boiseries sans qu'on le demande. Petit plus apprécié.",
    verified: true,
  },
  {
    id: "t20",
    author: "Frédéric L.",
    location: "Mulhouse",
    country: "FR",
    rating: 5,
    date: "2024-10-28",
    serviceSlug: "cuisine",
    commentFR:
      "Remplacement d'une cuisine vétuste dans un appartement locatif. Travail rapide (2 jours), plomberie et électricité incluses. Le logement est reloué immédiatement après la fin du chantier. Bon investissement, tarif compétitif.",
    verified: true,
  },
  {
    id: "t21",
    author: "Nathalie G.",
    location: "Hésingue",
    country: "FR",
    rating: 5,
    date: "2024-10-02",
    serviceSlug: "sols-carrelage",
    commentFR:
      "Pose de parquet flottant dans 3 chambres. Jointement parfait aux plinthes, aucune planche qui grince. L'équipe a déplacé et remis en place tous les meubles. Un service complet vraiment appréciable. Je re-ferai appel à eux sans hésiter.",
    verified: true,
  },
  {
    id: "t22",
    author: "Alain S.",
    location: "Saint-Louis",
    country: "FR",
    rating: 5,
    date: "2024-09-12",
    serviceSlug: "borne-recharge",
    commentFR:
      "Installation d'une borne de recharge IRVE pour véhicule électrique dans mon garage. Câblage depuis le tableau, borne Wallbox Pulsar. Travail propre, mise en service le jour même. Dossier aide ADVENIR constitué par l'équipe.",
    verified: true,
  },
  {
    id: "t23",
    author: "Ursula F.",
    location: "Basel",
    country: "CH",
    rating: 5,
    date: "2024-08-20",
    serviceSlug: "renovation-complete",
    commentFR:
      "Villa rénovée de A à Z à Bâle : façade, terrasse, salle de bain, cuisine et peinture intérieure. 6 semaines de travaux, équipe pluridisciplinaire parfaitement coordonnée. On recommande chaudement à tous nos amis de la région.",
    commentDE:
      "Villa von A bis Z in Basel renoviert: Fassade, Terrasse, Badezimmer, Küche und Innenanstrich. 6 Wochen Bauarbeiten, perfekt koordiniertes multidisziplinäres Team. Wir empfehlen es wärmstens allen unseren Freunden in der Region.",
    verified: true,
  },
  {
    id: "t24",
    author: "Marc D.",
    location: "Leymen",
    country: "FR",
    rating: 5,
    date: "2024-07-30",
    serviceSlug: "plomberie",
    commentFR:
      "Remplacement d'un chauffe-eau thermodynamique et installation d'un adoucisseur d'eau. Pose soignée, raccordements étanches, notice d'utilisation expliquée clairement. On regrette de ne pas avoir fait ça plus tôt tellement c'est pratique.",
    verified: true,
  },
  {
    id: "t25",
    author: "Patricia V.",
    location: "Saint-Louis",
    country: "FR",
    rating: 4,
    date: "2024-07-10",
    serviceSlug: "entretien-exterieur",
    commentFR:
      "Nettoyage et remise en état de la terrasse et du jardin après un hiver difficile. Karcher des dalles, taille des haies, évacuation des déchets verts. Travail complet et soigné. On aurait aimé une intervention un peu plus rapide, mais résultat au top.",
    verified: true,
  },
  {
    id: "t26",
    author: "Daniel M.",
    location: "Weil am Rhein",
    country: "DE",
    rating: 5,
    date: "2024-06-18",
    serviceSlug: "facade",
    commentFR:
      "Ravalement et isolation par l'extérieur de notre maison à Weil am Rhein. Artisan sérieux qui maîtrise bien les matériaux français et les attentes côté allemand. Résultat esthétique, isolant thermique efficace. Prix très correct.",
    commentDE:
      "Fassadenrenovierung und Außendämmung unseres Hauses in Weil am Rhein. Seriöser Handwerker, der französische Materialien und deutsche Anforderungen gut kennt. Ästhetisches Ergebnis, effektive Wärmedämmung. Sehr fairer Preis.",
    verified: true,
  },
  {
    id: "t27",
    author: "Markus T.",
    location: "Basel",
    country: "CH",
    rating: 5,
    date: "2024-05-30",
    serviceSlug: "panneaux-photovoltaiques",
    commentFR:
      "Installation de 10 panneaux photovoltaïques sur le toit de notre villa côté bâlois. Démarches administratives prises en charge, mise en service par Enedis coordonnée. Première facture d'électricité deux fois moins élevée. Excellent investissement.",
    commentDE:
      "10 Photovoltaikpanele auf dem Dach unserer Villa auf Basler Seite installiert. Behördengänge übernommen, Inbetriebnahme koordiniert. Erste Stromrechnung halb so hoch. Hervorragende Investition.",
    verified: true,
  },
  {
    id: "t28",
    author: "Hélène C.",
    location: "Hagenthal-le-Bas",
    country: "FR",
    rating: 5,
    date: "2024-05-15",
    serviceSlug: "salle-de-bain",
    commentFR:
      "Salle de bain PMR aménagée pour ma mère : douche à l'italienne sans ressaut, barres d'appui, sol antidérapant, robinetterie thermostatique. Travail pensé dans les moindres détails pour la sécurité. Résultat fonctionnel et élégant à la fois.",
    verified: true,
  },
  {
    id: "t29",
    author: "Yves D.",
    location: "Village-Neuf",
    country: "FR",
    rating: 5,
    date: "2024-06-03",
    serviceSlug: "renovation-complete",
    commentFR:
      "Maison de 1970 entièrement remise à neuf : isolation, électricité, plomberie, cuisine, salles de bain et peinture. Budget tenu, planning respecté, qualité au rendez-vous. Aiman a supervisé chaque chantier personnellement. Prestation exemplaire.",
    verified: true,
  },
  {
    id: "t30",
    author: "Birgit H.",
    location: "Basel",
    country: "CH",
    rating: 5,
    date: "2024-09-25",
    serviceSlug: "cuisine",
    commentFR:
      "Cuisine sur mesure réalisée dans notre appartement à Bâle. Artisan joignable, ponctuel et rigoureux. Le fait de travailler avec un professionnel français juste de l'autre côté du Rhin est un vrai avantage : même qualité, prix suisse divisé par deux.",
    commentDE:
      "Maßgefertigte Küche in unserer Basler Wohnung. Handwerker erreichbar, pünktlich und gewissenhaft. Mit einem französischen Profi gleich jenseits des Rheins zu arbeiten ist ein echter Vorteil: gleiche Qualität, Schweizer Preis halbiert.",
    verified: true,
  },
];

export function getAverageRating(): number {
  const total = TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / TESTIMONIALS.length) * 10) / 10;
}

export function getTestimonialsByService(slug: string): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.serviceSlug === slug);
}

export function getTestimonialsByCountry(country: "FR" | "CH" | "DE"): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.country === country);
}

export function getFeaturedTestimonials(count = 6): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.rating === 5).slice(0, count);
}
