'use client';

import { Billboard } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { getGlowTexture } from '@/lib/three-utils';

type GlowProps = {
  color?: string;
  /** World-space diameter of the halo sprite. */
  size?: number;
  opacity?: number;
  position?: [number, number, number];
  /** Keeps the halo facing the camera (default) or locks it to a plane. */
  billboard?: boolean;
};

/**
 * Additive halo sprite. Used instead of a post-processing bloom pass so the
 * scene keeps its neon look on integrated GPUs and mobile devices.
 */
export function Glow({
  color = '#00f5d4',
  size = 3,
  opacity = 0.5,
  position = [0, 0, 0],
  billboard = true,
}: GlowProps) {
  const map = useMemo(() => getGlowTexture(), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map,
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [map, color, opacity]
  );

  const mesh = (
    <mesh position={position} material={material} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[size, size]} />
    </mesh>
  );

  if (!billboard) return mesh;
  return <Billboard position={position}>{mesh}</Billboard>;
}
