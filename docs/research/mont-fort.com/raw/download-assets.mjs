// Download all image, font, and svg assets referenced in the mont-fort.com HTML/CSS.
// Run: node download-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

const ORIGIN = 'https://mont-fort.com';
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('main.css', 'utf8');
const rootOut = '../../../../public';  // -> /tmp/ai-website-cloner-template/public

// Collect asset URLs
const urls = new Set();

// From <img src=...> and srcset
for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)) urls.add(m[1]);
for (const m of html.matchAll(/srcset=["']([^"']+)["']/g)) {
  for (const item of m[1].split(',')) {
    const url = item.trim().split(/\s+/)[0];
    if (url) urls.add(url);
  }
}
for (const m of html.matchAll(/<source[^>]+srcset=["']([^"']+)["']/g)) {
  for (const item of m[1].split(',')) {
    const url = item.trim().split(/\s+/)[0];
    if (url) urls.add(url);
  }
}
// Favicons from <link rel="icon">
for (const m of html.matchAll(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["']/g)) urls.add(m[1]);

// From CSS url() patterns — mostly font files under /assets/fonts/
for (const m of css.matchAll(/url\(([^)]+)\)/g)) {
  const raw = m[1].replace(/['"]/g, '').trim();
  if (raw.startsWith('data:')) continue;
  if (raw.startsWith('#')) continue; // svg fragment
  urls.add(raw);
}

// Filter to site-local (starts with '/')
const localUrls = [...urls].filter(u => u.startsWith('/') || u.startsWith(ORIGIN));

console.log(`Found ${urls.size} total asset URLs, ${localUrls.length} site-local`);

// Group by type
const buckets = { images: [], fonts: [], icons: [], other: [] };
for (const u of localUrls) {
  const lower = u.toLowerCase();
  if (lower.endsWith('.woff2') || lower.endsWith('.woff') || lower.endsWith('.ttf') || lower.endsWith('.otf')) buckets.fonts.push(u);
  else if (lower.includes('/favicon') || lower.includes('apple-touch')) buckets.icons.push(u);
  else if (lower.endsWith('.webp') || lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.svg') || lower.endsWith('.avif') || lower.endsWith('.gif')) buckets.images.push(u);
  else buckets.other.push(u);
}

console.log('Buckets:');
for (const [k, v] of Object.entries(buckets)) console.log(` ${k.padEnd(8)} ${v.length}`);

// Parallel download with concurrency=6
async function downloadOne(url) {
  const absUrl = url.startsWith('http') ? url : ORIGIN + url;
  const urlObj = new URL(absUrl);
  const outPath = path.resolve(rootOut, urlObj.pathname.replace(/^\/+/, ''));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  if (fs.existsSync(outPath)) return { url, status: 'exists', size: fs.statSync(outPath).size };
  try {
    const res = await fetch(absUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (clone-bot)' } });
    if (!res.ok) return { url, status: `HTTP ${res.status}`, size: 0 };
    const buf = new Uint8Array(await res.arrayBuffer());
    fs.writeFileSync(outPath, buf);
    return { url, status: 'ok', size: buf.length };
  } catch (e) {
    return { url, status: 'error: ' + e.message, size: 0 };
  }
}

async function runBatched(items, concurrency = 6) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const r = await downloadOne(url);
      results.push(r);
      if (results.length % 20 === 0) {
        console.log(`  ${results.length}/${items.length} — ${r.status} — ${url.slice(-50)}`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

const all = [...buckets.images, ...buckets.fonts, ...buckets.icons, ...buckets.other];
console.log(`\nDownloading ${all.length} assets (concurrency=6)...`);
const results = await runBatched(all, 6);

const ok = results.filter(r => r.status === 'ok').length;
const existed = results.filter(r => r.status === 'exists').length;
const failed = results.filter(r => r.status !== 'ok' && r.status !== 'exists');

console.log(`\nResults:`);
console.log(`  downloaded: ${ok}`);
console.log(`  already existed: ${existed}`);
console.log(`  failed: ${failed.length}`);
if (failed.length) {
  console.log('\nFailures:');
  failed.slice(0, 10).forEach(f => console.log(`  ${f.status} ${f.url}`));
}
const totalBytes = results.filter(r => r.size > 0).reduce((a, r) => a + r.size, 0);
console.log(`\nTotal bytes: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
