// Extract body-inner.html and enumerate unique asset URLs for each sub-page.
// Run: node extract-pages.mjs
import fs from 'node:fs';
import path from 'node:path';

const PAGES = ['trading', 'capital', 'maritime', 'fort-energy', 'news', 'contact'];
const outSections = path.resolve('../../../..', 'src/sections-raw');
fs.mkdirSync(outSections, { recursive: true });

const allAssets = new Set();
const allScripts = new Set();
const allCssLinks = new Set();
const summary = [];

for (const slug of PAGES) {
  const html = fs.readFileSync(path.join('pages', `${slug}.html`), 'utf8');

  // Body inner
  const bodyOpen = html.search(/<body[\s\S]*?>/);
  const bodyTagEnd = html.indexOf('>', bodyOpen) + 1;
  const bodyCloseIdx = html.lastIndexOf('</body>');
  const bodyInner = html.slice(bodyTagEnd, bodyCloseIdx);
  fs.writeFileSync(path.join(outSections, `page-${slug}.html`), bodyInner);

  // Strip problematic body opacity style blocks so we don't re-introduce the
  // fade-in animation we debugged on the homepage.
  let stripped = bodyInner.replace(/<style[^>]*>([\s\S]*?)<\/style>/g, (block, content) => {
    if (/body\s*\{/.test(content) || /body\.loaded/.test(content)) {
      return '<!-- stripped body-opacity block -->';
    }
    return block;
  });
  fs.writeFileSync(path.join(outSections, `page-${slug}.html`), stripped);

  // Extract asset URLs — <img src>, <img srcset>, <source srcset>, <link href>, <script src>, url(...) in inline styles
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
  const srcsets = [...html.matchAll(/srcset=["']([^"']+)["']/g)]
    .flatMap(m => m[1].split(',').map(s => s.trim().split(/\s+/)[0]))
    .filter(Boolean);
  const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
  const links = [...html.matchAll(/<link[^>]+href=["']([^"']+)["']/g)].map(m => m[1]);

  for (const u of [...imgs, ...srcsets]) if (u.startsWith('/')) allAssets.add(u);
  for (const u of scripts) if (u.startsWith('/')) allScripts.add(u);
  for (const u of links) if (u.startsWith('/') && (/\.css$/.test(u) || /_astro/.test(u))) allCssLinks.add(u);

  summary.push({
    slug,
    bodyInnerBytes: stripped.length,
    imgCount: imgs.length + srcsets.length,
    scriptCount: scripts.length,
  });
}

console.log('Extraction summary:');
summary.forEach(s => console.log(`  ${s.slug.padEnd(12)} body=${s.bodyInnerBytes.toString().padStart(7)}  imgs=${s.imgCount.toString().padStart(3)}  scripts=${s.scriptCount}`));
console.log();
console.log(`Total unique asset URLs across pages: ${allAssets.size}`);
console.log(`Total unique script URLs:              ${allScripts.size}`);
console.log(`Total unique CSS links:                ${allCssLinks.size}`);

// Write lists for the download phase
fs.writeFileSync('pages-assets.txt', [...allAssets].sort().join('\n'));
fs.writeFileSync('pages-scripts.txt', [...allScripts].sort().join('\n'));
fs.writeFileSync('pages-csslinks.txt', [...allCssLinks].sort().join('\n'));
