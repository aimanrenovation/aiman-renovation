#!/usr/bin/env node
/**
 * Génère des paires avant/après cohérentes via Imagen 4 Ultra
 * Stratégie : prompt très détaillé avec composition identique,
 * seul l'état (dégradé vs rénové) change.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REAL = path.join(ROOT, 'public/images/realisations');
const SERV = path.join(ROOT, 'public/images/services');

const KEY = process.env.GEMINI_API_KEY;

// Imagen 4 Ultra pour les images individuelles
async function generateImagen(prompt, outputPath) {
  const name = path.relative(ROOT, outputPath);
  console.log(`  🎨 ${name}...`);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${KEY}`,
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
      await sleep(30000);
      return generateImagen(prompt, outputPath);
    }
    throw new Error(`${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.predictions?.[0]?.bytesBase64Encoded) {
    throw new Error('No image: ' + JSON.stringify(data).slice(0, 200));
  }

  const buf = Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
  fs.writeFileSync(outputPath, buf);
  console.log(`  ✅ ${name} (${(buf.length / 1024).toFixed(0)} Ko)`);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/*
 * Chaque paire partage une COMPOSITION FIXE décrite en détail.
 * Seuls les matériaux/état/lumière changent.
 */
const PAIRS = [
  {
    slug: 'cuisine',
    // Composition fixe : vue depuis l'entrée, comptoir au fond, fenêtre à droite
    base: `Wide-angle 24mm interior photograph shot from the kitchen doorway looking straight ahead. The back wall has a countertop running its full width with upper cabinets above. Left wall has the fridge. A window is on the right side of the back wall. The oven and stove are centered on the countertop. Camera height is 1.5m, centered in the room. Photorealistic, professional photography.`,
    before: `The kitchen is old and deteriorated, dating from the 1970s. Brown worn laminate cabinets with some doors hanging loose, yellowed cracked wallpaper, stained beige formica countertop, dirty cracked linoleum floor in brown tones, dim single fluorescent tube on ceiling giving greenish light, grimy small window with torn curtain, old white fridge with rust spots. Everything looks tired, stained and dated. Harsh unflattering light.`,
    after: `The kitchen is freshly renovated and modern. Matte white handleless cabinets, dark polished granite countertop, white subway tile backsplash, new stainless steel oven and fridge, light oak engineered wood floor, warm recessed LED ceiling lights, clean large window flooding the room with natural light. Everything is pristine, clean and contemporary. Warm inviting atmosphere.`,
    service: `Photograph of a kitchen mid-renovation. Left half shows old brown cabinets being demolished, right half shows new white cabinets already installed. Protective plastic sheets on floor, power drill on countertop, dust in air. The contrast between old and new is clearly visible in the same frame. Wide angle, construction photography. Photorealistic.`,
  },
  {
    slug: 'salle-de-bain',
    base: `Wide-angle 24mm interior photograph of a bathroom shot from the doorway. Straight ahead is the back wall with a vanity sink and mirror. To the right is a bathtub/shower area. To the left is the toilet. Camera height 1.5m, centered. Photorealistic, professional photography.`,
    before: `The bathroom is old and worn out, 1980s style. Cracked pink and white ceramic wall tiles, stained chipped white bathtub with visible limescale and yellow ring, old pedestal sink with rusty faucet, dated white toilet with tank, moldy grout lines, bare bulb on ceiling, small frosted window, water damage stain on ceiling. Everything looks dirty and outdated. Harsh cold light.`,
    after: `The bathroom is beautifully renovated. Large walk-in shower with frameless glass panel and rainfall showerhead, floating light oak vanity with white round vessel sink and modern chrome faucet, large format light grey tiles on floor and walls, backlit round mirror, heated chrome towel rail, recessed warm LED downlights. Everything is clean, sleek and spa-like. Warm soft lighting.`,
    service: `Photograph of a bathroom renovation in progress. A professional tiler is laying large grey porcelain tiles on the wall, half the wall is tiled and half shows the old pink tiles underneath. Adhesive bucket and notched trowel visible, tile spacers on floor. Same room composition, showing the transformation mid-way. Photorealistic construction photography.`,
  },
  {
    slug: 'facade-ite',
    base: `Exterior photograph of the front facade of a two-story Alsatian house taken from the sidewalk across the street, slightly angled from the left. The house has 4 windows (2 on each floor), a central front door, a pitched roof with chimney on the right side, and a small front garden with low wall. Camera at eye level, 28mm lens. The full facade is visible including the roof line. Photorealistic, architectural photography.`,
    before: `The facade is severely deteriorated. Large diagonal cracks in the grey cement render, dark water stains running down from the roof gutters, peeling ochre paint patches, old wooden single-pane windows with rotting frames, broken wooden shutters hanging at angles, moss and green algae at the base of walls, missing chunks of render exposing the brick underneath, rusty old gutters with gaps. Overcast grey sky. The whole facade looks neglected and damaged.`,
    after: `The facade is beautifully renovated with ITE external insulation. Smooth pristine white mineral render, new double-glazed PVC windows with dark green wooden louvered shutters neatly open, bright red front door with polished brass handle, clean light stone window sills, new zinc gutters and downpipe, foundation plinth freshly painted grey. Front garden with trimmed boxwood hedge and small iron gate. Bright blue sky with white clouds.`,
    service: `Photograph of the same Alsatian house facade with scaffolding covering it during ITE insulation work. Lower portion has new white render already applied, middle section shows the grey reinforcing mesh over insulation boards, upper section still shows the old cracked render. A worker on scaffolding is applying adhesive. Different renovation stages visible on the same facade. Construction photography. Photorealistic.`,
  },
  {
    slug: 'jardin',
    base: `Wide-angle photograph of a residential backyard garden seen from the back door of a French house looking outward. A lawn area occupies the center, with a patio/terrace area in the foreground near the house. A fence runs along the back boundary. Trees are visible on the right side. A pathway leads from the terrace toward the back fence. Shot at 24mm, eye level, natural outdoor light. Photorealistic landscape photography.`,
    before: `The garden is completely neglected and overgrown. Knee-high weeds and wild grass cover the entire lawn area, broken rotting wooden fence with missing panels in the back, bare muddy patches with standing water, dead brown shrubs along the sides, pile of old bricks and rubble near the fence, cracked concrete slab where the terrace should be, a single dead grey tree on the right. Overcast depressing grey sky. Everything is brown, grey and lifeless.`,
    after: `The garden is professionally landscaped and stunning. Perfectly manicured emerald green lawn, beautiful curved natural stone pathway with moss between stones, large composite wood deck terrace in foreground with modern teak dining table and 4 chairs, vibrant colorful flower beds along the sides with lavender, roses and hydrangeas, neatly trimmed boxwood hedges along the fence, healthy green apple tree on the right with string lights, solar LED path bollards along the pathway, new stained wooden fence in background. Golden hour warm sunlight casting long shadows.`,
    service: `Photograph of garden landscaping in progress, same composition. Left side shows fresh sod being laid on prepared soil, center shows a half-completed stone pathway, right side shows a landscaper planting shrubs. New fence posts installed but rails not yet attached in background. Bags of topsoil and wheelbarrow visible. Sunny day. Photorealistic construction photography.`,
  },
  {
    slug: 'borne-irve',
    base: `Wide-angle interior photograph of a residential single-car garage shot from just inside the garage door looking toward the back wall. The back wall is straight ahead, the left wall has an electrical panel area, the right wall is plain. The floor takes up the lower third of the frame. A car would be parked in the center. Ceiling visible at top. 24mm lens, eye level. Photorealistic.`,
    before: `The garage is empty, neglected and dirty. Bare grey concrete floor with oil stains and cracks, unpainted cinder block walls with water marks, single dim bare incandescent bulb hanging from ceiling on a wire, old rusty metal fuse box on the left wall with exposed wires, cobwebs in upper corners, random clutter and old paint cans along the right wall. No car. Dark, depressing atmosphere with harsh shadows from the single bulb.`,
    after: `The garage is clean, modern and well-equipped. Light grey epoxy-coated floor with yellow parking guide lines, white painted walls, bright LED strip lights on ceiling, new modern electrical panel on left wall, sleek white IRVE wallbox EV charger mounted on the back wall with glowing green LED status ring, black charging cable neatly coiled on holster. A dark blue electric SUV is parked in the center, plugged in with the cable connected to its left side charge port. Clean organized space.`,
    service: `Photograph of a certified electrician in blue overalls installing a white EV wallbox charger on the back wall of a garage. He is using a drill to mount the bracket. The open electrical panel on the left wall shows a new dedicated 32A circuit being wired. Cable conduit runs along the wall between the panel and the charger location. Tools and wire on the floor. Same garage composition. Photorealistic construction photography.`,
  },
  {
    slug: 'panneaux-solaires',
    base: `Exterior photograph of an Alsatian residential house taken from the street at a 30-degree angle from the right, showing the full south-facing roof slope prominently. The house is two stories with a pitched clay tile roof, a chimney on the left, cream rendered facade, windows with shutters, front door, and a small front garden. The roof slope is the dominant feature in the upper half of the image. 28mm lens, eye level from across the street. Photorealistic architectural photography.`,
    before: `The house is ordinary with a bare clay tile roof. Traditional red-brown clay tiles on the pitched roof, no solar equipment at all, just empty roof surface. The facade has slightly faded cream render, older wooden shutters. Small untrimmed front garden, ordinary grey sky. The house looks perfectly normal but not modernized — no renewable energy visible anywhere.`,
    after: `The same house now has 12 sleek dark blue-black monocrystalline solar panels installed on the south-facing roof slope, arranged in 3 neat rows of 4 on aluminum mounting rails. The panels catch the sunlight and have a subtle blue shimmer. A small white inverter box is mounted on the right side wall. The facade is freshly painted cream white, shutters repainted. Bright blue sky with sun visible, emphasizing the solar installation. A small monitoring display is visible near the front door.`,
    service: `Photograph of solar panel installation in progress on the same house roof. Scaffolding on the right side, two workers in hard hats and harnesses on the roof. 6 panels already installed in the lower rows, one worker holding a panel while the other secures it with a power drill to the aluminum rail. Mounting hardware and cables visible. Clear sky. Same house, same angle. Photorealistic construction photography.`,
  },
];

