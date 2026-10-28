"use client";

import { useEffect } from "react";

import { getDirection, type Locale } from "@/i18n/config";

type DocumentAttributesProps = {
  locale: Locale;
};

/**
 * Syncs `lang` and `dir` onto <html> for correct RTL/LTR and accessibility.
 * Root layout owns <html>; locale is only known under [locale].
 */
export function DocumentAttributes({ locale }: DocumentAttributesProps) {
  useEffect(() => {
    const direction = getDirection(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale]);

  return null;
}
