import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party pre-minified bundles that ship under public/ and get
    // served verbatim by Next.js as static assets. Running ESLint against
    // them is meaningless — we don't author that code and the minifier
    // deliberately uses patterns (comma expressions, `require()`, unused
    // args) that trip modern TypeScript-ESLint rules.
    "public/_astro/**",
    "public/libs/**",
    // Research artefacts — captured HTML / JS / scripts used to build the
    // site. Not part of the runtime and not meant to be lint-clean.
    "docs/research/**",
  ]),
]);

export default eslintConfig;
