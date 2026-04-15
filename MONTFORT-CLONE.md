# Montfort Group — Website Clone

A Next.js 16 clone of **https://mont-fort.com/** (homepage + all 6 sub-pages), built
from mont-fort's exact production CSS, JavaScript bundles, fonts, 3D models, textures,
and HTML. This is a **byte-identical fidelity** approach: we ship mont-fort's
compiled output verbatim and wrap it in a Next.js delivery shell, so computed
styles, WebGL scenes, scroll animations, and chapter navigation match the
original exactly.

## Routes

| URL | Source page |
| --- | --- |
| `/` | https://mont-fort.com/ |
| `/trading` | https://mont-fort.com/trading/ |
| `/capital` | https://mont-fort.com/capital/ |
| `/maritime` | https://mont-fort.com/maritime/ |
| `/fort-energy` | https://mont-fort.com/fort-energy/ |
| `/news` | https://mont-fort.com/news/ |
| `/contact` | https://mont-fort.com/contact/ |

Each route renders its target page's full `<body>` content — header, hero,
WebGL canvas, chapters navigation, all sections, footer, scroll-to-top button,
and the `.montfort-menu` overlay — via `dangerouslySetInnerHTML`.

## Requirements

- **Node.js 24+** (see `package.json` engines field)
- Modern browser with WebGL2 support for the 3D scenes
- ~780 MB free disk (most of which is `node_modules`)

## Run it locally

From this directory (`montfort-clone/`):

```bash
# 1. Install dependencies (first time only — ~600 packages, 1 minute)
npm install

# 2. Start the dev server (Next.js Turbopack, hot reload)
npm run dev
```

Open **http://localhost:3000** in Chrome. You should see the Montfort Group
homepage with the 3D WebGL hero, "Scroll down to discover" CTA, smooth Lenis
scroll, sticky chapter navigation rail, and all 8 content sections.

To try a sub-page, navigate to `http://localhost:3000/trading`,
`http://localhost:3000/capital`, `/maritime`, `/fort-energy`, `/news`, or
`/contact`. Or click the Menu button in the top-right and pick from the
overlay menu.

## Build for production

```bash
# Builds all 7 routes as static pages
npm run build

# Serve the production build
npm run start
```

`npm run start` binds to `http://localhost:3000` by default. Set `PORT=4000`
in the environment to use a different port.

Other useful scripts:

```bash
npm run lint       # ESLint check
npm run typecheck  # TypeScript check
npm run check      # lint + typecheck + build, all in one
```

## Project structure

