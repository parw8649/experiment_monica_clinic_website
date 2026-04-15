import fs from "node:fs";
import path from "node:path";

// For guaranteed byte-exact fidelity we inject the entire <body> content of
// the target page verbatim — every class, every data-astro-cid marker,
// every svg path, every data-chapter attribute, the #scroll-top button, the
// #canvas-wrapper, the chapters-navigation, every section and the footer.
//
// The production scripts (GlobalApp, ChaptersNavigation, Solutions, Social,
// WebGL, Layout) are loaded in layout.tsx and wire themselves to this DOM.
const BODY_INNER_HTML = fs.readFileSync(
  path.join(process.cwd(), "src", "sections-raw", "body-inner.html"),
  "utf8",
);

export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER_HTML }} />;
}
