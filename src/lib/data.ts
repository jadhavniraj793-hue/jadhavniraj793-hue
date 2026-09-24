/**
 * Single source of truth for every piece of personal / professional content
 * rendered on the site. Editing this file updates the whole portfolio.
 */

export const profile = {
  name: 'Niraj Laxman Jadhav',
  shortName: 'Niraj Jadhav',
  initials: 'NJ',
  title: 'Data Analyst & BI Specialist',
  roles: ['Data Analyst', 'BI Specialist', 'SQL Analyst', 'Power BI Developer', 'Data Storyteller'],
  tagline:
    'Transforming Complex Raw Data into Actionable Business Intelligence & Visual Stories.',
  about:
    'Detail-oriented and analytically minded Data Analyst with hands-on project experience in Excel, SQL, Python, Power BI, and Tableau. Skilled at cleaning, analyzing, and visualizing data to uncover trends and support data-driven decision-making. Certified across the core BI and analytics toolchain, with a strong foundation in statistics from a B.A. in Economics. Eager to apply analytical rigor and problem-solving skills to deliver measurable business insights.',
  location: 'Koper, Mumbai, India',
  locationShort: 'Mumbai, India',
  phone: '+91 7208701481',
  phoneHref: '+917208701481',
  whatsappHref: 'https://wa.me/917208701481',
  email: 'jadhavniraj793@gmail.com',
  linkedin: 'https://linkedin.com/in/niraj-jadhav-b31',
  github: 'https://github.com/jadhavniraj793-hue',
  resumePath: '/Niraj-Jadhav-Resume.pdf',
  availability: 'Open to Data Analyst / BI Analyst roles',
} as const;

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
] as const;

export const heroStats = [
  { value: '3+', label: 'Analytics Projects', hint: 'end-to-end' },
  { value: '5', label: 'Certifications', hint: 'BI toolchain' },
  { value: '6+', label: 'Tools Mastered', hint: 'Excel · SQL · Python · BI' },
  { value: '100%', label: 'Data-Driven', hint: 'analytical rigour' },
] as const;

export const aboutBadges = [
  {
    icon: '📊',
    title: 'B.A. in Economics',
    subtitle: 'Statistical Foundation',
    accent: 'cyan',
  },
  {
    icon: '🔍',
    title: 'End-to-End Analytics Pipeline',
    subtitle: 'Raw data → clean model → insight',
    accent: 'violet',
  },
  {
    icon: '📈',
    title: 'Data Storytelling & Dashboards',
    subtitle: 'Insight that stakeholders act on',
    accent: 'cyan',
  },
] as const;

