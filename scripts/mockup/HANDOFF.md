# Project mockup pipeline — handoff

Goal: one reusable "Hexaigon studio desk" mockup (laptop + phone on a desk). A script
composites each project's two screenshots onto the green screens — **crisp UI, no AI
cost per project, repeatable**. Inspired by a competitor's device-mockup marketing shot.

## Brand (pulled from `app/[locale]/globals.css` + components)

- Theme: **dark**. Background near-black `#0a0a0a` (`oklch(0.08 0 0)`).
- Accent: vivid blue `oklch(0.7 0.15 250)` ≈ `#3b82f6`.
- Signature gradient: **blue → purple → green** (`from-blue-400 via-purple-400 to-green-400`),
  used in `components/hero.tsx` and `how-we-work-section.tsx`.
- Motif: hexagon / honeycomb + subtle tech grid.

## Status

- [x] `lib/data/projects.ts` — updated Wheel Way + 4YourNails to `.gr` domains; added 7
      new projects (shuk-athens, stone-massage-athens, konstantinopoulou-kyparissia,
      antoniadis-autoservice, vous-kreopoleio, sifnios-ixthiopolio, moiss-defense-systems).
- [x] `scripts/mockup/composite.py` — the compositing script, v3 (mask-based):
      composites only the ACTUAL green pixels (dilated 5px over the fringe), so
      device details inside the screen rect — MacBook notch, iPhone Dynamic
      Island, rounded corners — are preserved from the scene. Quad detection
      runs on a strict eroded mask so green reflections (keyboard glow, glossy
      bezels, desk) can't skew the rectangles. Global despill neutralizes green
      screen-glow reflections everywhere outside the composited screens.
- [x] **Two scenes** in `scripts/mockup/scenes/`:
      `scene-dark.jpg` (charcoal studio desk) and `scene-light.jpg` (marble desk,
      daylight — CURRENT default for the site's mockups).
- [ ] Capture per-project screenshots into `public/projects/<slug>-desktop.png` +
      `<slug>-mobile.png` (the 7 new projects are missing).
- [x] Batch composite run over all 14 pairs → `<slug>-mockup.png` (light scene).
- [x] `-mockup.png` wired into the portfolio UI (`mockupImage` in
      `lib/data/projects.ts`; home + /projects render only projects that have one).

## Batch commands

```bash
cd scripts/mockup
python composite.py --scene scenes/scene-light.jpg --batch ../../public/projects
# alternate look:
python composite.py --scene scenes/scene-dark.jpg --batch ../../public/projects
# side-by-side without overwriting:  --suffix -mockup-dark
```

## Base-scene prompt (Nano Banana Pro / AI Studio, 16:9, 2K)

Regenerate rather than edit — the head-on laptop pose is a structural change.

```
Photorealistic dark product mockup, premium AI-tech agency aesthetic. A modern
matte-charcoal desk against a dark textured concrete wall. Softly lit dark studio,
brighter than pitch black, deep charcoal grey with gentle fill light so details read
clearly.

VERY TIGHT, ZOOMED-IN COMPOSITION: the laptop and phone dominate the frame and fill
roughly 80% of it. The MacBook screen alone spans about two-thirds of the image
width. Camera close to the devices, minimal empty desk and wall around them.

A silver MacBook Pro facing the camera HEAD-ON, screen plane perfectly parallel to
the camera, no rotation, no angle, screen reads as a clean flat rectangle. A black
iPhone standing upright on a stand to the right, also facing the camera straight-on
and large in frame. BOTH screens are solid, evenly lit, pure chroma-green (#00ff00),
perfectly flat, sharp rectangular edges, fully unobstructed, with NO glare, NO
reflections and NO gradient across the green.

On the desk, a hot cappuccino in a matte ceramic cup with a hexagon-shaped latte art
on the foam and thin wisps of steam rising. Nothing (steam, objects, hands) crosses
in front of either screen.

Behind, a small subtly glowing "HEXAIGON" wall sign and a faint hexagonal honeycomb
grid lit with a soft, DESATURATED blue-to-purple gradient glow (keep any green in the
ambient glow very subtle so it never competes with the pure-green screens). Gradient
rim light on the aluminum edges and cup. Cinematic but bright and inviting, shallow
depth of field. 16:9, high detail, 2K, no text on the screens.
```

Fallbacks if the model misbehaves:
- Garbled logo/latte art → ask for just "a hexagon-shaped latte art on the foam", no text.
- Still too dark → append "evenly lit, medium-key lighting".

## Non-negotiables for the script to work

These are baked into the prompt; if you tweak it, keep them:

1. Screens **pure flat `#00ff00`** — no glare, reflection, or gradient (they shift the
   green and break color-keying).
2. **Nothing overlaps the screens** (steam, objects, hands) or the warp clips it.
3. **Ambient glow leans blue/purple, not green** — the brand gradient's green would
   confuse the mask. Script keys on *saturated + bright* green only; desaturated glow
   green is the safety margin.
4. Bigger devices = bigger green quads = larger, legible screenshots.

## How the script works

`composite.py` (needs `pip install opencv-python numpy`):

1. HSV color-key the pure-green screens.
2. Two largest green contours → reduce each to a 4-corner quad. Larger = laptop, smaller
   = phone.
3. `getPerspectiveTransform` + `warpPerspective` each screenshot into its quad, composite
   with a 1px-eroded mask (no green fringe).

Run:

```bash
cd scripts/mockup
pip install opencv-python numpy

# batch — writes public/projects/<slug>-mockup.png for every -desktop/-mobile pair:
python composite.py --scene scene.png --batch ../../public/projects

# single:
python composite.py --scene scene.png --desktop d.png --mobile m.png --out out.png
```

## Notes / gotchas

- Head-on screens are a bonus: near-zero perspective, so warps are basically clean
  rectangle pastes → sharpest text.
- Alternative to AI for the scene is Path A only (composite is already Path A / non-AI).
  Only the *background scene* uses AI, and only once.
- If auto-detection ever misfires (finds >2 or wrong green), tighten the HSV range in
  `find_green_quads` or make the ambient glow less green.
