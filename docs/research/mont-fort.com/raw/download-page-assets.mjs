// Download assets unique to the sub-pages (trading, capital, maritime, fort-energy, news, contact)
// These are images referenced from pages-assets.txt — we already have the JS + CSS bundles.
// Run: node download-page-assets.mjs
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://mont-fort.com';
const rootOut = '../../../..';  // project root

const urls = fs.readFileSync('pages-assets.txt', 'utf8').split('\n').map(s => s.trim()).filter(Boolean);
console.log(`Downloading ${urls.length} page assets...`);

async function downloadOne(url) {
  const absUrl = ORIGIN + url;
  const outPath = path.resolve(rootOut, 'public', url.replace(/^\/+/, ''));
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

async function runBatched(items, concurrency = 8) {
  const queue = [...items];
  const results = [];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const url = queue.shift();
      const r = await downloadOne(url);
      results.push(r);
      if (results.length % 15 === 0) {
        console.log(`  ${results.length}/${items.length} — ${r.status}`);
      }
    }
  });
  await Promise.all(workers);
  return results;
}

const results = await runBatched(urls, 8);
const ok = results.filter(r => r.status === 'ok').length;
const existed = results.filter(r => r.status === 'exists').length;
const failed = results.filter(r => r.status !== 'ok' && r.status !== 'exists');
const totalBytes = results.reduce((a, r) => a + (r.size || 0), 0);

console.log(`\nDone:  ok=${ok}  existed=${existed}  failed=${failed.length}`);
console.log(`Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
if (failed.length) {
  console.log('\nFailures:');
  failed.forEach(f => console.log(`  ${f.status}  ${f.url}`));
}
