import { readSection } from "@/lib/readSection";

// /trading/ — Montfort Trading page.
// Full body of https://mont-fort.com/trading/ injected verbatim; mont-fort's
// production CSS + module scripts (loaded in src/app/layout.tsx) wire
// themselves to the DOM attributes (data-astro-cid-*, data-chapter, etc.).
const BODY_INNER = readSection("page-trading");

export const metadata = {
  title: "Montfort Trading",
  description:
    "Operating efficiently by leading with innovation — Montfort's trading division moves physical commodities across global markets.",
};

export default function TradingPage() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
