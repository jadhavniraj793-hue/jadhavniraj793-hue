'use client';

import { Line, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import {
  PALETTE,
  arcBetween,
  curvePoints,
  fibonacciSphere,
  mulberry32,
} from '@/lib/three-utils';
import { Glow } from '../Glow';

/* ------------------------------------------------------------------ *
 * The rotating "data globe": a point-cloud world with flowing arcs.
 * ------------------------------------------------------------------ */

type DataGlobeProps = {
  /** Quality tier drives point counts. */
  quality?: 'high' | 'medium';
  detail?: number;
};

export function DataGlobe({ quality = 'high', detail = 3 }: DataGlobeProps) {
  const group = useRef<THREE.Group>(null);
  const packets = useRef<THREE.Group>(null);

  const radius = 1.62;
  const shellCount = quality === 'high' ? 1400 : 700;

  const shell = useMemo(() => fibonacciSphere(shellCount, radius), [shellCount]);
  const arcs = useMemo(() => {
    const rand = mulberry32(2024);
    // Deterministic endpoints on the sphere → identical composition for everyone.
    const surfacePoint = () => {
      const theta = rand() * Math.PI * 2;
      const z = rand() * 2 - 1;
      const r = Math.sqrt(Math.max(0, 1 - z * z));
      return new THREE.Vector3(Math.cos(theta) * r, z, Math.sin(theta) * r).multiplyScalar(
        radius * 1.01
      );
    };

    return Array.from({ length: 9 }, (_, i) => {
      const a = surfacePoint();
      let b = surfacePoint();
      let guard = 0;
      while (a.distanceTo(b) < radius * 0.55 && guard++ < 12) b = surfacePoint();
      // A few arcs intentionally exit the sphere for a "signal leaving orbit" feel.
      const reachesOut = i % 4 === 0;
      const curve = arcBetween(a, b, reachesOut ? 0.55 + rand() * 0.25 : 0.22 + rand() * 0.18);
      return {
        curve,
        points: curvePoints(curve, 30),
        speed: 0.16 + rand() * 0.22,
        offset: rand(),
      };
    });
  }, [radius]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (group.current) group.current.rotation.y += dt * 0.11;
    if (packets.current) {
      packets.current.rotation.copy(group.current!.rotation);
      packets.current.children.forEach((child, i) => {
        const arc = arcs[i];
        if (!arc) return;
        const t = (arc.offset + performance.now() * 0.00006 * arc.speed * 8) % 1;
        child.position.copy(arc.curve.getPointAt(Math.min(0.999, Math.max(0.001, t))));
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = 0.35 + Math.abs(Math.sin(t * Math.PI)) * 0.65;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Deep core: occludes the far side of the point shell for depth. */}
      <mesh>
        <sphereGeometry args={[radius * 0.74, 48, 48]} />
        <meshStandardMaterial
          color="#070c18"
          emissive="#063a4a"
          emissiveIntensity={0.55}
          roughness={0.35}
          metalness={0.85}
        />
      </mesh>

      {/* Wireframe lattice */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.82, detail]} />
        <meshBasicMaterial
          color={PALETTE.violet}
          wireframe
          transparent
          opacity={0.22}
          toneMapped={false}
        />
      </mesh>

      {quality === 'high' && (
        <mesh>
          <icosahedronGeometry args={[radius * 1.005, 1]} />
          <meshBasicMaterial
            color={PALETTE.aqua}
            wireframe
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Node cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shell, 3]} />
        </bufferGeometry>
        <PointMaterial
          transparent
          color={PALETTE.aqua}
          size={quality === 'high' ? 0.032 : 0.042}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Equatorial data rings */}
      {[
        [0, 0, 0],
        [Math.PI / 2.6, 0.4, 0],
        [Math.PI / 1.7, -0.6, 0.3],
      ].map((rotation, i) => (
        <mesh key={i} rotation={rotation as [number, number, number]}>
          <torusGeometry args={[radius * (1 + i * 0.045), 0.005, 8, 128]} />
          <meshBasicMaterial
            color={i === 1 ? PALETTE.violet : PALETTE.plasma}
            transparent
            opacity={0.4 - i * 0.06}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Traffic arcs */}
      {arcs.map((arc, i) => (
        <Line
          key={i}
          points={arc.points}
          color={i % 3 === 0 ? PALETTE.violet : PALETTE.aqua}
          lineWidth={1}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      ))}

      {/* Packets travelling along the arcs */}
      <group ref={packets}>
        {arcs.map((_, i) => (
          <mesh key={i} scale={0.045}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? PALETTE.violet : PALETTE.white}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Inner glow */}
      <Glow color={PALETTE.aquaDeep} size={radius * 7} opacity={0.16} />
      <Glow color={PALETTE.violetCore} size={radius * 4.4} opacity={0.2} />
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Instanced holographic bar-chart ring orbiting the globe.
 * ------------------------------------------------------------------ */

type DataBarsProps = {
  count?: number;
  radius?: number;
  data: number[];
};

export function DataBars({ count = 20, radius = 3.35, data }: DataBarsProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const heights = useRef<number[]>(Array.from({ length: count }, () => 0.4));

  const boxes = { w: 0.13, d: 0.13 } as const;
  const maxHeight = 1.5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const inst = mesh.current;
    if (!inst) return;

    for (let i = 0; i < count; i++) {
      const base = data[i % data.length];
      const wave = 0.55 + 0.45 * Math.sin(t * 0.9 + i * 0.55);
      const h = 0.22 + base * maxHeight * wave;

      const angle = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * radius, h / 2 - 0.85, Math.sin(angle) * radius);
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);

      // Cyan → violet gradient around the ring.
      const mix = i / count;
      color.setStyle(PALETTE.aqua).lerp(new THREE.Color(PALETTE.violet), mix);
      inst.setColorAt(i, color);

      heights.current[i] = h;
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    if (group.current) group.current.rotation.y -= 0.0012;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[boxes.w, 1, boxes.d]} />
        <meshStandardMaterial
          toneMapped={false}
          emissiveIntensity={1.5}
          emissive="#0b6f7a"
          metalness={0.6}
          roughness={0.25}
          transparent
          opacity={0.92}
        />
      </instancedMesh>

      {/* Dashboard plinth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]}>
        <ringGeometry args={[radius - 0.4, radius + 0.42, 128, 1]} />
        <meshBasicMaterial
          color={PALETTE.aquaDeep}
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.86, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={PALETTE.aqua} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[radius * 1.16, 0.0035, 8, 160]} />
        <meshBasicMaterial color={PALETTE.violet} transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Glowing tick marks around the plinth — reads as dashboard scale.
 * ------------------------------------------------------------------ */
export function DataTicks({ count = 60, radius = 3.95 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const inst = mesh.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.3);
      const h = 0.07 + pulse * 0.16;
      dummy.position.set(Math.cos(angle) * radius, -0.86 + h / 2, Math.sin(angle) * radius);
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.set(1, h * 12, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.02, 0.02, 0.02]} />
      <meshBasicMaterial color={PALETTE.aqua} transparent opacity={0.55} toneMapped={false} />
    </instancedMesh>
  );
}
