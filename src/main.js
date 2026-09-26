// ============================================================================
// APP ENTRY — boots every module and choreographs the hero reveal.
// ============================================================================
import './styles/main.css'
import gsap from 'gsap'
import { initScene } from './js/scene'
import { initPreloader } from './js/preloader'
import { initScroll } from './js/scroll'
import { initUI } from './js/ui'
import { initCursor } from './js/cursor'
import { renderWork } from './js/work'
import { aboutImage } from './data'

function revealHero(reduced) {
  if (reduced) {
    gsap.set('.hero__line-in', { yPercent: 0 })
    return
  }
  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .to('.hero__line-in', { yPercent: 0, duration: 1.15, stagger: 0.1 }, 0.05)
    .from('.hero__eyebrow', { y: 26, opacity: 0, duration: 0.8 }, 0.35)
    .from('.hero__sub', { y: 28, opacity: 0, duration: 0.8 }, 0.6)
    .from('.hero__actions', { y: 28, opacity: 0, duration: 0.8 }, 0.72)
    .from('.hero__meta-item', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.8)
    .from('.hero__badge', { scale: 0.6, opacity: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0.85)
}

const boot = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Content
  renderWork()
  const aboutImg = document.getElementById('aboutImg')
  if (aboutImg) aboutImg.src = aboutImage

  // Hide hero lines immediately (preloader sits on top, so no flash).
  if (!reduced) gsap.set('.hero__line-in', { yPercent: 120 })

  // Modules
  const scene = initScene('#hero-canvas')
  initScroll()
  initUI()
  initCursor()

  // Preloader → hero reveal → sculpture pops in
  initPreloader(() => {
    document.body.classList.add('is-loaded')
    revealHero(reduced)
    if (scene) scene.intro()
  })
}

boot()
