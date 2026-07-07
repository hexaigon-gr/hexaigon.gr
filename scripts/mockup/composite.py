#!/usr/bin/env python3
"""Composite a desktop + mobile screenshot onto the green screens of a base mockup.

Auto-detects the two pure chroma-green regions in the scene (largest = laptop,
smaller = phone), then perspective-warps each screenshot into place. Compositing
is masked by the ACTUAL green pixels (not the bounding rectangle), so device
details that intrude into the screen area — MacBook notch, iPhone Dynamic
Island, rounded corners — are preserved exactly as in the scene.

Deterministic, pixel-crisp, no AI, free to run per project.

Requirements:  pip install opencv-python numpy

Scenes live in scenes/ (scene-dark.jpg, scene-light.jpg).

Single project:
  python composite.py --scene scenes/scene-dark.jpg --desktop d.png --mobile m.png --out out.png

Batch every project in public/projects (matches <slug>-desktop.png + <slug>-mobile.png):
  python composite.py --scene scenes/scene-dark.jpg --batch ../../public/projects
"""
import argparse
import glob
import os

import cv2
import numpy as np

# Green fringe (anti-aliased / JPEG-blurred edge pixels) is a few px wide; the
# composite mask grows by this much so the screenshot overpaints it.
MASK_DILATE_PX = 5
# Contour detection erodes the strict mask by this much to cut thin bridges to
# green reflections (glossy bezels, keyboard glow).
ERODE_PX = 5
# The warped screenshot must extend past the dilated alpha so it never samples black.
QUAD_PAD = 14
# Safe-area inset for the phone screenshot (fraction of its width, per side).
PHONE_EDGE_PAD_FRAC = 0.04
# Scenes are upscaled to this width so screenshots keep enough pixels to stay
# legible when zoomed (background is soft/bokeh, so the upscale is invisible).
TARGET_SCENE_WIDTH = 2752


def green_mask(scene):
    """Permissive mask of chroma-green pixels — used for the composite alpha."""
    hsv = cv2.cvtColor(scene, cv2.COLOR_BGR2HSV)
    # A soft/desaturated brand-gradient green will NOT pass this gate.
    mask = cv2.inRange(hsv, np.array([35, 120, 110]), np.array([85, 255, 255]))
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))


def find_green_quads(scene):
    """Return the two screen quads, largest area first, as ordered 4-point arrays.

    Detection runs on a STRICT, eroded mask so green reflections on keyboards,
    bezels, and desks can't stretch the rectangles. The erosion is compensated
    by re-expanding the quads.
    """
    hsv = cv2.cvtColor(scene, cv2.COLOR_BGR2HSV)
    strict = cv2.inRange(hsv, np.array([35, 150, 140]), np.array([85, 255, 255]))
    strict = cv2.morphologyEx(strict, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE, (2 * ERODE_PX + 1, 2 * ERODE_PX + 1)
    )
    strict = cv2.erode(strict, kernel)

    contours, _ = cv2.findContours(strict, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = 0.001 * scene.shape[0] * scene.shape[1]
    contours = [c for c in contours if cv2.contourArea(c) > min_area]
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:2]
    if len(contours) < 2:
        raise SystemExit(
            f"Expected 2 green screens, found {len(contours)}. "
            "Check the scene has two clean pure-green screens with no glare."
        )
    # minAreaRect is robust to rounded corners, notches, and slight device tilt.
    quads = [cv2.boxPoints(cv2.minAreaRect(c)).astype(np.float32) for c in contours]
    return [expand_quad(order_quad(q), ERODE_PX) for q in quads]


def order_quad(pts):
    """Order 4 points as top-left, top-right, bottom-right, bottom-left."""
    s = pts.sum(axis=1)
    d = np.diff(pts, axis=1).ravel()
    return np.array(
        [pts[np.argmin(s)], pts[np.argmin(d)], pts[np.argmax(s)], pts[np.argmax(d)]],
        dtype=np.float32,
    )


def expand_quad(quad, pad):
    """Push each corner `pad` pixels outward from the quad's center."""
    center = quad.mean(axis=0)
    vectors = quad - center
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return (quad + vectors / norms * pad).astype(np.float32)


def screen_alpha(mask, quad):
    """Composite alpha for one screen: its green pixels, dilated over the fringe.

    Non-green pixels inside the quad (notch, Dynamic Island, corner bezel)
    stay at alpha 0 and keep the original scene — that's the whole trick.
    The quad region clips away nearby reflection greens outside the screen.
    Used for the LAPTOP: preserves the MacBook notch, and its corner rounding
    is too slight to cut UI.
    """
    region = np.zeros_like(mask)
    cv2.fillConvexPoly(region, expand_quad(quad, 2).astype(np.int32), 255)
    alpha = cv2.bitwise_and(mask, region)
    kernel = cv2.getStructuringElement(
        cv2.MORPH_ELLIPSE, (2 * MASK_DILATE_PX + 1, 2 * MASK_DILATE_PX + 1)
    )
    alpha = cv2.dilate(alpha, kernel)
    return cv2.GaussianBlur(alpha, (3, 3), 0)  # anti-aliased edge


