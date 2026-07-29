import { SITE_URL } from "@/lib/seo";

import type { Card } from "./types";

/**
 * Every digital business card, hand-maintained.
 *
 * There is deliberately no database. The set is small, only ever edited by us,
 * and changes ship with a deploy. That buys a lot: each card is prerendered at
 * build time, the vCard photo is downloaded and embedded during the build rather
 * than per request, and a tapped NFC tag resolves with no query and no cold
 * start.
 *
 * ---------------------------------------------------------------------------
 * TO ADD A CLIENT
 * ---------------------------------------------------------------------------
 * 1. Copy the block below and edit the fields. Only `slug`, `fullName` and
 *    `themeColor` are required.
 * 2. Drop their photo and logo in `public/cards/<slug>/`, then point
 *    `photoUrl` and `companyLogoUrl` at `/cards/<slug>/photo.jpg`.
 * 3. Commit and push. Vercel rebuilds and the card is live at /card/<slug>.
 * 4. Write `https://www.hexaigon.gr/card/<slug>` onto the NFC tag.
 *
 * Set `isActive: false` to take a card offline without releasing its slug, so
 * the client's tags keep pointing somewhere we still control.
 *
 * The slug is the product. Once tags are written it cannot change without
 * reprogramming every one of them, so pick it carefully the first time.
 */
export const CARDS: Card[] = [
  {
    slug: "dimitris-christakis",
    fullName: "Δημήτριος Χρηστάκης",
    jobTitle: "Co-founder",
    company: "hexAIgon Software Solutions",
    phone: "+30 698 388 2720",
    email: "hexaigonsoftwaresolutions@gmail.com",
    website: "https://www.hexaigon.gr",
    // Drop a square headshot at public/cards/dimitris-christakis/photo.jpg and
    // uncomment. Until then the portrait shows the initials, which reads fine.
    // photoUrl: "/cards/dimitris-christakis/photo.jpg",
    //
    // The hexAIgon mark from app/icon.svg, already served at /icon.svg. Its blue
    // is the brand blue, so it only suits cards using the default accent.
    companyLogoUrl: "/icon.svg",
    socialLinks: {
      instagram: "https://www.instagram.com/hexaigon.gr",
      linkedin: "https://www.linkedin.com/company/hexaigon",
      // No Facebook page found in the codebase, so the icon is omitted rather
      // than pointed at a guess.
    },
    themeColor: "#3b82f6",
    updatedAt: "2026-07-30",
  },
];

/** Lowercase alphanumeric words joined by single hyphens. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Slugs of the cards that should be prerendered.
 *
 * Validates as a side effect, and is called from `generateStaticParams`, so a
 * duplicate or malformed slug fails the build loudly instead of turning into a
 * silent 404 in production. Runs at build time only.
 */
export const getAllCardSlugs = (): string[] => {
  const seen = new Set<string>();

  CARDS.forEach(({ slug }) => {
    if (!SLUG_PATTERN.test(slug)) {
      throw new Error(
        `Invalid card slug "${slug}" in lib/cards/data.ts. Use lowercase letters, numbers and single hyphens between words.`,
      );
    }

    if (seen.has(slug)) {
      throw new Error(`Duplicate card slug "${slug}" in lib/cards/data.ts.`);
    }

    seen.add(slug);
  });

  // Inactive cards are excluded, so they are not prerendered and fall through
  // to the 404 that `getPublicCard` produces.
  return CARDS.filter(({ isActive }) => isActive !== false).map(({ slug }) => slug);
};

/**
 * Looks up a card for public display. Inactive and unknown slugs both resolve to
 * null, so the page cannot reveal which of the two it was.
 */
export const getPublicCard = (slug: string): Card | null => {
  const card = CARDS.find((entry) => entry.slug === slug.toLowerCase());
  if (!card || card.isActive === false) return null;

  return card;
};

/** Public URL for a card. Short and clean, so it fits on an NFC tag as is. */
export const cardUrl = (slug: string) => `${SITE_URL}/card/${slug}`;
