# Portfolio site — developer guide

A 3D, interactive Data Analyst portfolio for **Niraj Laxman Jadhav** — "Turning Data Into Decisions."

Live build target: GitHub Pages (`dist/` published by `.github/workflows/deploy.yml`).

## Stack

| Concern           | Choice                                                  |
| ----------------- | ------------------------------------------------------- |
| Framework         | React 19 + TypeScript                                   |
| Build             | Vite (`base: './'` so the bundle works from any path)   |
| Styling           | Tailwind CSS v4 (`@theme` design tokens in `src/index.css`) |
| 3D                | Three.js · React Three Fiber · Drei · Postprocessing    |
| Animation         | Framer Motion (+ CSS keyframes for ambient effects)     |
| Charts            | Recharts                                                |
| Icons             | Lucide React (brand marks are local SVGs)               |
| Fonts             | Self-hosted via Fontsource — Space Grotesk, Inter, JetBrains Mono |

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server on http://localhost:5173
npm run typecheck# tsc --noEmit
npm run build    # typecheck + production build into dist/
npm run preview  # preview the production build
```

Other scripts:

```bash
python3 scripts/make_resume.py   # regenerates public/resume.pdf (needs fpdf2)
node scripts/screenshot.mjs      # headless-Chrome visual QA into shots/
```

## Structure

```
index.html                 # SEO + Open Graph metadata, JSON-LD person schema, boot loader
public/                    # resume.pdf, favicon, og-cover.png, robots.txt, sitemap.xml
src/
  App.tsx                  # section composition, lazy loading, project overlay state
  index.css                # design tokens, glassmorphism utilities, keyframes
  data/
    portfolio.ts           # single source of truth for all résumé content
    analytics.ts           # seeded generators for the demonstration datasets
  hooks/                   # media queries, quality tiers, scroll spy, counters, GitHub API
  lib/                     # class helper, chart palette, scroll helper
  components/
    layout/                # Navbar, CursorGlow, Footer
    three/                 # SceneCanvas + reusable 3D elements + per-section scenes
    ui/                    # GlassCard, TiltCard, MagneticButton, Reveal, Counter, ...
    sections/              # Hero, About, Skills, Analytics Lab, Projects, ...
```

## Content rules

`src/data/portfolio.ts` is the only place personal content lives, and it mirrors the résumé:

- No employers, internships or job titles beyond "Aspiring Data Analyst — Independent Projects & Self-Learning".
- No invented certificate URLs; certifications list name + issuer only.
- Skill bar lengths are labelled in the UI as **visual emphasis placeholders**, not measured scores.
- Every simulated figure lives behind an explicit badge: *Interactive Portfolio Demo* (Analytics Lab) or
  *Portfolio Demo Project* (Creative Analytics Projects).
- GitHub numbers come from the live public API (`src/hooks/useGitHub.ts`). If the request fails, the UI
  states that data is unavailable instead of rendering placeholder counts.

## Performance model

- `src/hooks/useQuality.ts` assigns a quality tier (low / medium / high) from viewport + motion preference and
  drives particle counts, bar counts, DPR, antialiasing and bloom.
- `SceneCanvas` suspends rendering (`frameloop="demand"`) whenever a canvas leaves the viewport, so the four
  scenes never render simultaneously.
- Every below-the-fold section is code-split (`React.lazy`) and mounted only when it nears the viewport
  (`components/ui/Deferred.tsx`), which also mirrors the section id onto its placeholder so navigation and the
  scroll spy work before mount.
- `prefers-reduced-motion` disables scene animation, scroll smoothing, reveals and the custom cursor.

## Deployment

1. Repository → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`; `deploy.yml` type-checks, builds and publishes `dist/`.
3. `ci.yml` runs the same type check and build for pull requests.
