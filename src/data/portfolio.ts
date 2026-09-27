/**
 * Single source of truth for every piece of personal content on the site.
 * Everything here comes from Niraj's resume — no invented employment,
 * companies, metrics or certificate URLs.
 */

export const profile = {
  firstName: 'Niraj',
  fullName: 'Niraj Laxman Jadhav',
  initials: 'NJ',
  role: 'Data Analyst',
  tagline: 'Turning Data Into Decisions.',
  intro:
    'I analyze, visualize, and transform raw data into meaningful business insights.',
  summary:
    'Detail-oriented and analytically minded Data Analyst with hands-on project experience in Excel, SQL, Python, Power BI, and Tableau.',
  summaryLong:
    'Skilled at cleaning, analyzing, and visualizing data to uncover trends and support data-driven decision-making. Certified across the core BI and analytics toolchain, with a strong foundation in statistics from a B.A. in Economics.',
  location: 'Kopar, Mumbai, India',
  email: 'jadhavniraj793@gmail.com',
  phone: '7208701481',
  phoneHref: '+917208701481',
  github: 'https://github.com/jadhavniraj793-hue',
  githubUser: 'jadhavniraj793-hue',
  linkedin: 'https://linkedin.com/in/niraj-jadhav-b31',
  linkedinLabel: 'linkedin.com/in/niraj-jadhav-b31',
  resume: './resume.pdf',
} as const;

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

/** Focus areas shown in the About section. */
export const focusAreas = [
  'Data Analysis',
  'Data Cleaning',
  'Data Visualization',
  'Business Intelligence',
  'Exploratory Data Analysis',
  'Trend Analysis',
  'Problem Solving',
] as const;

export const aboutStats = [
  { value: 5, suffix: '+', label: 'Analytics Tools', hint: 'Excel · SQL · Python · Power BI · Tableau' },
  { value: 3, suffix: '', label: 'Featured Projects', hint: 'Sales · Churn · Economics' },
  { value: 5, suffix: '', label: 'Certifications', hint: 'Coursera · Udemy · Microsoft Learn' },
  { value: 100, suffix: '%', label: 'End-to-End Analytics', hint: 'Collect → Insight → Decision' },
] as const;

/* ── Skills ─────────────────────────────────────────────── */

export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  icon: 'table' | 'code' | 'bi' | 'flask' | 'brain';
  /** `level` is a visual emphasis indicator only — never a measured score. */
  skills: { name: string; level: number }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    blurb: 'Spreadsheet modelling and relational querying for day-to-day analysis.',
    icon: 'table',
    skills: [
      { name: 'Excel', level: 88 },
      { name: 'Pivot Tables', level: 85 },
      { name: 'VLOOKUP', level: 82 },
      { name: 'Charts', level: 84 },
      { name: 'SQL', level: 80 },
      { name: 'Joins', level: 78 },
      { name: 'Aggregations', level: 80 },
      { name: 'Subqueries', level: 72 },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    blurb: 'Scripted cleaning, analysis and plotting for repeatable workflows.',
    icon: 'code',
    skills: [
      { name: 'Python', level: 78 },
      { name: 'Pandas', level: 80 },
      { name: 'NumPy', level: 74 },
      { name: 'Matplotlib', level: 76 },
      { name: 'Seaborn', level: 74 },
    ],
  },
  {
    id: 'bi',
    title: 'Business Intelligence',
    blurb: 'Dashboards that turn a dataset into something a stakeholder can act on.',
    icon: 'bi',
    skills: [
      { name: 'Power BI', level: 82 },
      { name: 'Tableau', level: 78 },
      { name: 'Interactive Dashboards', level: 84 },
      { name: 'Data Storytelling', level: 80 },
    ],
  },
  {
    id: 'techniques',
    title: 'Analytics Techniques',
    blurb: 'The pipeline work that happens before a chart ever gets drawn.',
    icon: 'flask',
    skills: [
      { name: 'Data Cleaning', level: 86 },
      { name: 'Data Transformation', level: 82 },
      { name: 'Exploratory Data Analysis', level: 84 },
      { name: 'Trend & Pattern Analysis', level: 80 },
    ],
  },
  {
    id: 'core',
    title: 'Core Competencies',
    blurb: 'How I approach a problem before, during and after the analysis.',
    icon: 'brain',
    skills: [
      { name: 'Analytical Thinking', level: 88 },
      { name: 'Problem Solving', level: 85 },
      { name: 'Attention to Detail', level: 88 },
      { name: 'Data Visualization', level: 84 },
      { name: 'Communication', level: 80 },
      { name: 'Quick Learning', level: 90 },
    ],
  },
];

