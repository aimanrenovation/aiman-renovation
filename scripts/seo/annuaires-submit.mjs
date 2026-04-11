#!/usr/bin/env node
/**
 * annuaires-submit.mjs
 * --------------------
 * Automatise l'inscription d'AIMAN RENOVATION dans les annuaires en ligne.
 *
 * Usage :  node scripts/seo/annuaires-submit.mjs
 *
 * Ce script :
 *  1. Genere un fichier CSV Bing Places (bulk upload)
 *  2. Genere un fichier JSON structure pour chaque plateforme
 *  3. Affiche une checklist des etapes manuelles restantes
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "output");

// ─── Fiche entreprise (NAP) ────────────────────────────────────────────────
const LISTING = {
  name: "AIMAN RENOVATION",
  address: "11 rue de Bâle",
  city: "Saint-Louis",
  zip: "68300",
  state: "Grand Est",
  country: "FR",
  phone: "+33633496925",
  phoneDisplay: "+33 6 33 49 69 25",
  website: "https://aiman-renovation.fr",
  email: "contact@aiman-renovation.fr",
  siret: "SIRET_PLACEHOLDER",
  categories: [
    "Entreprise de rénovation",
    "Artisan du bâtiment",
    "Rénovation intérieure",
    "Rénovation extérieure",
  ],
  hours: {
    mon: "07:00-18:00",
    tue: "07:00-18:00",
    wed: "07:00-18:00",
    thu: "07:00-18:00",
    fri: "07:00-18:00",
    sat: "08:00-12:00",
    sun: "closed",
  },
  description: {
    fr: "Aiman Renovation — artisan de rénovation intérieure et extérieure à Saint-Louis (68300) et dans le Haut-Rhin. Salle de bain, cuisine, façade, peinture, électricité, plomberie. Devis gratuit sous 48h. Garantie décennale.",
    de: "Aiman Renovation — Handwerksbetrieb für Innen- und Außenrenovierung in Saint-Louis (68300) und im Haut-Rhin. Badezimmer, Küche, Fassade, Malerei, Elektrik, Sanitär. Kostenloser Kostenvoranschlag innerhalb von 48 Stunden. 10-jährige Garantie.",
    en: "Aiman Renovation — interior and exterior renovation contractor in Saint-Louis (68300) and the Haut-Rhin area. Bathroom, kitchen, facade, painting, electrical, plumbing. Free quote within 48 hours. 10-year warranty.",
  },
  serviceArea: [
    "Saint-Louis",
    "Mulhouse",
    "Colmar",
    "Huningue",
    "Hégenheim",
    "Village-Neuf",
    "Bartenheim",
    "Kembs",
    "Basel (Suisse)",
    "Lörrach (Allemagne)",
  ],
  lat: 47.5844,
  lng: 7.5607,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function ensureOutDir() {
  mkdirSync(OUT_DIR, { recursive: true });
}

function csvEscape(value) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ─── 1. Bing Places Bulk CSV ────────────────────────────────────────────────

function generateBingPlacesCSV() {
  // Format officiel Bing Places pour le bulk upload
  // Ref: https://www.bingplaces.com/DashBoard/ImportExport
  const headers = [
    "Store Code",
    "Name",
    "Address Line 1",
    "Address Line 2",
    "City",
    "State/Region",
    "Zip/Postal Code",
    "Country/Region",
    "Latitude",
    "Longitude",
    "Phone",
    "Website",
    "Category 1",
    "Category 2",
    "Category 3",
    "Category 4",
    "Monday Open",
    "Monday Close",
    "Tuesday Open",
    "Tuesday Close",
    "Wednesday Open",
    "Wednesday Close",
    "Thursday Open",
    "Thursday Close",
    "Friday Open",
    "Friday Close",
    "Saturday Open",
    "Saturday Close",
    "Sunday Open",
    "Sunday Close",
    "Description",
  ];

  const parseHours = (range) => {
    if (range === "closed") return ["", ""];
    const [open, close] = range.split("-");
    return [open, close];
  };

  const row = [
    "AIMAN-001",
    LISTING.name,
    LISTING.address,
    "",
    LISTING.city,
    LISTING.state,
    LISTING.zip,
    LISTING.country,
    LISTING.lat,
    LISTING.lng,
    LISTING.phoneDisplay,
    LISTING.website,
    ...LISTING.categories.slice(0, 4),
    ...parseHours(LISTING.hours.mon),
    ...parseHours(LISTING.hours.tue),
    ...parseHours(LISTING.hours.wed),
    ...parseHours(LISTING.hours.thu),
    ...parseHours(LISTING.hours.fri),
    ...parseHours(LISTING.hours.sat),
    ...parseHours(LISTING.hours.sun),
    LISTING.description.fr,
  ];

  const csv = [headers.map(csvEscape).join(","), row.map(csvEscape).join(",")].join("\n");

  const filePath = join(OUT_DIR, "bing-places-bulk.csv");
  writeFileSync(filePath, csv, "utf-8");

  // Copie aussi a la racine de scripts/seo/ comme demande
  writeFileSync(join(__dirname, "bing-places-bulk.csv"), csv, "utf-8");

  return filePath;
}

// ─── 2. JSON structure pour chaque plateforme ───────────────────────────────

function generateStructuredJSON() {
  const data = {
    _generatedAt: new Date().toISOString(),
    _note: "Données structurées pour inscription annuaires — AIMAN RENOVATION",
    listing: LISTING,
    platforms: {
      bingPlaces: {
        url: "https://www.bingplaces.com",
        status: "CSV généré — prêt pour import",
        file: "bing-places-bulk.csv",
      },
      googleBusinessProfile: {
        url: "https://business.google.com",
        status: "Manuel — voir annuaires-guide.md",
        steps: [
          "Se connecter sur business.google.com",
          "Cliquer « Gérer maintenant »",
          "Chercher le nom de l'entreprise ou l'ajouter",
          "Remplir les informations NAP",
          "Vérification par courrier postal ou téléphone",
        ],
      },
      appleMapsConnect: {
        url: "https://mapsconnect.apple.com",
        status: "Manuel uniquement — pas d'API disponible",
        steps: [
          "Se connecter avec un Apple ID",
          "Cliquer « Ajouter un nouveau lieu »",
          "Remplir nom, adresse, téléphone, site web",
          "Choisir la catégorie « Entrepreneur en rénovation »",
          "Valider — Apple vérifie sous 1 à 7 jours",
        ],
      },
      pagesJaunes: {
        url: "https://www.pagesjaunes.fr/inscription",
        status: "Manuel — voir annuaires-guide.md",
      },
      yelp: {
        url: "https://biz.yelp.fr",
        status: "Manuel — voir annuaires-guide.md",
      },
      houzz: {
        url: "https://www.houzz.fr/pro",
        status: "Manuel — voir annuaires-guide.md",
      },
    },
  };

  const filePath = join(OUT_DIR, "listing-structured.json");
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return filePath;
}

// ─── 3. Fichiers par plateforme (copier-coller) ────────────────────────────

function generatePlatformFiles() {
  const files = [];

  // Pages Jaunes
  const pjText = `=== PAGES JAUNES — Copier-coller ===

Nom de l'entreprise : ${LISTING.name}
Adresse : ${LISTING.address}, ${LISTING.zip} ${LISTING.city}
Téléphone : ${LISTING.phoneDisplay}
Site web : ${LISTING.website}
Email : ${LISTING.email}
SIRET : ${LISTING.siret}
Catégorie : Entreprise de rénovation
Sous-catégories : Rénovation intérieure, Rénovation extérieure, Artisan du bâtiment

Description :
${LISTING.description.fr}

Horaires :
Lundi - Vendredi : 7h00 - 18h00
Samedi : 8h00 - 12h00
Dimanche : Fermé

Zone d'intervention : ${LISTING.serviceArea.join(", ")}
`;
  const pjPath = join(OUT_DIR, "pages-jaunes.txt");
  writeFileSync(pjPath, pjText, "utf-8");
  files.push(pjPath);

  // Yelp
  const yelpText = `=== YELP — Copier-coller ===

Business Name: ${LISTING.name}
Address: ${LISTING.address}, ${LISTING.zip} ${LISTING.city}, France
Phone: ${LISTING.phoneDisplay}
Website: ${LISTING.website}
Email: ${LISTING.email}
Category: Home Renovation / Rénovation

Description (FR) :
${LISTING.description.fr}

Description (EN) :
${LISTING.description.en}

Hours:
Mon-Fri: 7:00 AM - 6:00 PM
Sat: 8:00 AM - 12:00 PM
Sun: Closed
`;
  const yelpPath = join(OUT_DIR, "yelp.txt");
  writeFileSync(yelpPath, yelpText, "utf-8");
  files.push(yelpPath);

  // Houzz
  const houzzText = `=== HOUZZ — Copier-coller ===

Nom de l'entreprise : ${LISTING.name}
Adresse : ${LISTING.address}, ${LISTING.zip} ${LISTING.city}
Téléphone : ${LISTING.phoneDisplay}
Site web : ${LISTING.website}
Email : ${LISTING.email}
Spécialités : Rénovation intérieure, Rénovation extérieure, Salle de bain, Cuisine, Façade, Peinture

Description :
${LISTING.description.fr}

Zone d'intervention : ${LISTING.serviceArea.join(", ")}
`;
  const houzzPath = join(OUT_DIR, "houzz.txt");
  writeFileSync(houzzPath, houzzText, "utf-8");
  files.push(houzzPath);

  return files;
}

// ─── 4. Checklist manuelle ──────────────────────────────────────────────────

function printChecklist() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║         CHECKLIST — Inscription Annuaires AIMAN RENOVATION      ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  AUTOMATISÉ (fichiers générés) :                                ║
║  ✅ Bing Places — CSV bulk upload prêt                          ║
║  ✅ JSON structuré — données complètes                          ║
║  ✅ Fiches copier-coller — Pages Jaunes, Yelp, Houzz            ║
║                                                                  ║
║  MANUEL — À FAIRE :                                             ║
║  ☐ Bing Places — Importer le CSV sur bingplaces.com             ║
║  ☐ Google Business Profile — business.google.com                ║
║  ☐ Apple Maps Connect — mapsconnect.apple.com                   ║
║  ☐ Pages Jaunes — pagesjaunes.fr/inscription                   ║
║  ☐ Yelp — biz.yelp.fr                                          ║
║  ☐ Houzz — houzz.fr/pro                                        ║
║  ☐ 118712.fr                                                    ║
║  ☐ Batiweb.com                                                  ║
║  ☐ Habitatpresto.com                                            ║
║  ☐ StarOfService.com                                            ║
║  ☐ Travaux.com                                                  ║
║                                                                  ║
║  📖 Guide détaillé : scripts/seo/annuaires-guide.md             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("\n🔧 AIMAN RENOVATION — Génération des fichiers annuaires\n");

  ensureOutDir();

  const bingCSV = generateBingPlacesCSV();
  console.log(`  ✅ Bing Places CSV → ${bingCSV}`);

  const jsonFile = generateStructuredJSON();
  console.log(`  ✅ JSON structuré  → ${jsonFile}`);

  const platformFiles = generatePlatformFiles();
  platformFiles.forEach((f) => console.log(`  ✅ Fiche plateforme → ${f}`));

  printChecklist();
}

main();
