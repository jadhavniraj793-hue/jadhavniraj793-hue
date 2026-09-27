import { useEffect, useState } from 'react';

/** Tracks which section id is currently closest to the top of the viewport. */
export function useScrollSpy(ids: string[], offset = 120): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollY = window.scrollY + offset;
        let current = ids[0] ?? '';
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollY) current = id;
        }
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
          current = ids[ids.length - 1] ?? current;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ids, offset]);

  return active;
}
