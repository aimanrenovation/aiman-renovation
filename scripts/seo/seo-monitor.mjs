#!/usr/bin/env node

/**
 * SEO Keyword Monitor for aiman-renovation.fr
 *
 * Usage:
 *   node scripts/seo/seo-monitor.mjs          # Automatic mode (GSC API)
 *   node scripts/seo/seo-monitor.mjs --manual  # Manual checklist mode
 *
 * Env vars (automatic mode):
 *   GOOGLE_SEARCH_CONSOLE_KEY_FILE  — path to service account JSON key
 *   GSC_SITE_URL                    — site URL (default: https://aiman-renovation.fr)
 */

import { writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Keywords ───────────────────────────────────────────────────────────────

const KEYWORDS = [
  // Salle de bain
  { keyword: "renovation salle de bain saint-louis", page: "/services/salle-de-bain", priority: "P1" },
  { keyword: "renovation salle de bain mulhouse", page: "/services/salle-de-bain", priority: "P1" },
  { keyword: "devis salle de bain haut-rhin", page: "/devis-salle-de-bain", priority: "P1" },
  // Façade
  { keyword: "ravalement facade alsace", page: "/services/facade", priority: "P1" },
  { keyword: "artisan facade huningue", page: "/services/facade", priority: "P1" },
  { keyword: "isolation exterieure haut-rhin", page: "/services/isolation", priority: "P1" },
  // Cuisine
  { keyword: "renovation cuisine mulhouse", page: "/services/cuisine", priority: "P2" },
  { keyword: "cuisine equipee saint-louis 68", page: "/devis-cuisine", priority: "P2" },
  // Peinture
  { keyword: "peintre saint-louis 68", page: "/services/peinture", priority: "P2" },
  { keyword: "peinture interieure mulhouse", page: "/services/peinture", priority: "P2" },
  // Électricité
  { keyword: "electricien saint-louis 68300", page: "/services/electricite", priority: "P2" },
  // Plomberie
  { keyword: "plombier saint-louis 68", page: "/services/plomberie", priority: "P2" },
  // Rénovation générale
  { keyword: "artisan renovation haut-rhin", page: "/", priority: "P1" },
  { keyword: "entreprise renovation saint-louis", page: "/", priority: "P1" },
  { keyword: "renovation maison alsace devis", page: "/devis", priority: "P1" },
  // Cross-border
  { keyword: "renovierung basel französischer handwerker", page: "/renovierung-schweiz", priority: "P2" },
  { keyword: "renovation appartement bale", page: "/renovierung-schweiz", priority: "P2" },
  // Longue traîne
  { keyword: "cout renovation salle de bain 2026", page: "/blog/cout-renovation-salle-de-bain-2026", priority: "P2" },
  { keyword: "artisan ou entreprise renovation", page: "/blog/artisan-ou-entreprise-renovation-comment-choisir", priority: "P3" },
  { keyword: "isolation exterieure maprimenov haut-rhin", page: "/blog/isolation-exterieure-haut-rhin-guide-maprimenov", priority: "P3" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const REPORTS_DIR = join(__dirname, 'reports');

function today() {
  return new Date().toISOString().slice(0, 10);
}

function reportPath(date) {
  return join(REPORTS_DIR, `seo-report-${date}.md`);
}

function ensureReportsDir() {
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

/**
 * Find the most recent previous report (if any).
 */
function findPreviousReport(currentDate) {
  if (!existsSync(REPORTS_DIR)) return null;

  const files = readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith('seo-report-') && f.endsWith('.md') && !f.includes(currentDate))
    .sort()
    .reverse();

  return files.length > 0 ? join(REPORTS_DIR, files[0]) : null;
}

/**
 * Parse keyword data from a previous report markdown table.
 * Returns a Map of keyword -> { position, impressions, clicks, ctr }
 */
function parsePreviousReport(filePath) {
  if (!filePath || !existsSync(filePath)) return new Map();

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const data = new Map();

  for (const line of lines) {
    // Match table rows: | P1 | keyword | page | position | impressions | clicks | ctr |
    const match = line.match(
      /^\|\s*(P[1-3])\s*\|\s*(.+?)\s*\|\s*.+?\s*\|\s*([\d.]+|—)\s*\|\s*([\d,]+|—)\s*\|\s*([\d,]+|—)\s*\|\s*([\d.]+%?|—)\s*\|$/
    );
    if (match) {
      const keyword = match[2].trim();
      const position = match[3] === '—' ? null : parseFloat(match[3]);
      data.set(keyword, { position });
    }
  }

  return data;
}

function trendArrow(current, previous) {
  if (previous === null || previous === undefined || current === null || current === undefined) return '';
  // Lower position = better in SEO
  const diff = previous - current;
  if (diff > 1) return ' ↑';
  if (diff < -1) return ' ↓';
  return ' →';
}

function formatCtr(clicks, impressions) {
  if (!impressions || impressions === 0) return '0.0%';
  return ((clicks / impressions) * 100).toFixed(1) + '%';
}

// ─── GSC API ────────────────────────────────────────────────────────────────

async function getSearchConsoleData(keyword) {
  const { google } = await import('googleapis');

  const keyFile = process.env.GOOGLE_SEARCH_CONSOLE_KEY_FILE;
  if (!keyFile) throw new Error('GOOGLE_SEARCH_CONSOLE_KEY_FILE not set');

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });
  const siteUrl = process.env.GSC_SITE_URL || 'https://aiman-renovation.fr';

  // 30 days window
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      dimensions: ['query', 'page'],
      dimensionFilterGroups: [{
        filters: [{ dimension: 'query', expression: keyword, operator: 'contains' }],
      }],
    },
  });

  return res.data.rows || [];
}

