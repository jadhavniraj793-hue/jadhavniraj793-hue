'use client';

import { PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE, fibonacciSphere } from '@/lib/three-utils';
import { usePointer } from '@/lib/hooks';
import { Glow } from './Glow';
import { Stage } from './Stage';

/** A glowing orbit ring with a satellite node riding it. */
function OrbitRing({
  radius,
  tilt,
  color,
  speed,
  nodeCount = 1,
}: {
  radius: number;
  tilt: [number, number, number];
  color: string;
  speed: number;
  nodeCount?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const children = group.current?.children ?? [];
    children.forEach((child, i) => {
      const angle = t * speed + (i / nodeCount) * Math.PI * 2;
      child.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.006, 6, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: nodeCount }, (_, i) => (
          <mesh key={i} scale={0.055}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function OrbWorld({ quality }: { quality: 'high' | 'medium' }) {
  const core = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const dust = useMemo(() => fibonacciSphere(quality === 'high' ? 420 : 220, 1.28), [quality]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const group = core.current;
    if (!group) return;
    group.rotation.y += dt * 0.12;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, pointer.current.y * 0.35, 2, dt);
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, -pointer.current.x * 0.25, 2, dt);
  });

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[3, 3, 4]} intensity={30} distance={16} decay={2} color={PALETTE.aqua} />
      <pointLight position={[-3, -2, 3]} intensity={26} distance={16} decay={2} color={PALETTE.violet} />

      <group ref={core} scale={1.05}>
        {/* Energy core */}
        <mesh>
          <icosahedronGeometry args={[0.62, 2]} />
          <meshStandardMaterial
            color="#0b1220"
            emissive={PALETTE.aquaDeep}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshBasicMaterial color={PALETTE.aqua} wireframe transparent opacity={0.18} toneMapped={false} />
        </mesh>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dust, 3]} />
          </bufferGeometry>
          <PointMaterial
            transparent
            color={PALETTE.violet}
            size={0.04}
            sizeAttenuation
            depthWrite={false}
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>

        <OrbitRing radius={1.45} tilt={[1.32, 0.2, 0]} color={PALETTE.aqua} speed={0.5} nodeCount={2} />
        <OrbitRing
          radius={1.85}
          tilt={[-0.9, 0.6, 0.4]}
          color={PALETTE.violet}
          speed={-0.36}
          nodeCount={3}
        />
        <OrbitRing radius={2.25} tilt={[0.4, -0.5, 1.1]} color={PALETTE.plasma} speed={0.26} />

        <Glow color={PALETTE.aquaDeep} size={5.6} opacity={0.18} />
      </group>
    </>
  );
}

export function SkillsOrbScene({
  quality,
  active,
}: {
  quality: 'high' | 'medium';
  active: boolean;
}) {
  return (
    <Stage active={active} maxDpr={quality === 'high' ? 1.5 : 1.1} cameraPosition={[0, 0, 6.4]} fov={45}>
      <OrbWorld quality={quality} />
    </Stage>
  );
}
