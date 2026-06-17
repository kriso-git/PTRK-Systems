// throwaway dev screenshot helper:
//   node scripts/_shot.mjs "§ 05" out.png [extraScrollPx]     -> home section
//   node scripts/_shot.mjs "/work" out.png [scrollPx]          -> a route (top, then scroll)
import puppeteer from "puppeteer";

const target = process.argv[2] ?? "§ 00";
const out = process.argv[3] ?? "scripts/_shot.png";
const extra = Number(process.argv[4] ?? 0);
const isPath = target.startsWith("/");
const url = "http://localhost:3000" + (isPath ? target : "/");

const b = await puppeteer.launch({
  headless: "shell",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const pg = await b.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
await pg.setViewport({ width: 1500, height: 950 });
await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));
if (!isPath) {
  await pg.evaluate((sel) => {
    const el = document.querySelector(`[data-section="${sel}"]`);
    if (el) el.scrollIntoView({ block: "start" });
  }, target);
}
if (extra) await pg.evaluate((px) => window.scrollBy(0, px), extra);
await new Promise((r) => setTimeout(r, 1200));
await pg.screenshot({ path: out });
console.log("shot", target, "->", out, "errors", errs.length, errs.slice(0, 4));
await b.close();
