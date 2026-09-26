// ============================================================================
// PRELOADER — fake-loads to 100%, lifts away, then fires the hero reveal.
// ============================================================================
import gsap from 'gsap'

export function initPreloader(onDone) {
  const el = document.getElementById('preloader')
  if (!el) {
    onDone()
    return
  }

  const finish = () => {
    el.classList.add('is-done')
    // Hard fallback in case the transitionend event never fires (hidden tab…)
    window.setTimeout(() => el.remove(), 1200)
    el.addEventListener(
      'transitionend',
      () => el.remove(),
      { once: true }
    )
    onDone()
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.remove()
    onDone()
    return
  }

  const num = document.getElementById('preloadNum')
  const bar = document.getElementById('preloadBar')
  const counter = { v: 0 }

  gsap
    .timeline({ onComplete: finish })
    .to(counter, {
      v: 100,
      duration: 1.7,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.v)
        if (num) num.textContent = String(v).padStart(3, '0')
        if (bar) bar.style.transform = `scaleX(${counter.v / 100})`
      },
    })
    .to(
      '.preloader__inner',
      { yPercent: -40, opacity: 0, duration: 0.45, ease: 'power2.in' },
      '+=0.15'
    )
}
