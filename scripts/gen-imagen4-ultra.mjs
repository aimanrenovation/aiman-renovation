#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REAL = path.join(ROOT, 'public/images/realisations');
const SERV = path.join(ROOT, 'public/images/services');

const KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-ultra-generate-001';

const IMAGES = [
  // ── Cuisine ──
  { path: `${REAL}/cuisine-avant.png`, prompt: `Wide-angle interior photograph of a deteriorated 1970s kitchen in an old Alsatian house in Saint-Louis, France. Dated brown laminate cabinets with missing handles, yellowed peeling wallpaper, cracked dirty linoleum floor, stained formica countertop, dim flickering fluorescent tube, small grimy window, water damage on ceiling. Natural harsh light, editorial documentary photography, 24mm lens. Photorealistic.` },
  { path: `${REAL}/cuisine-apres.png`, prompt: `Wide-angle interior photograph of a stunning renovated modern kitchen in an Alsatian house in Saint-Louis, France. Matte white handleless cabinets, polished dark granite countertop, stainless steel appliances, white subway tile backsplash with dark grout, warm recessed LED lighting, light oak engineered wood floor, large window with natural light. Interior design magazine photography, 24mm lens. Photorealistic.` },
  { path: `${SERV}/cuisine.png`, prompt: `Photograph of a kitchen renovation in progress in a French house. Old brown cabinets half demolished on left, new white cabinets being installed on right, power tools on countertop, protective plastic sheeting on floor, dust in air. Wide angle, editorial construction photography. Photorealistic.` },

  // ── Salle de bain ──
  { path: `${REAL}/salle-de-bain-avant.png`, prompt: `Interior photograph of an old decrepit bathroom in a French house. Cracked pink ceramic tiles from the 1980s, stained yellowed bathtub with limescale, moldy grout lines, old white toilet with exposed tank, rusty towel bar, single bare bulb, small frosted window, water stain on ceiling. Wide angle, harsh light. Photorealistic.` },
  { path: `${REAL}/salle-de-bain-apres.png`, prompt: `Interior photograph of a luxurious modern renovated bathroom. Walk-in rainfall shower with frameless glass partition, floating light oak vanity with round white vessel sink, large format light grey porcelain tiles floor to ceiling, backlit round mirror, heated chrome towel rail, warm recessed LED lighting, green plant accent. Wide angle, bright spa atmosphere. Photorealistic, interior design magazine quality.` },
  { path: `${SERV}/salle-de-bain.png`, prompt: `Photograph of a professional tiler renovating a bathroom. Hands laying large format porcelain tiles on wall with notched trowel, tile spacers visible, bucket of adhesive on floor, half-finished wall showing old surface underneath. Realistic construction photography.` },

  // ── Façade ITE ──
  { path: `${REAL}/facade-ite-avant.png`, prompt: `Exterior photograph of a deteriorated house facade in Alsace region, France. Severely cracked cement render with large diagonal cracks, dark water stains from roof, peeling ochre paint, old single-pane wooden windows with rotting frames and broken shutters, moss growth at base, missing render exposing brick. Overcast grey sky, wide angle street view. Architectural photography. Photorealistic.` },
  { path: `${REAL}/facade-ite-apres.png`, prompt: `Exterior photograph of a beautifully renovated Alsatian house with ITE external thermal insulation. Smooth fresh white mineral render, new double-glazed windows with dark green louvered wooden shutters, bright red front door with brass handle, clean stone window sills, new zinc gutters, front garden with low stone wall and boxwood hedge, bright blue sky. Wide angle street view, architectural magazine photography. Photorealistic.` },
  { path: `${SERV}/facade-ite.png`, prompt: `Photograph of ITE facade insulation installation in progress on a French house. Metal scaffolding, worker applying expanded polystyrene boards to wall, reinforcing fiberglass mesh visible on one section, trowel applying basecoat render on another. Different stages visible. Construction photography. Photorealistic.` },

  // ── Jardin ──
  { path: `${REAL}/jardin-avant.png`, prompt: `Photograph of an abandoned overgrown backyard garden behind a French house in Alsace. Knee-high weeds everywhere, broken rotting wooden fence, bare muddy patches, dead brown shrubs, pile of rubble in corner, neglected cracked concrete path. Overcast depressing light, wide angle. Photorealistic.` },
  { path: `${REAL}/jardin-apres.png`, prompt: `Photograph of a professionally landscaped garden in Alsace, France. Manicured emerald green lawn, curved natural stone pathway, composite wood deck terrace with modern teak outdoor dining set, vibrant flower beds with lavender roses and hydrangeas, trimmed boxwood hedges, mature apple tree with string lights, warm solar path lights, wooden fence. Golden hour sunlight. Professional landscape photography. Photorealistic.` },
  { path: `${SERV}/jardin.png`, prompt: `Photograph of professional landscaping work in progress in an Alsatian garden. Landscape gardener laying natural flagstone pavers, freshly planted young shrubs nearby, new fence posts being installed, bags of topsoil, wheelbarrow. Sunny day. Construction photography. Photorealistic.` },

  // ── Borne IRVE ──
  { path: `${REAL}/borne-irve-avant.png`, prompt: `Interior photograph of an empty neglected residential garage in France. Bare grey concrete floor with oil stains, unpainted cinder block walls, single dim bare bulb, old rusty fuse box, cobwebs, clutter in corner. Wide angle, unflattering harsh light. Photorealistic.` },
  { path: `${REAL}/borne-irve-apres.png`, prompt: `Interior photograph of a modern clean residential garage with EV charging station. Sleek white wall-mounted wallbox charger with illuminated green LED ring, light grey epoxy floor with parking lines, white painted walls, bright LED ceiling lights, dark blue electric SUV plugged in with charging cable, organized space. Professional photography. Photorealistic.` },
  { path: `${SERV}/borne-irve.png`, prompt: `Photograph of an electrician installing a wall-mounted EV wallbox charger in a residential garage. Blue work overalls, using drill to mount bracket, open electrical panel showing dedicated circuit, cable conduit on wall, tools on floor. Construction photography. Photorealistic.` },

  // ── Panneaux solaires ──
  { path: `${REAL}/panneaux-solaires-avant.png`, prompt: `Exterior photograph of a typical Alsatian residential house with bare clay tile roof, no solar panels. Traditional pitched roof with chimney, dormer window, cream rendered facade with shutters, small front garden, residential street in Saint-Louis France. Partly cloudy sky, south-facing roof slope visible. Wide angle street view. Photorealistic.` },
  { path: `${REAL}/panneaux-solaires-apres.png`, prompt: `Exterior photograph of an Alsatian house with solar photovoltaic panels installed. 12 sleek dark blue-black monocrystalline panels in 3 rows of 4 on aluminum rails on south-facing roof, white inverter box on side wall, smart meter near door. Clay tile roof, cream facade, blue sky with bright sun, panels reflecting slightly. Professional architectural photography. Photorealistic.` },
  { path: `${SERV}/panneaux-solaires.png`, prompt: `Photograph of solar panel installation in progress on an Alsatian house roof. Two workers in hard hats on scaffolding, one holding panel while other secures it to aluminum rails with drill, several panels already installed, cables visible. Clear blue sky, shot from ground looking up. Construction photography. Photorealistic.` },
];

