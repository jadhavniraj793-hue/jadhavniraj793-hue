// ============================================================================
// WORK GRID — renders project cards from src/data.js.
// ============================================================================
import { projects } from '../data'

const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`

export function renderWork() {
  const grid = document.getElementById('workGrid')
  if (!grid) return

  grid.innerHTML = projects
    .map(
      (p, i) => `
      <article class="work__card work__card--${p.size}" data-reveal data-tilt data-cursor="view" style="--d: ${(i % 2) * 0.08}s">
        <div class="work__media" data-parallax="0.06">
          <img src="${p.image}" alt="${p.title} — ${p.category} 3D project" loading="lazy" />
        </div>
        <div class="work__info">
          <div class="work__top">
            <span>${String(i + 1).padStart(2, '0')}</span>
            <span>${p.year}</span>
          </div>
          <div class="work__bottom">
            <div>
              <h3 class="work__title">${p.title}</h3>
              <p class="work__cat">${p.category} · ${p.tools}</p>
            </div>
            <span class="work__arrow">${ARROW}</span>
          </div>
        </div>
      </article>`
    )
    .join('')
}
