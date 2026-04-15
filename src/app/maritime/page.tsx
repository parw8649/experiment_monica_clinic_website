import { readSection } from "@/lib/readSection";

// /maritime/ — Montfort Maritime page.
const BODY_INNER = readSection("page-maritime");

export const metadata = {
  title: "Montfort Maritime",
  description: "Powering progress, delivering energy — Montfort's maritime and shipping arm.",
};

export default function MaritimePage() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
