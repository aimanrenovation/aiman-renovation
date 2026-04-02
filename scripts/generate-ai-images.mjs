#!/usr/bin/env node
/**
 * Script de génération d'images IA pour Aiman Renovation
 *
 * Usage:
 *   GEMINI_API_KEY=xxx node scripts/generate-ai-images.mjs
 *   — OU —
 *   OPENAI_API_KEY=xxx node scripts/generate-ai-images.mjs
 *
 * Génère 12 images (6 avant + 6 après) dans public/images/realisations/
 * + 6 images service dans public/images/services/
 * + 1 hero dans public/images/hero/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REAL_DIR = path.join(ROOT, 'public/images/realisations');
const SERV_DIR = path.join(ROOT, 'public/images/services');
const HERO_DIR = path.join(ROOT, 'public/images/hero');

fs.mkdirSync(REAL_DIR, { recursive: true });
fs.mkdirSync(SERV_DIR, { recursive: true });
fs.mkdirSync(HERO_DIR, { recursive: true });

const PROJECTS = [
  {
    slug: 'cuisine',
    before: 'Photorealistic interior photo of an old, run-down kitchen in an Alsatian house in Saint-Louis, France. Dated cabinets from the 1970s, peeling laminate, yellowed walls, broken tiles, dim fluorescent lighting, dirty countertop. Wide angle, natural light from a small window. Very realistic, professional photography style.',
    after: 'Photorealistic interior photo of a modern renovated kitchen in an Alsatian house in Saint-Louis, France. Sleek white cabinets, dark granite countertop, stainless steel appliances, subway tile backsplash, recessed LED lighting, hardwood floor. Wide angle, bright natural light. Very realistic, professional interior design photography.',
    service: 'Photorealistic wide-angle photo showing a kitchen mid-renovation: half demolished old cabinets, new ones being installed, tools visible, construction in progress. Alsatian house style. Professional photography.',
  },
  {
    slug: 'salle-de-bain',
    before: 'Photorealistic photo of an old bathroom in a French house. Cracked vintage tiles, rusty bathtub, stained grout, old toilet, mold on walls, dim lighting. Dated fixtures from the 1980s. Wide angle, realistic.',
    after: 'Photorealistic photo of a modern renovated bathroom. Walk-in rainfall shower with glass partition, floating vanity with vessel sink, large format tiles, warm LED lighting, heated towel rail. Clean minimalist design. Wide angle, bright.',
    service: 'Photorealistic photo of a bathroom renovation in progress: tiles being laid by hand, tools on floor, adhesive bucket, half-tiled wall showing the transformation. Professional construction photography.',
  },
  {
    slug: 'facade-ite',
    before: 'Photorealistic exterior photo of a deteriorated house facade in Alsace, France. Cracked render, stained walls, peeling paint, exposed masonry, old single-pane windows with damaged shutters, moss growth. Overcast sky. Wide angle street view.',
    after: 'Photorealistic exterior photo of a beautifully renovated Alsatian house facade with ITE external insulation. Fresh white render, new double-glazed windows with green shutters, red front door, well-maintained garden, blue sky. Professional architectural photography.',
    service: 'Photorealistic photo of a facade renovation in progress: scaffolding around an Alsatian house, workers installing insulation panels (polystyrene boards visible), rendering mesh being applied. Construction photography.',
  },
  {
    slug: 'jardin',
    before: 'Photorealistic photo of an abandoned overgrown garden behind a French house. Weeds everywhere, broken fence, bare soil patches, rubble, dead shrubs, neglected lawn. Overcast light. Wide angle.',
    after: 'Photorealistic photo of a beautifully landscaped garden in Alsace. Manicured lawn, stone pathway, wooden deck terrace with outdoor furniture, flower beds with colorful flowers, trimmed hedges, garden lighting, mature trees. Golden hour light. Professional landscape photography.',
    service: 'Photorealistic photo of a garden renovation in progress: landscaper laying stone pavers, freshly planted shrubs, new wooden fence being built, bags of soil. Construction in progress. Wide angle.',
  },
  {
    slug: 'borne-irve',
    before: 'Photorealistic photo of an empty, dark residential garage in France. Bare concrete floor, exposed walls, single bare bulb, old electrical panel, no equipment. Dim, unflattering light. Wide angle.',
    after: 'Photorealistic photo of a modern residential garage with an IRVE electric vehicle charging station. Sleek wall-mounted charger with glowing green LED, epoxy floor, LED strip lighting, electric car plugged in, clean organized space. Bright, modern. Professional photography.',
    service: 'Photorealistic photo of an electrician installing a wall-mounted EV charging station (IRVE) in a residential garage. Wiring visible, tools, electrical panel open. Professional construction photography.',
  },
  {
    slug: 'panneaux-solaires',
    before: 'Photorealistic exterior photo of a regular Alsatian house with bare roof tiles, no solar equipment. Traditional pitched roof, chimney, overcast sky. Street view. Wide angle.',
    after: 'Photorealistic exterior photo of the same Alsatian house now equipped with solar photovoltaic panels on the south-facing roof slope. 12 dark blue panels neatly arranged, inverter box on wall, smart meter. Blue sky with sun. Professional architectural photography.',
    service: 'Photorealistic photo of solar panel installation in progress on an Alsatian house roof. Workers on scaffolding mounting panels on rail system, cables visible, tools. Professional construction photography.',
  },
];

async function generateWithGemini(prompt, outputPath) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
          responseMimeType: 'image/png',
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find(p => p.inlineData);

  if (!imagePart) throw new Error('No image in Gemini response');

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`  ✓ ${path.basename(outputPath)}`);
}

async function generateWithOpenAI(prompt, outputPath) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
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
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const b64 = data.data[0].b64_json;
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`  ✓ ${path.basename(outputPath)}`);
}

async function main() {
  const useGemini = !!process.env.GEMINI_API_KEY;
  const useOpenAI = !!process.env.OPENAI_API_KEY;

  if (!useGemini && !useOpenAI) {
    console.error('❌ Aucune clé API trouvée.');
    console.error('   Fournissez GEMINI_API_KEY ou OPENAI_API_KEY');
    console.error('');
    console.error('   Exemple:');
    console.error('   GEMINI_API_KEY=AIza... node scripts/generate-ai-images.mjs');
    process.exit(1);
  }

  const generate = useGemini ? generateWithGemini : generateWithOpenAI;
  const provider = useGemini ? 'Gemini' : 'OpenAI DALL-E 3';
  console.log(`\n🎨 Génération d'images via ${provider}\n`);

  for (const project of PROJECTS) {
    console.log(`📷 ${project.slug}`);

    // Avant
    const beforePath = path.join(REAL_DIR, `${project.slug}-avant.png`);
    if (!fs.existsSync(beforePath)) {
      await generate(project.before, beforePath);
    } else {
      console.log(`  ⏭ ${project.slug}-avant.png (existe déjà)`);
    }

    // Après
    const afterPath = path.join(REAL_DIR, `${project.slug}-apres.png`);
    if (!fs.existsSync(afterPath)) {
      await generate(project.after, afterPath);
    } else {
      console.log(`  ⏭ ${project.slug}-apres.png (existe déjà)`);
    }

    // Service
    const servicePath = path.join(SERV_DIR, `${project.slug}.png`);
    if (!fs.existsSync(servicePath)) {
      await generate(project.service, servicePath);
    } else {
      console.log(`  ⏭ services/${project.slug}.png (existe déjà)`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n✅ Toutes les images ont été générées !');
  console.log(`   📁 ${REAL_DIR}`);
  console.log(`   📁 ${SERV_DIR}`);
}

main().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
