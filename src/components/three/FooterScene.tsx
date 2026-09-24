'use client';

import { Grid, PointMaterial, Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE, randomBoxPositions } from '@/lib/three-utils';
import { usePointer } from '@/lib/hooks';
import { Stage } from './Stage';

/** Slowly drifting particle cloud that fills the footer. */
function DriftField({ count }: { count: number }) {
  const cloud = useRef<THREE.Points>(null);
  const base = useMemo(() => randomBoxPositions(count, [22, 8, 10], 2025), [count]);
  const pointer = usePointer();

  useFrame((state, delta) => {
    const points = cloud.current;
    if (!points) return;
    const dt = Math.min(delta, 0.05);
    points.rotation.y += dt * 0.035;
    points.rotation.x = THREE.MathUtils.damp(points.rotation.x, pointer.current.y * 0.12, 1.6, dt);
    points.position.y = THREE.MathUtils.damp(
      points.position.y,
      pointer.current.y * 0.4 - 1.2 + Math.sin(state.clock.elapsedTime * 0.4) * 0.16,
      1.4,
      dt
    );
  });

  return (
    <points ref={cloud} position={[0, -1.2, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[base, 3]} />
      </bufferGeometry>
      <PointMaterial
        transparent
        color={PALETTE.aqua}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Rising "data columns" that scan upward through the footer. */
function DataRain({ count = 26, seed = 31 }) {
  const group = useRef<THREE.Group>(null);
  const columns = useMemo(() => {
    const rand = (i: number) => ((Math.sin(i * 127.1 + seed) * 43758.5453) % 1 + 1) % 1;
    return Array.from({ length: count }, (_, i) => ({
      x: (rand(i) - 0.5) * 20,
      z: (rand(i + 99) - 0.5) * 8 - 1,
      speed: 0.35 + rand(i + 7) * 0.85,
      height: 0.6 + rand(i + 13) * 2.4,
      offset: rand(i + 41) * 12,
      color: rand(i + 3) > 0.7 ? PALETTE.violet : PALETTE.aqua,
    }));
  }, [count, seed]);

  const ORIGIN = -1.4;
  const SPAN = 6;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const col = columns[i];
      if (!col) return;
      const progress = ((t * col.speed + col.offset) % SPAN) / SPAN;
      child.position.y = ORIGIN + progress * 7;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      // Fade in at the floor, fade out at the top.
      mat.opacity = Math.sin(progress * Math.PI) * 0.5;
      mesh.scale.y = col.height * (0.6 + Math.sin(progress * Math.PI) * 0.6);
    });
  });

  return (
    <group ref={group}>
      {columns.map((col, i) => (
        <mesh key={i} position={[col.x, ORIGIN, col.z]}>
          <boxGeometry args={[0.045, 1, 0.045]} />
          <meshBasicMaterial
            color={col.color}
            transparent
            opacity={0.3}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function FooterWorld({ quality }: { quality: 'high' | 'medium' }) {
  const pointer = usePointer();

  // Gentle camera drift so the particle field feels alive without scroll cost.
  useFrame(({ camera: cam }, delta) => {
    const dt = Math.min(delta, 0.05);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 1.4, 1.8, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 2.6 + pointer.current.y * 1.1, 1.8, dt);
    cam.lookAt(0, 0.4, 0);
  });

  return (
    <group>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 3, 4]} intensity={40} distance={22} decay={2} color={PALETTE.aqua} />
      <pointLight position={[-7, 1, -3]} intensity={34} distance={22} decay={2} color={PALETTE.violet} />

      <DriftField count={quality === 'high' ? 1400 : 700} />
      <DataRain count={quality === 'high' ? 26 : 16} />
      <Sparkles
        count={quality === 'high' ? 150 : 70}
        scale={[22, 8, 10]}
        size={2.4}
        speed={0.2}
        opacity={0.4}
        color={PALETTE.aqua}
      />

      {/* Neon data floor */}
      <Grid
        position={[0, -1.5, 0]}
        args={[60, 60]}
        cellSize={0.7}
        cellThickness={0.6}
        cellColor="#0e7490"
        sectionSize={3.5}
        sectionThickness={1.1}
        sectionColor={PALETTE.aquaDeep}
        fadeDistance={34}
        fadeStrength={1.4}
        infiniteGrid
      />
    </group>
  );
}

export function FooterScene({
  quality,
  active,
}: {
  quality: 'high' | 'medium';
  active: boolean;
}) {
  return (
    <Stage
      active={active}
      maxDpr={quality === 'high' ? 1.5 : 1.15}
      cameraPosition={[0, 2.6, 8.5]}
      fov={50}
    >
      <FooterWorld quality={quality} />
    </Stage>
  );
}
