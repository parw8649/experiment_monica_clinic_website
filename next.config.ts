import type { NextConfig } from "next";

// When deployed to a GitHub Pages *project site* (e.g.
// https://<user>.github.io/<repo>/) all assets live under a sub-path, not
// the site root. `NEXT_PUBLIC_BASE_PATH` lets CI inject the repo name so
// Next.js rewrites its own links and we can prefix the hardcoded asset
// URLs inside the mont-fort HTML we inject via dangerouslySetInnerHTML.
//
// Locally (`npm run dev` and `npm run build` without the env var) it stays
// empty, so `/` is served from the root and everything works.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Static export config for GitHub Pages / any static host.
// - `output: "export"` — pre-renders every route as a static HTML file
//   under `out/`. No Node.js runtime required.
// - `trailingSlash: true` — writes `/trading/index.html` so directory-style
//   URLs work on GitHub Pages.
// - `images.unoptimized: true` — disables the Next.js image optimizer,
//   which would need a runtime server. We only use raw <img> tags anyway.
// - `basePath` / `assetPrefix` — set together when deploying to a project
//   site, so Next-managed links and asset URLs are prefixed automatically.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: BASE_PATH || undefined,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
};

export default nextConfig;
