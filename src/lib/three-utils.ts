import * as THREE from 'three';

/* ------------------------------------------------------------------ *
 * Procedural 3D helpers.
 * Everything in the site is generated at runtime — no texture or model
 * downloads — so the scene stays instant, offline-friendly and tiny.
 * ------------------------------------------------------------------ */

let glowTexture: THREE.Texture | null = null;

/** Soft radial-gradient sprite used for every fake-bloom halo in the site. */
export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.72)');
  gradient.addColorStop(0.42, 'rgba(255,255,255,0.24)');
  gradient.addColorStop(0.72, 'rgba(255,255,255,0.06)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  glowTexture.needsUpdate = true;
  return glowTexture;
}

/** Deterministic PRNG so every visitor sees the same "designed" composition. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Evenly distributed points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    positions[i * 3] = Math.cos(phi) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(phi) * r * radius;
  }
  return positions;
}

/** Random points inside a box — used for the ambient particle fields. */
export function randomBoxPositions(count: number, [x, y, z]: [number, number, number], seed = 7) {
  const rand = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * x;
    positions[i * 3 + 1] = (rand() - 0.5) * y;
    positions[i * 3 + 2] = (rand() - 0.5) * z;
  }
  return positions;
}

/** Great-circle-ish arc that bulges away from the sphere centre. */
export function arcBetween(
  from: THREE.Vector3,
  to: THREE.Vector3,
  bulge = 0.35
): THREE.QuadraticBezierCurve3 {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const lift = 1 + bulge;
  return new THREE.QuadraticBezierCurve3(from, mid.multiplyScalar(lift), to);
}

/** Sample a curve into the flat tuple array `<Line />` expects. */
export function curvePoints(curve: THREE.Curve<THREE.Vector3>, segments = 32) {
  return curve
    .getPoints(segments)
    .map((p) => [p.x, p.y, p.z] as [number, number, number]);
}

/** Bar-chart dataset that looks like a real report, not noise. */
export const barData = [0.42, 0.68, 0.35, 0.82, 0.55, 0.95, 0.48, 0.72, 0.6, 0.88, 0.38, 0.66];

/** Spark-line dataset with an upward trend and one dip. */
export const lineData = [0.28, 0.4, 0.34, 0.52, 0.47, 0.68, 0.6, 0.78, 0.71, 0.92];

export const PALETTE = {
  aqua: '#00f5d4',
  aquaDeep: '#06b6d4',
  plasma: '#22d3ee',
  violet: '#8b5cf6',
  violetCore: '#7b2cbf',
  white: '#f8fafc',
} as const;
