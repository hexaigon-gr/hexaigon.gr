import { routing, SUPPORTED_LOCALES } from "./routing";

export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** A value that exists in every supported locale. */
export type Localized<T> = Record<Locale, T>;

const isLocale = (value: string): value is Locale =>
  (SUPPORTED_LOCALES as readonly string[]).includes(value);

/**
 * Reads a `Localized` value for a locale that arrives as a plain string from
 * route params. Falls back to the default locale so a bad param renders Greek
 * instead of `undefined`.
 */
export const pick = <T>(value: Localized<T>, locale: string): T =>
  isLocale(locale) ? value[locale] : value[routing.defaultLocale];