/* ── Projects ───────────────────────────────────────────── */

export type ChartKind = 'sales' | 'churn' | 'economic' | 'ecommerce' | 'behavior' | 'performance';

export type Project = {
  id: string;
  index: string;
  title: string;
  tools: string[];
  toolLabel: string;
  problem: string;
  dataset: string;
  description: string;
  analysis: string[];
  kpis: { label: string; value: string; delta?: string }[];
  insights: string[];
  recommendations: string[];
  methodology: string[];
  chart: ChartKind;
  accent: string;
  demo: boolean;
  featured: boolean;
};

export const projects: Project[] = [
  {
    id: 'sales-data-analysis',
    index: '01',
    title: 'Sales Data Analysis',
    tools: ['Excel', 'SQL'],
    toolLabel: 'Excel + SQL',
    problem:
      'Leadership could see total sales but not which products, regions or customer segments were actually driving them.',
    dataset:
      'Multi-region sales transactions — order date, region, product, category, quantity, unit price and customer segment.',
    description:
      'Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, and customer segments.',
    analysis: [
      'Excel pivot tables',
      'Excel charts',
      'SQL joins',
      'SQL aggregations',
      'Filtering',
      'Sales metrics',
      'Regional analysis',
      'Customer segmentation',
    ],
    kpis: [
      { label: 'Total Sales', value: '₹4.82M', delta: '+12.4%' },
      { label: 'Orders', value: '9,412', delta: '+8.1%' },
      { label: 'Top Product', value: 'Smart Monitor' },
      { label: 'Top Region', value: 'West' },
      { label: 'Customer Segment', value: 'Corporate' },
    ],
    insights: [
      'The West region contributed the largest share of revenue while the East region had the steepest month-on-month growth.',
      'A small group of products generated a disproportionate share of sales, following a classic concentration pattern.',
      'Corporate buyers ordered less frequently than consumers but carried a noticeably higher average order value.',
    ],
    recommendations: [
      'Prioritise inventory and promotion budget behind the top revenue-contributing products.',
      'Replicate the West region playbook in the fastest-growing but under-served regions.',
      'Build a retention track for corporate accounts, where each lost account costs the most revenue.',
    ],
    methodology: [
      'Removed duplicates, standardised region and category labels, fixed date formats.',
      'Joined orders with product and customer tables in SQL to build one analysis table.',
      'Aggregated sales by product, region, month and segment using GROUP BY and window totals.',
      'Rebuilt the summary in Excel pivot tables and charts for stakeholder-friendly reporting.',
    ],
    chart: 'sales',
    accent: '#22d3ee',
    demo: false,
    featured: true,
  },
  {
    id: 'customer-churn-analysis',
    index: '02',
    title: 'Customer Churn Analysis',
    tools: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    toolLabel: 'Python + Pandas + Matplotlib + Seaborn',
    problem:
      'Customers were leaving, but there was no clear view of who was churning or what those customers had in common.',
    dataset:
      'Customer records — tenure, contract type, monthly charges, support contacts, payment method and churn flag.',
    description:
      'Performed data cleaning and exploratory data analysis on customer data to uncover churn drivers.',
    analysis: [
      'Churn distribution',
      'Customer behavior',
      'Churn by segment',
      'Churn trends',
      'Retention patterns',
    ],
    kpis: [
      { label: 'Churn Rate', value: '26.4%' },
      { label: 'Retained', value: '73.6%' },
      { label: 'Highest-Risk Segment', value: 'Month-to-month' },
      { label: 'Riskiest Window', value: 'First 6 months' },
    ],
    insights: [
      'Churn concentrates heavily in the first months of tenure — the onboarding window is the leak.',
      'Month-to-month contracts churn at several times the rate of long-term contracts.',
      'Customers with repeated support contacts churn far more often than those with none.',
    ],
    recommendations: [
      'Build a structured 90-day onboarding journey for new customers.',
      'Incentivise migration from month-to-month to annual contracts.',
      'Flag accounts with repeated support tickets for proactive outreach.',
    ],
    methodology: [
      'Handled missing values, cast numeric fields and encoded categorical columns in Pandas.',
      'Profiled distributions and correlations across tenure, charges and contract type.',
      'Visualised churn splits with Matplotlib and Seaborn (count plots, KDE, heatmaps).',
      'Summarised churn drivers into a short, decision-ready set of findings.',
    ],
    chart: 'churn',
    accent: '#a78bfa',
    demo: false,
    featured: true,
  },
  {
    id: 'economic-data-analysis',
    index: '03',
    title: 'Economic Data Analysis',
    tools: ['Excel', 'Tableau'],
    toolLabel: 'Excel + Tableau',
    problem:
      'Macroeconomic indicators were scattered across sources with no single view of how growth, inflation and employment moved together.',
    dataset:
      'Macroeconomic time series — GDP growth, inflation, unemployment, industrial output and market index by period.',
    description:
      'Analyzed macroeconomic indicators and market trends to identify growth patterns.',
    analysis: [
      'Economic indicators',
      'Growth trends',
      'Market patterns',
      'Time-series analysis',
      'Interactive charts',
    ],
    kpis: [
      { label: 'Indicators Tracked', value: '5' },
      { label: 'Trend Direction', value: 'Upward' },
      { label: 'View', value: 'Time-series' },
      { label: 'Output', value: 'Tableau dashboard' },
    ],
    insights: [
      'Growth and industrial output move together with a visible lag between the two series.',
      'Inflation spikes line up with softer market performance in the following periods.',
      'Smoothing the series with moving averages makes the underlying trend far easier to read than raw values.',
    ],
    recommendations: [
      'Track indicators as indexed series so different units can be compared on one axis.',
      'Pair every trend chart with a short written takeaway for non-technical readers.',
      'Use interactive period filters so viewers can isolate the cycle they care about.',
    ],
    methodology: [
      'Consolidated indicator tables in Excel and normalised period formats.',
      'Computed period-over-period change and rolling averages.',
      'Built linked Tableau views with a shared time filter.',
      'Annotated turning points so the dashboard tells the story on its own.',
    ],
    chart: 'economic',
    accent: '#38bdf8',
    demo: false,
    featured: true,
  },
];