async function fetchAllKeywordData() {
  const results = [];

  for (const entry of KEYWORDS) {
    try {
      const rows = await getSearchConsoleData(entry.keyword);

      if (rows.length === 0) {
        results.push({
          ...entry,
          position: null,
          impressions: 0,
          clicks: 0,
          ctr: '0.0%',
        });
      } else {
        // Aggregate across all matching rows
        let totalImpressions = 0;
        let totalClicks = 0;
        let weightedPosition = 0;

        for (const row of rows) {
          totalImpressions += row.impressions || 0;
          totalClicks += row.clicks || 0;
          weightedPosition += (row.position || 0) * (row.impressions || 0);
        }

        const avgPosition = totalImpressions > 0
          ? (weightedPosition / totalImpressions)
          : null;

        results.push({
          ...entry,
          position: avgPosition ? parseFloat(avgPosition.toFixed(1)) : null,
          impressions: totalImpressions,
          clicks: totalClicks,
          ctr: formatCtr(totalClicks, totalImpressions),
        });
      }
    } catch (err) {
      console.error(`  [ERROR] ${entry.keyword}: ${err.message}`);
      results.push({
        ...entry,
        position: null,
        impressions: 0,
        clicks: 0,
        ctr: '0.0%',
        error: err.message,
      });
    }
  }

  return results;
}

// ─── Report Generation ─────────────────────────────────────────────────────

