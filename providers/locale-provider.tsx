"use client";

import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

import { DEFAULT_TIMEZONE } from "@/i18n/config";

type LocaleProviderProps = {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
};

/**
 * Client boundary for next-intl.
 * Server layouts load messages; this provider exposes them to Client Components.
 */
export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIMEZONE}>
      {children}
    </NextIntlClientProvider>
  );
}
