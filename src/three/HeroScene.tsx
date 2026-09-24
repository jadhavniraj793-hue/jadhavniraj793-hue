import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

const damp = THREE.MathUtils.damp;

/* ------------------------------ canvas textures ----------------------------- */

function makeTextTexture(text: string, color: string): THREE.CanvasTexture {
  const pad = 30;
  const font = '600 46px "Space Grotesk", Inter, system-ui, sans-serif';
  const probe = document.createElement('canvas').getContext('2d')!;
  probe.font = font;
  const w = Math.ceil(probe.measureText(text).width) + pad * 2;
  const h = 92;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;
  ctx.fillStyle = color;
  ctx.fillText(text, pad, h / 2);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.95;
  ctx.fillText(text, pad, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/** Excel-style spreadsheet sheet texture. */
function makeSheetTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 400;
  const x = c.getContext('2d')!;
  x.fillStyle = '#0a1322';
  x.fillRect(0, 0, 512, 400);

  // formula bar
  x.fillStyle = '#0e1a30';
  x.fillRect(0, 0, 512, 46);
  x.fillStyle = '#22c55e';
  x.font = '600 italic 21px Inter, sans-serif';
  x.fillText('fx', 16, 30);
  x.fillStyle = '#7dd3fc';
  x.font = '500 19px "JetBrains Mono", monospace';
  x.fillText('=SUM(B2:B12)', 52, 30);

  const left = 38;
  const colW = (512 - left) / 5;
  const top = 46;
  const rowH = (400 - top) / 8;

  // column headers
  const cols = ['A', 'B', 'C', 'D', 'E'];
  x.font = '600 17px Inter, sans-serif';
  cols.forEach((col, i) => {
    x.fillStyle = '#14532d';
    x.fillRect(left + i * colW, top, colW - 1, rowH - 1);
    x.fillStyle = '#86efac';
    x.textAlign = 'center';
    x.fillText(col, left + i * colW + colW / 2, top + rowH / 2 + 6);
  });
  x.textAlign = 'left';

  // row numbers + grid
  for (let r = 0; r < 7; r++) {
    x.fillStyle = '#101d33';
    x.fillRect(0, top + (r + 1) * rowH, left - 1, rowH - 1);
    x.fillStyle = '#64748b';
    x.font = '500 15px Inter, sans-serif';
    x.textAlign = 'center';
    x.fillText(String(r + 1), left / 2, top + (r + 1) * rowH + rowH / 2 + 5);
    x.textAlign = 'left';
  }
  x.strokeStyle = 'rgba(148,163,184,0.16)';
  x.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    x.beginPath();
    x.moveTo(left + i * colW, top);
    x.lineTo(left + i * colW, 400);
    x.stroke();
  }
  for (let r = 0; r <= 8; r++) {
    x.beginPath();
    x.moveTo(0, top + r * rowH);
    x.lineTo(512, top + r * rowH);
    x.stroke();
  }

  // highlighted cells + mini chart in col E
  const hl: [number, number, string][] = [
    [1, 1, 'rgba(34,211,238,0.20)'],
    [2, 2, 'rgba(139,92,246,0.22)'],
    [3, 1, 'rgba(34,211,238,0.14)'],
    [4, 3, 'rgba(139,92,246,0.16)'],
  ];
  hl.forEach(([col, row, color]) => {
    x.fillStyle = color;
    x.fillRect(left + col * colW + 1, top + row * rowH + 1, colW - 3, rowH - 3);
  });
  const bars = [0.5, 0.8, 0.42, 0.95, 0.65];
  bars.forEach((b, i) => {
    x.fillStyle = i % 2 ? '#22d3ee' : '#a78bfa';
    const bw = 12;
    const bh = b * (rowH * 0.62);
    x.fillRect(left + 4 * colW + 14 + i * 16, top + 5 * rowH - bh + 10, bw, bh);
  });

  // selection border
  x.strokeStyle = '#22d3ee';
  x.lineWidth = 2;
  x.strokeRect(left + colW + 1, top + rowH + 1, colW * 2 - 3, rowH * 2 - 3);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/** Power-BI-style dashboard card texture. */
function makeDashboardTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 350;
  const x = c.getContext('2d')!;
  const r = 26;
  x.beginPath();
  x.moveTo(r, 0);
  x.arcTo(512, 0, 512, 350, r);
  x.arcTo(512, 350, 0, 350, r);
  x.arcTo(0, 350, 0, 0, r);
  x.arcTo(0, 0, 512, 0, r);
  x.closePath();
  x.fillStyle = '#0a1020';
  x.fill();
  x.strokeStyle = 'rgba(148,163,184,0.25)';
  x.lineWidth = 2;
  x.stroke();

  // title dots
  ['#f87171', '#fbbf24', '#34d399'].forEach((col, i) => {
    x.fillStyle = col;
    x.beginPath();
    x.arc(28 + i * 24, 28, 6, 0, Math.PI * 2);
    x.fill();
  });
  x.fillStyle = '#cbd5e1';
  x.font = '600 16px Inter, sans-serif';
  x.fillText('S A L E S   O V E R V I E W', 110, 34);

  // KPI chips
  x.fillStyle = 'rgba(34,211,238,0.12)';
  x.fillRect(24, 56, 150, 44);
  x.fillStyle = 'rgba(167,139,250,0.14)';
  x.fillRect(186, 56, 150, 44);
  x.fillStyle = '#67e8f9';
  x.font = '700 22px "Space Grotesk", Inter, sans-serif';
  x.fillText('▲ KPI', 40, 85);
  x.fillStyle = '#c4b5fd';
  x.fillText('∑ TOTAL', 202, 85);

  // bar chart
  const bars = [0.45, 0.75, 0.55, 0.95, 0.62, 0.82];
  bars.forEach((b, i) => {
    const bh = b * 130;
    x.shadowColor = i % 2 ? '#22d3ee' : '#8b5cf6';
    x.shadowBlur = 14;
    x.fillStyle = i % 2 ? '#22d3ee' : '#8b5cf6';
    x.fillRect(40 + i * 44, 268 - bh, 24, bh);
    x.shadowBlur = 0;
  });
  ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'].forEach((q, i) => {
    x.fillStyle = '#64748b';
    x.font = '500 13px Inter, sans-serif';
    x.fillText(q, 44 + i * 44, 288);
  });

  // donut
  const cx = 400;
  const cy = 170;
  const rr = 52;
  x.lineWidth = 16;
  x.strokeStyle = '#1e293b';
  x.beginPath();
  x.arc(cx, cy, rr, 0, Math.PI * 2);
  x.stroke();
  const arcs: [number, string][] = [
    [2.1, '#8b5cf6'],
    [1.4, '#22d3ee'],
    [0.9, '#38bdf8'],
  ];
  let start = -Math.PI / 2;
  arcs.forEach(([a, col]) => {
    x.strokeStyle = col;
    x.beginPath();
    x.arc(cx, cy, rr, start, start + a);
    x.stroke();
    start += a + 0.18;
  });

  // sparkline
  x.strokeStyle = '#a78bfa';
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(330, 300);
  x.lineTo(360, 280);
  x.lineTo(390, 292);
  x.lineTo(420, 258);
  x.lineTo(450, 268);
  x.lineTo(486, 236);
  x.stroke();
  x.fillStyle = '#e0f2fe';
  x.beginPath();
  x.arc(486, 236, 5, 0, Math.PI * 2);
  x.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/* --------------------------------- elements --------------------------------- */

