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
    prompt: 'Professional LinkedIn headshot portrait of a French woman, approximately 30 years old, warm friendly smile, light brown hair in a neat low bun, wearing a navy blue blazer over a white blouse, neutral light grey studio background, soft diffused studio lighting, shallow depth of field, shoulders and head visible. Corporate portrait photography, high quality, photorealistic.',
  },
  {
    name: 'lucas',
    prompt: 'Professional LinkedIn headshot portrait of a French man, approximately 28 years old, clean shaven, short dark brown hair neatly styled, confident approachable smile, wearing a charcoal grey suit jacket over light blue dress shirt with no tie, neutral light grey studio background, soft diffused studio lighting, shallow depth of field, shoulders and head visible. Corporate portrait photography, high quality, photorealistic.',
  },
  {
    name: 'amira',
    prompt: 'Professional LinkedIn headshot portrait of a French woman of North African descent, approximately 25 years old, warm welcoming smile, dark wavy hair past shoulders, wearing a burgundy red blazer over a cream silk blouse, neutral light grey studio background, soft diffused studio lighting, shallow depth of field, shoulders and head visible. Corporate portrait photography, high quality, photorealistic.',
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
