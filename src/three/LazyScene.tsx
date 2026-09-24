import { Canvas } from '@react-three/fiber';
import { type ReactNode, Suspense, useEffect, useRef, useState } from 'react';

interface LazySceneProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  /** Upper DPR bound — lower on mobile to keep 60fps. */
  dprMax?: number;
}

/**
 * WebGL canvas that only renders its frameloop while intersecting the viewport,
 * suspends on scroll-away, and clamps DPR for performance.
 */
export function LazyScene({
  children,
  className,
  cameraPosition = [0, 0, 9],
  fov = 42,
  dprMax = 1.75,
}: LazySceneProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '260px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holder} className={className}>
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, dprMax]}
        camera={{ position: cameraPosition, fov }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
