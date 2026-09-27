/* Visual QA for the portfolio — run by .github/workflows/screenshot.yml
   Builds are served from dist/; this script walks the page with headless Chrome
   and saves full-section screenshots to shots/ plus a console-error report. */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

fs.mkdirSync('shots', { recursive: true });

const exe = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const base = process.env.BASE_URL || 'http://127.0.0.1:8000/';

const browser = await puppeteer.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});

const errors = [];
const sections = ['about', 'skills', 'analytics-lab', 'projects', 'creative', 'experience', 'education', 'certifications', 'process', 'github', 'contact'];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => errors.push(`[${vp.name}] ${String(e).slice(0, 300)}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${vp.name}] console: ${m.text().slice(0, 300)}`);
  });

  await page.goto(base, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: `shots/${vp.name}-hero.png` });

  for (const id of sections) {
    await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' });
    }, id);
    await new Promise((r) => setTimeout(r, 1800));
    await page.screenshot({ path: `shots/${vp.name}-${id}.png` });
  }
  await page.close();
}

fs.writeFileSync('shots/console-report.json', JSON.stringify({ errors: [...new Set(errors)] }, null, 2));
console.log(errors.length ? `${errors.length} console/page errors — see shots/console-report.json` : 'No console errors.');
await browser.close();
