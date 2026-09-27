const NAV_OFFSET = 76;

function top(el: HTMLElement) {
  return el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
}

/**
 * Scrolls to a section by id.
 *
 * Sections below the fold mount lazily, so the document height can change while
 * the smooth scroll is still running. Two correction passes re-target the
 * element once the real content has replaced its placeholder.
 */
export function scrollToId(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';

  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: top(el), behavior });

  if (reduced) return;
  [420, 900].forEach((delay) => {
    window.setTimeout(() => {
      const current = document.getElementById(id);
      if (!current) return;
      const target = top(current);
      if (Math.abs(target - window.scrollY) > 24) window.scrollTo({ top: target, behavior });
    }, delay);
  });
}
