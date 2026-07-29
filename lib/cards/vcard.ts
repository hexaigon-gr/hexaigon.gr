import { readFile } from "node:fs/promises";
import path from "node:path";

import { SITE_URL } from "@/lib/seo";

import { type Card, SOCIAL_PLATFORMS } from "./types";

/**
 * vCard 3.0 serialisation.
 *
 * 3.0 rather than 4.0 on purpose: iOS Contacts, Android Contacts, Outlook and
 * Google Contacts all read 3.0, whereas 4.0 support is still patchy on older
 * Android builds. 3.0 is the version with no downside here.
 */

const CRLF = "\r\n";

/**
 * Escapes a vCard text value per RFC 2426 section 5. Backslash first, or it
 * would double-escape the separators added after it.
 */
const escapeValue = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

/**
 * Folds a line to 75 octets, continuing with a single leading space.
 *
 * Counted in UTF-8 bytes, not characters: Greek names are two bytes each, so
 * folding on character count would overrun the limit. A multi-byte character is
 * never split across the fold, which some parsers reject outright.
 */
const foldLine = (line: string) => {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const segments: string[] = [];
  let start = 0;

  while (start < bytes.length) {
    // First segment gets 75 octets, continuations 74 plus the leading space.
    const limit = segments.length === 0 ? 75 : 74;
    let end = Math.min(start + limit, bytes.length);

    // Walk back off a UTF-8 continuation byte (10xxxxxx) so the split lands on
    // a character boundary.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;

    segments.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
  }

  return segments.join(`${CRLF} `);
};

/**
 * Splits a display name into the vCard `N` components. Everything before the
 * last token is the given name, so "Maria Elena Papadopoulou" yields family
 * "Papadopoulou" and given "Maria Elena". Single-token names go in the family
 * slot, which is what Contacts apps sort on.
 */
const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { family: "", given: "" };
  if (parts.length === 1) return { family: parts[0], given: "" };

  return {
    family: parts[parts.length - 1],
    given: parts.slice(0, -1).join(" "),
  };
};

/** Largest photo we are willing to inline, in bytes. */
const MAX_INLINE_PHOTO_BYTES = 500_000;

const PHOTO_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WEBP",
};

interface InlinePhoto {
  /** vCard TYPE token, e.g. "JPEG". */
  type: string;
  base64: string;
}

/** vCard TYPE token by file extension, for photos read off disk. */
const PHOTO_TYPES_BY_EXTENSION: Record<string, string> = {
  ".jpg": "JPEG",
  ".jpeg": "JPEG",
  ".png": "PNG",
  ".gif": "GIF",
  ".webp": "WEBP",
};

/**
 * Reads a photo stored under `public/`, e.g. "/cards/mitsos/photo.jpg".
 *
 * Deliberately a filesystem read rather than an HTTP request to our own origin.
 * The vCard is prerendered at build time, so fetching the URL would hit the
 * *currently deployed* site: a photo added in the same commit would not exist
 * yet and the embed would silently fail until the next deploy.
 */
