// Server component that injects a raw HTML string as a child of <body>.
//
// The target site's static export is a long `<body>` full of Astro-generated
// markup and `<script type="module">` tags that bootstrap its Three.js/GSAP
// scene. We embed it verbatim via dangerouslySetInnerHTML.
//
// --- Caveat: the wrapping <div> ------------------------------------------
//
// React requires a single root element, so every page.tsx returns
// `<RawBody>` which renders `<div dangerouslySetInnerHTML={...} />`. That
// puts an extra `<div>` between `<body>` and the content. The target site's
// compiled GlobalApp bundle originally used `body > main` (direct-child
// combinator) to find its scroll target, which fails the moment `<main>` is
// a grand-child of `<body>`. GSAP would warn `body > main not found` 100+
// times, its ScrollTriggers would never bind, and the first WebGL frame
// would never draw — the page rendered blank white with only the fixed
// header. That is exactly what was happening on GitHub Pages while
// `npm run dev` looked fine.
//
// Two things keep the site working now:
//
//   1. `scripts/rewrite-base-path.mjs` runs after `next build` and rewrites
//      `body > main` to `body main` inside `public/_astro/GlobalApp.vK8XqYB9.js`.
//      There's only a single occurrence of that string in the 912KB bundle.
//      Changing the combinator from direct-child to descendant lets the
//      query match `<main>` even when it's wrapped in a React div.
//
//   2. We keep the wrapper. Trying to unwrap it via a client-side script
//      fights React 19's hydration — React detects a body structural
//      mismatch and falls back to full client-side rendering, wiping
//      whatever the unwrap script moved, even with `suppressHydrationWarning`.
//      The rewrite approach is robust because it doesn't touch the DOM
//      structure at all.

export function RawBody({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
