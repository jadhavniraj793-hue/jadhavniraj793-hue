# 🌌 Niraj Laxman Jadhav — 3D Data Cosmos Portfolio

An interactive, production-ready portfolio for a **Data Analyst & BI Specialist**, built around a
"Futuristic Data Cosmos / Cybernetic Analytics Hub" theme: real WebGL scenes, glassmorphic surfaces
and motion design that all degrade gracefully on weak devices.

> **Repo note:** this repository is also `jadhavniraj793-hue/jadhavniraj793-hue` (a GitHub *profile*
> repo), so the original profile `README.md` has been left **untouched**. Everything about running and
> customising the website lives in this file.

---

## ⚡ Quick start

```bash
# 1. install dependencies (Node.js 18.18+ recommended, tested on Node 22)
npm install

# 2. run the dev server
npm run dev
#    → http://localhost:3000

# 3. production build + local production server
npm run build
npm run start
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server with hot reload |
| `npm run build` | Optimised production build |
| `npm run start` | Serves the production build |
| `npm run typecheck` | `tsc --noEmit` — full type audit |
| `npm run lint` | Next.js lint |
| `npm run resume` | Regenerates `public/Niraj-Jadhav-Resume.pdf` (see below) |

### Deploy to Vercel (optional)

```bash
npx vercel            # preview deploy
npx vercel --prod     # production deploy
```

The project builds statically — no environment variables, no backend, no database.

---

## 🎨 What's inside

| Section | Highlights |
| --- | --- |
| **Hero** | Full-screen react-three-fiber "data cosmos": a rotating **data globe** of 1,400 glowing nodes with traffic arcs and travelling packets, an **instanced holographic bar-chart ring**, floating **pie / trend-line / node-cluster** holograms, wireframe KPI cubes, parallax starfield — all pointer-reactive. Plus three CTAs (Explore Projects · Get In Touch · Download Resume), a rotating role ticker and four KPI stat cards. |
| **About** | Career summary, animated `analyst_id.json` hologram card with a scanning highlight, three highlight badges and a tool-belt chip row. |
| **Skills** | Four glass skill cards with animated proficiency meters over a second WebGL scene — an **orbiting analytics core** with three tilted orbit rings and satellite nodes — plus a double skill ticker. |
| **Projects** | Three glass case-study cards, each with its **own live 3D chart** (`bars` / `line` / `dashboard` variants), key highlights, tech chips and tags. |
| **Journey** | Vertical timeline with a scroll-linked progress spine that fills as you read, a travelling light node, pulsing "current" marker, experience + education entries. |
| **Certifications** | Five **flip badges** (CSS 3D, `preserve-3d`) that reveal the skills unlocked behind each certification — hover on desktop, tap/Enter and Space on touch and keyboard. |
| **Contact** | Glassmorphic validated form (name / email / message → pre-filled `mailto:`), one-click Email · WhatsApp · LinkedIn buttons, copy-to-clipboard contact rows, live Mumbai (IST) clock. |
| **Footer** | Third WebGL scene: drifting particle cloud, rising "data rain" columns, neon infinite data grid, sitemap, socials and status card. |

Global chrome: boot-sequence preloader, Lenis smooth scrolling, neon scroll-progress bar, pointer
glow + reticle, sticky glass navigation with active-section tracking, and a "back to top" orb.

---

## 🧱 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router, React 19) |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` design system in `src/app/globals.css`) |
| 3D | **three.js** via **@react-three/fiber** + **@react-three/drei** |
| Animation | **framer-motion** (reveal-on-scroll, micro-interactions, layout transitions) |
| Smooth scroll | **Lenis** |
| Icons | **lucide-react** |
| Fonts | **self-hosted variable fonts** (Space Grotesk / Inter / JetBrains Mono via `@fontsource-variable`) — zero Google Fonts requests |

### Design tokens

```
space    #050811   abyss   #0A0F1D   deep  #0D1426
aqua     #00F5D4   aqua-deep #06B6D4  plasma #22D3EE
violet   #8B5CF6   violet-core #7B2CBF
mist     #F8FAFC   ash     #94A3B8
```

Everything is exposed as Tailwind utilities (`bg-space`, `text-aqua`, `border-violet-glow`,
`font-display`, `animate-aurora`, …) plus custom `@utility` classes: `glass`, `glass-soft`,
`text-gradient`, `neon-ring`, `grid-overlay`, `noise`, `sweep-glow`, `preserve-3d`.

---

## 📁 Project structure

