import { readSection } from "@/lib/readSection";

// /news/ — News index page listing recent Montfort press releases.
const BODY_INNER = readSection("page-news");

export const metadata = {
  title: "News — Montfort Group",
  description: "Latest news and press releases from the Montfort Group.",
};

export default function NewsPage() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
