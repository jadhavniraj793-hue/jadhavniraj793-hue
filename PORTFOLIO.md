# 🎬 3D Animation Portfolio — Niraj Jadhav

A dark, cinematic, WebGL-powered portfolio for 3D art & motion design.
Built with **Vite + Three.js + GSAP + Lenis** — no frameworks, easy to maintain.

## ✨ What's inside

- **Interactive 3D hero** — iridescent chrome torus-knot sculpture, orbiting satellites,
  particle fields, mouse parallax and scroll-driven motion (Three.js)
- **Preloader** with counter → staggered hero reveal (GSAP)
- **Buttery smooth scrolling** (Lenis) with scroll reveals and image parallax
- **Custom cursor** that grows on links and becomes a "VIEW" badge over projects
- **Editorial work grid** with 3D hover tilt, magnetic buttons, animated stats,
  services list, contact footer with live local clock
- Fully responsive, `prefers-reduced-motion` aware, graceful no-WebGL fallback

## 🚀 Run locally

```bash
npm install
npm run dev      # → http://localhost:5173
```

Production build:

```bash
npm run build    # outputs to dist/
npm run preview  # serve the build locally
```

## ✏️ Editing your content

Almost everything lives in **`src/data.js`**:

- `profile` — name, email, social links
- `projects` — title / category / year / tools / size (`lg`, `md` or `wide`) / image
- `aboutImage` — the workspace photo in the About section

To swap artwork, drop new images into `src/assets/` and update the imports at the
top of `src/data.js`.

Copy for hero / about / services / footer lives in **`index.html`** — plain HTML,
clearly marked with comments section by section.

Colors & fonts are CSS variables at the top of **`src/styles/main.css`**
(`--accent` is the orange, `--accent-2` the violet).

## 🌐 Deploying to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. After merging to `main`:

1. Repo **Settings → Pages → Source: GitHub Actions**
2. Push to `main` — the site builds and deploys automatically
   to `https://<user>.github.io/<repo>/`

The build uses a relative base (`vite.config.js`), so it also works on Vercel,
Netlify or any static host without changes.
