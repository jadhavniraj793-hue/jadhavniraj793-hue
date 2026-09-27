import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { SceneCanvas } from './SceneCanvas';
import { Bars3D, Particles, StudioLights } from './elements';
import { useQuality } from '../../hooks/useQuality';

/** Stylised graduation cap built from primitives — light on geometry. */
function GraduationCap() {
  const group = useRef<THREE.Group>(null);
  const tassel = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.32;
    if (tassel.current) tassel.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.35;
  });

  return (
    <group ref={group} position={[0, 0.5, 0]}>
      {/* board */}
      <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0.35, 0]}>
        <boxGeometry args={[2.1, 0.08, 2.1]} />
        <meshStandardMaterial color="#0b1b3a" emissive="#22d3ee" emissiveIntensity={0.22} metalness={0.8} roughness={0.25} />
      </mesh>
      <lineSegments rotation={[0, Math.PI / 4, 0]} position={[0, 0.35, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(2.1, 0.08, 2.1)]} />
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.85} />
      </lineSegments>
      {/* crown */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.55, 24]} />
        <meshStandardMaterial color="#0a1024" emissive="#1d4ed8" emissiveIntensity={0.25} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* tassel */}
      <group position={[0.75, 0.4, 0.75]}>
        <mesh ref={tassel} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, -0.68, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      </group>
    </group>
  );
}

/** Education visual: a graduation cap floating above a small statistics chart. */
export default function EducationScene() {
  const quality = useQuality();
  return (
    <SceneCanvas cameraPosition={[0, 1.2, 6.5]} fov={44} eventsEnabled={false}>
      <StudioLights />
      <Float speed={quality.motion ? 1.2 : 0} floatIntensity={quality.motion ? 0.6 : 0} rotationIntensity={0.1}>
        <GraduationCap />
      </Float>
      <Bars3D count={quality.tier === 'low' ? 5 : 8} position={[0, -1.9, 0]} spacing={0.45} width={0.26} />
      <Particles count={Math.round(quality.particles * 0.3)} radius={7} speed={0.5} />
    </SceneCanvas>
  );
}
