/* Visual QA for the portfolio — run by .github/workflows/screenshot.yml
   Takes full-page section screenshots (desktop + mobile hero) with headless
   Chrome and saves them to shots/. */
import puppeteer from "puppeteer-core";
import fs from "node:fs";

fs.mkdirSync("shots", { recursive: true });

const exe = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const browser = await puppeteer.launch({
  executablePath: exe,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });

await page.goto("http://127.0.0.1:8000/", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4500)); // preloader + hero entrance

const sections = ["hero", "about", "skills", "projects", "experience", "education", "contact"];
let desktopDiag = null;
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
  if (id === "hero") {
    desktopDiag = await page.evaluate(() => {
      const bg = window.__bg3d;
      return {
        hookSet: !!bg,
        initError: window.__bg3dError || null,
        rendererActive: bg ? !bg.renderer.getContext().isContextLost() : false,
        drawCalls: bg ? bg.renderer.info.render.calls : 0,
        triangles: bg ? bg.renderer.info.render.triangles : 0,
        points: bg ? bg.renderer.info.render.points : 0
      };
    });
  }
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

// diagnostics: WebGL/THREE loaded, icons loaded
const diag = await page.evaluate(async () => {
  const out = { three: typeof window.THREE !== "undefined", brokenImgs: [] };
  const canvas = document.getElementById("bg3d");
  out.canvasSize = canvas ? `${canvas.width}x${canvas.height}` : "missing";
  const bg = window.__bg3d;
  if (bg) {
    const gl = bg.renderer.getContext();
    out.rendererActive = !gl.isContextLost();
    out.drawCalls = bg.renderer.info.render.calls;
    out.triangles = bg.renderer.info.render.triangles;
    out.points = bg.renderer.info.render.points;
  } else {
    out.rendererActive = false;
  }
  document.querySelectorAll("img").forEach((img) => {
    if (!img.complete || img.naturalWidth === 0) out.brokenImgs.push(img.getAttribute("src"));
  });
  return out;
});
fs.writeFileSync("shots/errors.txt",
  "PAGE ERRORS:\n" + (errors.length ? errors.join("\n") : "none") +
  "\n\nDESKTOP RENDERER (after hero screenshot):\n" + JSON.stringify(desktopDiag, null, 2) +
  "\n\nMOBILE DIAGNOSTICS:\n" + JSON.stringify(diag, null, 2) + "\n");

await browser.close();
