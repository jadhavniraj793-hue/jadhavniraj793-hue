/**
 * Demonstration analytics data.
 *
 * Every number produced here is SIMULATED sample data generated from a
 * deterministic seeded generator. It exists to demonstrate dashboard and
 * visualisation work — it is not real company data.
 */

export const DEMO_NOTICE = 'Interactive Portfolio Demo — simulated sample data';

/* ── deterministic pseudo random ─────────────────────────── */

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seeded(key: string) {
  return mulberry32(hashString(key));
}

/* ── filter dimensions ───────────────────────────────────── */

export const TIME_RANGES = [
  { id: '6m', label: '6 Months', months: 6 },
  { id: '12m', label: '12 Months', months: 12 },
  { id: '24m', label: '24 Months', months: 24 },
] as const;

export const CATEGORIES = ['All Categories', 'Electronics', 'Apparel', 'Home', 'Grocery'] as const;
export const REGIONS = ['All Regions', 'West', 'North', 'South', 'East'] as const;
export const PRODUCTS = ['All Products', 'Smart Monitor', 'Wireless Kit', 'Ergo Chair', 'Coffee Pack'] as const;

export type TimeRangeId = (typeof TIME_RANGES)[number]['id'];
export type Category = (typeof CATEGORIES)[number];
export type Region = (typeof REGIONS)[number];
export type Product = (typeof PRODUCTS)[number];

export type LabFilters = {
  range: TimeRangeId;
  category: Category;
  region: Region;
  product: Product;
};

export const defaultFilters: LabFilters = {
  range: '12m',
  category: 'All Categories',
  region: 'All Regions',
  product: 'All Products',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Filters scale the simulated volume so charts visibly react to selection. */
function filterScale(f: LabFilters): number {
  let s = 1;
  if (f.category !== 'All Categories') s *= 0.34;
  if (f.region !== 'All Regions') s *= 0.31;
  if (f.product !== 'All Products') s *= 0.27;
  return s;
}

export type MonthPoint = {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
  customers: number;
  target: number;
};

export function buildMonthly(f: LabFilters): MonthPoint[] {
  const months = TIME_RANGES.find((r) => r.id === f.range)?.months ?? 12;
  const rng = seeded(`monthly:${f.category}:${f.region}:${f.product}`);
  const scale = filterScale(f);
  const now = new Date();
  const out: MonthPoint[] = [];

  let base = 720_000 + rng() * 260_000;
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const seasonal = 1 + 0.14 * Math.sin((d.getMonth() / 12) * Math.PI * 2) + 0.07 * Math.cos(d.getMonth());
    const drift = 1 + (months - i) * 0.012;
    const noise = 0.9 + rng() * 0.22;
    const revenue = base * seasonal * drift * noise * scale;
    const margin = 0.19 + rng() * 0.07;
    const aov = 690 + rng() * 140;
    out.push({
      month: `${MONTH_LABELS[d.getMonth()]}${months > 12 ? ` '${String(d.getFullYear()).slice(2)}` : ''}`,
      revenue: Math.round(revenue),
      profit: Math.round(revenue * margin),
      orders: Math.round(revenue / aov),
      customers: Math.round((revenue / aov) * (0.55 + rng() * 0.18)),
      target: Math.round(base * drift * 1.04 * scale),
    });
    base *= 1.004;
  }
  return out;
}

export type KpiCard = {
  id: string;
  label: string;
  value: number;
  format: 'currency' | 'number' | 'percent';
  delta: number;
  spark: number[];
};