const readLocalPhoto = async (photoPath: string): Promise<InlinePhoto | null> => {
  try {
    const [cleanPath] = photoPath.split(/[?#]/);
    const extension = path.extname(cleanPath).toLowerCase();
    const type = PHOTO_TYPES_BY_EXTENSION[extension];
    if (!type) return null;

    // Resolve inside public/ and confirm it stayed there, so a path with ".."
    // in the data file cannot read arbitrary files off the build machine.
    const publicDir = path.join(process.cwd(), "public");
    const absolute = path.join(publicDir, cleanPath);
    if (!absolute.startsWith(publicDir)) return null;

    const buffer = await readFile(absolute);
    if (buffer.length === 0 || buffer.length > MAX_INLINE_PHOTO_BYTES) return null;

    return { type, base64: buffer.toString("base64") };
  } catch {
    return null;
  }
};

/** Downloads a photo hosted on someone else's origin. */
const fetchRemotePhoto = async (photoUrl: string): Promise<InlinePhoto | null> => {
  try {
    const response = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return null;

    const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
    const type = PHOTO_MIME_TYPES[contentType];
    if (!type) return null;

    const declaredLength = Number(response.headers.get("content-length"));
    if (declaredLength > MAX_INLINE_PHOTO_BYTES) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0 || buffer.length > MAX_INLINE_PHOTO_BYTES) return null;

    return { type, base64: buffer.toString("base64") };
  } catch {
    return null;
  }
};

/**
 * Loads the card photo so it can be embedded in the vCard.
 *
 * Worth the effort: a `PHOTO;VALUE=URI` line is silently dropped by iOS Contacts
 * and by most Android builds, so a URI-only vCard saves a contact with no
 * picture. Embedded base64 actually shows up.
 *
 * Returns null on any problem. A missing photo must never fail the download.
 */
const loadInlinePhoto = (photoUrl: string): Promise<InlinePhoto | null> =>
  photoUrl.startsWith("/") ? readLocalPhoto(photoUrl) : fetchRemotePhoto(photoUrl);

/**
 * Contacts apps only auto-link a phone number they can dial from anywhere, so
 * strip formatting and keep a leading `+`.
 */
const normalizePhone = (phone: string) => {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/[^\d]/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
};

/**
 * Converts the hand-written `updatedAt` date into a vCard `REV` timestamp.
 *
 * @param value ISO date such as "2026-07-29", or a full ISO datetime.
 * @returns a basic-format UTC timestamp, or null when the value is missing or
 *          unparseable, so one typo in the data file cannot break the download.
 */
const toVCardTimestamp = (value: string | undefined): string | null => {
  if (!value) return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString().replace(/\.\d{3}/, "");
};

const ensureAbsoluteUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

interface BuildVCardOptions {
  card: Card;
  /** Absolute URL of the public card page, written into the vCard as a URL. */
  cardUrl?: string;
  /**
   * Set false to skip the photo download. Useful if a caller needs the vCard
   * synchronously and does not care about the picture.
   */
  embedPhoto?: boolean;
}

/**
 * Builds the vCard body for a card row.
 *
 * @returns CRLF-delimited vCard 3.0 text. Line endings are CRLF because
 *          RFC 2426 requires it and some Windows and Outlook parsers reject LF.
 */
export const buildVCard = async ({
  card,
  cardUrl,
  embedPhoto = true,
}: BuildVCardOptions): Promise<string> => {
  const { family, given } = splitName(card.fullName);

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeValue(family)};${escapeValue(given)};;;`,
    `FN:${escapeValue(card.fullName)}`,
  ];

  if (card.company) lines.push(`ORG:${escapeValue(card.company)}`);
  if (card.jobTitle) lines.push(`TITLE:${escapeValue(card.jobTitle)}`);

  if (card.phone) {
    const phone = normalizePhone(card.phone);
    // CELL first so the number lands under "mobile" rather than "other".
    if (phone) lines.push(`TEL;TYPE=CELL,VOICE:${escapeValue(phone)}`);
  }

  if (card.email) lines.push(`EMAIL;TYPE=INTERNET,PREF:${escapeValue(card.email.trim())}`);

  if (card.address) {
    const address = escapeValue(card.address.trim());
    // ADR has seven semicolon-separated components. We hold the address as one
    // free-text string, so it goes in the street slot with the rest empty, and
    // LABEL carries the same text for clients that prefer to display that.
    lines.push(`ADR;TYPE=WORK:;;${address};;;;`);
    lines.push(`LABEL;TYPE=WORK:${address}`);
  }

  const website = card.website ? ensureAbsoluteUrl(card.website) : "";
  if (website) lines.push(`URL:${escapeValue(website)}`);

  // The card page itself, so a saved contact can be reopened later. Skipped if
  // it would duplicate the website line.
  if (cardUrl && cardUrl !== website) lines.push(`URL;TYPE=Digital Card:${escapeValue(cardUrl)}`);

  SOCIAL_PLATFORMS.forEach(({ key, label }) => {
    const url = card.socialLinks?.[key];
    if (!url) return;
    // X-SOCIALPROFILE is the de facto standard, honoured by iOS and macOS.
    lines.push(`X-SOCIALPROFILE;TYPE=${label.toLowerCase()}:${escapeValue(url)}`);
  });

  if (card.photoUrl) {
    const photo = embedPhoto ? await loadInlinePhoto(card.photoUrl) : null;

    if (photo) {
      lines.push(`PHOTO;ENCODING=b;TYPE=${photo.type}:${photo.base64}`);
    } else {
      // The fallback URI must be absolute. A card's photoUrl is usually a path
      // under public/, and a relative URI in a vCard is useless to a Contacts
      // app once the file has left the browser.
      const absolute = card.photoUrl.startsWith("/")
        ? `${SITE_URL}${card.photoUrl}`
        : card.photoUrl;
      lines.push(`PHOTO;VALUE=URI:${escapeValue(absolute)}`);
    }
  }

  if (card.note) lines.push(`NOTE:${escapeValue(card.note.trim())}`);

  // REV lets a re-saved contact overwrite the older copy instead of duplicating.
  // Omitted rather than faked when a card carries no date, since a wrong REV is
  // worse than none: a stale value stops a genuine update from taking effect.
  const rev = toVCardTimestamp(card.updatedAt);
  if (rev) lines.push(`REV:${rev}`);

  lines.push("END:VCARD");

  // Trailing CRLF: some parsers ignore a final line without one.
  return `${lines.map(foldLine).join(CRLF)}${CRLF}`;
};

/**
 * ASCII-only filename for `Content-Disposition`. Non-ASCII names are handled
 * separately via the RFC 5987 `filename*` parameter.
 */
export const buildVCardFilename = (card: Card) => {
  const ascii = card.fullName
    .normalize("NFKD")
    // Drop every non-ASCII code point. That covers the combining marks
    // NFKD just separated out, so accented Latin letters survive as
    // their base form rather than turning into separators.
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  // Greek names reduce to nothing above, so fall back to the slug.
  return `${ascii || card.slug}.vcf`;
};
