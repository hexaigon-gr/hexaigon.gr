// Renders one 1080x1350 (4:5) branded Instagram post per portfolio project.
// The post puts the actual WEBSITE (desktop screenshot in a browser frame) front and
// centre, with only two pieces of text: what it is + the live link. Nothing else.
// Usage: node instagram/generator/generate.mjs
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { POSTS } from "./projects.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PROJECTS_DIR = path.join(ROOT, "public", "projects");
const OUT_DIR = path.join(ROOT, "instagram", "posts");
fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 1080, H = 1350, SCALE = 2;

const dataUri = (file) =>
  "data:image/png;base64," + fs.readFileSync(path.join(PROJECTS_DIR, file)).toString("base64");

function hexLogo(size = 44) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="hg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#60a5fa"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs>
    <path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" stroke="url(#hg)" stroke-width="7" fill="none" stroke-linejoin="round"/>
  </svg>`;
}

function domainSize(d) {
  if (d.length <= 16) return 62;
  if (d.length <= 22) return 52;
  if (d.length <= 30) return 42;
  return 34;
}

function template(p) {
  const shot = dataUri(p.desktop);
  return `<!doctype html><html><head><meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap&subset=greek,latin');
    * { margin:0; padding:0; box-sizing:border-box; }
    html,body { width:${W}px; height:${H}px; }
    .post { position:relative; width:${W}px; height:${H}px; overflow:hidden;
      background:#0a0a0a; color:#fff; font-family:'Commissioner','Segoe UI',sans-serif;
      display:flex; flex-direction:column; }
    .glow1 { position:absolute; top:-240px; right:-180px; width:640px; height:640px;
      background:radial-gradient(circle, rgba(59,130,246,.28), transparent 62%); }
    .glow2 { position:absolute; bottom:-280px; left:-220px; width:660px; height:660px;
      background:radial-gradient(circle, rgba(124,58,237,.16), transparent 62%); }
    .grid { position:absolute; inset:0;
      background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
                       linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
      background-size:56px 56px; mask-image:linear-gradient(180deg,#000,transparent 60%); }
    .inner { position:relative; z-index:2; display:flex; flex-direction:column; height:100%; padding:60px; }

    .head { display:flex; align-items:center; gap:16px; }
    .word { font-size:30px; font-weight:700; letter-spacing:-.02em; }
    .word b { color:#60a5fa; font-weight:800; }

    /* browser centred in the space between header and footer */
    .mid { flex:1; display:flex; flex-direction:column; justify-content:center; min-height:0; }
    .browser { border-radius:20px; overflow:hidden;
      border:1px solid rgba(255,255,255,.14);
      box-shadow:0 46px 100px -34px rgba(0,0,0,.95), 0 0 0 1px rgba(59,130,246,.10); }
    .bar { height:60px; background:#171717; display:flex; align-items:center; gap:10px;
      padding:0 22px; border-bottom:1px solid rgba(255,255,255,.07); }
    .dot { width:14px; height:14px; border-radius:50%; }
    .addr { flex:1; margin-left:16px; height:36px; background:#0c0c0c; border-radius:9px;
      display:flex; align-items:center; justify-content:center; gap:10px;
      font-family:'JetBrains Mono',monospace; font-size:19px; color:#9aa0ac; }
    .addr svg { opacity:.8; }
    .shot { width:100%; height:auto; display:block; background:#fff; }

    /* footer: only label + link */
    .foot { padding-top:48px; }
    .label { display:flex; align-items:center; gap:14px;
      font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:500;
      letter-spacing:.02em; color:#7cc4ff; margin-bottom:20px; }
    .label .pin { width:10px; height:10px; border-radius:50%; background:#60a5fa;
      box-shadow:0 0 16px #3b82f6; flex:none; }
    .link { display:flex; align-items:center; gap:20px; }
    .link .globe { width:46px; height:46px; border-radius:12px; flex:none;
      background:linear-gradient(135deg,#2563eb,#1d4ed8); display:flex; align-items:center; justify-content:center;
      box-shadow:0 12px 30px -12px rgba(37,99,235,.8); }
    .domain { font-size:${domainSize(p.domain)}px; font-weight:800; letter-spacing:-.02em;
      background:linear-gradient(100deg,#ffffff,#cfe0ff 70%,#8fb4ff);
      -webkit-background-clip:text; background-clip:text; color:transparent; }
  </style></head>
  <body>
    <div class="post">
      <div class="glow1"></div><div class="glow2"></div><div class="grid"></div>
      <div class="inner">
        <div class="head">${hexLogo(46)}<div class="word">hex<b>AI</b>gon</div></div>

        <div class="mid">
          <div class="browser">
            <div class="bar">
              <span class="dot" style="background:#ff5f57"></span>
              <span class="dot" style="background:#febc2e"></span>
              <span class="dot" style="background:#28c840"></span>
              <div class="addr">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 10V8a6 6 0 1112 0v2" stroke="#7cc4ff" stroke-width="2" stroke-linecap="round"/><rect x="4" y="10" width="16" height="10" rx="2.5" stroke="#7cc4ff" stroke-width="2"/></svg>
                ${p.domain}
              </div>
            </div>
            <img class="shot" src="${shot}" alt="">
          </div>
        </div>

        <div class="foot">
          <div class="label"><span class="pin"></span>${p.label}</div>
          <div class="link">
            <span class="globe"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" stroke="#fff" stroke-width="2"/></svg></span>
            <span class="domain">${p.domain}</span>
          </div>
        </div>
      </div>
    </div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: SCALE });

for (const p of POSTS) {
  if (!fs.existsSync(path.join(PROJECTS_DIR, p.desktop))) { console.log("skip (no desktop):", p.slug); continue; }
  await page.setContent(template(p), { waitUntil: "networkidle" });
  try {
    await page.evaluate(() => document.fonts.ready);
  } catch {
    // Font Loading API unavailable — the waitForTimeout below still covers us.
  }
  await page.waitForTimeout(250);
  await page.locator(".post").screenshot({ path: path.join(OUT_DIR, `${p.slug}.png`) });
  console.log("✓", p.slug, "→", p.domain);
}

await browser.close();
console.log("\nDone →", OUT_DIR);