/** Portfolio demo builds — clearly labelled as demonstration work. */
export const creativeProjects: Project[] = [
  {
    id: 'ecommerce-sales-intelligence',
    index: '04',
    title: 'E-Commerce Sales Intelligence',
    tools: ['Excel', 'SQL', 'Python', 'Power BI'],
    toolLabel: 'Excel · SQL · Python · Power BI',
    problem:
      'An online retailer needs one place to see revenue, profitability and order economics instead of five disconnected exports.',
    dataset:
      'Simulated e-commerce order lines — order id, date, category, channel, revenue, cost, quantity and customer id.',
    description:
      'A full revenue-and-profit command view: revenue, orders, average order value, profit, margin and active customers in one model.',
    analysis: [
      'Revenue & profit modelling',
      'Average order value',
      'Margin decomposition',
      'Category contribution',
      'Channel mix',
    ],
    kpis: [
      { label: 'Total Revenue', value: '₹18.4M', delta: '+14.2%' },
      { label: 'Total Orders', value: '24,860', delta: '+9.6%' },
      { label: 'Average Order Value', value: '₹740', delta: '+4.2%' },
      { label: 'Total Profit', value: '₹4.1M', delta: '+11.8%' },
      { label: 'Profit Margin', value: '22.3%', delta: '+0.9pp' },
      { label: 'Customer Count', value: '8,930', delta: '+6.4%' },
    ],
    insights: [
      'Margin, not revenue, separates the strong categories from the weak ones.',
      'Average order value rises sharply whenever bundled products are in the basket.',
      'A single channel drives most order volume but not most profit.',
    ],
    recommendations: [
      'Shift promotional spend toward high-margin rather than high-revenue categories.',
      'Expand bundling to categories with a low average order value.',
      'Report profit alongside revenue on every executive view.',
    ],
    methodology: [
      'Modelled orders, products and customers into a star schema.',
      'Built reusable measures for revenue, cost, profit, margin and AOV.',
      'Validated totals against the raw extract before publishing.',
      'Designed the dashboard around one question per visual.',
    ],
    chart: 'ecommerce',
    accent: '#22d3ee',
    demo: true,
    featured: false,
  },
  {
    id: 'customer-behavior-intelligence',
    index: '05',
    title: 'Customer Behavior Intelligence',
    tools: ['Python', 'SQL', 'Power BI'],
    toolLabel: 'Python · SQL · Power BI',
    problem:
      'Marketing treats every customer the same because nobody has separated the loyal base from the one-time buyers.',
    dataset:
      'Simulated customer activity — first and last order date, order count, spend, category affinity and churn flag.',
    description:
      'Segments customers by value and frequency, then tracks retention and churn signals across the lifecycle.',
    analysis: [
      'Customer segments',
      'Purchase frequency',
      'Customer lifetime behavior',
      'Retention',
      'Churn',
    ],
    kpis: [
      { label: 'Segments', value: '5' },
      { label: 'Repeat Rate', value: '46%' },
      { label: 'Retention (M3)', value: '61%' },
      { label: 'At-Risk Share', value: '18%' },
    ],
    insights: [
      'A small loyal segment accounts for a large share of total spend.',
      'Purchase frequency, not basket size, is the strongest signal of long-term value.',
      'Retention falls off a cliff between the first and second purchase.',
    ],
    recommendations: [
      'Run a dedicated second-purchase campaign inside the first 30 days.',
      'Protect the loyal segment with early access and service perks.',
      'Score at-risk customers weekly instead of quarterly.',
    ],
    methodology: [
      'Built recency / frequency / monetary features in SQL.',
      'Clustered customers into interpretable value tiers in Python.',
      'Tracked cohort retention month over month.',
      'Published the segments back to a Power BI decision view.',
    ],
    chart: 'behavior',
    accent: '#a78bfa',
    demo: true,
    featured: false,
  },
  {
    id: 'business-performance-dashboard',
    index: '06',
    title: 'Business Performance Dashboard',
    tools: ['Power BI', 'SQL', 'Excel'],
    toolLabel: 'Power BI · SQL · Excel',
    problem:
      'Monthly business reviews run on static slides that are out of date the moment they are exported.',
    dataset:
      'Simulated company performance data — monthly revenue, profit, sales volume, region and product line.',
    description:
      'A single executive view of revenue, profit, sales, regional performance, product performance and monthly trend.',
    analysis: [
      'Revenue',
      'Profit',
      'Sales',
      'Regional performance',
      'Product performance',
      'Monthly trends',
    ],
    kpis: [
      { label: 'Revenue', value: '₹12.7M', delta: '+7.8%' },
      { label: 'Profit', value: '₹2.9M', delta: '+5.1%' },
      { label: 'Sales Volume', value: '41,200', delta: '+6.2%' },
      { label: 'Best Region', value: 'West' },
    ],
    insights: [
      'Seasonality explains most of the month-to-month revenue swing.',
      'One region consistently beats plan while another consistently trails it.',
      'Product mix shifts quietly erode margin even in strong revenue months.',
    ],
    recommendations: [
      'Compare every month against both last month and the same month last year.',
      'Give each region an owner and a single accountable metric.',
      'Add a margin guardrail alongside the revenue target.',
    ],
    methodology: [
      'Consolidated source extracts into one SQL reporting view.',
      'Defined a shared metric dictionary so numbers match across teams.',
      'Built drill-through pages from company level to region and product.',
      'Automated refresh so the review always uses current data.',
    ],
    chart: 'performance',
    accent: '#38bdf8',
    demo: true,
    featured: false,
  },
];