```
montfort-clone/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Loads main.css, 6 module scripts, metadata
│   │   ├── globals.css         # @font-face for Century Gothic + Josefin Sans
│   │   ├── page.tsx            # Homepage route
│   │   ├── trading/page.tsx    # /trading route
│   │   ├── capital/page.tsx    # /capital route
│   │   ├── maritime/page.tsx   # /maritime route
│   │   ├── fort-energy/page.tsx# /fort-energy route
│   │   ├── news/page.tsx       # /news route
│   │   └── contact/page.tsx    # /contact route
│   ├── lib/
│   │   └── readSection.ts      # Helper to read raw HTML blocks
│   └── sections-raw/           # Verbatim HTML blocks from mont-fort.com
│       ├── body-inner.html     # Homepage body (~107 KB)
│       ├── page-trading.html   # Trading page body
│       ├── page-capital.html
│       ├── page-maritime.html
│       ├── page-fort-energy.html
│       ├── page-news.html
│       ├── page-contact.html
│       ├── montfort-menu.html  # Menu overlay block
│       └── <individual section blocks for reference>
│
├── public/                      # Assets served at /
│   ├── _astro/                  # Mont-fort's production bundles
│   │   ├── _slug_.B97dlsMJ.css        # 300 KB — the exact CSS
│   │   ├── GlobalApp.vK8XqYB9.js      # 890 KB — Three.js + GSAP + app code
│   │   ├── ScrollTrigger.*.js          # GSAP ScrollTrigger
│   │   ├── index.*.js                  # GSAP core
│   │   ├── KTX2Loader.*.js             # Basis texture loader
│   │   ├── Layout / WebGL / Chapters / Solutions / Social / ClientRouter / router / visitedNews
│   │   └── 97 PNG/WebP images (m_*.png / m_*.webp)
│   │
│   ├── assets/
│   │   ├── fonts/               # 36 woff2 + woff files
│   │   │   ├── CenturyGothic[-Bold|-Italic|-BoldItalic].{woff2,woff}
│   │   │   └── JosefinSans-{Thin,ExtraLight,Light,Regular,Medium,SemiBold,Bold}[Italic].{woff2,woff}
│   │   ├── models/              # 15 GLB 3D models for Three.js
│   │   │   ├── homepage/Homepage.glb, earth-min.glb, WhatWeDo.glb, ...
│   │   │   ├── capital/, fort-energy/, maritime/, trading/
│   │   │   └── mountains.glb
│   │   └── textures/            # WebP textures + 1 EXR env map
│   │       ├── envmap-min.exr (HDR lighting)
│   │       ├── noise, perlin, voronoi, rock_diffuse, rock_normal, ...
│   │       └── homepage/, capital/, maritime/, trading/
│   │
│   └── libs/basis/              # Basis Universal texture transcoder (wasm)
│
├── docs/
│   └── research/
│       └── mont-fort.com/       # Full audit trail for the clone
│           ├── raw/             # Downloaded source HTML, CSS, JS bundles
│           │   ├── index.html                 # Homepage HTML
│           │   ├── pages/<slug>.html          # Sub-page HTMLs
│           │   ├── _astro/                    # Downloaded JS chunks
│           │   ├── main.css                   # The full CSS
│           │   ├── download-assets.mjs        # Image/font downloader
│           │   ├── download-3d-assets.mjs     # GLB/texture/wasm downloader
│           │   ├── download-page-assets.mjs   # Sub-page asset downloader
│           │   ├── download-js-chain.mjs      # Recursive JS import resolver
│           │   ├── extract-sections.mjs       # Per-section HTML extractor
│           │   └── extract-pages.mjs          # Per-page body-inner extractor
│           └── sections/        # Extracted HTML blocks
│
├── package.json                 # Next.js 16 + React 19 + shadcn
├── package-lock.json            # Deterministic install
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── README.md                    # Original template README
└── MONTFORT-CLONE.md             # (this file)
```

## Push to GitHub

This directory is already a git repository with three clone commits on top of
the template's history.

```bash
# From inside montfort-clone/:

# 1. See where you stand
git status
git log --oneline -5

# 2. Create a new EMPTY repo on github.com (no README / gitignore / license)

# 3. Point your local repo at it
git remote remove origin  # remove the template's remote first
git remote add origin https://github.com/<your-username>/<your-repo>.git

# 4. Push
git branch -M main        # rename master -> main
git push -u origin main
```

Your repo on GitHub will contain:
- All source files (`src/`, `public/`, `docs/`, configs)
- `.github/workflows/deploy.yml` — CI that builds and deploys to GitHub Pages
- Your three clone commits layered on top of the template history
- **NOT** `node_modules/` or `.next/` or `out/` (gitignored)

Anyone who clones your repo can reproduce the site with:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
npm run dev
```

## Deploy to GitHub Pages

The repo ships a ready-to-go GitHub Actions workflow at
`.github/workflows/deploy.yml` that runs `npm ci && npm run build` on every
push to `main`, uploads `out/` as a Pages artifact, and deploys it.

**Before your first push, enable Pages:**

1. On GitHub, go to your repo → **Settings → Pages**.
2. Under "Build and deployment", set **Source** to **GitHub Actions**
   (NOT "Deploy from a branch").
3. Save. You don't need to select a branch — the workflow handles everything.

**After that, every `git push` automatically:**
1. Checks out the code
2. Installs deps (`npm ci`)
3. Builds the static site (`npm run build` → `out/`)
4. Creates `.nojekyll` so Jekyll doesn't eat `_next/` / `_astro/` folders
5. Uploads `out/` as a Pages artifact
6. Deploys it live at your Pages URL

### Pick your hosting URL pattern

GitHub Pages has three URL patterns. Pick one **before** your first deploy —
they have different config requirements:

**Option A — User site at `https://<you>.github.io/` (simplest)**
- Create a repo literally named `<your-username>.github.io`
- Deploy serves from the site root, so `/_astro/...` asset paths work as-is
- **Zero config changes required.** Just push.

**Option B — Custom domain (also simple)**
- Point a CNAME at your repo's GitHub Pages URL
- Also serves from root, so `/_astro/...` paths work as-is
- **Zero config changes required.** Add a `CNAME` file under `public/` with
  your domain, then push.

