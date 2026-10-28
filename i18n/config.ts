export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Qatar local time — avoids SSR/client markup mismatches in next-intl. */
export const DEFAULT_TIMEZONE = "Asia/Qatar";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const RTL_LOCALES: readonly Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
