import { chromium } from "playwright";
const b = await chromium.launch();
const cards = [
  ["dimitris-christakis", "hexaigon"],
  ["nikolaos-zoukas", "zoukas"],
  ["cut-the-crap", "barber"],
];
for (const [slug, name] of cards) {
  const p = await b.newPage({ viewport: { width: 380, height: 820 }, deviceScaleFactor: 2 });
  await p.goto(`http://localhost:3000/card/${slug}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(5200); // let typewriter finish
  await p.screenshot({ path: `C:/Users/Μητσάκος/Desktop/projects/hexaigon.gr/public/digital-cards/${name}.png`, clip: { x: 0, y: 0, width: 380, height: 780 } });
  await p.close();
  console.log("captured", name);
}
await b.close();
