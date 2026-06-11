/**
 * Captures real hero screenshots of the live portfolio projects into
 * public/previews/<id>.webp (1280w, q72). Re-run whenever the live
 * sites change visually: `node scripts/capture-previews.mjs`
 */
import puppeteer from "puppeteer";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const TARGETS = [
  { id: "f3xykee-terminal", url: "https://fexyke.hu" },
  { id: "molekulax", url: "https://molekulax.vercel.app" },
  { id: "donna-pizza", url: "https://www.donnapizzakecskemet.eu" },
];

mkdirSync("public/previews", { recursive: true });
const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1440, height: 900 },
});

for (const t of TARGETS) {
  const page = await browser.newPage();
  try {
    await page.goto(t.url, { waitUntil: "networkidle2", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 4000)); // fonts + intro animations
    const png = await page.screenshot({ type: "png" });
    await sharp(png)
      .resize(1280)
      .webp({ quality: 72 })
      .toFile(`public/previews/${t.id}.webp`);
    console.log(`✓ ${t.id} (${t.url})`);
  } catch (e) {
    console.error(`✗ ${t.id}: ${e.message}`);
  } finally {
    await page.close();
  }
}
await browser.close();
