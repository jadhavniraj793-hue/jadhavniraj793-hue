/**
 * Generates `public/Niraj-Jadhav-Resume.pdf` from scratch — no external
 * dependency, just raw PDF 1.4 primitives with the standard Helvetica fonts.
 *
 *   node scripts/generate-resume.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/Niraj-Jadhav-Resume.pdf');

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 46;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = [0.09, 0.11, 0.16];
const MUTED = [0.38, 0.42, 0.49];
const ACCENT = [0.02, 0.45, 0.42]; // deep teal — reads well in print
const ACCENT_2 = [0.42, 0.16, 0.63]; // violet
const RULE = [0.82, 0.85, 0.88];

const ops = [];
let y = MARGIN;

const esc = (value) =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    // keep the output pure ASCII so WinAnsiEncoding is always safe
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x20-\x7E]/g, '');

function color([r, g, b]) {
  return `${r} ${g} ${b}`;
}

function text(value, { size = 10, font = 'F1', fill = INK, x = MARGIN, gap = 14 } = {}) {
  ops.push('BT');
  ops.push(`/${font} ${size} Tf`);
  ops.push(`${color(fill)} rg`);
  ops.push(`1 0 0 1 ${x.toFixed(2)} ${(PAGE_H - y - size).toFixed(2)} Tm`);
  ops.push(`(${esc(value)}) Tj`);
  ops.push('ET');
  y += gap;
}

function rule({ width = CONTENT_W, thickness = 0.8, fill = RULE, x = MARGIN, gap = 12 } = {}) {
  ops.push(`${color(fill)} rg`);
  ops.push(
    `${x.toFixed(2)} ${(PAGE_H - y).toFixed(2)} ${width.toFixed(2)} ${thickness} re f`
  );
  y += gap;
}

function sectionTitle(title, marker) {
  y += 8;
  text(title.toUpperCase(), { size: 11.5, font: 'F2', fill: ACCENT, gap: 4 });
  rule({ fill: marker ?? ACCENT, thickness: 1.4, width: 42, gap: 12 });
}

/** Naive but reliable wrapping using average Helvetica glyph width. */
function wrap(value, size, maxWidth = CONTENT_W, factor = 0.5) {
  const perLine = Math.max(18, Math.floor(maxWidth / (size * factor)));
  const words = String(value).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > perLine) {
      lines.push(line.trim());
      line = word;
    } else {
      line += ` ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function paragraph(value, { size = 9.6, gap = 13, fill = MUTED, indent = 0 } = {}) {
  for (const line of wrap(value, size, CONTENT_W - indent)) {
    text(line, { size, fill, x: MARGIN + indent, gap });
  }
}

function bullet(value, { size = 9.6, gap = 13, fill = INK, indent = 12 } = {}) {
  const lines = wrap(value, size, CONTENT_W - indent - 10);
  lines.forEach((line, index) => {
    if (index === 0) {
      ops.push('BT');
      ops.push(`/F1 ${size} Tf`);
      ops.push(`${color(ACCENT_2)} rg`);
      ops.push(
        `1 0 0 1 ${(MARGIN + indent - 9).toFixed(2)} ${(PAGE_H - y - size).toFixed(2)} Tm`
      );
      ops.push('(\\267) Tj'); // middle dot bullet
      ops.push('ET');
    }
    text(line, { size, fill, x: MARGIN + indent, gap: index === lines.length - 1 ? gap : gap });
  });
}

function row(left, right, { size = 10.5, leftFont = 'F2', fill = INK, rightFill = MUTED } = {}) {
  text(left, { size, font: leftFont, fill, gap: 13 });
  ops.push('BT');
  ops.push(`/F1 ${size - 1.2} Tf`);
  ops.push(`${color(rightFill)} rg`);
  const approx = String(right).length * (size - 1.2) * 0.5;
  ops.push(
    `1 0 0 1 ${(PAGE_W - MARGIN - approx).toFixed(2)} ${(
      PAGE_H -
      (y - 13) -
      (size - 1.2)
    ).toFixed(2)} Tm`
  );
  ops.push(`(${esc(right)}) Tj`);
  ops.push('ET');
}

/* ------------------------------------------------------------------ *
 * DOCUMENT
 * ------------------------------------------------------------------ */

// ---------- Header ----------
text('NIRAJ LAXMAN JADHAV', { size: 23, font: 'F2', fill: INK, gap: 22 });
text('Data Analyst & BI Specialist', { size: 12.5, font: 'F1', fill: ACCENT, gap: 16 });
paragraph(
  'Transforming complex raw data into actionable business intelligence and visual stories.',
  { size: 9.6, fill: MUTED, gap: 16 }
);
text(
  'Koper, Mumbai, India  |  +91 7208701481  |  jadhavniraj793@gmail.com  |  linkedin.com/in/niraj-jadhav-b31',
  { size: 8.8, fill: MUTED, gap: 4 }
);
rule({ thickness: 1.6, fill: ACCENT, gap: 16 });

// ---------- Summary ----------
sectionTitle('Career Summary');
paragraph(
  'Detail-oriented and analytically minded Data Analyst with hands-on project experience in Excel, SQL, Python, Power BI, and Tableau. Skilled at cleaning, analyzing, and visualizing data to uncover trends and support data-driven decision-making. Certified across the core BI and analytics toolchain, with a strong foundation in statistics from a B.A. in Economics. Eager to apply analytical rigor and problem-solving skills to deliver measurable business insights.',
  { gap: 13.5 }
);

// ---------- Core Skills ----------
sectionTitle('Core Skills');
const SKILLS = [
  ['Data Analysis & Tools', 'Excel (Pivot Tables, VLOOKUP, Charts), SQL (Joins, Aggregations, Subqueries), Python (Pandas, NumPy, Matplotlib, Seaborn)'],
  ['Business Intelligence', 'Power BI, Tableau, Interactive Dashboards, Data Storytelling'],
  ['Techniques', 'Data Cleaning, Data Transformation, Exploratory Data Analysis (EDA), Trend & Pattern Analysis'],
  ['Core Competencies', 'Analytical Thinking, Problem Solving, Attention to Detail, Data Visualization, Quick Learning, Communication'],
];
for (const [label, value] of SKILLS) {
  const lines = wrap(value, 9.6, CONTENT_W - 118);
  lines.forEach((line, index) => {
    if (index === 0) {
      text(label, { size: 9.6, font: 'F2', fill: INK, gap: 13, x: MARGIN });
      // rewind one line and place value to the right of the label
      y -= 13;
      text(line, { size: 9.6, fill: MUTED, x: MARGIN + 122, gap: 13 });
    } else {
      text(line, { size: 9.6, fill: MUTED, x: MARGIN + 122, gap: 13 });
    }
  });
}

// ---------- Projects ----------
sectionTitle('Featured Projects');

const PROJECTS = [
  {
    title: 'Sales Data Analysis',
    meta: 'Excel, SQL  |  2024',
    points: [
      'Cleaned and analyzed a multi-region sales dataset to identify top-performing products, regions, and customer segments.',
      'Built pivot tables and charts in Excel to surface actionable insights for stakeholders.',
      'Wrote complex SQL queries (joins, aggregations, filtering) to extract and analyze key sales metrics.',
    ],
  },
  {
    title: 'Customer Churn Analysis',
    meta: 'Python (Pandas, Matplotlib, Seaborn)  |  2024',
    points: [
      'Performed deep data cleaning and exploratory data analysis (EDA) to detect churn patterns.',
      'Visualized customer behavior trends and correlation matrices.',
      'Identified key factors influencing churn and proposed data-backed retention strategies.',
    ],
  },
  {
    title: 'Economic Data Analysis',
    meta: 'Excel, Tableau  |  2023',
    points: [
      'Analyzed macroeconomic indicators and market trends to identify economic growth drivers.',
      'Designed interactive Tableau dashboards for clear presentation to non-technical audiences.',
      'Delivered insights supporting academic and analytical business conclusions.',
    ],
  },
];

for (const project of PROJECTS) {
  y += 2;
  row(project.title, project.meta);
  for (const point of project.points) bullet(point);
}

// ---------- Experience ----------
sectionTitle('Experience');
row(
  'Aspiring Data Analyst — Independent Projects & Self-Learning',
  '2025 - Present',
  { size: 10.2 }
);
text('Self-directed  |  Remote', { size: 9, fill: MUTED, gap: 12 });
[
  'Built end-to-end data pipelines: ingestion, cleaning, transformation and validation on real-world datasets.',
  'Developed interactive dashboards in Power BI and Tableau to track business KPIs and performance trends.',
  'Ran exploratory analysis in Python (Pandas, NumPy, Seaborn) to surface correlations, outliers and segment behaviour.',
  'Modelled real-world business metrics — revenue, churn, retention and growth — with stakeholder-ready reporting.',
].forEach((point) => bullet(point));

// ---------- Education ----------
sectionTitle('Education');
row('B.A. in Economics', '2023 - 2025', { size: 10.2 });
text('KV Pendarkar College, Mumbai University', { size: 9, fill: MUTED, gap: 12 });
[
  'Statistical foundation: descriptive statistics, probability, hypothesis testing and econometrics.',
  'Applied economic theory to live market data, drawing analytical conclusions from primary indicators.',
].forEach((point) => bullet(point));

// ---------- Certifications ----------
sectionTitle('Certifications');
[
  'Microsoft Excel for Data Analysis — Coursera',
  'SQL for Data Analysis — Udemy',
  'Python for Data Analysis — Udemy',
  'Power BI for Business Intelligence — Microsoft Learn',
  'Data Visualization with Tableau — Coursera',
].forEach((cert) => bullet(cert, { fill: INK }));

// ---------- Footer ----------
y += 6;
rule({ thickness: 0.8, fill: RULE, gap: 10 });
text('Generated from nirajjadhav.dev portfolio  ·  built with Next.js, React Three Fiber and Framer Motion', {
  size: 8,
  fill: MUTED,
  gap: 10,
});

/* ------------------------------------------------------------------ *
 * PDF ASSEMBLY
 * ------------------------------------------------------------------ */
const content = ops.join('\n');
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
];

let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
const offsets = [];
objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(pdf, 'latin1'));
console.log(`✓ résumé written → ${OUT} (${(Buffer.byteLength(pdf, 'latin1') / 1024).toFixed(1)} KB)`);
