// ============================================================================
// UI — nav behaviour, mobile menu, magnetic buttons, card tilt,
// animated counters, footer clock and back-to-top.
// ============================================================================

// Exposed for scroll.js so anchor navigation can close the menu first.
export function closeMenu() {
  const menu = document.getElementById('menu')
  const burger = document.getElementById('burger')
  if (!menu || !menu.classList.contains('is-open')) return
  menu.classList.remove('is-open')
  menu.setAttribute('aria-hidden', 'true')
  if (burger) {
    burger.classList.remove('is-open')
    burger.setAttribute('aria-expanded', 'false')
    burger.setAttribute('aria-label', 'Open menu')
  }
  document.body.classList.remove('is-locked')
  if (window.__lenis) window.__lenis.start()
}

export function initUI() {
  const finePointer = window.matchMedia('(pointer: fine)').matches

  // ---------- Nav: hide on scroll down, show on scroll up ----------
  const nav = document.getElementById('nav')
  const progressBar = document.getElementById('progressBar')
  let lastY = 0

  const onScroll = () => {
    const y = window.scrollY
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 40)
      if (Math.abs(y - lastY) > 8) {
        nav.classList.toggle('is-hidden', y > lastY && y > 320)
        lastY = y
      }
    }
    if (progressBar) {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  // ---------- Mobile menu ----------
  const menu = document.getElementById('menu')
  const burger = document.getElementById('burger')

  const openMenu = () => {
    if (!menu || !burger) return
    menu.classList.add('is-open')
    menu.setAttribute('aria-hidden', 'false')
    burger.classList.add('is-open')
    burger.setAttribute('aria-expanded', 'true')
    burger.setAttribute('aria-label', 'Close menu')
    document.body.classList.add('is-locked')
    if (window.__lenis) window.__lenis.stop()
  }

  if (burger) {
    burger.addEventListener('click', () => {
      if (menu && menu.classList.contains('is-open')) closeMenu()
      else openMenu()
    })
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })

  // ---------- Magnetic buttons ----------
  if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = 0.32
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        el.style.transition = 'transform 0.16s ease-out'
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)'
        el.style.transform = 'translate(0, 0)'
      })
    })
  }

  // ---------- Card tilt ----------
  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const maxTilt = 4
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        card.style.transition = 'transform 0.18s ease-out'
        card.style.transform = `perspective(1100px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`
      })
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
      })
    })
  }

  // ---------- Animated counters ----------
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        counterIO.unobserve(en.target)
        const el = en.target
        const target = parseFloat(el.dataset.count) || 0
        const duration = 1700
        const start = performance.now()
        const step = (now) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          const val = Math.round(target * eased)
          el.textContent = val >= 1000 ? val.toLocaleString('en-US') : String(val)
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    },
    { threshold: 0.6 }
  )
  document.querySelectorAll('[data-count]').forEach((el) => counterIO.observe(el))

  // ---------- Footer clock ----------
  const timeEl = document.getElementById('localTime')
  if (timeEl) {
    const tick = () => {
      timeEl.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    }
    tick()
    setInterval(tick, 1000)
  }

  // ---------- Back to top ----------
  const toTop = document.getElementById('toTop')
  if (toTop) {
    toTop.addEventListener('click', () => {
      if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
}
