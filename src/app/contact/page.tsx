import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /contact/ — Contact page with office locations and form.
const BODY_INNER = readSection("page-contact");

export const metadata = {
  title: "Contact — Montfort Group",
  description: "Reach out to Montfort Group — offices in Geneva, Dubai, and Singapore.",
};

export default function ContactPage() {
  return <RawBody html={BODY_INNER} />;
}
