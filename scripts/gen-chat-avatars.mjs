#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/chat');

const KEY = process.env.GEMINI_API_KEY;
const MODEL = 'imagen-4.0-generate-001';

const AVATARS = [
  {
    name: 'sophie',
    prompt: 'Smartphone selfie style photo of a real 30 year old French woman taken by a coworker at work. She is wearing a wrinkled red polo shirt, color hex E50000, with white embroidered text AIMAN on the left chest. She has messy light brown hair in a ponytail, minimal makeup, a natural relaxed smile showing teeth. She is standing inside a small renovation company office, behind her: a messy desk with papers, a computer screen, wall calendar, hard hats on shelf. Fluorescent office lighting mixed with daylight from a window. The photo looks like it was taken with an iPhone, slightly off-center framing, not professional photography. Real person, not a model, not AI looking. Square format.',
  },
  {
    name: 'lucas',
    prompt: 'Smartphone selfie style photo of a real 28 year old French man taken at a construction site. He is wearing a slightly dusty red polo shirt, color hex E50000, with white embroidered text AIMAN on the left chest. He has short dark brown hair, 2 day stubble, tanned skin, a casual grin. Behind him: a half renovated room with exposed brick wall, paint buckets on the floor, plastic sheeting, a ladder. He is wearing work boots visible at bottom. Natural daylight from windows, dust particles in air. Photo looks like it was taken with a phone by a colleague, casual composition. Real construction worker, not a model. Square format.',
  },
  {
    name: 'amira',
    prompt: 'Smartphone selfie style photo of a real 25 year old French woman of Maghreb origin taken at an office desk. She is wearing a clean red polo shirt, color hex E50000, with white embroidered text AIMAN on the left chest. She has dark wavy hair loose on shoulders, natural smile with dimples, small gold stud earrings. She is sitting at a desk with renovation floor plans spread out, a laptop showing a spreadsheet, a coffee mug, post-it notes on screen. Warm afternoon light from a window to the side. Photo looks candid like a coworker snapped it, slightly tilted angle. Real office worker in a small company, not corporate. Square format.',
  },
];

if (!KEY) {
  console.error('GEMINI_API_KEY manquant');
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

async function generate(avatar) {
  const outPath = path.join(OUT, `${avatar.name}.png`);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000) {
    console.log(`  ✓ ${avatar.name}.png existe deja (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
    return;
  }

  console.log(`  → Generating ${avatar.name}...`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: avatar.prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        outputOptions: { mimeType: 'image/png' },
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  ✗ ${avatar.name} erreur HTTP ${res.status}: ${text.substring(0, 200)}`);
    return;
  }

  const data = await res.json();
  const b64 = data.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`  ✗ ${avatar.name}: pas de base64 dans la reponse`);
    return;
  }

  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
  console.log(`  ✓ ${avatar.name}.png (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
}

console.log('Generating chat avatars...');
for (const avatar of AVATARS) {
  await generate(avatar);
}
console.log('Done!');
