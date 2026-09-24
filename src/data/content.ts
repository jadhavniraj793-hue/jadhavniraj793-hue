/**
 * Central content source for the portfolio.
 * Every piece of information here comes directly from the material provided by
 * Niraj — nothing is invented. If a value is unknown it is simply omitted
 * (e.g. issuing organisations / dates that were never specified).
 */

export const profile = {
  firstName: 'Niraj',
  fullName: 'Niraj Laxman Jadhav',
  displayName: 'NIRAJ JADHAV',
  initials: 'NJ',
  role: 'Data Analyst',
  location: 'Mumbai, India',
  phoneDisplay: '+91 72087 01481',
  phoneHref: 'tel:+917208701481',
  email: 'jadhavniraj793@gmail.com',
  linkedin: 'https://www.linkedin.com/in/niraj-jadhav-b313ba39a',
  github: 'https://github.com/jadhavniraj793-hue',
  headline: 'Turning Data Into Meaningful Insights',
  subheadline:
    'Data Analyst skilled in Excel, SQL, Python, Power BI and Tableau, passionate about transforming raw data into clear, actionable business insights.',
  about:
    'I am a detail-oriented and analytically minded Data Analyst with hands-on experience in Excel, SQL, Python, Power BI, and Tableau. I enjoy cleaning, analyzing, and visualizing data to uncover trends and support data-driven decision-making.',
};

/* ---------------------------------- Skills --------------------------------- */

export type SkillCategory =
  | 'Spreadsheets'
  | 'Data Querying'
  | 'Programming & Libraries'
  | 'Visualization & BI'
  | 'Analytics Techniques';

export interface Skill {
  name: string;
  category: SkillCategory;
  /** Visual design element only — NOT a claim of certification or expertise level. */
  level: number;
  color: string;
  icon: string;
}

export const skills: Skill[] = [
  { name: 'Excel', category: 'Spreadsheets', level: 90, color: '#4ade80', icon: 'FileSpreadsheet' },
  { name: 'Advanced Excel', category: 'Spreadsheets', level: 85, color: '#34d399', icon: 'Table' },
  { name: 'SQL', category: 'Data Querying', level: 88, color: '#60a5fa', icon: 'Database' },
  { name: 'Python', category: 'Programming & Libraries', level: 82, color: '#fbbf24', icon: 'Code' },
  { name: 'Pandas', category: 'Programming & Libraries', level: 85, color: '#a78bfa', icon: 'LayoutGrid' },
  { name: 'NumPy', category: 'Programming & Libraries', level: 80, color: '#38bdf8', icon: 'Boxes' },
  { name: 'Matplotlib', category: 'Programming & Libraries', level: 78, color: '#e879f9', icon: 'LineChart' },
  { name: 'Seaborn', category: 'Programming & Libraries', level: 78, color: '#22d3ee', icon: 'Waves' },
  { name: 'Power BI', category: 'Visualization & BI', level: 86, color: '#facc15', icon: 'BarChart3' },
  { name: 'Tableau', category: 'Visualization & BI', level: 80, color: '#f472b6', icon: 'PieChart' },
  { name: 'Data Cleaning', category: 'Analytics Techniques', level: 90, color: '#818cf8', icon: 'Filter' },
  { name: 'Data Transformation', category: 'Analytics Techniques', level: 84, color: '#60a5fa', icon: 'Workflow' },
  { name: 'Exploratory Data Analysis', category: 'Analytics Techniques', level: 86, color: '#2dd4bf', icon: 'Search' },
  { name: 'Data Visualization', category: 'Analytics Techniques', level: 88, color: '#c084fc', icon: 'Activity' },
  { name: 'Trend & Pattern Analysis', category: 'Analytics Techniques', level: 82, color: '#34d399', icon: 'TrendingUp' },
  { name: 'Business Intelligence', category: 'Analytics Techniques', level: 80, color: '#7dd3fc', icon: 'Briefcase' },
];

/* --------------------------------- Projects -------------------------------- */

export interface Project {
  index: string;
  title: string;
  tools: string[];
  toolCategories: string[];
  description: string;
  color: string;
  icon: string;
  /** Approach points are derived strictly from the provided description. */
  approach: string[];
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'Sales Data Analysis',
    tools: ['Excel', 'SQL'],
    toolCategories: ['Spreadsheet Analytics', 'Query & Aggregation'],
    description:
      'Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, and customer segments. Built pivot tables and charts in Excel and used SQL joins, aggregations and filtering to analyze key sales metrics.',
    color: '#4ade80',
    icon: 'Table',
    approach: [
      'Cleaned and prepared a multi-region sales dataset',
      'Identified top-performing products, regions and customer segments',
      'Built pivot tables and charts in Excel',
      'Used SQL joins, aggregations and filtering for key sales metrics',
    ],
  },
  {
    index: '02',
    title: 'Customer Churn Analysis',
    tools: ['Python', 'Pandas', 'Matplotlib', 'Seaborn'],
    toolCategories: ['Data Wrangling', 'Exploratory Analysis', 'Statistical Charts'],
    description:
      'Performed data cleaning and exploratory data analysis on customer data to identify churn patterns, customer behavior trends and factors influencing churn.',
    color: '#60a5fa',
    icon: 'TrendingUp',
    approach: [
      'Performed data cleaning on customer data',
      'Ran exploratory data analysis (EDA) end to end',
      'Identified churn patterns and customer behavior trends',
      'Surfaced factors influencing churn with Matplotlib & Seaborn visuals',
    ],
  },
  {
    index: '03',
    title: 'Economic Data Analysis',
    tools: ['Excel', 'Tableau'],
    toolCategories: ['Macro Analysis', 'Interactive Dashboards'],
    description:
      'Analyzed macroeconomic indicators and market trends using Excel and designed interactive Tableau dashboards to communicate findings clearly.',
    color: '#c084fc',
    icon: 'PieChart',
    approach: [
      'Analyzed macroeconomic indicators and market trends in Excel',
      'Structured findings for clear communication',
      'Designed interactive Tableau dashboards',
      'Turned analysis into an intuitive visual story',
    ],
  },
];

