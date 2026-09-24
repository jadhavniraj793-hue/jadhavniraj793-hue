'use client';

import { Sparkles, Stars } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { PALETTE, barData } from '@/lib/three-utils';
import { usePointer, scrollState } from '@/lib/hooks';
import { DataBars, DataGlobe, DataTicks } from './pieces/DataGlobe';
import { HoloLine, HoloPie, NodeCluster, WireCubes } from './pieces/HoloCharts';
import { Stage } from './Stage';

/**
 * Camera + world rig: everything eases toward the pointer (parallax) and
 * pulls back slightly as the visitor scrolls through the hero.
 */
function CosmosRig({ children, compact }: { children: ReactNode; compact: boolean }) {
  const world = useRef<THREE.Group>(null);
  const pointer = usePointer();
  const camera = useThree((state) => state.camera);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const group = world.current;
    if (!group) return;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, pointer.current.x * 0.24, 2.2, dt);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, -pointer.current.y * 0.18, 2.2, dt);
    // Push the globe to the right of the viewport on desktop so the hero copy
    // has a clean, dark stage to sit on. Centred on mobile.
    group.position.x = THREE.MathUtils.damp(group.position.x, compact ? 0 : 2.15, 2, dt);

    const baseZ = compact ? 12.4 : 9.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.current.x * 0.7, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.current.y * 0.45, 2, dt);
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      baseZ + scrollState.progress * (compact ? 4 : 3),
      2,
      dt
    );
    camera.lookAt(0, 0, 0);
  });

  return <group ref={world}>{children}</group>;
}

function Cosmos({ quality }: { quality: 'high' | 'medium' }) {
  const size = useThree((state) => state.size);
  const compact = size.width < 820;
  const high = quality === 'high';

  return (
    <CosmosRig compact={compact}>
      {/* ---------- Lighting ---------- */}
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color={PALETTE.white} />
      <pointLight position={[5, 3.5, 6]} intensity={70} distance={26} decay={2} color={PALETTE.aqua} />
      <pointLight
        position={[-6, -2.5, 4]}
        intensity={60}
        distance={26}
        decay={2}
        color={PALETTE.violet}
      />

      {/* ---------- Deep space backdrop ---------- */}
      <Stars radius={78} depth={46} count={high ? 1600 : 700} factor={3.6} saturation={0} fade speed={0.3} />
      <Sparkles
        count={high ? 220 : 110}
        scale={[20, 12, 12]}
        size={2.6}
        speed={0.24}
        opacity={0.5}
        color={PALETTE.aqua}
        noise={[0.6, 0.6, 0.6]}
      />
      <Sparkles
        count={high ? 120 : 60}
        scale={[16, 10, 10]}
        size={3.4}
        speed={0.16}
        opacity={0.35}
        color={PALETTE.violet}
      />

      {/* ---------- Core: the data globe ---------- */}
      <group scale={compact ? 0.82 : 1}>
        <DataGlobe quality={quality} detail={high ? 3 : 2} />
      </group>

      {/* ---------- The dashboard ring ---------- */}
      <group scale={compact ? 0.78 : 1}>
        <DataBars count={high ? 20 : 14} radius={3.35} data={barData} />
        {high && <DataTicks count={64} radius={3.98} />}
      </group>

      {/* ---------- Floating holographic reports ---------- */}
      <HoloPie
        position={compact ? [-2.15, 2.35, -1.6] : [-4.55, 1.75, -0.4]}
        scale={compact ? 0.6 : 1}
      />
      <HoloLine
        position={compact ? [2.05, -2.5, 1.2] : [4.55, -1.35, 0.6]}
        scale={compact ? 0.72 : 1.05}
      />
      <NodeCluster
        position={compact ? [-2.6, -1.9, 1.4] : [-3.3, -2.15, 1.1]}
        count={high ? 7 : 5}
        spread={compact ? 1.8 : 2.4}
      />
      <NodeCluster position={[3.7, 2.5, -2.6]} count={5} spread={2} seed={77} />
      <WireCubes count={high ? 6 : 3} spread={compact ? 8 : 11} />
    </CosmosRig>
  );
}

/** The hero's interactive 3D cosmos. */
export function HeroScene({
  quality,
  active = true,
}: {
  quality: 'high' | 'medium';
  active?: boolean;
}) {
  return (
    <Stage active={active} maxDpr={quality === 'high' ? 1.75 : 1.25} cameraPosition={[0, 0, 9.6]}>
      <Cosmos quality={quality} />
    </Stage>
  );
}
