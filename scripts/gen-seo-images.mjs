#!/usr/bin/env node
/**
 * gen-seo-images.mjs
 * Génère 59 images SEO uniques via Gemini Imagen 4.0
 * Usage: node scripts/gen-seo-images.mjs
 * Retry: node scripts/gen-seo-images.mjs --retry-failed
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// API Key — env var uniquement (la clé hardcodée de generate-images.sh a été révoquée)
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('ERROR: No API key found.');
  console.error('Set GEMINI_API_KEY or GOOGLE_API_KEY environment variable.');
  console.error('Example: GEMINI_API_KEY=AIza... node scripts/gen-seo-images.mjs');
  process.exit(1);
}

const RETRY_FAILED = process.argv.includes('--retry-failed');

// ─── LISTE DES 59 IMAGES ────────────────────────────────────────────────────

const IMAGES = [

  // ── BLOG (15 articles) ────────────────────────────────────────────────────

  {
    category: 'blog',
    slug: 'prix-renovation-salle-de-bain-saint-louis',
    prompt: 'Professional editorial photography of a modern bathroom renovation in Alsace France. Newly installed large-format grey porcelain tiles, walk-in shower, floating vanity with vessel sink, natural light from frosted window. Calculator, renovation blueprints and price estimate on counter. Clean and bright interior. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'cout-cuisine-equipee-alsace',
    prompt: 'Professional editorial photography of a modern equipped kitchen with Alsatian design influences. White handleless cabinets, dark granite countertop, integrated appliances, warm oak wood accents. Price estimate papers and tape measure on kitchen island, natural daylight. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'renovation-appartement-bale-demarches',
    prompt: 'Professional editorial photography of a contemporary apartment renovation in Basel Switzerland. Open-plan living area under renovation, city view through large windows, architectural blueprints and administrative documents spread on a work table, hard hat and safety vest. Modern Swiss urban context. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'artisan-frontalier-france-suisse-avantages',
    prompt: 'Professional editorial photography showing a French craftsman working in a cross-border context. Split scene: French village landscape on left, Swiss Basel cityscape on right, craftsman in work overalls with tools in the center. Rhine river bridge visible in background, golden hour light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'isolation-thermique-haut-rhin-primes-2026',
    prompt: 'Professional editorial photography of thermal insulation installation on an Alsatian house facade. Workers installing white polystyrene insulation panels, thermal diagram and energy certificate documents visible. House in Haut-Rhin France, autumn light, scaffolding. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'renover-maison-ancienne-saint-louis',
    prompt: 'Professional editorial photography of an old traditional Alsatian half-timbered house being renovated in Saint-Louis France. Before and after split: left side showing original weathered timber frame, right side showing freshly restored beams and render. Warm daylight, residential street. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'carrelage-ou-parquet-guide-alsace',
    prompt: 'Professional editorial photography comparing flooring materials. Split composition: left half showing elegant large-format porcelain floor tiles in light grey, right half showing warm natural oak engineered parquet. Both installed in a bright Alsatian home interior, natural daylight. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'peinture-interieure-mulhouse-tendances',
    prompt: 'Professional editorial photography of contemporary interior painting trends in Alsace. Freshly painted living room in a Mulhouse apartment, terracotta accent wall, sage green ceiling, white trim, paint swatches and color palette cards on the floor. Natural light, warm tones. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'electricite-normes-nf-c-15-100',
    prompt: 'Professional editorial photography of a modern electrical panel installation in a French home. Clean white distribution board with organized circuit breakers, certified electrician in work uniform connecting cables, NF C 15-100 compliance documentation nearby. Professional and technical atmosphere. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'plomberie-renovation-signes-refaire',
    prompt: 'Professional editorial photography showing plumbing renovation signs in a French bathroom. Close-up of deteriorated pipes with limescale, water stains on wall tiles, contrasted with new copper and PER pipes being installed. Plumber hands working, tools visible. Educational documentary style. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'ravalement-facade-haut-rhin-prix',
    prompt: 'Professional editorial photography of a facade renovation in Haut-Rhin Alsace. Worker on scaffolding applying fresh white mineral render to an old house, deteriorated original render visible on adjacent section. Alsatian village street, blue sky, professional construction photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'renovation-energetique-aides-2026',
    prompt: 'Professional editorial photography of an energy-efficient home renovation in France 2026. Newly installed heat pump, solar panels on roof, triple-glazed windows, thick insulation visible in wall section. Energy label A certificate and MaPrimeRenov documents on a modern desk. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'salle-de-bain-pmr-seniors-guide',
    prompt: 'Professional editorial photography of an adapted accessible bathroom for seniors and people with reduced mobility. Walk-in shower with folding seat and grab rails, anti-slip floor tiles, height-adjustable sink, wide doorway. Bright and safe design, warm natural light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'renovation-loft-mulhouse-idees',
    prompt: 'Professional architectural photography of a renovated loft in Mulhouse Alsace. Industrial-style open-plan space, exposed brick walls, steel beams, polished concrete floor, modern designer furniture. Large factory windows letting in diffused northern light. Contemporary urban living. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'blog',
    slug: 'choisir-artisan-renovation-10-criteres',
    prompt: 'Professional editorial photography illustrating the selection of a renovation craftsman. Homeowner and craftsman reviewing blueprints and project documents at a kitchen table, professional presentation folder visible, handshake framing. Bright residential setting, trust and expertise atmosphere. 16:9 ratio, photorealistic, no text.',
  },

  // ── VILLES FRANCE (22 villes) ─────────────────────────────────────────────

  {
    category: 'villes',
    slug: 'saint-louis',
    prompt: 'Architectural photography of Saint-Louis Alsace France, charming residential street with well-maintained Alsatian houses, half-timbered facades and flower boxes, clean urban environment near the Rhine. Professional real estate context, golden afternoon light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'mulhouse',
    prompt: 'Architectural photography of Mulhouse city center, Alsace France. Art Nouveau architecture facades on the main square, renovated 19th century townhouses, urban renewal context. Warm daylight, professional architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'ferrette',
    prompt: 'Architectural photography of Ferrette medieval village in Sundgau Alsace France. Picturesque half-timbered houses on hillside, medieval castle ruins visible above the village, narrow stone streets. Warm afternoon light, authentic Alsatian architecture. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'bartenheim',
    prompt: 'Architectural photography of Bartenheim village in Haut-Rhin Alsace France. Traditional Alsatian residential houses with red tile roofs and render facades, quiet village street, well-maintained properties. Natural daylight, peaceful suburban setting. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'blotzheim',
    prompt: 'Architectural photography of Blotzheim village in Haut-Rhin Alsace France, near Basel airport. Mix of traditional Alsatian houses and modern residential properties, village church tower in background, green surroundings. Clear blue sky, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'hesingue',
    prompt: 'Architectural photography of Hesingue commune in Haut-Rhin Alsace France. Traditional village houses with characteristic Alsatian facades, flower-decorated window boxes, village square. Warm natural light, charming residential architecture. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'village-neuf',
    prompt: 'Architectural photography of Village-Neuf in Haut-Rhin Alsace France, near the Rhine and Three Countries Corner. Modern and traditional residential mix, clean streets, green gardens. Blue sky, suburban residential context. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'huningue',
    prompt: 'Architectural photography of Huningue in Haut-Rhin Alsace France, border town on the Rhine. Historic 18th century fortified town architecture, renovated facades along main street, footbridge over the Rhine in distance. Natural daylight, architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'kembs',
    prompt: 'Architectural photography of Kembs commune in Haut-Rhin Alsace France near the Rhine canal. Traditional Alsatian farmhouse architecture, agricultural and residential setting, church spire visible, autumn colors. Peaceful rural context, natural light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'ottmarsheim',
    prompt: 'Architectural photography of Ottmarsheim village in Haut-Rhin Alsace France. Romanesque abbey church, traditional Alsatian houses around the historic center, well-preserved heritage. Warm afternoon light, small town character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'sierentz',
    prompt: 'Architectural photography of Sierentz town in Haut-Rhin Alsace France. Main street with traditional Alsatian merchant houses, weekly market stalls, historic town center. Clear daylight, lively small town atmosphere. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'rixheim',
    prompt: 'Architectural photography of Rixheim commune in Haut-Rhin Alsace France. Residential streets with Alsatian-style houses, wallpaper museum landmark, maintained gardens and facades. Professional residential context, natural light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'habsheim',
    prompt: 'Architectural photography of Habsheim town in Haut-Rhin Alsace France. Traditional Alsatian townhouses along the main street, renovated render facades, characteristic window shutters. Bright daylight, authentic small town character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'brunstatt',
    prompt: 'Architectural photography of Brunstatt-Didenheim suburban area near Mulhouse Alsace France. Well-maintained residential street, mix of 1970s houses and renovated properties, mature trees lining the road. Sunny day, pleasant suburban setting. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'wittenheim',
    prompt: 'Architectural photography of Wittenheim town in Haut-Rhin Alsace France. Town center with mix of residential and commercial buildings, renovated facades, main street vitality. Natural daylight, urban town context. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'illzach',
    prompt: 'Architectural photography of Illzach suburban commune adjacent to Mulhouse Alsace France. Residential neighborhood with 1960s-1980s era houses being renovated, clean streets, garden setting. Professional real estate context, afternoon light. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'kingersheim',
    prompt: 'Architectural photography of Kingersheim commune near Mulhouse Alsace France. Suburban residential street with traditional Alsatian-influenced houses, flower gardens, renovation work visible. Blue sky, peaceful residential neighborhood. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'wittelsheim',
    prompt: 'Architectural photography of Wittelsheim town in Haut-Rhin Alsace France. Residential area with mix of older potash-era workers houses and modern renovations, typical Alsatian landscape. Natural light, small industrial town character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'staffelfelden',
    prompt: 'Architectural photography of Staffelfelden commune in Haut-Rhin Alsace France. Quiet residential street with individual houses, mature gardens, Alsatian architectural character. Clear blue sky, suburban setting. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'altkirch',
    prompt: 'Architectural photography of Altkirch historic town in Sundgau Alsace France. Hilltop town with medieval character, Notre-Dame church dominating the skyline, traditional Alsatian buildings around the central square. Golden hour light, architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'thann',
    prompt: 'Architectural photography of Thann town in Haut-Rhin Alsace France. Gothic Collegiate Church of Saint-Thiébaut rising above traditional Alsatian townhouses, wine-growing context, Vosges mountains in background. Warm afternoon light, heritage architecture. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'cernay',
    prompt: 'Architectural photography of Cernay town in Haut-Rhin Alsace France. Town center with post-war Alsatian reconstruction architecture, main street with renovated commercial and residential facades. Natural daylight, dynamic small town. 16:9 ratio, photorealistic, no text.',
  },

  // ── VILLES SUISSE (16 villes) ─────────────────────────────────────────────

  {
    category: 'villes',
    slug: 'basel',
    prompt: 'Architectural photography of Basel Switzerland city skyline. Basler Münster cathedral rising above the historic city, Rhine river in the foreground with Mittlere Brücke bridge, elegant historic facades along the riverbank. Blue sky with clouds, professional architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'allschwil',
    prompt: 'Architectural photography of Allschwil residential neighborhood Basel-Landschaft Switzerland. Elegant suburban street with well-maintained 1980s single-family houses, mature trees, quiet and prosperous atmosphere. Warm daylight, professional real estate photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'binningen',
    prompt: 'Architectural photography of Binningen commune Basel-Landschaft Switzerland. Upscale residential street on a hillside with views toward Basel, elegant villas and townhouses from the 1960s-70s, well-tended gardens. Golden afternoon light, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'bottmingen',
    prompt: 'Architectural photography of Bottmingen commune Basel-Landschaft Switzerland. Historic Bottmingen moated castle (Schloss Bottmingen) surrounded by elegant residential villas, manicured gardens, prestigious village character. Clear sky, architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'riehen',
    prompt: 'Architectural photography of Riehen residential district Basel-Stadt Switzerland. Tree-lined street with elegant historic villas and townhouses, Beyeler Foundation park context, affluent suburban character. Warm afternoon light, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'birsfelden',
    prompt: 'Architectural photography of Birsfelden commune Basel-Landschaft Switzerland on the Rhine. Rhine river port atmosphere with residential buildings being renovated, post-industrial character mixed with modern housing. Natural daylight, urban renewal photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'muttenz',
    prompt: 'Architectural photography of Muttenz commune Basel-Landschaft Switzerland. St. Arbogast historic fortified church surrounded by a mix of traditional Swiss farmhouses and modern residential development. Clear daylight, village character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'reinach-bl',
    prompt: 'Architectural photography of Reinach Basel-Landschaft Switzerland. Suburban residential street with multi-family apartment buildings from the 1970s-80s alongside single-family houses, renovation work visible. Natural light, Swiss suburban setting. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'oberwil-bl',
    prompt: 'Architectural photography of Oberwil commune in Leimental valley Basel-Landschaft Switzerland. Historic village center with half-timbered farmhouses and traditional Swiss architecture, surrounded by rolling green hills. Sunny day, peaceful rural character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'therwil',
    prompt: 'Architectural photography of Therwil family-friendly commune in Leimental Basel-Landschaft Switzerland. Quiet residential street with well-maintained 1980s-90s family houses, gardens and trees, clean suburban environment. Blue sky, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'muenchenstein',
    prompt: 'Architectural photography of Münchenstein commune adjacent to Basel, Basel-Landschaft Switzerland. Historic railway viaduct landmark over the Birs river, mix of old buildings along the waterway and modern residential development on the hillside. Natural light, architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'arlesheim',
    prompt: 'Architectural photography of Arlesheim village Basel-Landschaft Switzerland. Baroque St. Mary Cathedral dominating the historic village center, 18th century bourgeois houses along cobblestone streets, green Birseck parkland surroundings. Golden hour light, heritage architecture. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'pratteln',
    prompt: 'Architectural photography of Pratteln industrial and residential commune Basel-Landschaft Switzerland on the Rhine. Mix of converted industrial buildings and modern residential developments, Rhine river logistics visible in background. Natural daylight, urban transformation photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'aesch-bl',
    prompt: 'Architectural photography of Aesch wine-growing commune in Birseck valley Basel-Landschaft Switzerland. Traditional Swiss farmhouses and wine cellars, vineyards on gentle slopes, peaceful agricultural landscape with residential character. Autumn light, rural Swiss setting. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'dornach',
    prompt: 'Architectural photography of Dornach commune Solothurn canton Switzerland. Goetheanum unique Rudolf Steiner expressionist concrete architecture on the hill, surrounding village with traditional Swiss houses below. Dramatic sky, iconic architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'liestal',
    prompt: 'Architectural photography of Liestal cantonal capital Basel-Landschaft Switzerland. Historic city gate (Stadttor) and medieval old town street with well-preserved burgher houses, half-timbered facades and Art Nouveau buildings. Clear daylight, historic town photography. 16:9 ratio, photorealistic, no text.',
  },

  // ── VILLES ALLEMAGNE (6 villes) ───────────────────────────────────────────

  {
    category: 'villes',
    slug: 'weil-am-rhein',
    prompt: 'Architectural photography of Weil am Rhein Germany. Modern residential quarter near the French border, Dreiländereck Three Countries Corner marker visible in distance by the Rhine, mix of contemporary housing and traditional buildings. Clear blue sky, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'loerrach',
    prompt: 'Architectural photography of Lörrach city center Baden-Württemberg Germany. Historic old town with half-timbered houses and Rötteln castle ruin visible on the hillside above, Dreiländereck region character. Warm afternoon light, architectural photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'grenzach-wyhlen',
    prompt: 'Architectural photography of Grenzach-Wyhlen commune on the Rhine Baden-Württemberg Germany. Riverside residential neighborhood with family houses and gardens, Rhine riverbank promenade visible, green suburban setting near Basel. Natural daylight, professional photography. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'binzen',
    prompt: 'Architectural photography of Binzen wine village in Markgräflerland Baden-Württemberg Germany. Traditional half-timbered Fachwerkhaus houses in historic village center, vineyards on gentle slopes, characteristic South Baden rural character. Warm light, authentic village atmosphere. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'eimeldingen',
    prompt: 'Architectural photography of Eimeldingen small rural commune in Lörrach district Baden-Württemberg Germany. Typical South Baden village with individual family houses, fruit orchards and vineyards landscape, quiet residential setting. Clear sky, rural German village character. 16:9 ratio, photorealistic, no text.',
  },
  {
    category: 'villes',
    slug: 'kandern',
    prompt: 'Architectural photography of Kandern historic small town in Markgräflerland Baden-Württemberg Germany. Rosenfels park with castle ruins above the town, historic stone-built old town below, wine culture and Black Forest foothills setting. Golden hour light, atmospheric photography. 16:9 ratio, photorealistic, no text.',
  },
];

// ─── MODÈLES À ESSAYER ──────────────────────────────────────────────────────

const MODELS = [
  'imagen-4.0-generate-001',
  'imagen-3.0-generate-002',
];

// ─── GÉNÉRATION ─────────────────────────────────────────────────────────────

async function generateWithModel(model, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '16:9',
        personGeneration: 'allow_adult',
        safetyFilterLevel: 'block_low_and_above',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status} (${model}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const bytes = data.predictions?.[0]?.bytesBase64Encoded;
  if (!bytes) {
    throw new Error(`No image in response (${model}): ${JSON.stringify(data).slice(0, 200)}`);
  }
  return bytes;
}

async function generateImage(item) {
  const outputPath = join(ROOT, 'public/images', item.category, `${item.slug}.png`);
  await mkdir(dirname(outputPath), { recursive: true });

  let lastErr;
  for (const model of MODELS) {
    try {
      const bytes = await generateWithModel(model, item.prompt);
      const buf = Buffer.from(bytes, 'base64');
      await writeFile(outputPath, buf);
      console.log(`  OK  ${item.category}/${item.slug}.png  (${(buf.length / 1024).toFixed(0)} KB) via ${model}`);
      return { success: true, slug: item.slug };
    } catch (err) {
      lastErr = err;
      if (err.message.includes('429')) {
        console.log(`  RATE LIMIT — waiting 30s before retry with next model...`);
        await sleep(30000);
      }
    }
  }
  throw lastErr;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const failedLogPath = join(ROOT, 'scripts', 'gen-seo-images-failed.json');

  let toProcess = IMAGES;

  if (RETRY_FAILED && existsSync(failedLogPath)) {
    const failed = JSON.parse(await readFile(failedLogPath, 'utf8'));
    const failedSlugs = new Set(failed.map((f) => f.slug));
    toProcess = IMAGES.filter((img) => failedSlugs.has(img.slug));
    console.log(`\nRetrying ${toProcess.length} previously failed images...\n`);
  }

  console.log(`\nGenerating ${toProcess.length} SEO images via Gemini Imagen 4.0\n`);
  console.log(`API KEY: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}\n`);

  const failed = [];
  let done = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const progress = `[${String(i + 1).padStart(2, '0')}/${toProcess.length}]`;
    process.stdout.write(`${progress} ${item.category}/${item.slug} ... `);

    let succeeded = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await generateImage(item);
        done++;
        succeeded = true;
        break;
      } catch (err) {
        if (attempt < 3) {
          console.log(`\n  Attempt ${attempt} failed: ${err.message.slice(0, 120)}`);
          console.log(`  Waiting 5s before retry...`);
          await sleep(5000);
        } else {
          console.log(`\n  FAILED after 3 attempts: ${err.message.slice(0, 120)}`);
          failed.push({ slug: item.slug, category: item.category, error: err.message.slice(0, 200) });
        }
      }
    }

    // Rate limiting: 3s between images (Imagen 4.0 quota)
    if (succeeded) {
      await sleep(3000);
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Done: ${done}/${toProcess.length} images generated`);

  if (failed.length > 0) {
    await writeFile(failedLogPath, JSON.stringify(failed, null, 2));
    console.log(`\nFailed images (${failed.length}) logged to scripts/gen-seo-images-failed.json`);
    console.log('Re-run with: node scripts/gen-seo-images.mjs --retry-failed');
    failed.forEach((f) => console.log(`  - ${f.category}/${f.slug}: ${f.error.slice(0, 80)}`));
  } else {
    console.log('All images generated successfully!');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