export function buildKpis(rows: MonthPoint[], f: LabFilters): KpiCard[] {
  const sum = (k: keyof MonthPoint) => rows.reduce((a, r) => a + (r[k] as number), 0);
  const revenue = sum('revenue');
  const profit = sum('profit');
  const orders = sum('orders');
  const customers = sum('customers');
  const half = Math.max(1, Math.floor(rows.length / 2));
  const recent = rows.slice(-half).reduce((a, r) => a + r.revenue, 0) / half;
  const prior = rows.slice(0, half).reduce((a, r) => a + r.revenue, 0) / half;
  const growth = prior > 0 ? ((recent - prior) / prior) * 100 : 0;
  const rng = seeded(`kpi:${f.range}:${f.category}:${f.region}:${f.product}`);

  return [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: revenue,
      format: 'currency',
      delta: growth,
      spark: rows.map((r) => r.revenue),
    },
    {
      id: 'profit',
      label: 'Total Profit',
      value: profit,
      format: 'currency',
      delta: growth * (0.7 + rng() * 0.5),
      spark: rows.map((r) => r.profit),
    },
    {
      id: 'orders',
      label: 'Orders',
      value: orders,
      format: 'number',
      delta: growth * (0.6 + rng() * 0.4),
      spark: rows.map((r) => r.orders),
    },
    {
      id: 'aov',
      label: 'Avg Order Value',
      value: orders ? revenue / orders : 0,
      format: 'currency',
      delta: (rng() - 0.35) * 6,
      spark: rows.map((r) => (r.orders ? r.revenue / r.orders : 0)),
    },
    {
      id: 'margin',
      label: 'Profit Margin',
      value: revenue ? (profit / revenue) * 100 : 0,
      format: 'percent',
      delta: (rng() - 0.4) * 3,
      spark: rows.map((r) => (r.revenue ? (r.profit / r.revenue) * 100 : 0)),
    },
    {
      id: 'customers',
      label: 'Customers',
      value: customers,
      format: 'number',
      delta: growth * (0.5 + rng() * 0.5),
      spark: rows.map((r) => r.customers),
    },
  ];
}

export type NamedValue = { name: string; value: number; secondary?: number };

export function buildRegional(f: LabFilters): NamedValue[] {
  const rng = seeded(`region:${f.range}:${f.category}:${f.product}`);
  const regions = REGIONS.filter((r) => r !== 'All Regions');
  const rows = regions.map((name) => {
    const base = 1.6 + rng() * 2.4; // ₹ crore
    return {
      name,
      value: Math.round(base * 100), // ₹ lakh
      secondary: Math.round(base * 23), // profit, ₹ lakh
    };
  });
  if (f.region !== 'All Regions') {
    return rows.map((r) => (r.name === f.region ? r : { ...r, value: r.value * 0.18, secondary: (r.secondary ?? 0) * 0.18 }));
  }
  return rows;
}

export function buildProducts(f: LabFilters): NamedValue[] {
  const rng = seeded(`product:${f.range}:${f.category}:${f.region}`);
  const products = PRODUCTS.filter((p) => p !== 'All Products');
  const rows = products.map((name) => ({
    name,
    value: Math.round(40 + rng() * 120), // ₹ lakh
    secondary: Math.round((14 + rng() * 16) * 10) / 10, // margin %
  }));
  if (f.product !== 'All Products') {
    return rows.map((r) => (r.name === f.product ? r : { ...r, value: r.value * 0.2 }));
  }
  return rows;
}

export function buildSegments(f: LabFilters): NamedValue[] {
  const rng = seeded(`segment:${f.category}:${f.region}:${f.product}`);
  const names = ['Loyal', 'Promising', 'New', 'At Risk', 'Dormant'];
  const raw = names.map(() => 0.6 + rng());
  const total = raw.reduce((a, b) => a + b, 0);
  return names.map((name, i) => ({ name, value: Math.round((raw[i] / total) * 1000) / 10 }));
}

export type RadarPoint = { metric: string; value: number; benchmark: number };

export function buildPerformanceRadar(f: LabFilters): RadarPoint[] {
  const rng = seeded(`radar:${f.category}:${f.region}:${f.product}`);
  return ['Revenue', 'Profit', 'Retention', 'Volume', 'Reach', 'Satisfaction'].map((metric) => ({
    metric,
    value: Math.round(55 + rng() * 42),
    benchmark: Math.round(50 + rng() * 25),
  }));
}

export function buildCustomerGrowth(rows: MonthPoint[]): { month: string; customers: number; returning: number }[] {
  let cumulative = 0;
  return rows.map((r, i) => {
    cumulative += r.customers;
    return {
      month: r.month,
      customers: Math.round(cumulative / (i + 1)),
      returning: Math.round((cumulative / (i + 1)) * 0.46),
    };
  });
}

/* ── project-specific demo datasets ──────────────────────── */

export const salesByRegion = [
  { name: 'West', sales: 1.62, orders: 3120 },
  { name: 'North', sales: 1.28, orders: 2480 },
  { name: 'South', sales: 1.05, orders: 2190 },
  { name: 'East', sales: 0.87, orders: 1622 },
];

