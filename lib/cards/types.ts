/**
 * Social platforms a card can link out to. Adding one here is enough for the
 * public page and the vCard export to pick it up.
 */
export const SOCIAL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["key"];

export type SocialLinks = Partial<Record<SocialPlatform, string>>;

/**
 * One digital business card, as hand-written in `lib/cards/data.ts`.
 *
 * Everything past `themeColor` is optional so a minimal card stays a short
 * object. The page renders only the fields that are present: no photo falls back
 * to initials in a hexagon, no phone drops that row entirely.
 */
export interface Card {
  /** URL segment, lowercase kebab-case. Must be unique across all cards. */
  slug: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  /** Primary number, treated as a mobile: dialable row, `TEL;TYPE=CELL` in the vCard. */
  phone?: string;
  /**
   * Optional second number for a fixed office line. Renders its own contact row
   * and is written as `TEL;TYPE=WORK,VOICE`, so a saved contact keeps mobile and
   * office apart instead of collapsing them into one.
   */
  landline?: string;
  email?: string;
  /** With or without a scheme. `https://` is added where one is missing. */
  website?: string;
  /**
   * Free-text postal address, e.g. "Ermou 12, Athens 10563". Renders as a
   * contact row that opens Maps, and goes into the vCard so the saved contact
   * can give directions. Worth setting for any client with a physical shop.
   */
  address?: string;
  /**
   * Link to the business's reviews (usually a Google Maps place). Renders a
   * "Reviews" row with a star. Display-only, not written into the vCard.
   */
  reviewsUrl?: string;
  /**
   * One short line, e.g. "Web, apps and AI automation". Shown under the company
   * on the page and written into the vCard as `NOTE`.
   */
  note?: string;
  /**
   * Either a path under `public/cards/`, e.g. "/cards/mitsos/photo.jpg", or an
   * absolute URL on another host.
   *
   * Local photos must live under `/cards/` specifically. That is the only
   * directory the vCard builder will read from, because a wider path makes
   * Vercel's file tracer bundle everything under it into the function. See
   * `CARD_IMAGE_URL_PREFIX` in `lib/cards/vcard.ts`. A path outside `/cards/`
   * still displays on the page but will not embed in the vCard.
   */
  photoUrl?: string;
  /** Any path or URL. Only displayed on the page, never used in the vCard. */
  companyLogoUrl?: string;
  /**
   * Centred lockup instead of the default logo-left row: the emblem sits centred
   * as the hero with the wordmark under it, and the name/role/tagline are typed
   * out (CardTypewriter) centred below. Independent of `backgroundImageUrl`.
   */
  centered?: boolean;
  /**
   * Base page colour, overriding the default near-black. A hex string, e.g.
   * "#0b1a34" for a deep navy. Use to match the card to the client's palette.
   */
  surface?: string;
  /**
   * Optional full-bleed background image behind the card. Bake the darkening/tint
   * into the image itself so the contact rows stay readable; the page also frosts
   * the contact panel when one is set. Usually paired with `centered`.
   */
  backgroundImageUrl?: string;
  socialLinks?: SocialLinks;
  /** Accent colour as a hex string, e.g. "#3b82f6". Drives the whole page. */
  themeColor: string;
  /**
   * Omit or set true to publish. False takes the card offline while keeping the
   * slug reserved, so the client's NFC tags stay pointed at something we own.
   */
  isActive?: boolean;
  /**
   * ISO date, e.g. "2026-07-29". Written into the vCard as `REV`, which lets a
   * re-saved contact overwrite the older copy instead of duplicating it. Bump it
   * when you change a card's details. Omitted from the vCard if absent.
   */
  updatedAt?: string;
}
