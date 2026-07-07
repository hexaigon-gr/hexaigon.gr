import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "public", "projects");

// slug -> live URL (keep in sync with lib/data/projects.ts)
const SITES = {
  orderoo: "https://orderoo.gr",
  kratisix: "https://www.kratisix.com/en",
  "salsa-rayo": "https://salsarayo.com/",
  "poseidon-transfers": "https://poseidontranfer.vercel.app/en-US",
  "moisis-flower-design": "https://www.moisis-flower-design.gr",
  "1-percent-club": "https://1-percent-club-six.vercel.app/en",
  "4yournails": "https://www.4yournails.gr",
  "wheel-way": "https://wheel-way.gr",
  "viliotis-ilias-accountant": "https://viliotis-ilias-accountant.vercel.app/",
  "iatriki-apokatastasi": "https://www.iatriki-apokatastasi.gr",
  "anthopolio-kaloudhs": "https://www.anthopoleio-kaloudis.gr/en",
  "iching-balance": "https://i-ching-v2.vercel.app/",
  figata: "https://www.figata.gr/en",
  epityxein: "https://epityxein.vercel.app",
  "shuk-athens": "https://www.shukathens.com",
  "stone-massage-athens": "https://stonemassageathens.com",
  "konstantinopoulou-kyparissia": "https://konstantinopoulou-kyparissia.vercel.app/en",
  "antoniadis-autoservice": "https://www.antoniadis-autoservice.gr",
  "vous-kreopoleio": "https://vous-kreopoleio.vercel.app",
  "sifnios-ixthiopolio": "https://sifnios-ixthiopolio.vercel.app",
  "moiss-defense-systems": "https://moiss-defense-systems.vercel.app",
};

// CLI: `node scripts/screenshot.mjs slug1 slug2 ...` (no args → every site)
const argv = process.argv.slice(2);
const slugs = argv.length ? argv : Object.keys(SITES);
const TARGETS = slugs.map((slug) => {
  const url = SITES[slug];
  if (!url) {
    console.error(`Unknown slug: ${slug}`);
    process.exit(1);
  }
  return { slug, url };
});

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

const run = async () => {
  const browser = await chromium.launch();
  for (const { slug, url } of TARGETS) {
    for (const [label, viewport] of [["desktop", DESKTOP], ["mobile", MOBILE]]) {
      const ctx = await browser.newContext({
        viewport,
        deviceScaleFactor: 2,
        userAgent:
          label === "mobile"
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            : undefined,
      });
      const page = await ctx.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      } catch {
        // Some sites never reach networkidle (polling, analytics); fall back to load.
        await page.goto(url, { waitUntil: "load", timeout: 60_000 });
      }
      await page.waitForTimeout(2500);
      const out = path.join(OUT_DIR, `${slug}-${label}.png`);
      await page.screenshot({ path: out, fullPage: false });
      console.log(`Saved ${out}`);
      await ctx.close();
    }
  }
  await browser.close();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
