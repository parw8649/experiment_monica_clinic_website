// Extract each section's HTML block from the raw mont-fort.com HTML using depth-counted tag matching.
// Run: node extract-sections.mjs
import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('index.html', 'utf8');
const outDir = '../sections';
fs.mkdirSync(outDir, { recursive: true });

/** Extract a balanced <tag ...>...</tag> block starting at tagStart index. */
function extractBlock(source, tagStart, tagName) {
  const openRe = new RegExp(`<${tagName}\\b`, 'g');
  const closeRe = new RegExp(`</${tagName}\\s*>`, 'g');
  openRe.lastIndex = tagStart + 1;
  let depth = 1;
  let pos = tagStart + 1;
  while (pos < source.length) {
    openRe.lastIndex = pos;
    closeRe.lastIndex = pos;
    const openMatch = openRe.exec(source);
    const closeMatch = closeRe.exec(source);
    if (!closeMatch) return null;
    if (openMatch && openMatch.index < closeMatch.index) {
      depth++;
      pos = openMatch.index + 1;
    } else {
      depth--;
      pos = closeMatch.index + closeMatch[0].length;
      if (depth === 0) return source.slice(tagStart, pos);
    }
  }
  return null;
}

/** Find a tag by a substring inside its attribute list (e.g. class or id). */
function findTagByAttrMatch(source, tagName, needle) {
  const needleIdx = source.indexOf(needle);
  if (needleIdx < 0) return null;
  // Walk back to find the opening <tagName
  const openTag = `<${tagName}`;
  const tagStart = source.lastIndexOf(openTag, needleIdx);
  if (tagStart < 0) return null;
  return extractBlock(source, tagStart, tagName);
}

const extracts = [
  { name: 'header', tag: 'header', needle: '<header' },
  { name: 'hero', tag: 'section', needle: 'class="hero"' },
  { name: 'WhoWeAre', tag: 'section', needle: 'id="WhoWeAre"' },
  { name: 'WhatWeDo', tag: 'section', needle: 'id="WhatWeDo"' },
  { name: 'GlobalConnectivity', tag: 'section', needle: 'id="GlobalConnectivity"' },
  { name: 'Sustainability', tag: 'section', needle: 'section-sustainability' },
  { name: 'Solutions', tag: 'section', needle: 'section-solutions' },
  { name: 'Equality', tag: 'section', needle: 'section-equality' },
  { name: 'Social', tag: 'section', needle: 'section-social' },
  { name: 'footer', tag: 'footer', needle: '<footer' },
  { name: 'ChaptersNav', tag: 'div', needle: 'class="chapters-navigation"' },
  { name: 'CanvasWrapper', tag: 'div', needle: 'id="canvas-wrapper"' },
];

const summary = [];
for (const e of extracts) {
  const block = findTagByAttrMatch(html, e.tag, e.needle);
  if (block) {
    const outPath = path.join(outDir, `${e.name}.html`);
    fs.writeFileSync(outPath, block);
    summary.push({ name: e.name, tag: e.tag, bytes: block.length, path: outPath });
  } else {
    summary.push({ name: e.name, tag: e.tag, bytes: 0, path: 'NOT FOUND' });
  }
}

console.log('Extracted blocks:');
for (const s of summary) {
  console.log(`  ${s.name.padEnd(22)} ${s.tag.padEnd(8)} ${String(s.bytes).padStart(8)} bytes  ${s.path}`);
}
