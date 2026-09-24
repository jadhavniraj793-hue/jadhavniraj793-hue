'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, type ReactNode } from 'react';
import * as THREE from 'three';

type StageProps = {
  children: ReactNode;
  /** When false the render loop is fully parked (0 GPU cost). */
  active?: boolean;
  /** Upper DPR bound — the loop self-lowers it if the device struggles. */
  maxDpr?: number;
  minDpr?: number;
  cameraPosition?: [number, number, number];
  fov?: number;
  className?: string;
  /** Optional static markup shown while the GL context boots. */
  fallback?: ReactNode;
};

/**
 * Shared react-three-fiber canvas.
 *
 * Performance contract:
 *  - `frameloop="never"` when off-screen or when the tab is hidden
 *  - DPR starts conservative and is tuned by drei's PerformanceMonitor
 *  - no shadows, no post-processing, stencil buffer disabled
 */
export function Stage({
  children,
  active = true,
  maxDpr = 1.75,
  minDpr = 0.7,
  cameraPosition = [0, 0, 9.6],
  fov = 45,
  className,
  fallback = null,
}: StageProps) {
  const [dpr, setDpr] = useState(() => Math.min(maxDpr, 1.35));

  return (
    <Canvas
      className={className}
      // "demand" still paints one frame on mount (so an off-screen canvas is
      // never blank) but parks the loop, and therefore the GPU, right after.
      frameloop={active ? 'always' : 'demand'}
      dpr={dpr}
      resize={{ scroll: false, debounce: { scroll: 50, resize: 120 } }}
      camera={{ position: cameraPosition, fov, near: 0.1, far: 120 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor
        bounds={() => [40, 58]}
        onDecline={() => setDpr((d) => Math.max(minDpr, +(d - 0.25).toFixed(2)))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, +(d + 0.15).toFixed(2)))}
      />
      <Suspense fallback={fallback}>{children}</Suspense>
    </Canvas>
  );
}
