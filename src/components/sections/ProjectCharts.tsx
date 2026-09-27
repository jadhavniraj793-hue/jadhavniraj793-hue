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
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  behaviorFrequency,
  churnBySegment,
  churnByTenure,
  churnDistribution,
  ecommerceChannels,
  economicIndicators,
  performanceMonthly,
  retentionCurve,
  salesByRegion,
  salesMonthly,
  salesSegments,
  sectorGrowth,
} from '../../data/analytics';
import type { ChartKind } from '../../data/portfolio';
import { chartSeries, palette, tooltipStyle } from '../../lib/utils';

const axis = {
  stroke: palette.axis,
  tick: { fill: '#64748b', fontSize: 9.5, fontFamily: 'JetBrains Mono, monospace' },
  tickLine: false,
  axisLine: false,
} as const;

/** Compact preview used inside project cards. */
export function ProjectPreview({ kind }: { kind: ChartKind }) {
  switch (kind) {
    case 'sales':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={salesMonthly} margin={{ top: 8, right: 4, left: -28, bottom: -4 }}>
            <defs>
              <linearGradient id="pv-sales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.cyan} stopOpacity={0.5} />
                <stop offset="100%" stopColor={palette.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="month" {...axis} interval={2} />
            <YAxis {...axis} width={34} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="sales" stroke={palette.cyan} strokeWidth={2} fill="url(#pv-sales)" />
            <Line type="monotone" dataKey="target" stroke={palette.violet} strokeWidth={1.4} strokeDasharray="4 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      );
    case 'churn':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={churnBySegment} margin={{ top: 10, right: 6, left: -28, bottom: -4 }}>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="name" {...axis} interval={0} tick={{ fill: '#64748b', fontSize: 8.5 }} />
            <YAxis {...axis} width={32} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="churn" name="Churn %" stackId="a" fill={palette.violet} radius={[0, 0, 0, 0]} barSize={22} />
            <Bar dataKey="retained" name="Retained %" stackId="a" fill={palette.cyan} fillOpacity={0.35} radius={[4, 4, 0, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'economic':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={economicIndicators} margin={{ top: 10, right: 6, left: -28, bottom: -4 }}>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="period" {...axis} />
            <YAxis {...axis} width={32} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="gdp" name="GDP %" stroke={palette.cyan} strokeWidth={2} dot={{ r: 2 }} />
            <Line type="monotone" dataKey="inflation" name="Inflation %" stroke={palette.amber} strokeWidth={1.6} dot={false} />
            <Line type="monotone" dataKey="unemployment" name="Unemployment %" stroke={palette.violet} strokeWidth={1.6} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    case 'ecommerce':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ecommerceChannels} margin={{ top: 10, right: 6, left: -28, bottom: -4 }}>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="name" {...axis} interval={0} tick={{ fill: '#64748b', fontSize: 8.5 }} />
            <YAxis {...axis} width={32} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="revenue" name="Revenue ₹M" fill={palette.cyan} fillOpacity={0.85} radius={[5, 5, 0, 0]} barSize={18} />
            <Bar dataKey="profit" name="Profit ₹M" fill={palette.blue} fillOpacity={0.7} radius={[5, 5, 0, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      );
    case 'behavior':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={behaviorFrequency} margin={{ top: 10, right: 6, left: -28, bottom: -4 }}>
            <defs>
              <linearGradient id="pv-behavior" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.violet} stopOpacity={0.55} />
                <stop offset="100%" stopColor={palette.violet} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="bucket" {...axis} />
            <YAxis {...axis} width={38} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="customers" name="Customers" stroke={palette.violet} strokeWidth={2} fill="url(#pv-behavior)" />
          </AreaChart>
        </ResponsiveContainer>
      );
    case 'performance':
    default:
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={performanceMonthly} margin={{ top: 10, right: 6, left: -30, bottom: -4 }}>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="month" {...axis} interval={2} />
            <YAxis {...axis} width={30} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="revenue" name="Revenue ₹M" fill={palette.sky} fillOpacity={0.6} radius={[4, 4, 0, 0]} barSize={12} />
            <Line type="monotone" dataKey="profit" name="Profit ₹M" stroke={palette.mint} strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      );
  }
}

function Frame({ title, children, height = 'h-60' }: { title: string; children: React.ReactNode; height?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h4 className="mb-3 font-display text-xs font-semibold tracking-wide text-ink">{title}</h4>
      <div className={height}>{children}</div>
    </div>
  );
}

const legendStyle = (value: string) => <span style={{ color: '#9aa8c4', fontSize: 11 }}>{value}</span>;

