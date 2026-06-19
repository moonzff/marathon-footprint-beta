// 需要 playwright 才能运行：npm i -D playwright && npx playwright install chromium
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { chromium } from "playwright";

const root = dirname(fileURLToPath(import.meta.url));
const url = `file://${root}/index.html`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: "load" });
await page.screenshot({ path: `${root}/poster-lab-overview.png`, fullPage: true });

const posters = await page.locator(".poster").all();
for (let index = 0; index < posters.length; index += 1) {
  await posters[index].screenshot({ path: `${root}/poster-option-${index + 1}.png` });
}

await browser.close();

const outputs = ["poster-lab-overview.png", "poster-option-1.png", "poster-option-2.png", "poster-option-3.png"];
const stats = {};
for (const file of outputs) {
  const bytes = await readFile(`${root}/${file}`);
  stats[file] = bytes.length;
}
console.log(JSON.stringify(stats, null, 2));