export const salesMonthly = [
  { month: 'Jan', sales: 312, target: 300 },
  { month: 'Feb', sales: 348, target: 315 },
  { month: 'Mar', sales: 401, target: 340 },
  { month: 'Apr', sales: 372, target: 355 },
  { month: 'May', sales: 435, target: 380 },
  { month: 'Jun', sales: 468, target: 400 },
  { month: 'Jul', sales: 441, target: 415 },
  { month: 'Aug', sales: 502, target: 430 },
  { month: 'Sep', sales: 528, target: 450 },
  { month: 'Oct', sales: 561, target: 470 },
  { month: 'Nov', sales: 604, target: 500 },
  { month: 'Dec', sales: 652, target: 520 },
];

export const salesSegments = [
  { name: 'Corporate', value: 41 },
  { name: 'Consumer', value: 37 },
  { name: 'Small Business', value: 22 },
];

export const churnDistribution = [
  { name: 'Retained', value: 73.6 },
  { name: 'Churned', value: 26.4 },
];

export const churnBySegment = [
  { name: 'Month-to-month', churn: 42, retained: 58 },
  { name: 'One year', churn: 18, retained: 82 },
  { name: 'Two year', churn: 8, retained: 92 },
  { name: 'Prepaid', churn: 27, retained: 73 },
];

export const churnByTenure = [
  { tenure: '0-3m', churn: 46, customers: 820 },
  { tenure: '4-6m', churn: 38, customers: 760 },
  { tenure: '7-12m', churn: 29, customers: 1120 },
  { tenure: '1-2y', churn: 19, customers: 1340 },
  { tenure: '2-3y', churn: 12, customers: 980 },
  { tenure: '3y+', churn: 7, customers: 1210 },
];

export const retentionCurve = [
  { month: 'M0', retention: 100 },
  { month: 'M1', retention: 88 },
  { month: 'M2', retention: 74 },
  { month: 'M3', retention: 66 },
  { month: 'M4', retention: 61 },
  { month: 'M5', retention: 58 },
  { month: 'M6', retention: 56 },
];

export const economicIndicators = [
  { period: '2019', gdp: 4.0, inflation: 3.7, unemployment: 5.3, market: 100 },
  { period: '2020', gdp: -5.8, inflation: 6.2, unemployment: 8.0, market: 78 },
  { period: '2021', gdp: 9.1, inflation: 5.5, unemployment: 6.6, market: 112 },
  { period: '2022', gdp: 7.2, inflation: 6.7, unemployment: 5.8, market: 121 },
  { period: '2023', gdp: 7.8, inflation: 5.4, unemployment: 5.1, market: 138 },
  { period: '2024', gdp: 6.9, inflation: 4.6, unemployment: 4.8, market: 152 },
  { period: '2025', gdp: 6.4, inflation: 4.1, unemployment: 4.6, market: 166 },
];

export const sectorGrowth = [
  { name: 'Services', value: 8.2 },
  { name: 'Industry', value: 6.4 },
  { name: 'Agriculture', value: 3.1 },
  { name: 'Construction', value: 7.0 },
];

export const ecommerceChannels = [
  { name: 'Marketplace', revenue: 7.4, profit: 1.4 },
  { name: 'Own Store', revenue: 5.9, profit: 1.6 },
  { name: 'Retail Partner', revenue: 3.2, profit: 0.7 },
  { name: 'Social', revenue: 1.9, profit: 0.4 },
];

export const behaviorFrequency = [
  { bucket: '1 order', customers: 4820 },
  { bucket: '2-3', customers: 2410 },
  { bucket: '4-6', customers: 1080 },
  { bucket: '7-10', customers: 430 },
  { bucket: '10+', customers: 190 },
];

export const performanceMonthly = [
  { month: 'Jan', revenue: 0.92, profit: 0.2 },
  { month: 'Feb', revenue: 0.98, profit: 0.22 },
  { month: 'Mar', revenue: 1.12, profit: 0.26 },
  { month: 'Apr', revenue: 1.04, profit: 0.23 },
  { month: 'May', revenue: 1.18, profit: 0.27 },
  { month: 'Jun', revenue: 1.26, profit: 0.3 },
  { month: 'Jul', revenue: 1.14, profit: 0.25 },
  { month: 'Aug', revenue: 1.31, profit: 0.31 },
  { month: 'Sep', revenue: 1.38, profit: 0.33 },
  { month: 'Oct', revenue: 1.22, profit: 0.28 },
  { month: 'Nov', revenue: 1.44, profit: 0.35 },
  { month: 'Dec', revenue: 1.51, profit: 0.38 },
];

