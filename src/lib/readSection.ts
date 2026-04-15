import fs from "node:fs";
import path from "node:path";

// BASE_PATH is injected by next.config.ts at build time via NEXT_PUBLIC_BASE_PATH.
// Empty string for root-served deployments (localhost dev, user site, custom
// domain). Set to something like "/experiment_monica_clinic_website" for a
// GitHub Pages project-site deployment.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Read a raw HTML block from src/sections-raw at build time. Called from
// server components only — these files are bundled with the build.
const SECTIONS_DIR = path.join(process.cwd(), "src", "sections-raw");

// List of page slugs we do host locally. Links to anything else (e.g. the
// original "/who-we-are/" which only exists on the live mont-fort site) are
// left untouched and will 404 on the clone until someone clones those pages.
const LOCAL_PAGE_SLUGS = [
  "trading",
  "capital",
  "maritime",
  "fort-energy",
  "news",
  "contact",
];

/**
 * Read a raw HTML block and rewrite its hardcoded absolute paths so they
 * resolve correctly on the clone, including under a GitHub Pages project-site
 * sub-path when BASE_PATH is set.
 *
 * Transformations applied:
 *   src|href="/_astro/..."   -> src|href="{BASE_PATH}/_astro/..."
 *   src|href="/assets/..."   -> src|href="{BASE_PATH}/assets/..."
 *   src|href="/libs/..."     -> src|href="{BASE_PATH}/libs/..."
 *   href="/trading/" etc.    -> href="{BASE_PATH}/trading/"
 *   href="/"                 -> href="{BASE_PATH}/"
 *   The Cloudflare email-decoder script (/cdn-cgi/scripts/...) is stripped
 *   because GitHub Pages does not serve /cdn-cgi/ — the page still renders
 *   fine without it, the obfuscated "[email&#160;protected]" placeholders
 *   just remain visible as-is instead of being decoded on the client.
 */
export function readSection(name: string): string {
  let html = fs.readFileSync(path.join(SECTIONS_DIR, `${name}.html`), "utf8");

  // Prefix asset paths under /_astro/, /assets/, /libs/. We match after any
  // attribute-delimiter character (`"`, `'`, whitespace, or comma) so this
  // catches src=, href=, srcset= (which has comma-separated URLs), and even
  // inline style url() references.
  html = html.replace(
    /(["'\s,(])\/(_astro|assets|libs)\//g,
    `$1${BASE_PATH}/$2/`,
  );

  // Prefix internal page links for the slugs we host locally
  const slugUnion = LOCAL_PAGE_SLUGS.join("|");
  const slugRegex = new RegExp(`href="/(${slugUnion})(/?)"`, "g");
  html = html.replace(slugRegex, (_match, slug, trailing) => {
    const suffix = trailing || "/";
    return `href="${BASE_PATH}/${slug}${suffix}"`;
  });

  // Home link
  html = html.replace(/href="\/"/g, `href="${BASE_PATH}/"`);

  // Strip the Cloudflare email-decode script — path is not served by Pages.
  html = html.replace(
    /<script[^>]+\/cdn-cgi\/scripts\/[^>]+><\/script>/g,
    "",
  );

  return html;
}
