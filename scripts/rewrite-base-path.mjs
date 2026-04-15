// Post-build path rewriter.
//
// Problem: when we deploy to a GitHub Pages *project site*
// (`<owner>.github.io/<repo>/`), every absolute URL needs a `/<repo>/`
// prefix or it 404s. Next.js rewrites its own links and asset chunks via
// `basePath`, and our `readSection` helper rewrites the raw HTML we
// inject. But there is one tier it cannot reach: the hardcoded absolute
// paths that live INSIDE the production CSS and JS bundles we ship
// verbatim under `public/_astro/`, for example:
//
//   - `_slug_.B97dlsMJ.css` contains `url(/assets/fonts/CenturyGothic.woff2)`
//   - `GlobalApp.vK8XqYB9.js` contains `"/assets/models/earth-min.glb"`,
//     `"/assets/textures/envmap-min.exr"`, `"/assets/sounds/sound.mp3"`,
//     `"/libs/basis/"`, ...
//
// Next.js copies those files into `out/` as-is during `next build`. This
// script runs AFTER the build and walks `out/` recursively looking for
// `.css`, `.js`, and `.mjs` files, then rewrites every
//     `/_astro/...`  |  `/assets/...`  |  `/libs/...`
// reference to `${BASE_PATH}/_astro/...` etc. It uses a negative lookbehind
// so a path that's already been prefixed (by Next.js or by readSection)
// never gets double-prefixed.
//
// Run: BASE_PATH=/experiment_monica_clinic_website node scripts/rewrite-base-path.mjs
// (or let deploy.yml pass NEXT_PUBLIC_BASE_PATH through automatically).
import fs from 'node:fs';
import path from 'node:path';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || '';
if (!BASE_PATH) {
  console.log('[rewrite-base-path] NEXT_PUBLIC_BASE_PATH is empty — nothing to do.');
  process.exit(0);
}

const OUT_DIR = path.resolve('out');
if (!fs.existsSync(OUT_DIR)) {
  console.error(`[rewrite-base-path] out/ does not exist at ${OUT_DIR}. Did you run next build first?`);
  process.exit(1);
}

// Paths we want to prefix. Listed in the same order that Next/readSection
// may already have prefixed them — we use a negative lookbehind against
// BASE_PATH so repeated runs are idempotent.
const PREFIX_PATHS = ['/_astro/', '/assets/', '/libs/'];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escapedBasePath = escapeRegex(BASE_PATH);

// Build one regex per target path. Pattern:
//   (?<!base_path)  — not already prefixed
//   ([\"'\s,(])     — delimiter in source/JS: quote, whitespace, comma, or (
//   \/<path>        — the absolute path we're rewriting
// The delimiter capture guarantees we don't catch a path that's part of a
// longer identifier (like `something_astro`), only standalone asset refs.
const patterns = PREFIX_PATHS.map((p) => {
  const escaped = escapeRegex(p);
  return new RegExp(`(?<!${escapedBasePath})(["'\\s,(])(${escaped})`, 'g');
});

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(css|js|mjs)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

const files = walk(OUT_DIR);
console.log(`[rewrite-base-path] Scanning ${files.length} .css/.js/.mjs files under out/ for absolute paths to rewrite with base path "${BASE_PATH}"...`);

let filesRewritten = 0;
let totalSubs = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  let fileSubs = 0;
  for (const re of patterns) {
    const matches = after.match(re);
    if (matches) fileSubs += matches.length;
    after = after.replace(re, (_m, delim, p) => `${delim}${BASE_PATH}${p}`);
  }
  if (after !== before) {
    fs.writeFileSync(file, after);
    filesRewritten++;
    totalSubs += fileSubs;
    // Keep the log compact — just show the file's relative path and the
    // number of substitutions it received.
    const rel = path.relative(OUT_DIR, file);
    console.log(`  ${fileSubs.toString().padStart(5)} subs  ${rel}`);
  }
}

console.log(`\n[rewrite-base-path] Done. Rewrote ${filesRewritten}/${files.length} files, ${totalSubs} total substitutions.`);
