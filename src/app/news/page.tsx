import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /news/ — News index page listing recent Montfort press releases.
const BODY_INNER = readSection("page-news");

export const metadata = {
  title: "News — Montfort Group",
  description: "Latest news and press releases from the Montfort Group.",
};

export default function NewsPage() {
  return <RawBody html={BODY_INNER} />;
}
