#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REAL = path.join(ROOT, 'public/images/realisations');
const SERV = path.join(ROOT, 'public/images/services');

fs.mkdirSync(REAL, { recursive: true });
fs.mkdirSync(SERV, { recursive: true });

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('OPENAI_API_KEY missing'); process.exit(1); }

const IMAGES = [
  // ── Cuisine ──
  { path: `${REAL}/cuisine-avant.png`, prompt: `Professional interior photograph of a deteriorated 1970s kitchen in an old Alsatian house, Saint-Louis France. Yellowed peeling wallpaper, worn brown laminate cabinets with missing handles, cracked linoleum floor, stained countertop, dim fluorescent tube light, small dirty window. Realistic, editorial photography style, wide angle 24mm lens, natural light.` },
  { path: `${REAL}/cuisine-apres.png`, prompt: `Professional interior photograph of a beautifully renovated modern kitchen in an Alsatian house, Saint-Louis France. Matte white handleless cabinets, dark stone countertop, stainless steel appliances, white subway tile backsplash, warm LED recessed lighting, oak engineered floor, large window with natural light. Realistic, interior design magazine style, wide angle 24mm.` },
  { path: `${SERV}/cuisine.png`, prompt: `Professional photograph of a kitchen renovation in progress in a French house. Old cabinets partially demolished, new white cabinets being installed, tools on countertop, protective floor covering, construction dust. Realistic editorial construction photography, wide angle.` },

  // ── Salle de bain ──
  { path: `${REAL}/salle-de-bain-avant.png`, prompt: `Professional photograph of an old run-down bathroom in a French house. Cracked pink tiles from the 1980s, rusty bathtub with limescale, stained grout, old white toilet with tank, mold spots on ceiling, single bare bulb, small frosted window. Realistic editorial photography, wide angle.` },
  { path: `${REAL}/salle-de-bain-apres.png`, prompt: `Professional photograph of a luxurious renovated modern bathroom. Large walk-in rainfall shower with frameless glass, floating oak vanity with white vessel sink, large format gray porcelain tiles, backlit mirror, heated chrome towel rail, warm recessed LED lighting. Realistic interior design magazine photography, wide angle.` },
  { path: `${SERV}/salle-de-bain.png`, prompt: `Professional photograph of a bathroom renovation in progress. Tiler laying large format tiles on wall with notched trowel, adhesive bucket, tile spacers, half-tiled wall showing old surface underneath. Realistic construction photography.` },

  // ── Façade ITE ──
  { path: `${REAL}/facade-ite-avant.png`, prompt: `Professional exterior photograph of a deteriorated Alsatian house facade in Saint-Louis 68300, France. Cracked cement render with large cracks, water stains, peeling paint, old single-pane wooden windows with damaged shutters, exposed masonry patches, moss growth at base, overcast sky. Street view, wide angle, realistic architectural photography.` },
  { path: `${REAL}/facade-ite-apres.png`, prompt: `Professional exterior photograph of a beautifully renovated Alsatian house with external wall insulation (ITE). Fresh smooth white mineral render, new dark green louvered shutters, double-glazed PVC windows, bright red front door with brass handle, well-maintained front garden with low stone wall, blue sky. Street view, wide angle, realistic architectural magazine photography.` },
  { path: `${SERV}/facade-ite.png`, prompt: `Professional photograph of facade renovation with ITE insulation in progress on an Alsatian house. Scaffolding visible, workers applying polystyrene insulation boards to exterior wall, reinforcing mesh being embedded in adhesive, partially rendered sections. Realistic construction documentary photography, wide angle.` },

  // ── Jardin ──
  { path: `${REAL}/jardin-avant.png`, prompt: `Professional photograph of an abandoned overgrown garden behind a French house in Alsace. Tall weeds everywhere, broken old wooden fence, bare muddy soil patches, dead brown shrubs, pile of rubble in corner, neglected patchy lawn, overcast grey sky. Wide angle landscape photography, realistic.` },
  { path: `${REAL}/jardin-apres.png`, prompt: `Professional photograph of a beautifully landscaped garden in Alsace, France. Manicured green lawn, curved natural stone pathway, wooden deck terrace with modern outdoor dining set, colorful flower beds with lavender and roses, trimmed boxwood hedges, mature fruit tree, warm solar path lights, golden hour sunlight. Professional landscape design magazine photography, wide angle.` },
  { path: `${SERV}/jardin.png`, prompt: `Professional photograph of garden landscaping work in progress. Landscaper laying natural stone pavers for a pathway, freshly planted young shrubs, new wooden fence posts being installed, bags of topsoil, wheelbarrow. Alsatian garden setting. Realistic construction photography, wide angle.` },

  // ── Borne IRVE ──
  { path: `${REAL}/borne-irve-avant.png`, prompt: `Professional photograph of an empty dark residential garage in a French house. Bare unpainted concrete floor with oil stains, exposed cinder block walls, single bare incandescent bulb, old rusty electrical panel, cobwebs, clutter in corner. Wide angle, dim unflattering light, realistic photography.` },
  { path: `${REAL}/borne-irve-apres.png`, prompt: `Professional photograph of a modern residential garage with an installed IRVE electric vehicle charging station. Sleek white wall-mounted Schneider EVlink charger with glowing green LED indicator, light grey epoxy coated floor, white painted walls, bright LED strip ceiling light, dark blue electric car plugged in with charging cable, clean organized space. Realistic, modern, professional photography, wide angle.` },
  { path: `${SERV}/borne-irve.png`, prompt: `Professional photograph of an electrician installing a wall-mounted EV charging station (IRVE wallbox) in a residential garage. Wiring being connected, electrical panel open showing dedicated circuit, drill and tools on floor. French residential setting. Realistic construction photography.` },

  // ── Panneaux solaires ──
  { path: `${REAL}/panneaux-solaires-avant.png`, prompt: `Professional exterior photograph of a typical Alsatian house with bare clay tile roof, no solar equipment. Traditional pitched roof with chimney, dormer window, rendered facade, small front garden, residential street in Saint-Louis France. Overcast sky. Realistic architectural photography, street view angle showing full roof.` },
  { path: `${REAL}/panneaux-solaires-apres.png`, prompt: `Professional exterior photograph of an Alsatian house in Saint-Louis France with solar photovoltaic panels installed on the south-facing roof. 12 sleek dark blue monocrystalline panels neatly arranged in rows on mounting rails, small white inverter box on side wall, clay tile roof, blue sky with bright sun. Realistic architectural magazine photography, angle showing roof clearly.` },
  { path: `${SERV}/panneaux-solaires.png`, prompt: `Professional photograph of solar panel installation in progress on an Alsatian house roof. Two workers on scaffolding mounting a solar panel onto aluminum rail system on pitched clay tile roof, cables and mounting hardware visible, clear sky. Realistic construction photography, shot from ground looking up.` },
];

async function generate(prompt, outputPath) {
  const name = path.relative(ROOT, outputPath);
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭  ${name} (existe)`);
    return;
  }

  console.log(`  🎨 ${name}...`);
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 429) {
      console.log(`  ⏳ Rate limited, attente 60s...`);
      await sleep(60000);
      return generate(prompt, outputPath); // retry
    }
    throw new Error(`API ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const buf = Buffer.from(data.data[0].b64_json, 'base64');
  fs.writeFileSync(outputPath, buf);
  console.log(`  ✅ ${name} (${(buf.length / 1024).toFixed(0)} Ko)`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log(`\n🖼️  Génération de ${IMAGES.length} images via DALL-E 3 HD\n`);

  let done = 0;
  for (const img of IMAGES) {
    try {
      await generate(img.prompt, img.path);
      done++;
    } catch (err) {
      console.error(`  ❌ ${path.basename(img.path)}: ${err.message}`);
    }
    // Rate limit: ~1 req / 15s pour DALL-E 3
    if (done < IMAGES.length) await sleep(16000);
  }

  console.log(`\n✅ ${done}/${IMAGES.length} images générées`);
}

main();
