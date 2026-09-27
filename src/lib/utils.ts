/** Tiny className joiner — avoids pulling in clsx for a handful of call sites. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Shared chart palette so 3D scenes and Recharts stay visually in sync. */
export const palette = {
  cyan: '#22d3ee',
  blue: '#3b82f6',
  sky: '#38bdf8',
  violet: '#a78bfa',
  mint: '#5eead4',
  amber: '#fbbf24',
  rose: '#fb7185',
  grid: 'rgba(148,163,184,0.12)',
  axis: '#64748b',
};

export const chartSeries = [palette.cyan, palette.blue, palette.violet, palette.mint, palette.amber, palette.rose];

/** Recharts tooltip styling shared across every chart on the site. */
export const tooltipStyle = {
  contentStyle: {
    background: 'rgba(6,11,26,0.92)',
    border: '1px solid rgba(148,163,184,0.22)',
    borderRadius: 12,
    boxShadow: '0 20px 50px -25px rgba(0,0,0,0.9)',
    backdropFilter: 'blur(10px)',
    fontSize: 12,
    fontFamily: 'Inter Variable, Inter, sans-serif',
    color: '#e8edf7',
  },
  labelStyle: { color: '#9aa8c4', fontSize: 11, marginBottom: 4 },
  itemStyle: { color: '#e8edf7', fontSize: 12 },
  cursor: { fill: 'rgba(34,211,238,0.06)' },
} as const;
