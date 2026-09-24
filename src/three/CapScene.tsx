import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

/** Animated graduation cap built from primitives — lightweight and stylised. */
export function CapScene() {
  const board = useRef<THREE.Group>(null);
  const tassel = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, d) => {
    const t = clock.elapsedTime;
    if (board.current) {
      board.current.rotation.y += d * 0.35;
      board.current.position.y = Math.sin(t * 1.2) * 0.06;
    }
    if (tassel.current) {
      tassel.current.rotation.x = Math.sin(t * 1.6) * 0.35;
      tassel.current.rotation.z = Math.cos(t * 1.3) * 0.3;
    }
    if (ring1.current) ring1.current.rotation.z += d * 0.4;
    if (ring2.current) ring2.current.rotation.z -= d * 0.28;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.8}>
      <group position={[0, -0.15, 0]}>
        {/* cap base */}
        <mesh position={[0, -0.42, 0]}>
          <cylinderGeometry args={[0.52, 0.66, 0.52, 32]} />
          <meshStandardMaterial color="#141d38" metalness={0.35} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <torusGeometry args={[0.53, 0.028, 12, 40]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.85} toneMapped={false} />
        </mesh>

        {/* mortarboard */}
        <group ref={board}>
          <mesh position={[0, 0.12, 0]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[1.7, 0.07, 1.7]} />
            <meshStandardMaterial color="#1b2547" metalness={0.45} roughness={0.3} />
          </mesh>
          {/* board edge glow */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0.4, 0]}>
            <boxGeometry args={[1.74, 0.02, 1.74]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} toneMapped={false} />
          </mesh>
          {/* button + tassel */}
          <mesh position={[0, 0.19, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#fbbf24" toneMapped={false} />
          </mesh>
          <group ref={tassel} position={[0, 0.16, 0]}>
            <mesh position={[0.42, -0.12, 0.28]} rotation={[0, 0, -0.9]}>
              <cylinderGeometry args={[0.012, 0.012, 0.75, 8]} />
              <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} toneMapped={false} />
            </mesh>
            <mesh position={[0.62, -0.52, 0.42]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.55} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* orbit rings */}
        <mesh ref={ring1} rotation={[Math.PI / 2.15, 0, 0]}>
          <torusGeometry args={[1.25, 0.008, 8, 80]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} toneMapped={false} />
        </mesh>
        <mesh ref={ring2} rotation={[Math.PI / 1.8, 0.5, 0]}>
          <torusGeometry args={[1.45, 0.006, 8, 80]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} toneMapped={false} />
        </mesh>

        {/* floating sparkle dots */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.cos(i * 2.2) * 1.6, Math.sin(i * 1.7) * 0.9, Math.sin(i * 2.2) * 1.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={i % 2 ? '#a78bfa' : '#67e8f9'} transparent opacity={0.8} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function CapLights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <pointLight position={[-4, 2, 3]} intensity={18} distance={14} decay={2} color="#8b5cf6" />
      <pointLight position={[4, -1, 3]} intensity={14} distance={14} decay={2} color="#fbbf24" />
    </>
  );
}