function TextSprite({
  text,
  position,
  color = '#8be9ff',
  size = 0.5,
  opacity = 0.85,
}: {
  text: string;
  position: [number, number, number];
  color?: string;
  size?: number;
  opacity?: number;
}) {
  const tex = useMemo(() => makeTextTexture(text, color), [text, color]);
  const aspect = (tex.image as HTMLCanvasElement).width / (tex.image as HTMLCanvasElement).height;
  return (
    <Float speed={1.7} rotationIntensity={0.12} floatIntensity={0.9}>
      <sprite position={position} scale={[size * aspect, size, 1]}>
        <spriteMaterial map={tex} transparent depthWrite={false} opacity={opacity} toneMapped={false} />
      </sprite>
    </Float>
  );
}

function BarChart({ position }: { position: [number, number, number] }) {
  const heights = [0.9, 1.5, 1.1, 2.0, 1.4, 2.35, 1.8];
  const colors = ['#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9'];
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const h = heights[i] * (0.92 + 0.08 * Math.sin(t * 1.5 + i * 0.9));
      mesh.scale.y = h;
      mesh.position.y = h / 2;
    });
  });

  return (
    <group position={position}>
      <RoundedBox args={[4.7, 0.12, 1.2]} radius={0.05} smoothness={3} position={[0, -0.07, 0]}>
        <meshStandardMaterial color="#111a33" metalness={0.5} roughness={0.35} transparent opacity={0.85} />
      </RoundedBox>
      <group ref={group}>
        {heights.map((h, i) => (
          <RoundedBox
            key={i}
            args={[0.42, 1, 0.42]}
            radius={0.07}
            smoothness={3}
            position={[i * 0.62 - 1.86, h / 2, 0]}
          >
            <meshStandardMaterial
              color={colors[i]}
              emissive={colors[i]}
              emissiveIntensity={0.4}
              metalness={0.35}
              roughness={0.25}
              transparent
              opacity={0.94}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

function Donut({ position }: { position: [number, number, number] }) {
  const arcs = [
    { f: 0.48, c: '#8b5cf6' },
    { f: 0.3, c: '#22d3ee' },
    { f: 0.22, c: '#38bdf8' },
  ];
  const gap = 0.32;
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.z += d * 0.16;
  });

  let angle = 0;
  const meshes = arcs.map((a, i) => {
    const arcLen = a.f * Math.PI * 2 - gap;
    const start = angle + gap / 2;
    angle += a.f * Math.PI * 2;
    return (
      <mesh key={i} rotation={[0, 0, start]}>
        <torusGeometry args={[0.78, 0.15, 18, 60, arcLen]} />
        <meshStandardMaterial color={a.c} emissive={a.c} emissiveIntensity={0.5} metalness={0.3} roughness={0.3} />
      </mesh>
    );
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.8}>
      <group position={position} rotation={[-0.42, 0.16, 0]} ref={group}>
        {meshes}
      </group>
    </Float>
  );
}

function TrendLine({ position, color = '#67e8f9' }: { position: [number, number, number]; color?: string }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.7, -0.35, 0),
        new THREE.Vector3(-1.05, 0.05, 0),
        new THREE.Vector3(-0.45, -0.45, 0),
        new THREE.Vector3(0.25, 0.15, 0),
        new THREE.Vector3(0.95, -0.05, 0),
        new THREE.Vector3(1.7, 0.65, 0),
      ]),
    [],
  );
  const dot = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.09) % 1;
    dot.current?.position.copy(curve.getPointAt(t));
  });

  return (
    <group position={position}>
      <mesh>
        <tubeGeometry args={[curve, 72, 0.03, 8, false]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.52, 0]}>
        <tubeGeometry args={[curve, 72, 0.016, 6, false]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh ref={dot}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
      </mesh>
    </group>
  );
}

