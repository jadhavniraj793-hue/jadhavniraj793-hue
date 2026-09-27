import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

/** Animates 0 → `end` once the element scrolls into view. */
export function useCountUp(end: number, duration = 1600, decimals = 0) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Number((end * eased).toFixed(decimals)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, decimals, reduced]);

  return { ref, value };
}
