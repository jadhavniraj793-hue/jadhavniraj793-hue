/**
 * Automated layout / runtime QA for the portfolio.
 *
 * Loads the production build in headless Chrome at every supported breakpoint,
 * scrolls the whole page so lazy sections mount, and asserts:
 *   - no page or console errors, no failed requests
 *   - no horizontal overflow, and no element sticking out of the viewport
 *   - every navigable section exists and has real height
 *   - charts and 3D canvases actually rendered
 *
 * Findings are emitted as GitHub Actions annotations (::error:: / ::notice::)
 * so they show up in the run summary. Exits non-zero when something breaks.
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8000/';
const EXE = process.env.CHROME_PATH || '/usr/bin/google-chrome';

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1024', width: 1024, height: 768 },
  { name: '768', width: 768, height: 1024 },
  { name: '480', width: 480, height: 900 },
  { name: '390', width: 390, height: 844 },
];

const SECTIONS = [
  'home',
  'about',
  'skills',
  'analytics-lab',
  'projects',
  'creative',
  'experience',
  'education',
  'certifications',
  'process',
  'approach',
  'github',
  'contact',
];

const problems = [];
const notes = [];

const browser = await puppeteer.launch({
  executablePath: EXE,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

  const runtime = [];
  page.on('pageerror', (e) => runtime.push(`pageerror: ${String(e).slice(0, 180)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') runtime.push(`console: ${m.text().slice(0, 180)}`);
  });
  page.on('requestfailed', (r) => {
    const url = r.url();
    // GitHub API calls are expected to fail when the runner is rate-limited.
    if (url.includes('api.github.com')) return;
    runtime.push(`request failed: ${url.slice(0, 120)} (${r.failure()?.errorText})`);
  });

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3500));

  // Walk the page so every deferred section mounts.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 260));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
  });
  await new Promise((r) => setTimeout(r, 1500));

  const report = await page.evaluate((sections) => {
    const out = {
      overflowX: document.documentElement.scrollWidth - window.innerWidth,
      missing: [],
      shallow: [],
      wide: [],
      charts: document.querySelectorAll('.recharts-surface').length,
      canvases: [...document.querySelectorAll('canvas')].map((c) => `${c.width}x${c.height}`),
      pageHeight: document.body.scrollHeight,
      h1: document.querySelector('h1')?.textContent?.trim().slice(0, 60) ?? null,
      navLinks: document.querySelectorAll('header nav button').length,
    };

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) {
        out.missing.push(id);
        continue;
      }
      const rect = el.getBoundingClientRect();
      if (rect.height < 220) out.shallow.push(`${id}:${Math.round(rect.height)}px`);
    }

    const tol = 2;
    for (const el of document.querySelectorAll('body *')) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.visibility === 'hidden' || style.display === 'none') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.right > window.innerWidth + tol || rect.left < -tol) {
        // Ignore intentionally scrollable strips and decorative glows.
        let node = el;
        let scrollable = false;
        while (node && node !== document.body) {
          const s = getComputedStyle(node);
          if (['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX) || ['hidden', 'clip'].includes(s.overflow)) {
            scrollable = true;
            break;
          }
          node = node.parentElement;
        }
        if (scrollable || el.getAttribute('aria-hidden') === 'true') continue;
        out.wide.push(
          `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} [${Math.round(rect.left)}→${Math.round(rect.right)}]`,
        );
      }
    }
    out.wide = [...new Set(out.wide)].slice(0, 5);
    return out;
  }, SECTIONS);

  const tag = `${vp.name}px`;
  if (runtime.length) problems.push(`${tag}: ${[...new Set(runtime)].slice(0, 3).join(' | ')}`);
  if (report.overflowX > 2) problems.push(`${tag}: horizontal overflow of ${report.overflowX}px`);
  if (report.missing.length) problems.push(`${tag}: missing sections ${report.missing.join(', ')}`);
  if (report.shallow.length) problems.push(`${tag}: suspiciously short sections ${report.shallow.join(', ')}`);
  if (report.wide.length) problems.push(`${tag}: elements outside viewport → ${report.wide.join(' ;; ')}`);
  if (report.charts === 0) problems.push(`${tag}: no Recharts surfaces rendered`);
  if (!report.canvases.length) problems.push(`${tag}: no WebGL canvas rendered`);
  if (report.canvases.some((c) => c.startsWith('0x') || c.endsWith('x0'))) {
    problems.push(`${tag}: zero-sized canvas (${report.canvases.join(',')})`);
  }

  notes.push(
    `${tag}: height=${report.pageHeight} charts=${report.charts} canvases=${report.canvases.length} nav=${report.navLinks} h1="${report.h1}"`,
  );

  await page.close();
}

await browser.close();

for (const n of notes) console.log(`::notice title=QA::${n}`);
for (const p of problems) console.log(`::error title=Layout QA::${p}`);
console.log(problems.length ? `\n${problems.length} problems found` : '\nLayout QA passed at every breakpoint.');
process.exit(problems.length ? 1 : 0);
