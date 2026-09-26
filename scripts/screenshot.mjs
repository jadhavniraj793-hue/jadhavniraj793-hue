/* Visual QA for the portfolio — run by .github/workflows/screenshot.yml
   Takes full-page section screenshots (desktop + mobile hero) with headless
   Chrome and saves them to shots/. */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

fs.mkdirSync("shots", { recursive: true });

const exe = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const browser = await puppeteer.launch({
  executablePath: exe,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://127.0.0.1:8000/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4500)); // preloader + hero entrance

const sections = ["hero", "about", "skills", "projects", "experience", "education", "contact"];
for (const id of sections) {
  await page.evaluate(
    (sel) => {
      const el = sel === "hero" ? document.body : document.getElementById(sel);
      el.scrollIntoView({ behavior: "instant", block: "start" });
      if (sel !== "hero") window.scrollBy(0, -70);
    },
    id
  );
  await new Promise((r) => setTimeout(r, 2000)); // reveal animations settle
  await page.screenshot({ path: `shots/${id}.png` });
}

// mobile hero + mobile skills
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
await page.goto("http://127.0.0.1:8000/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4500));
await page.screenshot({ path: "shots/mobile-hero.png" });
await page.evaluate(() => document.getElementById("skills").scrollIntoView({ behavior: "instant" }));
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: "shots/mobile-skills.png" });

console.log("PAGE ERRORS:", errors.length ? JSON.stringify(errors, null, 2) : "none");
await browser.close();
