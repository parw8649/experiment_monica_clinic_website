import type { Metadata, Viewport } from "next";
import { BASE_PATH } from "@/lib/readSection";
import "./globals.css";

// When we deploy to a GitHub Pages project site, every asset URL needs to
// be prefixed with the repo name. BASE_PATH is "" locally and "/<repo>" in
// CI (injected via NEXT_PUBLIC_BASE_PATH).
const P = (p: string) => `${BASE_PATH}${p}`;

export const viewport: Viewport = {
  themeColor: "#2d628c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Montfort Group",
  description:
    "We are a global commodity trading company and asset investment company that trade in physical commodity, small commodity, downstream oil in UAE, Singapore, Switzerland.",
  keywords: "keyword 2, keyword 2",
  robots: "index, follow",
  icons: {
    icon: [{ url: P("/_astro/favicon_R1w72.webp"), type: "image/x-icon" }],
    shortcut: P("/_astro/favicon_R1w72.webp"),
    apple: [{ url: P("/_astro/favicon_Z1kMBbQ.webp"), sizes: "180x180" }],
  },
  openGraph: {
    title: "Montfort Group",
    description:
      "We are a global commodity trading company and asset investment company that trade in physical commodity, small commodity, downstream oil in UAE, Singapore, Switzerland.",
  },
  other: {
    "astro-view-transitions-enabled": "true",
    "astro-view-transitions-fallback": "swap",
    generator: "Astro v5.2.6",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          The compiled production stylesheet is the source of truth for
          every colour, font, layout rule, and responsive breakpoint.
          Loading it via a `<link>` in the head guarantees it's applied
          before first paint — no FOUC.
        */}
        <link rel="stylesheet" href={P("/_astro/_slug_.B97dlsMJ.css")} />

        {/*
          Astro view-transitions scaffolding. These inline rules
          neutralise the default view-transition CSS so the ClientRouter
          (loaded just below) can take over with its own animations.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-astro-transition-scope="astro-smooz4hq-1"] { view-transition-name: none; }@layer astro { ::view-transition-old(none) { animation: none; opacity: 0; mix-blend-mode: normal; }::view-transition-new(none) { animation: none; mix-blend-mode: normal; }::view-transition-group(none) { animation: none } }',
          }}
        />

        {/*
          ClientRouter goes in <head>, exactly like the source HTML, so
          it executes BEFORE any of the body's module scripts. It sets
          up the page-load / page-transition events the other modules
          listen for. Default `type="module"` semantics are deferred and
          execute in document order — do not add `async`, that races the
          ordering with the body scripts and leaves the renderer
          half-initialised (visible symptom: a WebGL canvas with no
          drawn pixels).

          IMPORTANT: the OTHER five module scripts (WebGL, Solutions,
          Social, ChaptersNavigation, Layout) are NOT loaded here. They
          are already inline at the end of every page's body-inner HTML
          (because they live at the end of the source `<body>`), and
          the readSection helper preserves them verbatim. Loading them
          here too would call init() twice on the same module, which
          calls renderer.attach() twice on the same canvas and corrupts
          the WebGL state.
        */}
        <script
          type="module"
          src={P("/_astro/ClientRouter.astro_astro_type_script_index_0_lang.WONxKOw9.js")}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