/* ── dataset previews shown inside project detail views ─── */

export type DatasetPreview = { columns: string[]; rows: (string | number)[][] };

export const datasetPreviews: Record<string, DatasetPreview> = {
  'sales-data-analysis': {
    columns: ['order_id', 'date', 'region', 'product', 'segment', 'qty', 'sales'],
    rows: [
      ['ORD-10241', '2024-03-02', 'West', 'Smart Monitor', 'Corporate', 4, 51960],
      ['ORD-10242', '2024-03-02', 'North', 'Wireless Kit', 'Consumer', 2, 5980],
      ['ORD-10243', '2024-03-03', 'South', 'Ergo Chair', 'Small Business', 1, 14500],
      ['ORD-10244', '2024-03-04', 'West', 'Smart Monitor', 'Consumer', 1, 12990],
      ['ORD-10245', '2024-03-05', 'East', 'Coffee Pack', 'Consumer', 6, 3540],
    ],
  },
  'customer-churn-analysis': {
    columns: ['customer_id', 'tenure_m', 'contract', 'monthly_charge', 'support_calls', 'churn'],
    rows: [
      ['CUS-8821', 3, 'Month-to-month', 899, 4, 'Yes'],
      ['CUS-8822', 26, 'Two year', 649, 0, 'No'],
      ['CUS-8823', 11, 'One year', 749, 1, 'No'],
      ['CUS-8824', 2, 'Month-to-month', 999, 3, 'Yes'],
      ['CUS-8825', 41, 'Two year', 599, 0, 'No'],
    ],
  },
  'economic-data-analysis': {
    columns: ['period', 'gdp_growth', 'inflation', 'unemployment', 'market_index'],
    rows: [
      ['2021', 9.1, 5.5, 6.6, 112],
      ['2022', 7.2, 6.7, 5.8, 121],
      ['2023', 7.8, 5.4, 5.1, 138],
      ['2024', 6.9, 4.6, 4.8, 152],
      ['2025', 6.4, 4.1, 4.6, 166],
    ],
  },
  'ecommerce-sales-intelligence': {
    columns: ['order_id', 'date', 'channel', 'category', 'revenue', 'cost', 'profit'],
    rows: [
      ['EC-55012', '2025-01-12', 'Marketplace', 'Electronics', 18400, 14200, 4200],
      ['EC-55013', '2025-01-12', 'Own Store', 'Apparel', 5400, 3900, 1500],
      ['EC-55014', '2025-01-13', 'Social', 'Home', 2600, 2100, 500],
      ['EC-55015', '2025-01-14', 'Own Store', 'Electronics', 22100, 16800, 5300],
      ['EC-55016', '2025-01-15', 'Retail Partner', 'Grocery', 1400, 1180, 220],
    ],
  },
  'customer-behavior-intelligence': {
    columns: ['customer_id', 'first_order', 'orders', 'spend', 'recency_d', 'segment'],
    rows: [
      ['CB-2201', '2024-02-11', 14, 96400, 12, 'Loyal'],
      ['CB-2202', '2024-06-03', 3, 12800, 61, 'Promising'],
      ['CB-2203', '2025-01-19', 1, 2400, 8, 'New'],
      ['CB-2204', '2023-11-02', 7, 41200, 148, 'At Risk'],
      ['CB-2205', '2023-04-27', 2, 6100, 302, 'Dormant'],
    ],
  },
  'business-performance-dashboard': {
    columns: ['month', 'region', 'product_line', 'revenue', 'profit', 'units'],
    rows: [
      ['2025-08', 'West', 'Hardware', 1310000, 312000, 4120],
      ['2025-08', 'North', 'Hardware', 980000, 221000, 3080],
      ['2025-09', 'West', 'Accessories', 640000, 178000, 6210],
      ['2025-09', 'South', 'Hardware', 720000, 151000, 2260],
      ['2025-09', 'East', 'Accessories', 410000, 96000, 3940],
    ],
  },
};

/* ── formatting helpers ─────────────────────────────────── */

export function formatCompactCurrency(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

export function formatKpi(value: number, format: KpiCard['format']): string {
  if (format === 'currency') return formatCompactCurrency(value);
  if (format === 'percent') return `${value.toFixed(1)}%`;
  return formatCompactNumber(value);
}
