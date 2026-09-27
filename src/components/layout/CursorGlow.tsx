import { useEffect, useRef } from 'react';
import { useIsTouch, usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const TRAIL = 6;

/** Glowing cursor halo with a short particle trail. Desktop pointer devices only. */
export function CursorGlow() {
  const touch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (touch || reduced) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    const trail = Array.from({ length: TRAIL }, () => ({ x: target.x, y: target.y }));
    let raf = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement | null;
      hovering = !!el?.closest('a, button, [data-cursor="hover"], input, textarea, select');
    };

    const tick = () => {
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.65 : 1})`;
        ringRef.current.style.opacity = hovering ? '0.95' : '0.6';
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      let px = target.x;
      let py = target.y;
      trail.forEach((p, i) => {
        p.x += (px - p.x) * 0.3;
        p.y += (py - p.y) * 0.3;
        px = p.x;
        py = p.y;
        const el = trailRefs.current[i];
        if (el) {
          const s = 1 - i / (TRAIL + 1);
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${s})`;
          el.style.opacity = String(0.4 * s);
        }
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120] hidden lg:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 h-9 w-9 rounded-full border border-cyan-300/70 transition-[opacity] duration-200"
        style={{ boxShadow: '0 0 24px -4px rgba(34,211,238,0.85), inset 0 0 14px -6px rgba(34,211,238,0.9)' }}
      />
      <div ref={dotRef} className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-cyan-200" />
      {Array.from({ length: TRAIL }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-cyan-300 blur-[1px]"
        />
      ))}
    </div>
  );
}
