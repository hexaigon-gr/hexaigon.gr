/**
 * Turns a client's single `theme_color` hex into everything the public card
 * page needs to look deliberately designed rather than tinted at random.
 *
 * The page never hardcodes the accent. It sets `--card-accent` (an "r g b"
 * triple) once on a wrapper and every tint below it is
 * `rgb(var(--card-accent) / <alpha>)`, so one column in the database drives
 * glows, rings, borders and the QR code.
 *
 * Named `--card-accent` rather than `--accent` on purpose: `--accent` is already
 * a shadcn semantic token defined in `app/globals.css`, and shadowing it inside
 * the card subtree would quietly break any `bg-accent` used there later.
 */

/** Brand blue. Used when a row has no colour or an unparseable one. */
export const DEFAULT_THEME_COLOR = "#3b82f6";

const HEX_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isValidHexColor = (value: string) => HEX_PATTERN.test(value.trim());

/**
 * Normalises to lowercase 6-digit hex, expanding the 3-digit shorthand.
 * Falls back to the brand colour rather than throwing, because a bad value in
 * one row must never take a client's card offline.
 */
export const normalizeHexColor = (value: string | null | undefined): string => {
  const candidate = (value ?? "").trim().toLowerCase();
  if (!isValidHexColor(candidate)) return DEFAULT_THEME_COLOR;

  if (candidate.length === 4) {
    const [, r, g, b] = candidate;
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  return candidate;
};

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): Rgb => {
  const normalized = normalizeHexColor(hex);

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
};

/**
 * WCAG relative luminance. Drives the readable-text decision below, so a client
 * who picks a pale yellow accent gets dark text on their buttons instead of
 * white-on-white.
 */
const relativeLuminance = ({ r, g, b }: Rgb) => {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const mixToward = ({ rgb, target, amount }: { rgb: Rgb; target: number; amount: number }): Rgb => ({
  r: Math.round(rgb.r + (target - rgb.r) * amount),
  g: Math.round(rgb.g + (target - rgb.g) * amount),
  b: Math.round(rgb.b + (target - rgb.b) * amount),
});

const toHex = ({ r, g, b }: Rgb) =>
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;

export interface CardTheme {
  /** Normalised accent hex. Safe to hand to QR generators and meta tags. */
  accent: string;
  /** "r g b" triple for `rgb(var(--card-accent) / <alpha>)` in CSS. */
  accentRgb: string;
  /** Readable text colour on top of a solid accent fill. */
  accentContrast: string;
  /** Lifted accent, for the top-of-page glow where the accent is very dark. */
  accentGlow: string;
  /**
   * QR module colour on a white plate. Scanners need roughly 40% contrast
   * against the background, so a pale accent falls back to near-black instead
   * of producing a pretty code that no camera can read.
   */
  qrForeground: string;
  /** CSS custom properties to spread onto the page wrapper's `style`. */
  cssVars: React.CSSProperties;
}

export const buildCardTheme = (themeColor: string | null | undefined): CardTheme => {
  const accent = normalizeHexColor(themeColor);
  const rgb = hexToRgb(accent);
  const luminance = relativeLuminance(rgb);

  // 0.45 is where white-on-accent stops clearing 4.5:1 for typical hues. Below
  // it keep white text; above it switch to near-black.
  const accentContrast = luminance > 0.45 ? "#0a0a0f" : "#ffffff";

  // A near-black accent produces no visible glow, so pull it toward white
  // enough to read as light. Bright accents are left alone.
  const accentGlow = luminance < 0.12 ? toHex(mixToward({ rgb, target: 255, amount: 0.45 })) : accent;

  const qrForeground = luminance < 0.3 ? accent : "#0a0a0f";

  const accentRgb = `${rgb.r} ${rgb.g} ${rgb.b}`;

  return {
    accent,
    accentRgb,
    accentContrast,
    accentGlow,
    qrForeground,
    cssVars: {
      "--card-accent": accentRgb,
      "--card-accent-hex": accent,
      "--card-accent-contrast": accentContrast,
      "--card-accent-glow": accentGlow,
    } as React.CSSProperties,
  };
};