def pad_replicate(img, frac):
    """Pad an image on all sides by `frac` of its width, replicating edge pixels.

    Used on the PHONE screenshot before warping: the UI moves inward so the
    screen's rounded corners never clip real content (header text, icons),
    while the replicated edge pixels fill the corner areas with the header's
    own background color — exactly how content sits inside a real phone's
    safe area. Content shrinks by only ~7%, visually negligible.
    """
    pad = max(2, int(round(img.shape[1] * frac)))
    return cv2.copyMakeBorder(img, pad, pad, pad, pad, cv2.BORDER_REPLICATE)


def warp_onto(scene, screenshot, quad, alpha):
    """Warp screenshot across the (expanded) quad, composite where alpha says so."""
    dst = expand_quad(quad, QUAD_PAD)

    # warpPerspective minifies with plain bilinear sampling, which aliases text.
    # Pre-downscale to the quad's own pixel size with INTER_AREA (true area
    # averaging) so the warp is ~1:1 and text stays crisp.
    dst_w = int(round((np.linalg.norm(dst[1] - dst[0]) + np.linalg.norm(dst[2] - dst[3])) / 2))
    dst_h = int(round((np.linalg.norm(dst[3] - dst[0]) + np.linalg.norm(dst[2] - dst[1])) / 2))
    if screenshot.shape[1] > dst_w:
        screenshot = cv2.resize(screenshot, (dst_w, dst_h), interpolation=cv2.INTER_AREA)

    h, w = screenshot.shape[:2]
    src = np.array([[0, 0], [w, 0], [w, h], [0, h]], dtype=np.float32)
    matrix = cv2.getPerspectiveTransform(src, dst)
    warped = cv2.warpPerspective(
        screenshot, matrix, (scene.shape[1], scene.shape[0]), flags=cv2.INTER_LINEAR
    )

    a = (alpha / 255.0)[..., None]
    return (scene * (1 - a) + warped * a).astype(np.uint8)


def despill(img, protect_mask):
    """Neutralize green spill everywhere except the composited screens.

    Handles screen-glow reflections on desks/keyboards and leftover fringe.
    Only touches pixels where green exceeds both red and blue, so neutral
    scene colors are unaffected; screenshot content is protected by the mask.
    """
    b, g, r = cv2.split(img.astype(np.int16))
    excess = np.clip(g - np.maximum(b, r), 0, None)
    g = g - excess * (protect_mask == 0)
    return np.clip(cv2.merge([b, g, r]), 0, 255).astype(np.uint8)


def composite(scene_path, desktop_path, mobile_path, out_path):
    scene = cv2.imread(scene_path)
    desktop = cv2.imread(desktop_path)
    mobile = cv2.imread(mobile_path)
    if scene is None:
        raise SystemExit(f"Cannot read scene: {scene_path}")
    if desktop is None or mobile is None:
        raise SystemExit(f"Cannot read screenshots for {out_path}")

    # Low-res scenes give the screenshots too few pixels to stay legible.
    if scene.shape[1] < TARGET_SCENE_WIDTH:
        scale = TARGET_SCENE_WIDTH / scene.shape[1]
        scene = cv2.resize(
            scene,
            (TARGET_SCENE_WIDTH, int(round(scene.shape[0] * scale))),
            interpolation=cv2.INTER_LANCZOS4,
        )

    mask = green_mask(scene)
    laptop_quad, phone_quad = find_green_quads(scene)  # largest first

    alpha_laptop = screen_alpha(mask, laptop_quad)
    alpha_phone = screen_alpha(mask, phone_quad)

    out = warp_onto(scene, desktop, laptop_quad, alpha_laptop)
    # Phone: content wraps inside the rounded screen; the safe-area padding
    # keeps the header/footer clear of the corner rounding.
    out = warp_onto(out, pad_replicate(mobile, PHONE_EDGE_PAD_FRAC), phone_quad, alpha_phone)

    screens = cv2.bitwise_or(
        (alpha_laptop >= 128).astype(np.uint8) * 255,
        (alpha_phone >= 128).astype(np.uint8) * 255,
    )
    out = despill(out, screens)
    cv2.imwrite(out_path, out)
    print(f"  wrote {out_path}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", required=True, help="Scene image with two green screens")
    ap.add_argument("--desktop", help="Desktop screenshot (single mode)")
    ap.add_argument("--mobile", help="Mobile screenshot (single mode)")
    ap.add_argument("--out", help="Output PNG (single mode)")
    ap.add_argument("--batch", help="public/projects dir; pairs <slug>-desktop/-mobile.png")
    ap.add_argument(
        "--suffix",
        default="-mockup",
        help="Batch output suffix (default -mockup → <slug>-mockup.png)",
    )
    args = ap.parse_args()

    if args.batch:
        for desktop in sorted(glob.glob(os.path.join(args.batch, "*-desktop.png"))):
            slug = os.path.basename(desktop)[: -len("-desktop.png")]
            mobile = os.path.join(args.batch, f"{slug}-mobile.png")
            if not os.path.exists(mobile):
                print(f"  skip {slug}: no mobile screenshot")
                continue
            out = os.path.join(args.batch, f"{slug}{args.suffix}.png")
            print(slug)
            composite(args.scene, desktop, mobile, out)
        return

    if not (args.desktop and args.mobile and args.out):
        raise SystemExit("Single mode needs --desktop, --mobile and --out")
    composite(args.scene, args.desktop, args.mobile, args.out)


if __name__ == "__main__":
    main()
