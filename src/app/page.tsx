import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// Home (/) — the target site homepage body injected verbatim.
//
// For guaranteed byte-exact fidelity we inject the entire <body> content of
// the target page verbatim: every class, every data-astro-cid marker,
// every svg path, every data-chapter attribute, the #scroll-top button, the
// #canvas-wrapper, the chapters-navigation, every section and the footer.
//
// RawBody wraps the HTML in a <div> and then immediately runs a tiny
// inline unwrap script so that <main>, <header>, <footer>, and the five
// Astro module scripts end up as DIRECT children of <body>. The bundled
// Three.js/GSAP code queries `body > main` with the direct-child
// combinator, so the wrapping div has to be gone before those scripts
// fire. See src/components/raw-body.tsx for the full explanation.
const BODY_INNER = readSection("body-inner");

export default function Home() {
  return <RawBody html={BODY_INNER} />;
}
