import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /maritime/ — Montfort Maritime page.
const BODY_INNER = readSection("page-maritime");

export const metadata = {
  title: "Montfort Maritime",
  description: "Powering progress, delivering energy — Montfort's maritime and shipping arm.",
};

export default function MaritimePage() {
  return <RawBody html={BODY_INNER} />;
}