function DatabaseCylinders({ position }: { position: [number, number, number] }) {
  const rows = [0, 0.62];
  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.9}>
      <group position={position} rotation={[0.12, -0.35, 0]}>
        {rows.map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <cylinderGeometry args={[0.52, 0.52, 0.44, 40]} />
              <meshPhysicalMaterial
                color="#6d28d9"
                transparent
                opacity={0.3}
                roughness={0.15}
                metalness={0.15}
                clearcoat={0.6}
              />
            </mesh>
            {[-0.22, 0.22].map((oy, j) => (
              <mesh key={j} position={[0, oy, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.52, 0.02, 10, 48]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.75} toneMapped={false} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </Float>
  );
}

function DashboardCard({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const tex = useMemo(() => makeDashboardTexture(), []);
  return (
    <Float speed={1.3} rotationIntensity={0.22} floatIntensity={0.85}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[2.06, 1.44, 0.05]} radius={0.06} smoothness={3} position={[0, 0, -0.04]}>
          <meshStandardMaterial color="#0b1120" metalness={0.4} roughness={0.4} transparent opacity={0.9} />
        </RoundedBox>
        <mesh>
          <planeGeometry args={[1.9, 1.3]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function SpreadsheetCard({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const tex = useMemo(() => makeSheetTexture(), []);
  return (
    <Float speed={1.5} rotationIntensity={0.22} floatIntensity={0.85}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[1.86, 1.5, 0.05]} radius={0.06} smoothness={3} position={[0, 0, -0.04]}>
          <meshStandardMaterial color="#0b1120" metalness={0.4} roughness={0.4} transparent opacity={0.9} />
        </RoundedBox>
        <mesh>
          <planeGeometry args={[1.72, 1.35]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function NodeWeb({ position }: { position: [number, number, number] }) {
  const nodes: [number, number, number][] = [
    [-1.15, 0.62, 0],
    [0, 1.0, 0],
    [1.18, 0.58, 0],
    [1.65, -0.38, 0],
    [0.4, -0.8, 0],
    [-1.4, -0.52, 0],
    [-0.1, 0.02, 0.15],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 6],
    [1, 6],
    [2, 6],
    [4, 6],
  ];
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr: number[] = [];
    edges.forEach(([a, b]) => arr.push(...nodes[a], ...nodes[b]));
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, []);
  const group = useRef<THREE.Group>(null);
  const lines = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((c, i) => {
      const s = 1 + 0.28 * Math.sin(t * 2 + i * 1.35);
      c.scale.setScalar(s);
    });
    const m = lines.current?.material as THREE.LineBasicMaterial | undefined;
    if (m) m.opacity = 0.2 + 0.12 * (1 + Math.sin(t * 1.4));
  });

  return (
    <group position={position}>
      <lineSegments ref={lines} geometry={lineGeo}>
        <lineBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.26}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <group ref={group}>
        {nodes.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.062, 14, 14]} />
            <meshBasicMaterial color={i % 2 ? '#22d3ee' : '#a78bfa'} transparent opacity={0.95} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Dust({ count = 190 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color('#67e8f9'), new THREE.Color('#a78bfa'), new THREE.Color('#60a5fa'), new THREE.Color('#e2e8f0')];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.018;
    ref.current.position.y = Math.sin(performance.now() * 0.0002) * 0.18;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Whole scene parallax: follows the pointer with smoothed damping. */
function Parallax({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ pointer }, d) => {
    const g = ref.current;
    if (!g) return;
    const dt = Math.min(d, 0.05);
    g.rotation.y = damp(g.rotation.y, pointer.x * 0.16, 2.6, dt);
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.1, 2.6, dt);
    g.position.x = damp(g.position.x, pointer.x * 0.28, 2.2, dt);
    g.position.y = damp(g.position.y, -pointer.y * 0.16, 2.2, dt);
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------------------------------- scene ----------------------------------- */

export function HeroScene({ mobile }: { mobile: boolean }) {
  const codeLabels: { text: string; p: [number, number, number]; c: string; s: number }[] = mobile
    ? [
        { text: 'SELECT *', p: [-2.9, 2.5, -1], c: '#89e6ff', s: 0.4 },
        { text: 'pd.read_csv()', p: [2.9, 2.4, -1.1], c: '#c4b5fd', s: 0.38 },
        { text: 'GROUP BY', p: [-3.2, -1.9, -0.9], c: '#93c5fd', s: 0.36 },
        { text: 'JOIN', p: [3.2, -1.8, -0.9], c: '#89e6ff', s: 0.4 },
        { text: '∑', p: [-1.6, -2.5, 0], c: '#a5f3fc', s: 0.46 },
        { text: 'Δ', p: [1.7, -2.5, 0], c: '#c4b5fd', s: 0.44 },
      ]
    : [
        { text: 'SELECT *', p: [-4.4, 2.7, -1], c: '#89e6ff', s: 0.46 },
        { text: 'pd.read_csv()', p: [4.3, 2.6, -1.1], c: '#c4b5fd', s: 0.44 },
        { text: 'GROUP BY', p: [-4.9, -1.9, -0.9], c: '#93c5fd', s: 0.4 },
        { text: 'JOIN', p: [4.7, -2.0, -0.9], c: '#89e6ff', s: 0.44 },
        { text: '=PIVOT()', p: [-2.6, 3.2, -0.5], c: '#86efac', s: 0.36 },
        { text: 'plt.show()', p: [2.8, 3.3, -0.6], c: '#93c5fd', s: 0.36 },
        { text: '∑', p: [-2.0, -2.7, 0], c: '#a5f3fc', s: 0.52 },
        { text: 'Δ', p: [2.1, -2.8, 0], c: '#c4b5fd', s: 0.5 },
        { text: '{ }', p: [-5.3, 0.6, -0.7], c: '#a5b4fc', s: 0.46 },
        { text: 'π', p: [5.4, -0.6, -0.9], c: '#a5f3fc', s: 0.48 },
      ];

  return (
    <Parallax>
      <group scale={mobile ? 0.66 : 1} position={[0, mobile ? 0.35 : 0, 0]}>
        {/* ambient data dust */}
        <Dust count={mobile ? 70 : 190} />

        {/* left — 3D bar chart */}
        <BarChart position={mobile ? [-2.1, -1.35, -0.6] : [-4.1, -1.1, -0.8]} />

        {/* right — donut chart */}
        <Donut position={mobile ? [2.2, 1.6, -0.8] : [4.3, 1.35, -1.0]} />

        {/* right — trend line panel */}
        <group position={mobile ? [2.1, -1.5, -0.5] : [4.15, -1.6, -0.6]}>
          <TrendLine position={[0, 0, 0]} />
        </group>

        {/* top-left — spreadsheet */}
        <SpreadsheetCard
          position={mobile ? [-2.0, 1.8, -0.8] : [-4.0, 1.75, -1.0]}
          rotation={mobile ? [0.1, 0.5, 0.03] : [0.08, 0.55, 0.03]}
        />

        {/* top-right — database cylinders */}
        <DatabaseCylinders position={mobile ? [0.2, 2.6, -1.2] : [0.4, 2.7, -1.6]} />

        {/* bottom-center-left — BI dashboard card */}
        <DashboardCard
          position={mobile ? [0.1, -2.7, -0.9] : [-1.3, -2.75, -1.2]}
          rotation={mobile ? [0.16, -0.4, 0] : [0.14, -0.5, 0]}
        />

        {/* glowing data-node network behind content */}
        <NodeWeb position={[0, 0.35, -1.9]} />

        {/* SQL / code / analytics symbol particles */}
        {codeLabels.map((l, i) => (
          <TextSprite key={i} text={l.text} position={l.p} color={l.c} size={l.s} opacity={0.85} />
        ))}
      </group>
    </Parallax>
  );
}

export function HeroLights() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 7, 6]} intensity={1.6} color="#dbeafe" />
      <pointLight position={[-7, 3, 4]} intensity={30} distance={20} decay={2} color="#8b5cf6" />
      <pointLight position={[7, -2, 4]} intensity={26} distance={20} decay={2} color="#22d3ee" />
    </>
  );
}
