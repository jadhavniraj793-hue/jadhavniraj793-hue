import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff?url';
import { seeded } from '../../data/analytics';

export const FONT_URL = monoFont;

const CYAN = '#22d3ee';
const BLUE = '#3b82f6';
const VIOLET = '#a78bfa';

/* ── Particle field ──────────────────────────────────────── */

export function Particles({ count = 800, radius = 14, speed = 1 }: { count?: number; radius?: number; speed?: number }) {
  const points = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const rng = seeded(`particles:${count}`);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(rng());
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = 0.02 + rng() * 0.05;
    }
    return { positions, sizes };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.022 * speed;
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18 * speed;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        color={CYAN}
        transparent
        opacity={0.62}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Grid floor ──────────────────────────────────────────── */

export function GridFloor({ y = -3.2, size = 34, divisions = 34 }: { y?: number; size?: number; divisions?: number }) {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(size, divisions, new THREE.Color(CYAN), new THREE.Color('#1e3a8a'));
    const material = g.material as THREE.Material & { opacity: number; transparent: boolean; depthWrite: boolean };
    material.transparent = true;
    material.opacity = 0.22;
    material.depthWrite = false;
    return g;
  }, [size, divisions]);

  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = ((state.clock.elapsedTime * 0.45) % 2) - 1;
  });

  return (
    <group position={[0, y, 0]}>
      <group ref={ref}>
        <primitive object={grid} />
      </group>
    </group>
  );
}

/* ── Animated 3D bar chart ───────────────────────────────── */

export function Bars3D({
  count = 10,
  position = [0, 0, 0],
  spacing = 0.52,
  width = 0.3,
}: {
  count?: number;
  position?: [number, number, number];
  spacing?: number;
  width?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Mesh[]>([]);

  const heights = useMemo(() => {
    const rng = seeded(`bars:${count}`);
    return Array.from({ length: count }, (_, i) => 0.5 + rng() * 1.9 + i * 0.06);
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    bars.current.forEach((bar, i) => {
      if (!bar) return;
      const target = heights[i] * (0.82 + 0.22 * Math.sin(t * 0.9 + i * 0.55));
      bar.scale.y = THREE.MathUtils.lerp(bar.scale.y, target, 0.06);
      bar.position.y = bar.scale.y / 2;
    });
    if (group.current) group.current.rotation.y = Math.sin(t * 0.18) * 0.22;
  });

  return (
    <group ref={group} position={position}>
      {heights.map((h, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) bars.current[i] = el;
          }}
          position={[(i - (count - 1) / 2) * spacing, h / 2, 0]}
          scale={[1, h, 1]}
          castShadow={false}
        >
          <boxGeometry args={[width, 1, width]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? CYAN : i % 3 === 1 ? BLUE : VIOLET}
            emissive={i % 3 === 0 ? CYAN : i % 3 === 1 ? BLUE : VIOLET}
            emissiveIntensity={0.55}
            roughness={0.25}
            metalness={0.55}
            transparent
            opacity={0.92}
          />
        </mesh>
      ))}
      {/* reflective base plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[count * spacing + 0.6, 1.6]} />
        <meshBasicMaterial color={'#0b1b3a'} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/* ── Animated 3D line graph ──────────────────────────────── */

/** Minimal structural type for drei's fat line (Line2 from three-stdlib). */
type FatLine = { geometry: { setPositions: (array: ArrayLike<number>) => void } };

export function LineGraph3D({ position = [0, 0, 0], points = 26 }: { position?: [number, number, number]; points?: number }) {
  const group = useRef<THREE.Group>(null);
  const lineRef = useRef<FatLine | null>(null);
  const marker = useRef<THREE.Mesh>(null);

  const base = useMemo(() => {
    const rng = seeded(`line:${points}`);
    return Array.from({ length: points }, (_, i) => {
      const x = (i / (points - 1)) * 5 - 2.5;
      const y = Math.sin(i * 0.42) * 0.5 + rng() * 0.28 + i * 0.045 - 0.6;
      return new THREE.Vector3(x, y, 0);
    });
  }, [points]);

  // Reused flat buffer — fat lines are rebuilt through setPositions each frame.
  const buffer = useMemo(() => new Float32Array(points * 3), [points]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lineRef.current) {
      for (let i = 0; i < base.length; i++) {
        buffer[i * 3] = base[i].x;
        buffer[i * 3 + 1] = base[i].y + Math.sin(t * 1.1 + i * 0.35) * 0.09;
        buffer[i * 3 + 2] = 0;
      }
      lineRef.current.geometry.setPositions(buffer);
    }
    if (marker.current) {
      const idx = Math.floor(((Math.sin(t * 0.35) + 1) / 2) * (base.length - 1));
      marker.current.position.set(base[idx].x, base[idx].y + Math.sin(t * 1.1 + idx * 0.35) * 0.09, 0);
      const s = 1 + Math.sin(t * 4) * 0.12;
      marker.current.scale.setScalar(s);
    }
    if (group.current) group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
  });

  return (
    <group ref={group} position={position}>
      <Line
        ref={lineRef as never}
        points={base}
        color={CYAN}
        lineWidth={2.4}
        transparent
        opacity={0.95}
        dashed={false}
      />
      {base.filter((_, i) => i % 4 === 0).map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color={'#a5f3fc'} />
        </mesh>
      ))}
      <mesh ref={marker}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshBasicMaterial color={'#ffffff'} />
      </mesh>
    </group>
  );
}

