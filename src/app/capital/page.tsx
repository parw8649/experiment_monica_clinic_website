import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /capital/ — Montfort Capital page.
const BODY_INNER = readSection("page-capital");

export const metadata = {
  title: "Montfort Capital",
  description:
    "Identify and seize opportunities that maximise value — a fund management company built on the expertise of a global leader.",
};

export default function CapitalPage() {
  return <RawBody html={BODY_INNER} />;
}
