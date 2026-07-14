import type { Metadata } from "next";

/**
 * Canonical origin. The apex domain 307s to www, so every canonical, hreflang
 * and sitemap URL must use www or it points at a redirect.
 */
export const SITE_URL = "https://www.hexaigon.gr";

/**
 * next-intl runs with the default `localePrefix: "always"`, so BOTH locales are
 * prefixed: /el (default) and /en. There is no unprefixed variant.
 *
 * @param pathname route without the locale prefix — "" for the homepage,
 *                 "/projects" for the projects page, etc.
 */
export const localeUrl = (locale: string, pathname = "") =>
  `${SITE_URL}/${locale}${pathname}`;

/**
 * Self-referential canonical plus the hreflang cluster. Each locale must point
 * its canonical at its OWN url — canonicalising /en to the Greek page would
 * tell Google the English version is a duplicate and drop it from the index.
 */
export const buildAlternates = (
  locale: string,
  pathname = ""
): NonNullable<Metadata["alternates"]> => {
  const el = localeUrl("el", pathname);
  const en = localeUrl("en", pathname);

  return {
    canonical: locale === "en" ? en : el,
    languages: {
      "el-GR": el,
      en,
      "x-default": el,
    },
  };
};
