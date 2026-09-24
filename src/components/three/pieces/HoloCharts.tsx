'use client';

import { Float, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PALETTE, lineData, mulberry32 } from '@/lib/three-utils';
import { Glow } from '../Glow';

const SLICES = [
  { value: 0.36, color: PALETTE.aqua, lift: 0.09 },
  { value: 0.27, color: PALETTE.plasma, lift: 0.03 },
  { value: 0.21, color: PALETTE.violet, lift: 0.06 },
  { value: 0.16, color: PALETTE.violetCore, lift: 0 },
];

/* ------------------------------------------------------------------ *
 * Holographic exploded pie chart.
 * ------------------------------------------------------------------ */
export function HoloPie({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  spin = 0.12,
}) {
  const group = useRef<THREE.Group>(null);
  const radius = 0.9;
  const depth = 0.22;

  const slices = useMemo(() => {
    let start = 0;
    return SLICES.map((slice) => {
      const thetaLength = slice.value * Math.PI * 2;
      const mid = start + thetaLength / 2;
      const entry = { ...slice, thetaStart: start, thetaLength, mid };
      start += thetaLength;
      return entry;
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.004;
    group.current.rotation.x = -0.42 + Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
      <group ref={group} position={position} scale={scale}>
        {slices.map((slice, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(slice.mid) * slice.lift * 2.4,
              slice.lift,
              Math.sin(slice.mid) * slice.lift * 2.4,
            ]}
          >
            <cylinderGeometry
              args={[radius, radius, depth, 48, 1, false, -slice.thetaStart, -slice.thetaLength]}
            />
            <meshStandardMaterial
              color={slice.color}
              emissive={slice.color}
              emissiveIntensity={0.55}
              metalness={0.75}
              roughness={0.22}
              transparent
              opacity={0.92}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Donut hole + rim */}
        <mesh position={[0, 0.02, 0]}>
          <torusGeometry args={[radius + 0.012, 0.008, 8, 96]} />
          <meshBasicMaterial color={PALETTE.aqua} transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <Glow color={PALETTE.plasma} size={3.1} opacity={0.16} position={[0, 0, -0.2]} />
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ *
 * Floating holographic trend line with per-point markers.
 * ------------------------------------------------------------------ */
export function HoloLine({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  width = 2.2,
  height = 1.1,
}) {
  const dots = useRef<THREE.Group>(null);

  const points = useMemo(
    () =>
      lineData.map(
        (value, i) =>
          [
            (i / (lineData.length - 1) - 0.5) * width,
            (value - 0.5) * height,
            0,
          ] as [number, number, number]
      ),
    [width, height]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    dots.current?.children.forEach((child, i) => {
      const target = 0.7 + 0.5 * Math.sin(t * 1.6 - i * 0.5);
      child.scale.setScalar(0.045 * target);
    });
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.8}>
      <group position={position} scale={scale} rotation={[0, -0.36, 0.06]}>
        {/* Frame */}
        <Line
          points={[
            [-width / 2 - 0.14, -height / 2 - 0.1, 0],
            [width / 2 + 0.14, -height / 2 - 0.1, 0],
          ]}
          color={PALETTE.aquaDeep}
          lineWidth={1}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
        <Line
          points={[
            [-width / 2 - 0.14, -height / 2 - 0.1, 0],
            [-width / 2 - 0.14, height / 2 + 0.2, 0],
          ]}
          color={PALETTE.aquaDeep}
          lineWidth={1}
          transparent
          opacity={0.5}
          toneMapped={false}
        />

        {/* Baseline stems */}
        {points.map((p, i) => (
          <Line
            key={`stem-${i}`}
            points={[p, [p[0], -height / 2 - 0.1, 0]]}
            color={PALETTE.violet}
            lineWidth={1}
            transparent
            opacity={0.22}
            toneMapped={false}
          />
        ))}

        <Line
          points={points}
          color={PALETTE.aqua}
          lineWidth={2}
          transparent
          opacity={0.95}
          toneMapped={false}
        />

        <group ref={dots}>
          {points.map((p, i) => (
            <mesh key={`dot-${i}`} position={p}>
              <sphereGeometry args={[1, 10, 10]} />
              <meshBasicMaterial
                color={i === points.length - 1 ? PALETTE.white : PALETTE.aqua}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        <Glow color={PALETTE.aquaDeep} size={3} opacity={0.14} position={[0, 0, -0.4]} />
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ *
 * Cluster of floating data nodes wired together — "the pipeline".
 * ------------------------------------------------------------------ */
export function NodeCluster({
  position = [0, 0, 0] as [number, number, number],
  count = 7,
  spread = 3.4,
  seed = 42,
}) {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const pos: [number, number, number] = [
        (rand() - 0.5) * spread,
        (rand() - 0.5) * spread * 0.6,
        (rand() - 0.5) * spread * 0.5,
      ];
      return {
        pos,
        size: 0.05 + rand() * 0.075,
        color: i % 3 === 0 ? PALETTE.violet : PALETTE.aqua,
        phase: rand() * Math.PI * 2,
      };
    });
  }, [count, spread, seed]);

  const links = useMemo(() => {
    const rand = mulberry32(seed + 1);
    const out: [[number, number, number], [number, number, number]][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const next = nodes[(i + 1 + Math.floor(rand() * 2)) % nodes.length];
      out.push([nodes[i].pos, next.pos]);
    }
    return out;
  }, [nodes, seed]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.06;
    group.current.children.forEach((child, i) => {
      const node = nodes[i];
      if (!node) return;
      child.position.set(
        node.pos[0],
        node.pos[1] + Math.sin(t * 0.8 + node.phase) * 0.09,
        node.pos[2]
      );
    });
  });

  return (
    <group position={position}>
      <group ref={group}>
        {nodes.map((node, i) => (
          <mesh key={i} position={node.pos}>
            <icosahedronGeometry args={[node.size, 0]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.6}
              roughness={0.3}
              metalness={0.6}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {links.map((link, i) => (
        <Line
          key={i}
          points={link}
          color={PALETTE.aquaDeep}
          lineWidth={1}
          transparent
          opacity={0.25}
          toneMapped={false}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Floating wireframe KPI cubes — cheap geometry, big 3D payoff.
 * ------------------------------------------------------------------ */
export function WireCubes({ count = 5, spread = 5, seed = 9 }) {
  const group = useRef<THREE.Group>(null);

  const cubes = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      pos: [
        (rand() - 0.5) * spread,
        (rand() - 0.5) * spread * 0.75,
        (rand() - 0.5) * spread * 0.7,
      ] as [number, number, number],
      size: 0.16 + rand() * 0.3,
      rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI] as [number, number, number],
      speed: 0.1 + rand() * 0.3,
      color: rand() > 0.5 ? PALETTE.aqua : PALETTE.violet,
    }));
  }, [count, spread, seed]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const cube = cubes[i];
      if (!cube) return;
      child.rotation.x = cube.rot[0] + t * cube.speed * 0.6;
      child.rotation.y = cube.rot[1] + t * cube.speed;
      child.position.y = cube.pos[1] + Math.sin(t * 0.7 + i) * 0.14;
    });
  });

  return (
    <group ref={group}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={cube.pos} rotation={cube.rot}>
          <boxGeometry args={[cube.size, cube.size, cube.size]} />
          <meshBasicMaterial
            color={cube.color}
            wireframe
            transparent
            opacity={0.42}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
