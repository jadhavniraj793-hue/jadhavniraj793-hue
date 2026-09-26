// ============================================================================
// SMOOTH SCROLL (Lenis) + anchor navigation + scroll reveals + image parallax.
// ============================================================================
import Lenis from 'lenis'
import { closeMenu } from './ui'

export function initScroll() {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  window.__lenis = lenis

  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // ---- Anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href')
      if (!href || href.length <= 1) return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      closeMenu()
      if (href === '#top') {
        lenis.scrollTo(0, { duration: 1.4 })
      } else {
        lenis.scrollTo(target, { offset: -70, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
      }
    })
  })

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in')
          io.unobserve(en.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

  // ---- Parallax on media wrappers ----
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'))
  if (parallaxEls.length) {
    let ticking = false
    const update = () => {
      ticking = false
      const vh = window.innerHeight
      parallaxEls.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < -140 || r.top > vh + 140) return
        const speed = parseFloat(el.dataset.parallax) || 0.06
        const center = r.top + r.height / 2 - vh / 2
        const y = -center * speed
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.22)`
      })
    }
    lenis.on('scroll', () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    })
    window.addEventListener('resize', update)
    update()
  }

  return lenis
}
