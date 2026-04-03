#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REAL = path.join(ROOT, 'public/images/realisations');
const SERV = path.join(ROOT, 'public/images/services');
const HERO = path.join(ROOT, 'public/images/hero');

fs.mkdirSync(REAL, { recursive: true });
fs.mkdirSync(SERV, { recursive: true });
fs.mkdirSync(HERO, { recursive: true });

const KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash-image';

const IMAGES = [
  // ── Cuisine ──
  { path: `${REAL}/cuisine-avant.png`, prompt: `Generate a photorealistic wide-angle interior photograph of a deteriorated 1970s kitchen in an old Alsatian house in Saint-Louis, France. Dated brown laminate cabinets with missing handles, yellowed peeling wallpaper, cracked dirty linoleum floor, stained formica countertop, dim flickering fluorescent tube, small grimy window, water damage marks on ceiling. Shot on 24mm lens, natural harsh light, editorial documentary style. No text, no watermark.` },
  { path: `${REAL}/cuisine-apres.png`, prompt: `Generate a photorealistic wide-angle interior photograph of a stunning renovated modern kitchen in an Alsatian house. Matte white handleless cabinets, polished dark granite countertop, stainless steel oven and fridge, white subway tile backsplash with dark grout, warm recessed LED lighting, light oak engineered wood floor, large window flooding natural light. 24mm lens, bright airy, interior design magazine style. No text, no watermark.` },
  { path: `${SERV}/cuisine.png`, prompt: `Generate a photorealistic photograph of a kitchen renovation in progress. Old brown cabinets half demolished on left, new white cabinets being installed on right, power tools on the countertop, protective plastic sheeting on floor, dust in air, construction worker visible from behind. Wide angle, realistic editorial construction photography. No text.` },

  // ── Salle de bain ──
  { path: `${REAL}/salle-de-bain-avant.png`, prompt: `Generate a photorealistic photograph of an old decrepit bathroom in a French house. Cracked pink ceramic tiles from the 1980s, stained yellowed bathtub with visible limescale, moldy grout lines, old white toilet with exposed tank, rusty towel bar, single bare bulb hanging from ceiling, small frosted window, water stain on ceiling. Wide angle, unflattering harsh light. No text, no watermark.` },
  { path: `${REAL}/salle-de-bain-apres.png`, prompt: `Generate a photorealistic photograph of a luxurious modern renovated bathroom. Large walk-in rainfall shower with frameless glass partition, floating light oak vanity with round white vessel sink, large format light grey porcelain tiles floor to ceiling, backlit round mirror, heated chrome towel rail, recessed warm LED lighting, green plant accent. Wide angle, bright spa-like atmosphere. Interior design magazine quality. No text, no watermark.` },
  { path: `${SERV}/salle-de-bain.png`, prompt: `Generate a photorealistic photograph of a professional tiler at work renovating a bathroom. Close-up of hands laying large format porcelain tiles on a wall using a notched trowel, tile spacers visible, bucket of adhesive on floor, half-finished wall showing old surface below. Realistic construction photography. No text.` },

  // ── Façade ITE ──
  { path: `${REAL}/facade-ite-avant.png`, prompt: `Generate a photorealistic exterior photograph of a deteriorated house facade in the Alsace region of France. Severely cracked cement render with large diagonal cracks, dark water stains running down from roof, peeling ochre paint, old single-pane wooden windows with rotting frames and broken shutters, moss and lichen growth at base, missing render patches exposing brick. Overcast grey sky, wide angle street view. Architectural documentary photography. No text, no watermark.` },
  { path: `${REAL}/facade-ite-apres.png`, prompt: `Generate a photorealistic exterior photograph of a beautifully renovated Alsatian house with ITE external thermal insulation. Smooth fresh white mineral render, brand new double-glazed windows with dark green louvered wooden shutters, bright red front door with polished brass handle, clean stone window sills, new zinc gutters, well-maintained front garden with low stone wall and boxwood hedge, bright blue sky. Wide angle street view, professional architectural photography. No text, no watermark.` },
  { path: `${SERV}/facade-ite.png`, prompt: `Generate a photorealistic photograph of an ITE facade insulation installation in progress on a French house. Metal scaffolding covering the facade, worker in hard hat applying expanded polystyrene boards to the wall, reinforcing fiberglass mesh visible on one section, trowel applying basecoat render on another section. Different stages visible simultaneously. Construction photography. No text.` },

  // ── Jardin ──
  { path: `${REAL}/jardin-avant.png`, prompt: `Generate a photorealistic photograph of an abandoned overgrown backyard garden behind a French house in Alsace. Knee-high weeds and wild grass everywhere, broken rotting wooden fence panels, bare muddy patches, dead brown shrubs, pile of construction rubble and old bricks in corner, single dead tree, neglected cracked concrete path. Overcast depressing light, wide angle. No text, no watermark.` },
  { path: `${REAL}/jardin-apres.png`, prompt: `Generate a photorealistic photograph of a professionally landscaped garden in Alsace, France. Perfectly manicured emerald green lawn, curved natural stone pathway leading to a beautiful composite wood deck terrace with modern teak outdoor dining set with 4 chairs, vibrant flower beds with lavender, roses and hydrangeas, trimmed boxwood hedges bordering the lawn, mature apple tree with string lights, warm solar LED path bollard lights, wooden fence in background. Golden hour warm sunlight. Professional landscape architecture photography. No text, no watermark.` },
  { path: `${SERV}/jardin.png`, prompt: `Generate a photorealistic photograph of professional landscaping work in progress. Landscape gardener kneeling and laying natural flagstone pavers in a curved path, freshly planted young shrubs in burlap root balls nearby, new wooden fence posts being installed in background, bags of premium topsoil, wheelbarrow with tools. Green Alsatian garden setting, sunny day. Construction photography. No text.` },

  // ── Borne IRVE ──
  { path: `${REAL}/borne-irve-avant.png`, prompt: `Generate a photorealistic photograph of an empty neglected residential garage in a French house. Bare grey concrete floor with oil stains and cracks, unpainted cinder block walls, single dim incandescent bare bulb, old rusty fuse box with exposed wiring, cobwebs in corners, miscellaneous clutter and old paint cans, no car. Wide angle, unflattering harsh light from single source. No text, no watermark.` },
  { path: `${REAL}/borne-irve-apres.png`, prompt: `Generate a photorealistic photograph of a modern clean residential garage equipped with an EV charging station. Sleek white wall-mounted wallbox charger with illuminated green LED ring and charging cable holster, light grey epoxy-coated floor with parking line markings, white painted walls, bright recessed LED ceiling lights, modern dark blue electric SUV (like a Peugeot e-3008) plugged in with black charging cable, organized tool wall rack in background. Professional real estate photography. No text, no watermark.` },
  { path: `${SERV}/borne-irve.png`, prompt: `Generate a photorealistic photograph of a certified electrician installing a wall-mounted EV wallbox charger in a residential garage. Electrician in blue work overalls using a drill to mount the bracket, open electrical panel nearby showing a dedicated 32A circuit, cable conduit running along wall, tools and wire strippers on the floor. Professional construction documentation photography. No text.` },

  // ── Panneaux solaires ──
  { path: `${REAL}/panneaux-solaires-avant.png`, prompt: `Generate a photorealistic exterior photograph of a typical Alsatian residential house with a bare roof, no solar panels. Traditional pitched clay tile roof with red-brown tiles, brick chimney, dormer window, cream rendered facade with wooden shutters, small front garden with low hedge, quiet residential street in Saint-Louis France. Partly cloudy sky showing the empty south-facing roof slope prominently. Wide angle from across the street. No text, no watermark.` },
  { path: `${REAL}/panneaux-solaires-apres.png`, prompt: `Generate a photorealistic exterior photograph of the same style Alsatian house now equipped with solar photovoltaic panels. 12 sleek dark blue-black monocrystalline panels in 3 rows of 4, neatly mounted on aluminum rails on the south-facing roof slope, visible micro-inverter white box mounted on the side wall, new smart meter near the front door. Clay tile roof, cream facade, blue sky with bright sun, the panels reflecting slightly. Professional architectural photography showing the full installation. No text, no watermark.` },
  { path: `${SERV}/panneaux-solaires.png`, prompt: `Generate a photorealistic photograph of solar panel installation in progress on an Alsatian house pitched roof. Two workers in hard hats and safety harnesses on scaffolding, one holding a solar panel while the other secures it to aluminum mounting rails with a power drill, several panels already installed in a row, cables and MC4 connectors visible. Clear blue sky, shot from ground level looking up. Professional construction photography. No text.` },
];

async function generate(prompt, outputPath) {
  const name = path.relative(ROOT, outputPath);

  console.log(`  🎨 ${name}...`);
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 429) {
      console.log(`  ⏳ Rate limit, attente 30s...`);
      await sleep(30000);
      return generate(prompt, outputPath);
    }
    throw new Error(`${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find(p => p.inlineData);

  if (!imgPart) {
    const textPart = parts.find(p => p.text);
    throw new Error('No image returned' + (textPart ? ': ' + textPart.text.slice(0, 100) : ''));
  }

  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
  fs.writeFileSync(outputPath, buf);
  console.log(`  ✅ ${name} (${(buf.length / 1024).toFixed(0)} Ko)`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log(`\n🖼️  Génération de ${IMAGES.length} images via Gemini ${MODEL}\n`);

  let done = 0;
  for (const img of IMAGES) {
    try {
      await generate(img.prompt, img.path);
      done++;
    } catch (err) {
      console.error(`  ❌ ${path.basename(img.path)}: ${err.message}`);
    }
    // Gemini rate limit buffer
    await sleep(5000);
  }

  console.log(`\n✅ ${done}/${IMAGES.length} images générées avec Gemini`);
}

main();
