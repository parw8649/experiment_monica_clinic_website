import { readSection } from "@/lib/readSection";

// /contact/ — Contact page with office locations and form.
const BODY_INNER = readSection("page-contact");

export const metadata = {
  title: "Contact — Montfort Group",
  description: "Reach out to Montfort Group — offices in Geneva, Dubai, and Singapore.",
};

export default function ContactPage() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
