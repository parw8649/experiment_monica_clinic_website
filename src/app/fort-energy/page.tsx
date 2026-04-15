import { readSection } from "@/lib/readSection";

// /fort-energy/ — Fort Energy page.
const BODY_INNER = readSection("page-fort-energy");

export const metadata = {
  title: "Fort Energy",
  description: "Advancing innovation in energy investments.",
};

export default function FortEnergyPage() {
  return <div dangerouslySetInnerHTML={{ __html: BODY_INNER }} />;
}
