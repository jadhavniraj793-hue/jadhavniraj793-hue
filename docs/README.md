# Niraj Jadhav — Portfolio Website

A fast, responsive, single-page portfolio (plain HTML, CSS & JavaScript, no build step).

## Run locally
```bash
cd docs
python3 -m http.server 8080
# open http://localhost:8080
```

## Publish free with GitHub Pages
1. Repo **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main`, Folder: `/docs`
3. Your site goes live at `https://jadhavniraj793-hue.github.io/jadhavniraj793-hue/`

## Customize
- **Projects:** edit the `<article class="project">` cards in `index.html` and point the "Code →" links to your real repos.
- **Skill levels:** change the `--w:90%` values in the Skills section.
- **Typing roles:** edit the `roles` array at the top of `script.js`.
- **Colors:** change the CSS variables at the top of `style.css`.