export const allProjects = [...projects, ...creativeProjects];

/* ── Experience / Education / Certifications ────────────── */

export const experience = [
  {
    role: 'Aspiring Data Analyst',
    org: 'Independent Projects & Self-Learning',
    period: '2025 – Present',
    points: [
      'Built hands-on proficiency through self-directed projects and structured coursework.',
      'Interpreted datasets to identify trends and patterns.',
      'Built dashboards and reports using Excel, SQL, Power BI, and Tableau.',
      'Practiced data cleaning, transformation, analysis, and visualization.',
    ],
  },
] as const;

export const education = [
  {
    degree: 'B.A. in Economics',
    period: '2023 – 2025',
    institution: 'KV Pendarkar College, Mumbai University',
    note: 'Foundation in Statistics & Economics',
    highlights: ['Statistics', 'Econometrics fundamentals', 'Data interpretation', 'Research & reporting'],
  },
] as const;

export const certifications = [
  {
    name: 'Microsoft Excel for Data Analysis',
    issuer: 'Coursera',
    focus: 'Pivot tables, formulas, charting and spreadsheet analysis workflows.',
    tag: 'Excel',
  },
  {
    name: 'SQL for Data Analysis',
    issuer: 'Udemy',
    focus: 'Joins, aggregations, subqueries and analytical querying patterns.',
    tag: 'SQL',
  },
  {
    name: 'Python for Data Analysis',
    issuer: 'Udemy',
    focus: 'Pandas and NumPy for cleaning, transformation and exploratory analysis.',
    tag: 'Python',
  },
  {
    name: 'Power BI for Business Intelligence',
    issuer: 'Microsoft Learn',
    focus: 'Data modelling, DAX measures and interactive report design.',
    tag: 'Power BI',
  },
  {
    name: 'Data Visualization with Tableau',
    issuer: 'Coursera',
    focus: 'Dashboard construction, visual encoding and data storytelling.',
    tag: 'Tableau',
  },
] as const;