async function main() {
  console.log(`\n🖼️  Génération de ${PAIRS.length * 3} images cohérentes via Imagen 4 Ultra\n`);

  let done = 0;
  const total = PAIRS.length * 3;

  for (const pair of PAIRS) {
    console.log(`\n📷 ${pair.slug.toUpperCase()}`);

    // AVANT : composition + état dégradé
    const beforePrompt = `${pair.base}\n\n${pair.before}`;
    try {
      await generateImagen(beforePrompt, `${REAL}/${pair.slug}-avant.png`);
      done++;
    } catch (err) {
      console.error(`  ❌ ${pair.slug}-avant: ${err.message}`);
    }
    await sleep(3000);

    // APRÈS : même composition + état rénové
    const afterPrompt = `${pair.base}\n\n${pair.after}`;
    try {
      await generateImagen(afterPrompt, `${REAL}/${pair.slug}-apres.png`);
      done++;
    } catch (err) {
      console.error(`  ❌ ${pair.slug}-apres: ${err.message}`);
    }
    await sleep(3000);

    // SERVICE : même composition + travaux en cours
    try {
      await generateImagen(pair.service, `${SERV}/${pair.slug}.png`);
      done++;
    } catch (err) {
      console.error(`  ❌ ${pair.slug} service: ${err.message}`);
    }
    await sleep(3000);
  }

  console.log(`\n✅ ${done}/${total} images générées`);
}

main();
