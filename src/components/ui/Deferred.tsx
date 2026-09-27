import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Mounts children only once the placeholder approaches the viewport.
 * Keeps first paint light: heavy chart/3D sections never render until needed.
 */
export function Deferred({
  children,
  minHeight = 640,
  rootMargin = '700px',
  anchorId,
}: {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
  /**
   * Id mirrored onto the placeholder so in-page navigation and the scroll spy
   * still resolve a target before the real section has mounted.
   */
  anchorId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref}>
      {show ? children : <div id={anchorId} style={{ minHeight }} aria-hidden />}
    </div>
  );
}
