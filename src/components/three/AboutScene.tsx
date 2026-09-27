import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Line } from '@react-three/drei';
import * as THREE from 'three';
import { SceneCanvas } from './SceneCanvas';
import { DataCubes, KpiRings, Particles, StudioLights } from './elements';
import { useQuality } from '../../hooks/useQuality';
import { usePointer } from '../../hooks/usePointer';

function OrbitRing({ radius, tilt, speed, color }: { radius: number; tilt: [number, number, number]; speed: number; color: string }) {
  const group = useRef<THREE.Group>(null);
  const dot = useRef<THREE.Mesh>(null);

  const points = Array.from({ length: 65 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (group.current) group.current.rotation.y = t * 0.3;
    if (dot.current) dot.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });

  return (
    <group ref={group} rotation={tilt}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.35} />
      <mesh ref={dot}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = usePointer();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.25;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, pointer.current.y * 0.3, 0.05);
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshStandardMaterial color="#0b1b3a" emissive="#1d4ed8" emissiveIntensity={0.35} roughness={0.2} metalness={0.9} />
      </mesh>
    </group>
  );
}

/** Orbiting analytics core shown beside the About profile card. */
export default function AboutScene() {
  const quality = useQuality();
  return (
    <SceneCanvas cameraPosition={[0, 1.4, 6.2]} fov={42} eventsEnabled={false}>
      <StudioLights />
      <Float speed={quality.motion ? 1.4 : 0} floatIntensity={quality.motion ? 0.5 : 0} rotationIntensity={0.15}>
        <Core />
        <KpiRings position={[0, 0, 0]} scale={1.45} />
      </Float>
      <OrbitRing radius={2.1} tilt={[0.5, 0, 0.2]} speed={0.6} color="#22d3ee" />
      <OrbitRing radius={2.7} tilt={[-0.4, 0.3, -0.25]} speed={0.42} color="#60a5fa" />
      <OrbitRing radius={3.2} tilt={[0.25, -0.2, 0.55]} speed={0.3} color="#a78bfa" />
      <DataCubes count={quality.tier === 'low' ? 3 : 5} spread={4.2} />
      <Particles count={Math.round(quality.particles * 0.35)} radius={8} speed={0.6} />
    </SceneCanvas>
  );
}
