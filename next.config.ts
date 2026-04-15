import type { NextConfig } from "next";

// Static export config for GitHub Pages / any static host.
// - `output: "export"` tells Next to emit a pre-rendered HTML file per route
//   under `out/` at build time. No Node.js server is needed to serve the clone.
// - `trailingSlash: true` writes `/trading/index.html` etc., which GitHub Pages
//   serves correctly from a path like `/montfort-clone/trading/`.
// - `images.unoptimized: true` disables the Next.js Image Optimization API
//   (which would require a runtime server). Since all our <img> tags come from
//   dangerouslySetInnerHTML anyway, this is a no-op for us — but it avoids the
//   export error on `next/image` if anyone adds one later.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
