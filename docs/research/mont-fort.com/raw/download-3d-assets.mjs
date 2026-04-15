// Download all 3D models, textures, and WASM files used by mont-fort.com's Three.js scenes.
// Run: node download-3d-assets.mjs
import fs from 'node:fs';
import path from 'node:path';

const ORIGIN = 'https://mont-fort.com';
const rootOut = '../../../../public';

// Assets discovered in GlobalApp.vK8XqYB9.js and KTX2Loader.DxCkVlRj.js
const ASSETS = [
  // Homepage models (critical)
  '/assets/models/homepage/Homepage.glb',
  '/assets/models/homepage/Sustainability-min.glb',
  '/assets/models/homepage/TopChapters.glb',
  '/assets/models/homepage/WhatWeDo.glb',
  '/assets/models/homepage/earth-min.glb',
  '/assets/models/mountains.glb',
  // Other page models (used for view transitions)
  '/assets/models/capital/capital-min.glb',
  '/assets/models/capital/grass-min.glb',
  '/assets/models/fort-energy/energy-chapter.glb',
  '/assets/models/fort-energy/fort-energy.glb',
  '/assets/models/maritime/boat.glb',
  '/assets/models/maritime/maritime.glb',
  '/assets/models/trading/oil-metals.glb',
  '/assets/models/trading/raycaster.glb',
  // Textures
  '/assets/textures/envmap-min.exr',
  '/assets/textures/capital/capital-lightmap.webp',
  '/assets/textures/grass_diffuse.webp',
  '/assets/textures/homepage/homepage-lightmap.webp',
  '/assets/textures/homepage/snow_diffuse.webp',
  '/assets/textures/maritime/maritime-lightmap.webp',
  '/assets/textures/maritime/water-normal.webp',
  '/assets/textures/noise-solid-normal.webp',
  '/assets/textures/noise.webp',
  '/assets/textures/perlinNoise.webp',
  '/assets/textures/rock_diffuse.webp',
  '/assets/textures/rock_normal.webp',
  '/assets/textures/snowRockMix.webp',
  '/assets/textures/trading/trading-lightmap.webp',
  '/assets/textures/voronoi.webp',
];

// Also probe for known Three.js/KTX2 draco paths
const PROBE = [
  '/assets/draco/draco_decoder.js',
  '/assets/draco/draco_decoder.wasm',
  '/assets/draco/draco_wasm_wrapper.js',
  '/assets/basis/basis_transcoder.js',
  '/assets/basis/basis_transcoder.wasm',
];

async function downloadOne(url) {
  const absUrl = ORIGIN + url;
  const outPath = path.resolve(rootOut, url.replace(/^\/+/, ''));
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

const all = [...ASSETS, ...PROBE];
console.log(`Downloading ${all.length} 3D assets...`);
const results = await Promise.all(all.map(downloadOne));

const ok = results.filter(r => r.status === 'ok');
const existed = results.filter(r => r.status === 'exists');
const failed = results.filter(r => r.status !== 'ok' && r.status !== 'exists');

console.log(`\nOK: ${ok.length}, existed: ${existed.length}, failed: ${failed.length}`);
ok.forEach(r => console.log(`  ${(r.size/1024).toFixed(1).padStart(8)} KB  ${r.url}`));
if (failed.length) {
  console.log('\nFailures:');
  failed.forEach(f => console.log(`  ${f.status} ${f.url}`));
}
const totalBytes = results.reduce((a, r) => a + (r.size || 0), 0);
console.log(`\nTotal: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