function generateReport(results, previousData) {
  const date = today();
  const tracked = results.length;

  const withPosition = results.filter(r => r.position !== null);
  const avgPosition = withPosition.length > 0
    ? (withPosition.reduce((s, r) => s + r.position, 0) / withPosition.length).toFixed(1)
    : '—';

  const totalImpressions = results.reduce((s, r) => s + (r.impressions || 0), 0);
  const totalClicks = results.reduce((s, r) => s + (r.clicks || 0), 0);

  // Sort by priority then keyword
  const sorted = [...results].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
    return a.keyword.localeCompare(b.keyword);
  });

  // Build table
  const tableRows = sorted.map(r => {
    const prev = previousData.get(r.keyword);
    const trend = prev ? trendArrow(r.position, prev.position) : '';
    const pos = r.position !== null ? `${r.position}${trend}` : '—';
    const imp = r.impressions > 0 ? r.impressions.toLocaleString('fr-FR') : '—';
    const clicks = r.clicks > 0 ? r.clicks.toLocaleString('fr-FR') : '—';
    const ctr = r.impressions > 0 ? r.ctr : '—';
    return `| ${r.priority} | ${r.keyword} | ${r.page} | ${pos} | ${imp} | ${clicks} | ${ctr} |`;
  });

  // Improvements needed
  const notRanking = sorted.filter(r => r.position === null || r.position > 50);
  const lowCtr = sorted.filter(r => r.impressions > 0 && parseFloat(r.ctr) < 3);
  const improving = sorted.filter(r => {
    const prev = previousData.get(r.keyword);
    return prev && prev.position !== null && r.position !== null && r.position < prev.position - 1;
  });

  // Recommendations
  const recommendations = [];
  if (notRanking.length > 0) {
    recommendations.push(
      `**Mots-cles non indexes (${notRanking.length})** : Verifier que les pages cibles existent, ` +
      `ont du contenu optimise et des balises meta appropriees. Considerer la creation de contenu ` +
      `specifique pour ces mots-cles.`
    );
  }
  if (lowCtr.length > 0) {
    recommendations.push(
      `**CTR faible (${lowCtr.length} mots-cles)** : Ameliorer les meta titles et meta descriptions ` +
      `pour les rendre plus attractifs. Ajouter des rich snippets (FAQ, avis) si applicable.`
    );
  }
  if (improving.length > 0) {
    recommendations.push(
      `**Mots-cles en progression (${improving.length})** : Continuer les efforts actuels. ` +
      `Considerer l'ajout de liens internes vers ces pages pour renforcer le positionnement.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      'Premiere execution — les tendances seront disponibles au prochain rapport.'
    );
  }

  const previousReportNote = previousData.size > 0
    ? `\n> Compare avec le rapport precedent (${previousData.size} mots-cles).\n`
    : '\n> Premier rapport — pas de donnees de comparaison.\n';

  const report = `# SEO Report — ${date}
${previousReportNote}
## Summary

- **Mots-cles suivis** : ${tracked}
- **Position moyenne** : ${avgPosition}
- **Impressions totales (30j)** : ${totalImpressions.toLocaleString('fr-FR')}
- **Clics totaux (30j)** : ${totalClicks.toLocaleString('fr-FR')}

## Keyword Performance

| Priority | Keyword | Target Page | Position | Impressions | Clicks | CTR |
|----------|---------|-------------|----------|-------------|--------|-----|
${tableRows.join('\n')}

## Improvements Needed

### Mots-cles non positionnes (position > 50 ou absents)
${notRanking.length > 0
    ? notRanking.map(r => `- \`${r.keyword}\` → ${r.page}`).join('\n')
    : '- Aucun — tous les mots-cles sont positionnes !'
}

### Mots-cles avec CTR faible (< 3%)
${lowCtr.length > 0
    ? lowCtr.map(r => `- \`${r.keyword}\` — CTR: ${r.ctr}, Position: ${r.position}`).join('\n')
    : '- Aucun probleme de CTR detecte.'
}

### Mots-cles en progression
${improving.length > 0
    ? improving.map(r => {
        const prev = previousData.get(r.keyword);
        return `- \`${r.keyword}\` — ${prev.position} → ${r.position}`;
      }).join('\n')
    : '- Pas de donnees de comparaison disponibles.'
}

## Recommendations

${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---
*Genere automatiquement par seo-monitor.mjs le ${new Date().toISOString()}*
`;

  return report;
}

// ─── Manual Mode ────────────────────────────────────────────────────────────

function generateManualReport() {
  const date = today();

  const sorted = [...KEYWORDS].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority.localeCompare(b.priority);
    return a.keyword.localeCompare(b.keyword);
  });

  const tableRows = sorted.map(r =>
    `| ${r.priority} | ${r.keyword} | ${r.page} |  |  |  |  |`
  );

  const checklist = sorted.map((r, i) =>
    `${i + 1}. [ ] Chercher \`${r.keyword}\` sur Google.fr (navigation privee)\n` +
    `   - Position : ___  |  Page trouvee : ${r.page} ? oui / non`
  );

  const report = `# SEO Report — ${date} (MODE MANUEL)

> Ce rapport a ete genere en mode manuel car les credentials Google Search Console
> ne sont pas configures. Remplir les donnees manuellement.

## Comment verifier

1. Ouvrir Google.fr en **navigation privee**
2. Se localiser sur **Saint-Louis 68** (ou desactiver la geolocalisation)
3. Chercher chaque mot-cle ci-dessous
4. Noter la position et la page qui apparait

## Checklist

${checklist.join('\n')}

## Template de rapport

Remplir le tableau ci-dessous avec les donnees collectees :

| Priority | Keyword | Target Page | Position | Impressions | Clicks | CTR |
|----------|---------|-------------|----------|-------------|--------|-----|
${tableRows.join('\n')}

## Alternative : utiliser Google Search Console

Pour un suivi automatise, configurer l'acces API :
- Voir \`scripts/seo/seo-monitor-setup.md\` pour les instructions
- Ou consulter directement : https://search.google.com/search-console

---
*Genere par seo-monitor.mjs (mode manuel) le ${new Date().toISOString()}*
`;

  return report;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const isManual = process.argv.includes('--manual');
  const date = today();
  const outPath = reportPath(date);

  ensureReportsDir();

  console.log(`\n🔍 SEO Monitor — ${date}`);
  console.log(`   ${KEYWORDS.length} mots-cles suivis\n`);

  if (isManual) {
    console.log('📋 Mode manuel — generation du template...\n');
    const report = generateManualReport();
    writeFileSync(outPath, report, 'utf-8');
    console.log(`✅ Template genere : ${outPath}`);
    console.log('   Ouvrir le fichier et remplir les donnees manuellement.');
    return;
  }

  // Check for GSC credentials
  const hasCredentials = !!process.env.GOOGLE_SEARCH_CONSOLE_KEY_FILE;

  if (!hasCredentials) {
    console.log('⚠️  Pas de credentials Google Search Console detectes.');
    console.log('   Variables necessaires :');
    console.log('   - GOOGLE_SEARCH_CONSOLE_KEY_FILE=/path/to/key.json');
    console.log('   - GSC_SITE_URL=https://aiman-renovation.fr\n');
    console.log('   → Basculement en mode manuel.\n');

    const report = generateManualReport();
    writeFileSync(outPath, report, 'utf-8');
    console.log(`✅ Template genere : ${outPath}`);
    console.log('   Voir scripts/seo/seo-monitor-setup.md pour configurer l\'API.');
    return;
  }

  // Automatic mode
  console.log('🔗 Connexion a Google Search Console...\n');

  // Load previous report for comparison
  const previousPath = findPreviousReport(date);
  const previousData = parsePreviousReport(previousPath);
  if (previousPath) {
    console.log(`📊 Rapport precedent trouve : ${previousPath}`);
  }

  const results = await fetchAllKeywordData();
  const report = generateReport(results, previousData);

  writeFileSync(outPath, report, 'utf-8');
  console.log(`\n✅ Rapport genere : ${outPath}`);

  // Quick summary
  const withPos = results.filter(r => r.position !== null);
  const avgPos = withPos.length > 0
    ? (withPos.reduce((s, r) => s + r.position, 0) / withPos.length).toFixed(1)
    : '—';
  const totalClicks = results.reduce((s, r) => s + (r.clicks || 0), 0);

  console.log(`   Position moyenne : ${avgPos}`);
  console.log(`   Clics totaux (30j) : ${totalClicks}`);
  console.log(`   Mots-cles positionnes : ${withPos.length}/${results.length}`);
}

main().catch(err => {
  console.error('\n❌ Erreur fatale :', err.message);
  process.exit(1);
});
