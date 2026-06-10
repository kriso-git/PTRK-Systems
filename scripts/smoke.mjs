/**
 * Render-smoke gate — boots the production build and fails on any browser
 * console error or uncaught page error across the public routes.
 *
 * Usage: npm run build && npm run smoke
 * (Catches the class of bug that build + HTTP checks miss: hydration
 * mismatches, runtime crashes, invalid-DOM warnings.)
 */
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;
const ROUTES = ["/", "/work", "/method", "/connect", "/nemletezik"];

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(BASE, { signal: AbortSignal.timeout(2000) });
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await wait(500);
  }
  throw new Error(`Server did not become ready on :${PORT}`);
}

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  cwd: process.cwd(),
  stdio: "ignore",
  shell: true,
  detached: true,
});

let failures = 0;
try {
  await waitForServer();
  const browser = await puppeteer.launch({ headless: "new" });
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      const errors = [];
      const pageUrl = `${BASE}${route}`;
      // Known-benign locally: Vercel Analytics/Speed Insights scripts only
      // exist on Vercel infra (404 + MIME refusal on `next start`), and the
      // /nemletezik document itself is an EXPECTED 404 response.
      const ignorable = (text, url) =>
        /_vercel\/(insights|speed-insights)\//.test(`${text} ${url ?? ""}`) ||
        (route === "/nemletezik" &&
          text.startsWith("Failed to load resource") &&
          (url === pageUrl || url === undefined));
      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const url = msg.location()?.url;
        if (ignorable(msg.text(), url)) return;
        errors.push(`console: ${msg.text()}${url ? ` [${url}]` : ""}`);
      });
      page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

      await page.goto(`${BASE}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      // Let hydration + first animations settle so late errors surface.
      await wait(1500);

      if (errors.length) {
        failures += errors.length;
        console.error(`✗ ${route}`);
        for (const e of errors) console.error(`    ${e}`);
      } else {
        console.log(`✓ ${route}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  try {
    process.kill(-server.pid);
  } catch {
    try {
      server.kill();
    } catch {
      /* already gone */
    }
  }
  // Windows: detached tree kill fallback
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      shell: true,
    });
  }
}

if (failures) {
  console.error(`\nSMOKE FAIL — ${failures} error(s)`);
  process.exit(1);
}
console.log("\nSMOKE PASS — 0 console/page errors");
