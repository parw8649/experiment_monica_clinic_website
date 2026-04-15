import fs from "node:fs";
import path from "node:path";

// Read a raw HTML block from src/sections-raw at build time. Called from
// server components only — these files are bundled with the build.
const SECTIONS_DIR = path.join(process.cwd(), "src", "sections-raw");

export function readSection(name: string): string {
  return fs.readFileSync(path.join(SECTIONS_DIR, `${name}.html`), "utf8");
}