```
src/
├── app/
│   ├── layout.tsx            # fonts, metadata, global chrome (nav, cursor, preloader, smooth scroll)
│   ├── page.tsx              # section composition
│   ├── globals.css           # Tailwind v4 theme + design system + keyframes
│   ├── icon.svg              # favicon
│   ├── robots.ts, sitemap.ts # SEO routes
├── components/
│   ├── three/                # WebGL layer (all dynamically imported, ssr: false)
│   │   ├── Stage.tsx         # shared <Canvas> + DPR/performance policy
│   │   ├── Glow.tsx          # additive halo sprite (fake bloom)
│   │   ├── HeroScene.tsx     # hero cosmos + pointer/scroll rig
│   │   ├── SkillsOrbScene.tsx# orbiting analytics core
│   │   ├── ProjectChart.tsx  # per-project 3D chart variants
│   │   ├── FooterScene.tsx   # particle floor, data rain, neon grid
│   │   └── pieces/           # DataGlobe, DataBars, HoloCharts (pie/line/nodes/cubes)
│   ├── sections/             # Hero, About, Skills, Projects, Journey, Certifications, Contact, Footer
│   ├── ui/                   # Nav, Preloader, NeonButton, TiltCard, Reveal, SectionShell, Marquee, Backdrop…
│   └── providers/SmoothScroll.tsx
└── lib/
    ├── data.ts               # ⭐ ALL content lives here (single source of truth)
    ├── hooks.ts              # device tier, viewport, pointer, scroll bridges
    └── three-utils.ts        # procedural geometry / texture helpers
scripts/generate-resume.mjs   # builds the résumé PDF from raw PDF primitives
public/                       # résumé PDF, OG share image
```

---

## ✏️ Customising content

**Everything textual lives in [`src/lib/data.ts`](src/lib/data.ts)** — name, tagline, summary,
badges, skills + levels, projects, timeline, certifications, contact details and section headings.
Edit that one file and the whole site updates; no component edits required.

```ts
export const profile = { name: '…', email: '…', linkedin: '…', resumePath: '/…pdf' };
export const skillGroups = [ … ];
export const projects = [ … ];
```

Other common tweaks:

- **Colours / fonts / motion** → `@theme` block in `src/app/globals.css`
- **3D composition** → `HeroScene.tsx` (positions, particle counts) and `pieces/DataGlobe.tsx`
- **SEO / social share** → `metadata` in `src/app/layout.tsx`, image at `public/og-image.png`

### Résumé PDF

`public/Niraj-Jadhav-Resume.pdf` is generated, not uploaded:

```bash
npm run resume     # rewrites the PDF from scripts/generate-resume.mjs
```

The script writes PDF 1.4 by hand (standard Helvetica, no dependencies), so you can edit the content
arrays at the top of the file and regenerate. Prefer a designed PDF? Drop your own file into
`public/` and point `profile.resumePath` at it.

---

## 🚀 Performance & resilience

The 3D work never blocks reading the page:

- **Device tiering** (`useDeviceTier`) probes WebGL, `hardwareConcurrency`, `deviceMemory`, pointer
  type and `prefers-reduced-motion`, then classifies the device as `high` / `medium` / `low` / `none`.
  Low-tier and no-WebGL devices get an animated **CSS fallback** instead of a canvas.
- **Code splitting:** every scene is `next/dynamic(..., { ssr: false })`, so three.js (~330 KB) is
  never part of the initial JS payload. Server-rendered HTML contains zero canvases.
- **Adaptive DPR + `PerformanceMonitor`:** resolution starts conservative and is tuned down/up based
  on measured frame cost.
- **Loop parking:** `frameloop` switches to `demand` whenever a scene scrolls out of view, so
  off-screen canvases cost no GPU time.
- **No post-processing:** neon glow comes from additive sprite halos and emissive materials instead of
  a bloom pass — the look survives on integrated GPUs and phones.
- **Scroll without re-renders:** Lenis publishes scroll progress to a module-level object that
  `useFrame` reads, so smooth scrolling causes zero React re-renders.
- **Reduced motion honoured:** every decorative animation, tilt, flip and parallax collapses under
  `prefers-reduced-motion: reduce`.

---

## ♿ Accessibility

- Semantic landmarks: `header` / `main` / `footer`, one `h1`, labelled sections.
- "Skip to content" link, visible focus rings (`:focus-visible` outline in the accent colour).
- Nav exposes `aria-current`, the menu button exposes `aria-expanded`, flip badges are
  keyboard-operable (`Enter` / `Space`) with `aria-pressed` and descriptive labels.
- Form fields are labelled with inline error messaging; the résumé is a real downloadable PDF.
- Decorative 3D layers are `aria-hidden`; all content remains readable without JavaScript.

---

## 🌐 Contact

- **Email** — [jadhavniraj793@gmail.com](mailto:jadhavniraj793@gmail.com)
- **Phone / WhatsApp** — [+91 7208701481](https://wa.me/917208701481)
- **LinkedIn** — [linkedin.com/in/niraj-jadhav-b31](https://linkedin.com/in/niraj-jadhav-b31)
- **Location** — Koper, Mumbai, India

---

Built with Next.js, React Three Fiber, Framer Motion and Tailwind CSS.
