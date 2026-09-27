import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, ArrowDownRight, ArrowUpRight, Gauge, RefreshCw, SlidersHorizontal } from 'lucide-react';
import {
  CATEGORIES,
  PRODUCTS,
  REGIONS,
  TIME_RANGES,
  buildCustomerGrowth,
  buildKpis,
  buildMonthly,
  buildPerformanceRadar,
  buildProducts,
  buildRegional,
  buildSegments,
  defaultFilters,
  formatCompactCurrency,
  formatKpi,
  type LabFilters,
} from '../../data/analytics';
import { SectionHeading } from '../ui/SectionHeading';
import { GlassCard } from '../ui/GlassCard';
import { Reveal } from '../ui/Reveal';
import { DemoBadge } from '../ui/DemoBadge';
import { cn, chartSeries, palette, tooltipStyle } from '../../lib/utils';
import { useIsMobile } from '../../hooks/useMediaQuery';

/* ── filter control ──────────────────────────────────────── */

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[0.6rem] tracking-[0.25em] text-ink-faint uppercase">{label}</span>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                'relative shrink-0 rounded-full px-3 py-1.5 text-[0.72rem] whitespace-nowrap transition-colors duration-300',
                active ? 'text-abyss' : 'text-ink-muted hover:text-ink',
              )}
            >
              {active && (
                <motion.span
                  layoutId={`filter-${label}`}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10 font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── panel shell ─────────────────────────────────────────── */

function Panel({
  title,
  subtitle,
  children,
  className,
  icon,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <GlassCard className={cn('flex flex-col rounded-2xl', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[0.68rem] text-ink-faint">{subtitle}</p>}
        </div>
        {icon && <span className="text-cyan-300/70">{icon}</span>}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </GlassCard>
  );
}

const axisProps = {
  stroke: palette.axis,
  tick: { fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' },
  tickLine: false,
  axisLine: false,
} as const;

/* ── section ─────────────────────────────────────────────── */

export function AnalyticsLab() {
  const [filters, setFilters] = useState<LabFilters>(defaultFilters);
  const [seed, setSeed] = useState(0);
  const isMobile = useIsMobile();

  const monthly = useMemo(() => buildMonthly(filters), [filters]);
  const kpis = useMemo(() => buildKpis(monthly, filters), [monthly, filters]);
  const regional = useMemo(() => buildRegional(filters), [filters]);
  const products = useMemo(() => buildProducts(filters), [filters]);
  const segments = useMemo(() => buildSegments(filters), [filters]);
  const radar = useMemo(() => buildPerformanceRadar(filters), [filters]);
  const growth = useMemo(() => buildCustomerGrowth(monthly), [monthly]);

  const set = <K extends keyof LabFilters>(key: K) => (value: LabFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setFilters(defaultFilters);
    setSeed((s) => s + 1);
  };

  const chartKey = `${filters.range}-${filters.category}-${filters.region}-${filters.product}-${seed}`;

  return (
    <section id="analytics-lab" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading
          eyebrow="03 — Analytics Lab"
          title="Analytics Lab"
          subtitle="A live, filterable business dashboard built the way I build them in Power BI and Tableau — KPIs first, then the trend, then the breakdowns."
        />

        <Reveal className="mt-6 flex justify-center">
          <DemoBadge />
        </Reveal>

        <Reveal delay={0.08}>
          <GlassCard strong className="mt-10 rounded-3xl p-4 sm:p-6">
            {/* control bar */}
            <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FilterRow label="Time Range" options={TIME_RANGES.map((r) => r.label)} value={TIME_RANGES.find((r) => r.id === filters.range)!.label} onChange={(label) => set('range')(TIME_RANGES.find((r) => r.label === label)!.id)} />
                <FilterRow label="Category" options={CATEGORIES} value={filters.category} onChange={set('category')} />
                <FilterRow label="Region" options={REGIONS} value={filters.region} onChange={set('region')} />
                <FilterRow label="Product" options={PRODUCTS} value={filters.product} onChange={set('product')} />
              </div>
              <button
                onClick={reset}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs text-ink-muted transition hover:border-cyan-300/45 hover:text-cyan-100 lg:self-end"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset filters
              </button>
            </div>

            {/* KPI strip */}
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {kpis.map((kpi, i) => {
                const up = kpi.delta >= 0;
                return (
                  <motion.div
                    key={kpi.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.035] p-3 transition hover:border-cyan-300/30"
                  >
                    <span className="font-mono text-[0.58rem] tracking-[0.18em] text-ink-faint uppercase">{kpi.label}</span>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={`${chartKey}-${kpi.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="mt-1 font-display text-lg font-bold text-ink sm:text-xl"
                      >
                        {formatKpi(kpi.value, kpi.format)}
                      </motion.div>
                    </AnimatePresence>
                    <div className={cn('mt-1 flex items-center gap-1 text-[0.62rem]', up ? 'text-emerald-300' : 'text-rose-300')}>
                      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {Math.abs(kpi.delta).toFixed(1)}%
                      <span className="text-ink-faint">vs prior</span>
                    </div>
                    <div className="mt-2 h-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={kpi.spark.map((v, idx) => ({ i: idx, v }))} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
                          <defs>
                            <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={palette.cyan} stopOpacity={0.55} />
                              <stop offset="100%" stopColor={palette.cyan} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke={palette.cyan} strokeWidth={1.4} fill={`url(#spark-${kpi.id})`} isAnimationActive />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* charts */}
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <Panel
                title="Revenue vs Target"
                subtitle="Monthly revenue against plan"
                icon={<Activity className="h-4 w-4" />}
                className="lg:col-span-2"
              >
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart key={chartKey} data={monthly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={palette.cyan} stopOpacity={0.45} />
                          <stop offset="100%" stopColor={palette.cyan} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={palette.grid} vertical={false} />
                      <XAxis dataKey="month" {...axisProps} interval={isMobile ? 2 : 0} />
                      <YAxis {...axisProps} tickFormatter={(v) => formatCompactCurrency(Number(v))} width={58} />
                      <Tooltip {...tooltipStyle} formatter={(v, n) => [formatCompactCurrency(Number(v ?? 0)), String(n ?? '')]} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke={palette.cyan} strokeWidth={2} fill="url(#revFill)" animationDuration={900} />
                      <Line type="monotone" dataKey="target" name="Target" stroke={palette.violet} strokeWidth={1.6} strokeDasharray="5 5" dot={false} animationDuration={900} />
                      <Bar dataKey="profit" name="Profit" barSize={10} radius={[3, 3, 0, 0]} fill={palette.blue} fillOpacity={0.55} animationDuration={900} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Customer Segmentation" subtitle="Share of active customers" icon={<Gauge className="h-4 w-4" />}>
                <div className="h-64 sm:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart key={chartKey}>
                      <Tooltip {...tooltipStyle} formatter={(v, n) => [`${Number(v ?? 0).toFixed(1)}%`, String(n ?? '')]} />
                      <Pie
                        data={segments}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="56%"
                        outerRadius="82%"
                        paddingAngle={3}
                        stroke="none"
                        animationDuration={900}
                      >
                        {segments.map((_, i) => (
                          <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        height={38}
                        iconType="circle"
                        iconSize={7}
                        formatter={(value) => <span style={{ color: '#9aa8c4', fontSize: 11 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Sales Trend" subtitle="Orders per month">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart key={chartKey} data={monthly} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={palette.sky} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={palette.sky} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={palette.grid} vertical={false} />
                      <XAxis dataKey="month" {...axisProps} interval={isMobile ? 3 : 1} />
                      <YAxis {...axisProps} width={44} />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="orders" name="Orders" stroke={palette.sky} strokeWidth={2} fill="url(#ordersFill)" animationDuration={900} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Customer Growth" subtitle="Active vs returning">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart key={chartKey} data={growth} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="custFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={palette.mint} stopOpacity={0.45} />
                          <stop offset="100%" stopColor={palette.mint} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={palette.grid} vertical={false} />
                      <XAxis dataKey="month" {...axisProps} interval={isMobile ? 3 : 1} />
                      <YAxis {...axisProps} width={44} />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="customers" name="Customers" stroke={palette.mint} strokeWidth={2} fill="url(#custFill)" animationDuration={900} />
                      <Line type="monotone" dataKey="returning" name="Returning" stroke={palette.amber} strokeWidth={1.6} dot={false} animationDuration={900} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Regional Performance" subtitle="Revenue by region (₹ lakh)">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={chartKey} data={regional} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
                      <CartesianGrid stroke={palette.grid} horizontal={false} />
                      <XAxis type="number" {...axisProps} />
                      <YAxis type="category" dataKey="name" {...axisProps} width={52} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="value" name="Revenue" radius={[0, 6, 6, 0]} barSize={14} animationDuration={900}>
                        {regional.map((_, i) => (
                          <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Product Performance" subtitle="Revenue (₹ lakh) by product" className="lg:col-span-2">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart key={chartKey} data={products} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={palette.grid} vertical={false} />
                      <XAxis dataKey="name" {...axisProps} interval={0} tick={{ fill: '#64748b', fontSize: 9.5 }} />
                      <YAxis {...axisProps} width={44} />
                      <Tooltip {...tooltipStyle} />
                      <Bar dataKey="value" name="Revenue" radius={[6, 6, 0, 0]} barSize={26} animationDuration={900}>
                        {products.map((_, i) => (
                          <Cell key={i} fill={chartSeries[(i + 1) % chartSeries.length]} fillOpacity={0.85} />
                        ))}
                      </Bar>
                      <Line type="monotone" dataKey="secondary" name="Margin %" stroke={palette.amber} strokeWidth={1.8} dot={{ r: 2.5 }} animationDuration={900} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Performance Profile" subtitle="Index vs benchmark">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart key={chartKey} data={radar} outerRadius="72%">
                      <PolarGrid stroke={palette.grid} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 9.5 }} />
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <Tooltip {...tooltipStyle} />
                      <Radar name="Current" dataKey="value" stroke={palette.cyan} fill={palette.cyan} fillOpacity={0.28} animationDuration={900} />
                      <Radar name="Benchmark" dataKey="benchmark" stroke={palette.violet} fill={palette.violet} fillOpacity={0.14} animationDuration={900} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/8 pt-4 text-[0.68rem] text-ink-faint">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400/70" />
              Filters recompute every visual from a seeded sample generator — the same selection always returns the same
              numbers, so the dashboard behaves like a real report.
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
