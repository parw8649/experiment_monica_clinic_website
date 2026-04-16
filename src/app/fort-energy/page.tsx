import { readSection } from "@/lib/readSection";
import { RawBody } from "@/components/raw-body";

// /fort-energy/ — Fort Energy page.
const BODY_INNER = readSection("page-fort-energy");

export const metadata = {
  title: "Fort Energy",
  description: "Advancing innovation in energy investments.",
};

export default function FortEnergyPage() {
  return <RawBody html={BODY_INNER} />;
}