async function generate(prompt, outputPath) {
  const name = path.relative(ROOT, outputPath);
  console.log(`  🎨 ${name}...`);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${KEY}`,
    {
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
    }
  );

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 429) {
      console.log(`  ⏳ Rate limit, attente 30s...`);
      await new Promise(r => setTimeout(r, 30000));
      return generate(prompt, outputPath);
    }
    throw new Error(`${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const predictions = data.predictions;
  if (!predictions || !predictions[0]?.bytesBase64Encoded) {
    throw new Error('No image in response: ' + JSON.stringify(data).slice(0, 200));
  }

  const buf = Buffer.from(predictions[0].bytesBase64Encoded, 'base64');
  fs.writeFileSync(outputPath, buf);
  console.log(`  ✅ ${name} (${(buf.length / 1024).toFixed(0)} Ko)`);
}

async function main() {
  console.log(`\n🖼️  Génération de ${IMAGES.length} images via Imagen 4 Ultra\n`);

  let done = 0;
  for (const img of IMAGES) {
    try {
      await generate(img.prompt, img.path);
      done++;
    } catch (err) {
      console.error(`  ❌ ${path.basename(img.path)}: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log(`\n✅ ${done}/${IMAGES.length} images générées avec Imagen 4 Ultra`);
}

main();
