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
    prompt: 'Candid portrait photograph of a real French woman employee, approximately 30 years old, natural warm smile, light brown hair loosely tied back, wearing a bright red polo shirt with a small embroidered company logo on the chest, standing in a bright modern office with a blurred renovation construction site visible through the window behind her. Natural daylight from window, warm tones, shallow depth of field on face. She looks like a real renovation company employee, not a model. Authentic, approachable. Square crop, shoulders and head. Photorealistic.',
  },
  {
    name: 'lucas',
    prompt: 'Candid portrait photograph of a real French man employee, approximately 28 years old, short dark brown hair, light stubble, natural confident smile, wearing a bright red polo shirt with a small embroidered company logo on the chest, standing in a workshop or garage with renovation tools and materials blurred in the background. Natural daylight, warm tones, shallow depth of field on face. He looks like a real construction project manager, not a stock photo model. Authentic, down to earth. Square crop, shoulders and head. Photorealistic.',
  },
  {
    name: 'amira',
    prompt: 'Candid portrait photograph of a real young French woman of North African descent, approximately 25 years old, dark wavy hair past shoulders, warm genuine smile with dimples, wearing a bright red polo shirt with a small embroidered company logo on the chest, sitting at a desk with a laptop and renovation blueprints blurred in background. Natural office lighting, warm tones, shallow depth of field on face. She looks like a real sales assistant at a renovation company, not a model. Authentic, welcoming. Square crop, shoulders and head. Photorealistic.',
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
