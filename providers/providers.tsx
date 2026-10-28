"use client";

import type { AbstractIntlMessages } from "next-intl";

import type { Locale } from "@/i18n/config";

import { AuthProvider } from "./auth-provider";
import { DocumentAttributes } from "./document-attributes";
import { LocaleProvider } from "./locale-provider";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

type ProvidersProps = {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
};

/**
 * Root client provider tree.
 * Order matters: locale → theme → query → auth → toast.
 */
export function Providers({ locale, messages, children }: ProvidersProps) {
  return (
    <LocaleProvider locale={locale} messages={messages}>
      <DocumentAttributes locale={locale as Locale} />
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </LocaleProvider>
  );
}
