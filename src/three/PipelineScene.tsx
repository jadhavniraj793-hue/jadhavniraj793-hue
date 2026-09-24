import { Float, Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { pipelineStages } from '../data/content';

function Node({
  position,
  color,
  name,
  isFinal,
}: {
  position: [number, number, number];
  color: string;
  name: string;
  isFinal: boolean;
}) {
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, d) => {
    const t = clock.elapsedTime;
    core.current?.scale.setScalar(1 + 0.16 * Math.sin(t * 2.1 + position[0]));
    if (ring.current) ring.current.rotation.z += d * (isFinal ? 0.9 : 0.25);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.7}>
      <group position={position} scale={isFinal ? 1.22 : 1}>
        <RoundedBox args={[0.92, 0.92, 0.92]} radius={0.22} smoothness={4}>
          <meshPhysicalMaterial
            color="#0e1730"
            transparent
            opacity={0.62}
            roughness={0.18}
            metalness={0.25}
            clearcoat={0.7}
            emissive={color}
            emissiveIntensity={0.06}
          />
        </RoundedBox>
        <mesh ref={core}>
          <icosahedronGeometry args={[0.21, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.95} toneMapped={false} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0.3, 0]}>
          <torusGeometry args={[0.74, 0.014, 10, 60]} />
          <meshBasicMaterial color={color} transparent opacity={isFinal ? 0.65 : 0.3} toneMapped={false} />
        </mesh>
        {isFinal && (
          <mesh rotation={[Math.PI / 1.7, -0.4, 0.4]}>
            <torusGeometry args={[0.92, 0.008, 8, 60]} />
            <meshBasicMaterial color="#e0f2fe" transparent opacity={0.4} toneMapped={false} />
          </mesh>
        )}
        <Html position={[0, -0.92, 0]} center distanceFactor={9} zIndexRange={[8, 0]} className="pointer-events-none select-none">
          <div
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{
              borderColor: `${color}55`,
              background: 'rgba(7, 11, 22, 0.85)',
              color,
              boxShadow: `0 0 18px ${color}33`,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
            {name}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function SegmentParticles({
  from,
  to,
  colorA,
  colorB,
  count,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  colorA: string;
  colorB: string;
  count: number;
}) {
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y += 0.62;
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);

  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);
  const color = useMemo(() => new THREE.Color(colorA).lerp(new THREE.Color(colorB), 0.5), [colorA, colorB]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const p = (t * 0.16 + offsets[i]) % 1;
      const pos = curve.getPoint(p);
      m.position.copy(pos);
      const s = 0.6 + 0.5 * Math.sin(p * Math.PI);
      m.scale.setScalar(s);
    });
  });

  return (
    <>
      {offsets.map((_, i) => (
        <mesh key={i} ref={(el) => (meshes.current[i] = el)}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={0.95} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Dust({ count = 70 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color('#67e8f9'), new THREE.Color('#a78bfa'), new THREE.Color('#60a5fa')];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function PipelineScene({ mobile }: { mobile: boolean }) {
  const scale = mobile ? 0.6 : 1;
  const xs = useMemo(
    () => pipelineStages.map((_, i) => (-5.6 + (i * 11.2) / (pipelineStages.length - 1)) * scale),
    [scale],
  );
  const ys = useMemo(() => pipelineStages.map((_, i) => Math.sin(i * 1.05) * 0.52), []);

  const vectors = useMemo(
    () => pipelineStages.map((_, i) => new THREE.Vector3(xs[i], ys[i], 0)),
    [xs, ys],
  );

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 6]} intensity={1.4} />
      <pointLight position={[-6, 2, 4]} intensity={22} distance={18} decay={2} color="#8b5cf6" />
      <pointLight position={[6, -2, 4]} intensity={20} distance={18} decay={2} color="#22d3ee" />
      <Dust count={mobile ? 36 : 80} />

      {/* connection tubes */}
      {vectors.slice(0, -1).map((v, i) => {
        const mid = v.clone().add(vectors[i + 1]).multiplyScalar(0.5);
        mid.y += 0.62;
        const curve = new THREE.QuadraticBezierCurve3(v, mid, vectors[i + 1]);
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, 40, 0.014, 6, false]} />
            <meshBasicMaterial
              color={new THREE.Color(pipelineStages[i].color).lerp(new THREE.Color(pipelineStages[i + 1].color), 0.5)}
              transparent
              opacity={0.35}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* travelling data particles */}
      {vectors.slice(0, -1).map((v, i) => (
        <SegmentParticles
          key={i}
          from={v}
          to={vectors[i + 1]}
          colorA={pipelineStages[i].color}
          colorB={pipelineStages[i + 1].color}
          count={mobile ? 3 : 6}
        />
      ))}

      {/* stage nodes */}
      {pipelineStages.map((s, i) => (
        <Node key={s.name} position={[xs[i], ys[i], 0]} color={s.color} name={s.name} isFinal={i === pipelineStages.length - 1} />
      ))}
    </>
  );
}

export function PipelineLights() {
  return null;
}
