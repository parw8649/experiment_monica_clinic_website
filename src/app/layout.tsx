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
          Mont-fort's production stylesheet — the single source of truth for
          all colors, typography, layout rules, and responsive breakpoints.
          Copied verbatim from /_astro/_slug_.B97dlsMJ.css so computed styles
          are byte-identical.
        */}
        <link rel="stylesheet" href={P("/_astro/_slug_.B97dlsMJ.css")} />
        {/* Astro view-transitions scaffolding — these inline rules neutralise
            the default view-transition CSS so Astro's ClientRouter can take over. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-astro-transition-scope="astro-smooz4hq-1"] { view-transition-name: none; }@layer astro { ::view-transition-old(none) { animation: none; opacity: 0; mix-blend-mode: normal; }::view-transition-new(none) { animation: none; mix-blend-mode: normal; }::view-transition-group(none) { animation: none } }',
          }}
        />
      </head>
      <body>
        {children}

        {/*
          Mont-fort's production JS bundles — loaded as ES modules, same order
          as on mont-fort.com. GlobalApp initialises Three.js + GSAP + Lenis,
          Layout.js flips `.loaded` on body, and the section-specific entries
          (WebGL, Solutions, Social, ChaptersNavigation) wire themselves into
          the DOM elements rendered by our page component above.

          We place them AFTER children so the full DOM (including #scroll-top,
          #canvas-wrapper, all section elements) exists before scripts run.
        */}
        <script
          type="module"
          src={P("/_astro/ClientRouter.astro_astro_type_script_index_0_lang.WONxKOw9.js")}
          async
        />
        <script
          type="module"
          src={P("/_astro/WebGL.astro_astro_type_script_index_0_lang.ClLv70z8.js")}
          async
        />
        <script
          type="module"
          src={P("/_astro/Solutions.astro_astro_type_script_index_0_lang.DH4T_DBQ.js")}
          async
        />
        <script
          type="module"
          src={P("/_astro/Social.astro_astro_type_script_index_0_lang.DMS86Kjn.js")}
          async
        />
        <script
          type="module"
          src={P("/_astro/ChaptersNavigation.astro_astro_type_script_index_0_lang.DYrj7sV6.js")}
          async
        />
        <script
          type="module"
          src={P("/_astro/Layout.astro_astro_type_script_index_0_lang.DbdhcTQd.js")}
          async
        />
      </body>
    </html>
  );
}