export type SkillGroup = {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  accent: 'cyan' | 'violet' | 'mixed';
  skills: { name: string; detail?: string; level: number }[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'analysis',
    title: 'Data Analysis & Tools',
    icon: 'Database',
    blurb: 'Wrangling raw records into trustworthy, query-ready datasets.',
    accent: 'cyan',
    skills: [
      { name: 'Excel', detail: 'Pivot Tables · VLOOKUP · Charts', level: 92 },
      { name: 'SQL', detail: 'Joins · Aggregations · Subqueries', level: 88 },
      { name: 'Python', detail: 'Pandas · NumPy · Matplotlib · Seaborn', level: 82 },
    ],
  },
  {
    id: 'bi',
    title: 'Business Intelligence & Dashboards',
    icon: 'BarChart3',
    blurb: 'Designing dashboards that turn metrics into decisions.',
    accent: 'violet',
    skills: [
      { name: 'Power BI', detail: 'Data models · DAX measures', level: 85 },
      { name: 'Tableau', detail: 'Interactive storyboards', level: 80 },
      { name: 'Interactive Dashboards', detail: 'KPI drill-downs', level: 87 },
      { name: 'Data Storytelling', detail: 'Narrative-first visuals', level: 84 },
    ],
  },
  {
    id: 'techniques',
    title: 'Analytical Techniques',
    icon: 'Workflow',
    blurb: 'The method behind every reliable number in the report.',
    accent: 'mixed',
    skills: [
      { name: 'Data Cleaning', detail: 'Nulls · duplicates · outliers', level: 90 },
      { name: 'Data Transformation', detail: 'Reshape · enrich · normalise', level: 86 },
      { name: 'Exploratory Data Analysis', detail: 'Distributions · correlation', level: 88 },
      { name: 'Trend & Pattern Analysis', detail: 'Seasonality · cohorts · segments', level: 85 },
    ],
  },
  {
    id: 'competencies',
    title: 'Core Competencies',
    icon: 'Sparkles',
    blurb: 'How the work gets delivered — and communicated.',
    accent: 'cyan',
    skills: [
      { name: 'Analytical Thinking', level: 95 },
      { name: 'Problem Solving', level: 93 },
      { name: 'Attention to Detail', level: 94 },
      { name: 'Data Visualization', level: 90 },
      { name: 'Quick Learning', level: 96 },
      { name: 'Communication', level: 88 },
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  tech: string[];
  summary: string;
  highlights: string[];
  tags: string[];
  visual: 'bars' | 'line' | 'dashboard';
  accent: 'cyan' | 'violet' | 'mixed';
  index: string;
};

export const projects: Project[] = [
  {
    id: 'sales-data-analysis',
    index: '01',
    title: 'Sales Data Analysis',
    year: '2024',
    category: 'Sales Analytics · KPI Reporting',
    tech: ['Excel', 'SQL'],
    summary:
      'A multi-region sales dataset cleansed, modelled and interrogated with SQL and Excel to expose which products, regions and customer segments actually drive revenue.',
    highlights: [
      'Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, and customer segments.',
      'Built pivot tables and charts in Excel to surface actionable insights for stakeholders.',
      'Wrote complex SQL queries (joins, aggregations, filtering) to extract and analyze key sales metrics.',
    ],
    tags: ['SQL', 'Excel', 'Sales Analytics', 'KPI Dashboards'],
    visual: 'bars',
    accent: 'cyan',
  },
  {
    id: 'customer-churn-analysis',
    index: '02',
    title: 'Customer Churn Analysis',
    year: '2024',
    category: 'EDA · Behavioural Analytics',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    summary:
      'An exploratory churn study in Python: messy customer data cleaned, behaviour visualised, and the strongest churn drivers isolated to justify retention strategy.',
    highlights: [
      'Performed deep data cleaning and exploratory data analysis (EDA) to detect churn patterns.',
      'Visualized customer behavior trends and correlation matrices.',
      'Identified key factors influencing churn and proposed data-backed retention strategies.',
    ],
    tags: ['Python', 'Pandas', 'Seaborn', 'EDA', 'Churn Prediction'],
    visual: 'line',
    accent: 'violet',
  },
  {
    id: 'economic-data-analysis',
    index: '03',
    title: 'Economic Data Analysis',
    year: '2023',
    category: 'Macro Trends · Visual Storytelling',
    tech: ['Excel', 'Tableau'],
    summary:
      'Macroeconomic indicators tracked over time and translated into interactive Tableau dashboards that non-technical audiences could read in seconds.',
    highlights: [
      'Analyzed macroeconomic indicators and market trends to identify economic growth drivers.',
      'Designed interactive Tableau dashboards for clear presentation to non-technical audiences.',
      'Delivered insights supporting academic and analytical business conclusions.',
    ],
    tags: ['Tableau', 'Economics', 'Data Visualization', 'Market Trends'],
    visual: 'dashboard',
    accent: 'mixed',
  },
];

export const experience = [
  {
    id: 'exp-1',
    role: 'Aspiring Data Analyst — Independent Projects & Self-Learning',
    org: 'Self-directed · Remote',
    period: '2025 — Present',
    type: 'experience' as const,
    points: [
      'Building end-to-end data pipelines: ingestion, cleaning, transformation and validation on real-world datasets.',
      'Developing interactive dashboards in Power BI and Tableau to track business KPIs and performance trends.',
      'Running exploratory analysis in Python (Pandas, NumPy, Seaborn) to surface correlations and outliers.',
      'Modelling real-world business metrics — revenue, churn, retention, growth — with stakeholder-ready reporting.',
    ],
    skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Pandas'],
  },
  {
    id: 'edu-1',
    role: 'B.A. in Economics',
    org: 'KV Pendarkar College, Mumbai University',
    period: '2023 — 2025',
    type: 'education' as const,
    points: [
      'Statistical foundation: descriptive statistics, probability, hypothesis testing and econometrics.',
      'Applied economic theory to live market data, building analytical conclusions from primary indicators.',
      'Capstone analysis of macroeconomic trends presented through interactive Tableau dashboards.',
    ],
    skills: ['Statistics', 'Econometrics', 'Tableau', 'Excel'],
  },
];

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  focus: string;
  skills: string[];
  accent: 'cyan' | 'violet' | 'mixed';
};

export const certifications: Certification[] = [
  {
    id: 'excel',
    title: 'Microsoft Excel for Data Analysis',
    issuer: 'Coursera',
    focus: 'Pivot tables, lookups, formula-driven models and charting for analyst workflows.',
    skills: ['Pivot Tables', 'VLOOKUP', 'Charts', 'Cleaning'],
    accent: 'cyan',
  },
  {
    id: 'sql',
    title: 'SQL for Data Analysis',
    issuer: 'Udemy',
    focus: 'Query design with joins, aggregations, subqueries and filtering on real datasets.',
    skills: ['Joins', 'Aggregations', 'Subqueries', 'Filtering'],
    accent: 'mixed',
  },
  {
    id: 'python',
    title: 'Python for Data Analysis',
    issuer: 'Udemy',
    focus: 'Pandas and NumPy for wrangling, plus Matplotlib / Seaborn for exploratory visuals.',
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'],
    accent: 'violet',
  },
  {
    id: 'powerbi',
    title: 'Power BI for Business Intelligence',
    issuer: 'Microsoft Learn',
    focus: 'Data modelling, DAX measures and interactive report design for business users.',
    skills: ['Data Models', 'DAX', 'Reports', 'KPI Design'],
    accent: 'cyan',
  },
  {
    id: 'tableau',
    title: 'Data Visualization with Tableau',
    issuer: 'Coursera',
    focus: 'Visual encodings, dashboards and storyboards built for non-technical audiences.',
    skills: ['Dashboards', 'Storyboards', 'Visual Encoding'],
    accent: 'violet',
  },
];

export const orbitSkills = [
  'Excel',
  'SQL',
  'Python',
  'Pandas',
  'NumPy',
  'Power BI',
  'Tableau',
  'Matplotlib',
  'Seaborn',
  'DAX',
  'EDA',
  'Statistics',
  'Data Cleaning',
  'Dashboards',
  'Storytelling',
  'KPI Design',
  'Joins',
  'Pivot Tables',
] as const;

export const sectionMeta = {
  about: { index: '01', label: 'About', title: 'Career Summary', kicker: 'The analyst behind the dashboards' },
  skills: { index: '02', label: 'Skills', title: 'Core Skills', kicker: 'A full analytics stack, one orbit' },
  projects: { index: '03', label: 'Projects', title: 'Featured Projects', kicker: 'Real datasets, real conclusions' },
  journey: { index: '04', label: 'Journey', title: 'Experience & Education', kicker: 'The path so far' },
  certifications: { index: '05', label: 'Certifications', title: 'Certifications', kicker: 'Verified across the BI toolchain' },
  contact: { index: '06', label: 'Contact', title: 'Contact', kicker: "Let's turn your data into decisions" },
} as const;
