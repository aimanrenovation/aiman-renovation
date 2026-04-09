#!/usr/bin/env node
/**
 * IndexNow submission — push all sitemap URLs to Bing + Yandex instantly.
 *
 * IndexNow is a free protocol supported by Bing, Yandex, Seznam, Naver and
 * Yep. Google does NOT support it (use Search Console for Google). Running
 * this script makes sure our 360 pages get indexed quickly on Bing, which
 * also feeds DuckDuckGo, Ecosia, Qwant and several other engines.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs
 *   node scripts/indexnow-submit.mjs --dry-run
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const HOST = "aiman-renovation.fr";
const KEY = "58d676596fa759dea40bb2bb1a17e3bb";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const BATCH_SIZE = 10000; // IndexNow allows up to 10k URLs per request

const DRY_RUN = process.argv.includes("--dry-run");

async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  return res.text();
}

function extractUrls(xml) {
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  return Array.from(matches, (m) => m[1]);
}

async function submitBatch(urls, endpoint) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  if (DRY_RUN) {
    console.log(`[DRY] POST ${endpoint}  (${urls.length} urls)`);
    console.log(`       sample: ${urls.slice(0, 3).join(", ")}...`);
    return { ok: true, status: 200 };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  return { ok: res.ok, status: res.status, text };
}

async function main() {
  console.log(`→ Fetching sitemap from ${SITEMAP_URL}`);
  const xml = await fetchSitemap();
  const urls = extractUrls(xml);
  console.log(`→ Found ${urls.length} URLs`);

  if (urls.length === 0) {
    console.error("No URLs extracted from sitemap. Aborting.");
    process.exit(1);
  }

  const endpoints = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/indexnow",
    "https://yandex.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    console.log(`\n→ Submitting to ${endpoint}`);
    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
      const batch = urls.slice(i, i + BATCH_SIZE);
      try {
        const result = await submitBatch(batch, endpoint);
        const symbol = result.ok ? "✓" : "✗";
        console.log(`  ${symbol} batch ${i / BATCH_SIZE + 1}: HTTP ${result.status} (${batch.length} urls)`);
        if (!result.ok && result.text) {
          console.log(`    response: ${result.text.slice(0, 200)}`);
        }
      } catch (err) {
        console.log(`  ✗ batch ${i / BATCH_SIZE + 1}: ${err.message}`);
      }
    }
  }

  console.log(
    "\n✅ IndexNow submission done. Bing should start crawling within hours.\n" +
    "   Verify: https://www.bing.com/webmasters/indexnow",
  );
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
