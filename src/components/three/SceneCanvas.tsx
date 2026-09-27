import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { useQuality } from '../../hooks/useQuality';
import { cn } from '../../lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
  eventsEnabled?: boolean;
};

/**
 * Shared R3F canvas.
 *
 * - DPR and effect budget come from the device quality tier.
 * - Rendering is suspended whenever the canvas scrolls out of view, so several
 *   scenes can live on one page without competing for the GPU.
 * - Reduced-motion users get a single static frame.
 */
export function SceneCanvas({
  children,
  className,
  cameraPosition = [0, 0, 9],
  fov = 45,
  eventsEnabled = true,
}: Props) {
  const quality = useQuality();
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapper.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop = quality.motion === 0 || !visible ? 'demand' : 'always';

  return (
    <div ref={wrapper} className={cn('absolute inset-0', className)}>
      <Canvas
        className="!absolute inset-0 h-full w-full"
        dpr={quality.dpr}
        frameloop={frameloop}
        camera={{ position: cameraPosition, fov, near: 0.1, far: 100 }}
        gl={{
          antialias: quality.tier !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ pointerEvents: eventsEnabled ? 'auto' : 'none' }}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
