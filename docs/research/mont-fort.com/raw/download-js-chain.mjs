// Recursively download all JS modules referenced from mont-fort.com's entry scripts.
// Run: node download-js-chain.mjs
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://mont-fort.com';
const cssPath = 'main.css';
const htmlPath = 'index.html';

// Find all script src references from the HTML
const html = fs.readFileSync(htmlPath, 'utf8');
const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)]
  .map(m => m[1])
  .filter(u => u.startsWith('/_astro/'));

console.log('Entry scripts from HTML:');
scripts.forEach(s => console.log(' ', s));

const visited = new Set();
const queue = [...scripts];
const failed = [];

async function downloadAndParse(url) {
  if (visited.has(url)) return;
  visited.add(url);
  const absUrl = ORIGIN + url;
  const outPath = path.resolve('.', url.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  try {
    const res = await fetch(absUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (clone-bot)' } });
    if (!res.ok) {
      failed.push({ url, status: res.status });
      return;
    }
    const text = await res.text();
    fs.writeFileSync(outPath, text);

    // Parse static imports
    // Patterns: import"./foo.js", import{x}from"./bar.js", import("./baz.js")
    const imports = [
      ...text.matchAll(/import\s*(?:\{[^}]*\}\s*from\s*)?["']([^"']+)["']/g),
      ...text.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g),
      ...text.matchAll(/import\s*\*\s*as\s+\w+\s*from\s*["']([^"']+)["']/g),
    ].map(m => m[1]);

    for (const imp of imports) {
      if (imp.startsWith('./')) {
        // Relative import — resolve against the current URL's directory
        const dir = path.posix.dirname(url);
        const resolved = path.posix.normalize(path.posix.join(dir, imp));
        if (!visited.has(resolved)) queue.push(resolved);
      } else if (imp.startsWith('/')) {
        if (!visited.has(imp)) queue.push(imp);
      }
      // skip bare specifiers and absolute URLs
    }
  } catch (e) {
    failed.push({ url, err: e.message });
  }
}

// Process queue with small concurrency (sequential is fine — tiny total)
while (queue.length) {
  const batch = queue.splice(0, 4);
  await Promise.all(batch.map(downloadAndParse));
}

console.log(`\nDownloaded ${visited.size} JS files`);
console.log(`Failed: ${failed.length}`);
if (failed.length) failed.forEach(f => console.log('  FAIL', f.url, f.status || f.err));

// Also download the main CSS if not already present
const cssUrl = '/_astro/_slug_.B97dlsMJ.css';
const cssOut = path.resolve('.', cssUrl.replace(/^\//, ''));
fs.mkdirSync(path.dirname(cssOut), { recursive: true });
if (!fs.existsSync(cssOut) && fs.existsSync(cssPath)) {
  fs.copyFileSync(cssPath, cssOut);
  console.log(`Copied main.css -> ${cssOut}`);
}
