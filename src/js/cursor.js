// ============================================================================
// CUSTOM CURSOR — fast dot + trailing ring. The ring grows on links and
// becomes an orange "VIEW" badge over project cards. Desktop / fine pointers
// only; native cursor stays untouched on touch devices.
// ============================================================================
export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return

  const dot = document.querySelector('.cursor-dot')
  const ring = document.querySelector('.cursor-ring')
  if (!dot || !ring) return

  document.documentElement.classList.add('has-cursor')

  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let rx = x
  let ry = y
  let shown = false

  window.addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX
      y = e.clientY
      if (!shown) {
        shown = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    },
    { passive: true }
  )

  const loop = () => {
    rx += (x - rx) * 0.16
    ry += (y - ry) * 0.16
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)

  document.addEventListener('mouseover', (e) => {
    const view = e.target.closest('[data-cursor="view"]')
    const hover = e.target.closest('a, button, [data-hover]')
    ring.classList.toggle('is-view', !!view)
    ring.classList.toggle('is-hover', !!hover && !view)
    dot.style.opacity = view ? '0' : '1'
  })

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0'
    ring.style.opacity = '0'
  })
  document.addEventListener('mouseenter', () => {
    if (shown) {
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }
  })
}