**Option C — Project site at `https://<you>.github.io/<repo-name>/`**
- Your repo is named anything (e.g. `montfort-clone`)
- Served from `/<repo-name>/`, so asset paths starting with `/_astro/...`
  would 404 — they need to become `/<repo-name>/_astro/...`
- **Config changes required:** set `basePath: "/<repo-name>"` +
  `assetPrefix: "/<repo-name>/"` in `next.config.ts`, AND run a find-replace
  pass over `src/sections-raw/*.html` to prefix every `/_astro/` and
  `/assets/` with `/<repo-name>`. Nontrivial — if you go this route, ask
  me to wire it up.

**Recommended:** Option A (or Option B if you have a domain). Zero friction,
everything works out of the box.

### Manual build + deploy (no Actions)

You can also build locally and push `out/` to a `gh-pages` branch:

```bash
npm run build
touch out/.nojekyll
# Use a tool like `gh-pages` or just push out/ to a branch
npx gh-pages -d out -b gh-pages
```

Then in Settings → Pages, set Source to "Deploy from a branch" and pick
`gh-pages / (root)`.

## A note on trademark and brand content

This clone ships Montfort Group's own CSS, JavaScript, fonts, 3D models,
images, and HTML content verbatim. That's great for pixel-perfect visual
fidelity, but:

- **Montfort's logos, brand name, colors, and content remain their
  intellectual property.** You do not own them just because you have a
  local copy.
- Publishing a public clone under a URL that could be mistaken for Montfort's
  real site may run into **trademark, passing-off, and copyright** issues.
- GitHub's [acceptable use policy](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)
  prohibits impersonation and IP infringement on Pages.

Safe uses of this clone:
- Running it locally while you learn from the code, customize the template,
  or use it as a starting point for your own site
- Swapping out Montfort's content for your own brand assets before deploying
- Keeping the repo private

If you want to actually deploy this as Montfort's real site, that's between
you and Montfort — they'd need to authorize you to host their assets. If you
want to use this as a template for **your own** site, the next step is to
gradually replace `src/sections-raw/*.html` content, colors in
`public/_astro/_slug_.B97dlsMJ.css`, and the fonts/models with your own.

## Making changes

Everything is in **plain HTML files** you can edit directly:

- **Change visible text / structure** → edit `src/sections-raw/*.html`
  (e.g. `body-inner.html` for the homepage, `page-trading.html` for /trading).
  The dev server hot-reloads on save.
- **Change CSS rules** → edit `public/_astro/_slug_.B97dlsMJ.css`
  (this is the stylesheet the layout loads). Or add overrides at the bottom
  of `src/app/globals.css` — your rules will win because they're loaded after.
- **Change fonts** → swap files under `public/assets/fonts/`, then update
  `@font-face` declarations in `src/app/globals.css`.
- **Change 3D models** → replace `.glb` files in `public/assets/models/`.
  The Three.js code in `GlobalApp.vK8XqYB9.js` loads them by path.
- **Add a new route** → create `src/app/<slug>/page.tsx` following the pattern
  of the existing sub-pages.
- **Metadata / SEO** → edit `src/app/layout.tsx` (site-wide) or per-route
  `metadata` export.

## What's under the hood

The clone works because Next.js 16's App Router server components let us read
raw HTML files at build time and inject them via `dangerouslySetInnerHTML`.
`src/app/layout.tsx` loads mont-fort's production CSS + JavaScript bundles
with their original relative paths (they expect to be served from `/_astro/`),
and the scripts wire themselves to the DOM we inject — so Lenis smooth scroll,
GSAP ScrollTrigger, Three.js WebGL, the chapters navigation, the solutions
tabs, and the social carousel all work with zero reimplementation.

Reconnaissance / asset-discovery scripts under `docs/research/mont-fort.com/raw/`
are re-runnable if you want to re-capture mont-fort's current output.

## Known quirks

- **Native lazy-loaded images** don't always trigger on Lenis smooth scroll.
  If an image in the Social section looks blank, scroll slowly or interact
  with the page to force a re-measure.
- **Chrome window resize via automation** won't always take effect — for
  responsive testing, use DevTools' device mode manually.
- **Cookiebot + Google Tag Manager scripts** from mont-fort's `<head>` were
  not ported. Add them to `src/app/layout.tsx`'s head if you need consent
  tracking on the clone.

## License

Template code: MIT (see `LICENSE`).
Mont-fort content, images, 3D models, and brand assets remain the property of
Montfort Group. This clone is for **personal / educational** use; do not use
it for impersonation, phishing, or any activity that violates Montfort's
terms of service.