/* ── KPI rings ───────────────────────────────────────────── */

export function KpiRings({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  const g3 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (g1.current) g1.current.rotation.z += delta * 0.5;
    if (g2.current) g2.current.rotation.z -= delta * 0.34;
    if (g3.current) {
      g3.current.rotation.z += delta * 0.22;
      g3.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={g1}>
        <ringGeometry args={[0.95, 1.02, 64, 1, 0, Math.PI * 1.45]} />
        <meshBasicMaterial color={CYAN} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <mesh ref={g2}>
        <ringGeometry args={[1.18, 1.23, 64, 1, 0, Math.PI * 1.05]} />
        <meshBasicMaterial color={BLUE} side={THREE.DoubleSide} transparent opacity={0.75} />
      </mesh>
      <mesh ref={g3}>
        <ringGeometry args={[1.42, 1.45, 64, 1, 0, Math.PI * 0.75]} />
        <meshBasicMaterial color={VIOLET} side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.9, 48]} />
        <meshBasicMaterial color={'#0a1024'} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/* ── Rotating data cubes ─────────────────────────────────── */

type CubeSpec = { pos: [number, number, number]; size: number; speed: number; color: string };

export function DataCubes({ count = 7, spread = 6 }: { count?: number; spread?: number }) {
  const specs = useMemo<CubeSpec[]>(() => {
    const rng = seeded(`cubes:${count}:${spread}`);
    const colors = [CYAN, BLUE, VIOLET];
    return Array.from({ length: count }, () => ({
      pos: [(rng() - 0.5) * spread * 2, (rng() - 0.5) * spread, (rng() - 0.5) * spread - 1],
      size: 0.22 + rng() * 0.4,
      speed: 0.25 + rng() * 0.6,
      color: colors[Math.floor(rng() * colors.length)],
    }));
  }, [count, spread]);

  return (
    <group>
      {specs.map((c, i) => (
        <Cube key={i} spec={c} index={i} />
      ))}
    </group>
  );
}

function Cube({ spec, index }: { spec: CubeSpec; index: number }) {
  const mesh = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * spec.speed * 0.5;
    mesh.current.rotation.y += delta * spec.speed * 0.7;
    mesh.current.position.y = spec.pos[1] + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.28;
  });

  return (
    <group ref={mesh} position={spec.pos}>
      <mesh>
        <boxGeometry args={[spec.size, spec.size, spec.size]} />
        <meshStandardMaterial
          color={spec.color}
          emissive={spec.color}
          emissiveIntensity={0.35}
          transparent
          opacity={0.16}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(spec.size, spec.size, spec.size)]} />
        <lineBasicMaterial color={spec.color} transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

/* ── Node network ────────────────────────────────────────── */

export function NodeNetwork({ count = 16, radius = 3.1 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);

  const { nodes, edges } = useMemo(() => {
    const rng = seeded(`nodes:${count}:${radius}`);
    const nodes: THREE.Vector3[] = Array.from({ length: count }, () => {
      const theta = rng() * Math.PI * 2;
      const phi = Math.acos(2 * rng() - 1);
      const r = radius * (0.72 + rng() * 0.28);
      return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.65,
        r * Math.sin(phi) * Math.sin(theta),
      );
    });
    const edges: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < radius * 0.78) edges.push([nodes[i], nodes[j]]);
      }
    }
    return { nodes, edges: edges.slice(0, count * 2) };
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.055;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.12;
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={i % 4 === 0 ? '#ffffff' : CYAN} />
        </mesh>
      ))}
      {edges.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color={BLUE} lineWidth={1} transparent opacity={0.22} />
      ))}
    </group>
  );
}

/* ── Floating numeric readouts ───────────────────────────── */

const READOUTS = ['98.4%', '+12.4%', '4.82M', 'R²0.87', '₹740', 'p<0.05', '26.4%', 'σ 1.4'];

export function FloatingNumbers({ count = 6, spread = 5.4 }: { count?: number; spread?: number }) {
  const items = useMemo(() => {
    const rng = seeded(`numbers:${count}`);
    return Array.from({ length: count }, (_, i) => ({
      text: READOUTS[i % READOUTS.length],
      pos: [(rng() - 0.5) * spread * 2.1, (rng() - 0.5) * spread * 0.9, (rng() - 0.5) * 3 - 0.5] as [number, number, number],
      speed: 0.3 + rng() * 0.5,
      size: 0.16 + rng() * 0.1,
    }));
  }, [count, spread]);

  return (
    <group>
      {items.map((item, i) => (
        <FloatingNumber key={i} {...item} index={i} />
      ))}
    </group>
  );
}

function FloatingNumber({
  text,
  pos,
  speed,
  size,
  index,
}: {
  text: string;
  pos: [number, number, number];
  speed: number;
  size: number;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = pos[1] + Math.sin(t * speed + index) * 0.32;
    ref.current.lookAt(state.camera.position);
  });

  return (
    <group ref={ref} position={pos}>
      <Text font={FONT_URL} fontSize={size} color="#7dd3fc" anchorX="center" anchorY="middle" fillOpacity={0.75}>
        {text}
      </Text>
    </group>
  );
}

/* ── Scene lighting preset ───────────────────────────────── */

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#dbeafe" />
      <pointLight position={[-6, -2, -4]} intensity={45} color={VIOLET} distance={22} decay={2} />
      <pointLight position={[6, 3, 3]} intensity={38} color={CYAN} distance={20} decay={2} />
    </>
  );
}
