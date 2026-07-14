import { defineRouting } from "next-intl/routing";

export const SUPPORTED_LOCALES = ["en", "el"] as const;

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  // Greek is the primary audience, so "/" resolves to /el and hreflang
  // x-default points at the Greek page. Both locales stay prefixed.
  defaultLocale: "el",
  localeDetection: true,
});