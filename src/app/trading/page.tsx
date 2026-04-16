import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /trading/ — Montfort Trading page.
// Full body of https://mont-fort.com/trading/ injected verbatim; mont-fort's
// production CSS + module scripts (loaded in src/app/layout.tsx) wire
// themselves to the DOM attributes (data-astro-cid-*, data-chapter, etc.).
// See src/components/raw-body.tsx for why we unwrap the React div.
const BODY_INNER = readSection("page-trading");

export const metadata = {
  title: "Montfort Trading",
  description:
    "Operating efficiently by leading with innovation — Montfort's trading division moves physical commodities across global markets.",
};

export default function TradingPage() {
  return <RawBody html={BODY_INNER} />;
}