/* ── Process & approach ─────────────────────────────────── */

export const pipeline = [
  { step: '01', title: 'Collect', text: 'Gather the raw source data and confirm what each field really means.' },
  { step: '02', title: 'Clean', text: 'Remove duplicates, fix types, handle missing values and standardise labels.' },
  { step: '03', title: 'Transform', text: 'Join, reshape and engineer the fields the analysis actually needs.' },
  { step: '04', title: 'Analyze', text: 'Explore distributions, compare segments and test what the numbers suggest.' },
  { step: '05', title: 'Visualize', text: 'Build the chart or dashboard that makes the finding obvious at a glance.' },
  { step: '06', title: 'Insight', text: 'Write down what the data means in plain business language.' },
  { step: '07', title: 'Decision', text: 'Hand over a recommendation someone can act on this week.' },
] as const;

export const approach = [
  {
    title: 'Clean Data',
    text: 'Remove inconsistencies and prepare reliable datasets.',
    icon: 'sparkles',
  },
  {
    title: 'Find Patterns',
    text: 'Use analysis to uncover trends and relationships.',
    icon: 'search',
  },
  {
    title: 'Visualize',
    text: 'Transform complex information into understandable dashboards.',
    icon: 'chart',
  },
  {
    title: 'Generate Insights',
    text: 'Translate analytical findings into meaningful business insights.',
    icon: 'lightbulb',
  },
] as const;
