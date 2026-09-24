'use client';

import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { PALETTE, barData, lineData } from '@/lib/three-utils';
import { usePointer } from '@/lib/hooks';
import { Glow } from './Glow';
import { Stage } from './Stage';

export type ChartVariant = 'bars' | 'line' | 'dashboard';

/* ---------------------------- Variants ---------------------------- */

function BarChart3D({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const data = barData.slice(0, 9);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const target = 0.35 + data[i % data.length] * 1.5 * (0.82 + 0.18 * Math.sin(t * 1.1 + i));
      child.scale.y = THREE.MathUtils.damp(child.scale.y, target, 4, 0.016);
      child.position.y = child.scale.y / 2 - 0.7;
    });
  });

  return (
    <group rotation={[0, -0.55, 0]} position={[0, 0.1, 0]}>
      <group ref={group}>
        {data.map((_, i) => (
          <mesh key={i} position={[(i - (data.length - 1) / 2) * 0.34, 0, 0]} scale={[1, 0.4, 1]}>
            <boxGeometry args={[0.22, 1, 0.22]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? PALETTE.violet : accent}
              emissive={i % 3 === 0 ? PALETTE.violet : accent}
              emissiveIntensity={0.85}
              metalness={0.7}
              roughness={0.24}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <planeGeometry args={[3.6, 1.5]} />
        <meshBasicMaterial color={accent} transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function LineChart3D({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.Group>(null);
  const points = lineData.map(
    (v, i) => [(i / (lineData.length - 1) - 0.5) * 3.2, (v - 0.5) * 1.8, 0] as [number, number, number]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = -0.42 + Math.sin(t * 0.4) * 0.16;
    dots.current?.children.forEach((child, i) => {
      child.scale.setScalar(0.055 + Math.sin(t * 1.6 - i * 0.45) * 0.018);
    });
  });

  return (
    <group ref={group} position={[0, 0.1, 0]}>
      {/* Axis frame */}
      <Line points={[[-1.7, -1, 0], [1.7, -1, 0]]} color={accent} lineWidth={1} transparent opacity={0.4} />
      <Line points={[[-1.7, -1, 0], [-1.7, 1, 0]]} color={accent} lineWidth={1} transparent opacity={0.4} />
      {points.map((p, i) => (
        <Line
          key={`stem-${i}`}
          points={[p, [p[0], -1, 0]]}
          color={PALETTE.violet}
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      ))}

      <Line points={points} color={accent} lineWidth={2.4} transparent opacity={0.95} toneMapped={false} />

      <group ref={dots}>
        {points.map((p, i) => (
          <mesh key={i} position={p} scale={0.055}>
            <sphereGeometry args={[1, 10, 10]} />
            <meshBasicMaterial color={PALETTE.white} toneMapped={false} />
          </mesh>
        ))}
      </group>

      <Glow color={accent} size={3.6} opacity={0.18} position={[0, 0, -0.6]} />
    </group>
  );
}

function Dashboard3D({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const slices = [
    { value: 0.42, color: accent },
    { value: 0.28, color: PALETTE.violet },
    { value: 0.3, color: PALETTE.plasma },
  ];
  const bars = [0.5, 0.85, 0.35, 0.7, 0.45];

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = -0.34 + Math.sin(t * 0.35) * 0.2;
  });

  let start = 0;

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {/* Donut */}
      <group position={[-0.95, 0.25, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
        {slices.map((slice, i) => {
          const thetaLength = slice.value * Math.PI * 2;
          const mesh = (
            <mesh key={i} rotation={[0, 0, -start]}>
              <torusGeometry args={[0.46, 0.14, 14, 48, thetaLength]} />
              <meshStandardMaterial
                color={slice.color}
                emissive={slice.color}
                emissiveIntensity={0.7}
                metalness={0.7}
                roughness={0.25}
                toneMapped={false}
              />
            </mesh>
          );
          start += thetaLength;
          return mesh;
        })}
      </group>

      {/* Mini bar panel */}
      <group position={[0.85, -0.05, 0]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0, -0.14]}>
          <planeGeometry args={[1.7, 1.5]} />
          <meshBasicMaterial color="#0b1220" transparent opacity={0.55} />
        </mesh>
        {bars.map((value, i) => {
          const h = 0.2 + value * 0.95;
          return (
            <mesh key={i} position={[(i - (bars.length - 1) / 2) * 0.28, h / 2 - 0.66, 0]}>
              <boxGeometry args={[0.16, h, 0.16]} />
              <meshStandardMaterial
                color={accent}
                emissive={accent}
                emissiveIntensity={0.9}
                metalness={0.6}
                roughness={0.3}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
      <Glow color={accent} size={4} opacity={0.15} position={[0.2, 0, -0.8]} />
    </group>
  );
}

/** Pointer-reactive wrapper shared by all three variants. */
function Tilt({ children, amount = 0.28 }: { children: React.ReactNode; amount?: number }) {
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const size = useThree((state) => state.size);

  useFrame((_, delta) => {
    if (!group.current) return;
    const dt = Math.min(delta, 0.05);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * amount,
      2.4,
      dt
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.current.y * amount * 0.6,
      2.4,
      dt
    );
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, size.width < 520 ? 0.86 : 1, 3, dt));
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Per-project holographic chart. Rendered small, at low DPR, and only while
 * the card is on screen (`frameloop` is parked otherwise).
 */
export function ProjectChart({
  variant,
  accent,
  active,
}: {
  variant: ChartVariant;
  accent: string;
  active: boolean;
}) {
  return (
    <Stage
      active={active}
      maxDpr={1.4}
      fov={40}
      cameraPosition={[0, 0.6, 4.6]}
      className="h-full w-full"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 4, 3]} intensity={1.4} />
      <pointLight position={[-3, -2, 3]} intensity={24} distance={14} decay={2} color={PALETTE.violet} />
      <Tilt>
        {variant === 'bars' && <BarChart3D accent={accent} />}
        {variant === 'line' && <LineChart3D accent={accent} />}
        {variant === 'dashboard' && <Dashboard3D accent={accent} />}
      </Tilt>
    </Stage>
  );
}
