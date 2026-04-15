import { readSection } from "@/lib/readSection";

// Home (/) — the target site homepage body injected verbatim.
//
// For guaranteed byte-exact fidelity we inject the entire <body> content of
// the target page verbatim: every class, every data-astro-cid marker,
// every svg path, every data-chapter attribute, the #scroll-top button, the
// #canvas-wrapper, the chapters-navigation, every section and the footer.
//
// the target site's production scripts (GlobalApp, ChaptersNavigation, Solutions,
// Social, WebGL, Layout) are loaded in src/app/layout.tsx and wire
// themselves to this DOM.
const BODY_INNER = readSection("body-inner");

export default function Home() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
