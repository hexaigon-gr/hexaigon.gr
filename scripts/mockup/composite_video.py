#!/usr/bin/env python3
"""Composite a VIDEO onto the laptop green screen and an IMAGE onto the phone.

Reuses the detection/masking pipeline from composite.py: quads and alphas are
computed once, the phone image and despill are baked into a static base frame,
then only the laptop warp+blend runs per video frame.

Encoding: frames are piped to a bundled ffmpeg (imageio-ffmpeg) and encoded with
libx264 at a low CRF, so the static background and the phone screenshot stay
pixel-crisp instead of being mangled by OpenCV's low-bitrate mp4v codec. The
source video's audio track is muxed back in automatically (optional).

Notes:
- The video is stretched to the laptop screen's aspect (~16:10). Record the
  screen capture at the same aspect for a perfect fit, or pass --letterbox.

Usage:
  python composite_video.py --scene scenes/scene-light.jpg \
      --video demo.mp4 --image phone.png --out mockup.mp4 \
      [--letterbox] [--max-seconds 12] [--crf 15] [--no-audio]
"""
import argparse
import subprocess

import cv2
import numpy as np
from imageio_ffmpeg import get_ffmpeg_exe

from composite import (
    QUAD_PAD,
    TARGET_SCENE_WIDTH,
    despill,
    expand_quad,
    find_green_quads,
    green_mask,
    screen_alpha,
    warp_onto,
)


def solid_screen_alpha(mask, quad):
    """Full-RECTANGLE alpha for the phone: paint the whole screen, corner to corner.

    screen_alpha() keeps non-green pixels transparent (notch, Dynamic Island) AND
    the green's rounded corners curve inward — so UI in the extreme corners (the
    site's top-right hamburger menu) and along the top (header) gets chopped. Here
    we simply fill the entire screen quad, so every pixel of the screenshot shows,
    including the notch strip and all four corners. Corners read slightly squared,
    but nothing in the UI is ever cut off.
    """
    solid = np.zeros_like(mask)
    cv2.fillConvexPoly(solid, expand_quad(quad, 2).astype(np.int32), 255)
    return cv2.GaussianBlur(solid, (3, 3), 0)  # anti-aliased edge


def quad_dst_size(dst):
    w = int(round((np.linalg.norm(dst[1] - dst[0]) + np.linalg.norm(dst[2] - dst[3])) / 2))
    h = int(round((np.linalg.norm(dst[3] - dst[0]) + np.linalg.norm(dst[2] - dst[1])) / 2))
    return w, h


def fit_frame(frame, dst_w, dst_h, letterbox):
    """Resize a video frame to the screen size, stretching or letterboxing."""
    if not letterbox:
        return cv2.resize(frame, (dst_w, dst_h), interpolation=cv2.INTER_AREA)
    fh, fw = frame.shape[:2]
    scale = min(dst_w / fw, dst_h / fh)
    new_w, new_h = int(fw * scale), int(fh * scale)
    resized = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_AREA)
    canvas = np.zeros((dst_h, dst_w, 3), np.uint8)
    x = (dst_w - new_w) // 2
    y = (dst_h - new_h) // 2
    canvas[y : y + new_h, x : x + new_w] = resized
    return canvas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--scene", required=True, help="Scene image with two green screens")
    ap.add_argument("--video", required=True, help="Video for the laptop screen")
    ap.add_argument("--image", required=True, help="Image for the phone screen")
    ap.add_argument("--out", required=True, help="Output video path (.mp4)")
    ap.add_argument("--letterbox", action="store_true", help="Letterbox instead of stretch")
    ap.add_argument("--max-seconds", type=float, default=None, help="Trim output length")
    ap.add_argument("--crf", type=int, default=15, help="x264 quality (lower=better, 15≈visually lossless)")
    ap.add_argument("--no-audio", action="store_true", help="Drop the source video's audio track")
    args = ap.parse_args()

    scene = cv2.imread(args.scene)
    phone_img = cv2.imread(args.image)
    if scene is None:
        raise SystemExit(f"Cannot read scene: {args.scene}")
    if phone_img is None:
        raise SystemExit(f"Cannot read phone image: {args.image}")

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
    # Phone: fill over the notch/Dynamic Island so the site header isn't chopped.
    alpha_phone = solid_screen_alpha(mask, phone_quad)

    # Static base: phone image + despill baked in once. The laptop's green stays
    # under its (protected) alpha and is overwritten by the video every frame.
    base = warp_onto(scene, phone_img, phone_quad, alpha_phone)
    screens = cv2.bitwise_or(
        (alpha_laptop >= 128).astype(np.uint8) * 255,
        (alpha_phone >= 128).astype(np.uint8) * 255,
    )
    base = despill(base, screens)
    base_f = base.astype(np.float32)

    # Laptop warp is identical for every frame — precompute everything.
    dst = expand_quad(laptop_quad, QUAD_PAD)
    dst_w, dst_h = quad_dst_size(dst)
    src = np.array([[0, 0], [dst_w, 0], [dst_w, dst_h], [0, dst_h]], dtype=np.float32)
    matrix = cv2.getPerspectiveTransform(src, dst)
    a = (alpha_laptop.astype(np.float32) / 255.0)[..., None]

    cap = cv2.VideoCapture(args.video)
    if not cap.isOpened():
        raise SystemExit(f"Cannot open video: {args.video}")
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if args.max_seconds:
        total = min(total, int(args.max_seconds * fps))

    W, H = scene.shape[1], scene.shape[0]
    ffmpeg = get_ffmpeg_exe()
    # Raw BGR frames arrive on pipe:0; the source video (pipe input #1) supplies the
    # audio only. libx264 -crf keeps the static background + phone visually lossless.
    cmd = [
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", f"{fps}", "-i", "pipe:0",
    ]
    want_audio = not args.no_audio
    if want_audio:
        cmd += ["-i", args.video]
    cmd += [
        "-map", "0:v:0",
        *(["-map", "1:a:0?"] if want_audio else []),
        "-c:v", "libx264", "-crf", str(args.crf), "-preset", "slow", "-pix_fmt", "yuv420p",
        *(["-c:a", "aac", "-b:a", "192k"] if want_audio else []),
        "-shortest", "-movflags", "+faststart", args.out,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    n = 0
    while n < total:
        ok, frame = cap.read()
        if not ok:
            break
        fitted = fit_frame(frame, dst_w, dst_h, args.letterbox)
        warped = cv2.warpPerspective(
            fitted, matrix, (W, H), flags=cv2.INTER_LINEAR
        )
        out = (base_f * (1 - a) + warped.astype(np.float32) * a).astype(np.uint8)
        proc.stdin.write(np.ascontiguousarray(out).tobytes())
        n += 1
        if n % 60 == 0:
            print(f"  {n}/{total} frames")

    cap.release()
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit("ffmpeg encoding failed")
    print(f"wrote {args.out} ({n} frames @ {fps:.0f}fps, {W}x{H}, x264 crf{args.crf})")


if __name__ == "__main__":
    main()