/** Full visualisation set shown inside the project detail overlay. */
export function ProjectVisuals({ kind }: { kind: ChartKind }) {
  if (kind === 'sales') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Frame title="Monthly Sales vs Target (₹K)">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={salesMonthly} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="md-sales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.cyan} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={palette.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={42} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
              <Area type="monotone" dataKey="sales" name="Sales" stroke={palette.cyan} strokeWidth={2} fill="url(#md-sales)" />
              <Line type="monotone" dataKey="target" name="Target" stroke={palette.violet} strokeWidth={1.5} strokeDasharray="5 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Sales by Region (₹M)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByRegion} layout="vertical" margin={{ top: 6, right: 12, left: 6, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} horizontal={false} />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="name" {...axis} width={54} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="sales" name="Sales" radius={[0, 6, 6, 0]} barSize={16}>
                {salesByRegion.map((_, i) => (
                  <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Customer Segment Share (%)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip {...tooltipStyle} />
              <Pie data={salesSegments} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={3} stroke="none">
                {salesSegments.map((_, i) => (
                  <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
            </PieChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Orders by Region">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesByRegion} margin={{ top: 6, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} width={44} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="orders" name="Orders" fill={palette.blue} fillOpacity={0.75} radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Frame>
      </div>
    );
  }

  if (kind === 'churn') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Frame title="Churn Distribution (%)">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip {...tooltipStyle} />
              <Pie data={churnDistribution} dataKey="value" nameKey="name" innerRadius="56%" outerRadius="82%" paddingAngle={3} stroke="none">
                <Cell fill={palette.cyan} fillOpacity={0.5} />
                <Cell fill={palette.violet} fillOpacity={0.9} />
              </Pie>
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
            </PieChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Churn by Contract Segment (%)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={churnBySegment} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} interval={0} tick={{ fill: '#64748b', fontSize: 9 }} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
              <Bar dataKey="churn" name="Churned" stackId="s" fill={palette.violet} barSize={34} />
              <Bar dataKey="retained" name="Retained" stackId="s" fill={palette.cyan} fillOpacity={0.35} radius={[5, 5, 0, 0]} barSize={34} />
            </BarChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Churn Rate by Tenure (%)">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={churnByTenure} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="tenure" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
              <Bar dataKey="customers" name="Customers" fill={palette.blue} fillOpacity={0.35} radius={[5, 5, 0, 0]} barSize={22} yAxisId={0} />
              <Line type="monotone" dataKey="churn" name="Churn %" stroke={palette.rose} strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Retention Curve (%)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionCurve} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="md-ret" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.mint} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={palette.mint} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={40} domain={[0, 100]} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="retention" name="Retention" stroke={palette.mint} strokeWidth={2} fill="url(#md-ret)" />
            </AreaChart>
          </ResponsiveContainer>
        </Frame>
      </div>
    );
  }

  if (kind === 'economic') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Frame title="Indicators Over Time (%)" height="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={economicIndicators} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="period" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
              <Line type="monotone" dataKey="gdp" name="GDP growth" stroke={palette.cyan} strokeWidth={2.2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="inflation" name="Inflation" stroke={palette.amber} strokeWidth={1.8} dot={false} />
              <Line type="monotone" dataKey="unemployment" name="Unemployment" stroke={palette.violet} strokeWidth={1.8} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Market Index Trend" height="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={economicIndicators} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="md-market" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.sky} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={palette.sky} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="period" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="market" name="Index" stroke={palette.sky} strokeWidth={2} fill="url(#md-market)" />
            </AreaChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Sector Growth (%)" height="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorGrowth} layout="vertical" margin={{ top: 6, right: 12, left: 10, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} horizontal={false} />
              <XAxis type="number" {...axis} />
              <YAxis type="category" dataKey="name" {...axis} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" name="Growth" radius={[0, 6, 6, 0]} barSize={16}>
                {sectorGrowth.map((_, i) => (
                  <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Growth vs Market" height="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={economicIndicators} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="period" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="gdp" name="GDP %" fill={palette.cyan} fillOpacity={0.6} radius={[5, 5, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="market" name="Market index" stroke={palette.mint} strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Frame>
      </div>
    );
  }

  if (kind === 'ecommerce') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Frame title="Revenue & Profit by Channel (₹M)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ecommerceChannels} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="name" {...axis} interval={0} tick={{ fill: '#64748b', fontSize: 9 }} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
              <Bar dataKey="revenue" name="Revenue" fill={palette.cyan} fillOpacity={0.85} radius={[5, 5, 0, 0]} barSize={20} />
              <Bar dataKey="profit" name="Profit" fill={palette.blue} fillOpacity={0.7} radius={[5, 5, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Monthly Revenue Trend (₹M)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceMonthly} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="md-ecom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.cyan} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={palette.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={40} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={palette.cyan} strokeWidth={2} fill="url(#md-ecom)" />
              <Line type="monotone" dataKey="profit" name="Profit" stroke={palette.mint} strokeWidth={1.8} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Frame>
      </div>
    );
  }

  if (kind === 'behavior') {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Frame title="Purchase Frequency Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={behaviorFrequency} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="bucket" {...axis} />
              <YAxis {...axis} width={48} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="customers" name="Customers" radius={[6, 6, 0, 0]} barSize={30}>
                {behaviorFrequency.map((_, i) => (
                  <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Frame>
        <Frame title="Retention Curve (%)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retentionCurve} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="md-beh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette.violet} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={palette.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={palette.grid} vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={40} domain={[0, 100]} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="retention" name="Retention" stroke={palette.violet} strokeWidth={2} fill="url(#md-beh)" />
            </AreaChart>
          </ResponsiveContainer>
        </Frame>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Frame title="Revenue & Profit by Month (₹M)">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={performanceMonthly} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
            <CartesianGrid stroke={palette.grid} vertical={false} />
            <XAxis dataKey="month" {...axis} />
            <YAxis {...axis} width={40} />
            <Tooltip {...tooltipStyle} />
            <Legend formatter={legendStyle} iconType="circle" iconSize={7} />
            <Bar dataKey="revenue" name="Revenue" fill={palette.sky} fillOpacity={0.6} radius={[5, 5, 0, 0]} barSize={16} />
            <Line type="monotone" dataKey="profit" name="Profit" stroke={palette.mint} strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Frame>
      <Frame title="Regional Performance (₹M)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesByRegion} layout="vertical" margin={{ top: 6, right: 12, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={palette.grid} horizontal={false} />
            <XAxis type="number" {...axis} />
            <YAxis type="category" dataKey="name" {...axis} width={54} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="sales" name="Revenue" radius={[0, 6, 6, 0]} barSize={16}>
              {salesByRegion.map((_, i) => (
                <Cell key={i} fill={chartSeries[i % chartSeries.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Frame>
    </div>
  );
}
