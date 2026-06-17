// throwaway dev screenshot helper — node scripts/_shot.mjs "<section>" <out.png>
import puppeteer from "puppeteer";

const section = process.argv[2] ?? "§ 00";
const out = process.argv[3] ?? "scripts/_shot.png";

const b = await puppeteer.launch({
  headless: "shell",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const pg = await b.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
await pg.setViewport({ width: 1500, height: 950 });
await pg.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3500));
await pg.evaluate((sel) => {
  const el = document.querySelector(`[data-section="${sel}"]`);
  if (el) el.scrollIntoView({ block: "start" });
}, section);
await new Promise((r) => setTimeout(r, 1200));
await pg.screenshot({ path: out });
console.log("shot", section, "->", out, "errors", errs.length, errs.slice(0, 4));
await b.close();