/* ------------------------------- Certifications ---------------------------- */

export interface Certificate {
  id: string;
  title: string;
  issuer?: string;
  kind: string;
  date?: string;
  certId?: string;
  skills?: string[];
  accent: string;
  /** Optional scanned image placed in public/certificates/<id>.<ext> — shown when present. */
  image?: string;
}

export const certificates: Certificate[] = [
  {
    id: 'oneroadmap-data-analyst',
    title: 'Data Analyst — Certificate of Achievement',
    issuer: 'OneRoadmap',
    kind: 'Certificate of Achievement',
    date: 'Certified: September 2, 2026',
    certId: 'CERT-80401CE8',
    accent: '#a78bfa',
  },
  {
    id: 'aws-ai-practitioner-practice',
    title: 'Official Practice Question Set: AWS Certified AI Practitioner',
    issuer: 'AWS Training & Certification',
    kind: 'Official Practice Question Set',
    date: 'Completed: August 8, 2026',
    accent: '#fbbf24',
  },
  {
    id: 'azure-essentials',
    title: 'Microsoft Azure Essentials Professional Certificate',
    issuer: 'Microsoft + LinkedIn Learning',
    kind: 'Professional Certificate',
    date: 'Completed: September 4, 2026',
    accent: '#60a5fa',
  },
  {
    id: 'deloitte-data-analytics-simulation',
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte / Forage',
    kind: 'Job Simulation',
    date: 'Completed: August 5, 2026',
    accent: '#4ade80',
  },
  {
    id: 'business-analytics-excel',
    title: 'Business Analytics with Excel',
    issuer: 'Simplilearn SkillUp',
    kind: 'Declaration of Completion',
    date: 'August 9, 2026',
    certId: '10578697',
    accent: '#34d399',
    image: `${import.meta.env.BASE_URL}certificates/business-analytics-excel.jpg`,
  },
  {
    id: 'introduction-to-sql',
    title: 'Introduction to SQL',
    kind: 'Certificate',
    date: 'September 5, 2026',
    accent: '#38bdf8',
  },
  {
    id: 'genai-data-analytics-simulation',
    title: 'GenAI Powered Data Analytics Job Simulation',
    kind: 'Job Simulation',
    date: 'Completed: August 7, 2026',
    accent: '#e879f9',
    skills: [
      'Exploratory data analysis',
      'Risk profiling',
      'Predicting delinquency with AI',
      'Business reporting',
      'Data storytelling',
      'AI-driven collections strategy',
    ],
  },
  {
    id: 'tcs-ion-career-edge',
    title: 'TCS iON Career Edge — Young Professional',
    issuer: 'TCS iON',
    kind: 'Career Program',
    accent: '#22d3ee',
    skills: [
      'Communication Skills',
      'Thinking Skills',
      'Presentation Skills',
      'Soft Skills',
      'Resume Writing',
      'Group Discussion',
      'Interview Skills',
      'Business Etiquette',
      'Email Writing',
      'Problem-Solving',
      'Accounting Fundamentals',
      'IT Foundation Skills',
      'Artificial Intelligence Overview',
    ],
  },
];

/* --------------------------------- Experience ------------------------------- */

export const experience = {
  role: 'Aspiring Data Analyst',
  org: 'Independent Projects & Self-Learning',
  period: '2025 – Present',
  points: [
    'Hands-on data analysis projects',
    'Dataset interpretation',
    'Trend and pattern analysis',
    'Dashboard creation',
    'Data cleaning',
    'Data transformation',
    'Data visualization',
    'End-to-end analytics workflows',
  ],
};

/* --------------------------------- Education -------------------------------- */

export const education = {
  degree: 'B.A. in Economics',
  institution: 'KV Pendarkar College, Mumbai University',
  period: '2023 – 2025',
  location: 'Mumbai, India',
};

/* -------------------------------- Data pipeline ----------------------------- */

export const pipelineStages = [
  { name: 'Excel', color: '#4ade80', icon: 'FileSpreadsheet' },
  { name: 'SQL', color: '#60a5fa', icon: 'Database' },
  { name: 'Python', color: '#fbbf24', icon: 'Code' },
  { name: 'Power BI', color: '#facc15', icon: 'BarChart3' },
  { name: 'Tableau', color: '#f472b6', icon: 'PieChart' },
  { name: 'Business Insights', color: '#22d3ee', icon: 'Lightbulb' },
];

export const pipelineOutcomes = ['RAW DATA', 'ANALYSIS', 'INSIGHTS', 'DECISIONS'];

/* ---------------------------------- Stats ----------------------------------- */
/* Derived purely from the real content of this portfolio — no invented metrics. */

export const stats = [
  { value: 8, suffix: '', label: 'Certifications' },
  { value: 3, suffix: '', label: 'Analytics Projects' },
  { value: 16, suffix: '', label: 'Skills & Tools' },
  { value: 5, suffix: '', label: 'Core BI Tools' },
];

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
