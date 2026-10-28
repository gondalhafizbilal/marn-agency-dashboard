import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { APP_DESCRIPTION, APP_NAME } from "@/constants";

import "@/styles/globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

/**
 * Root layout — html/body shell only.
 * Locale, direction, and providers are applied in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="h-full">
      <body
        className={`${inter.variable} ${geistMono.variable} flex min-h-full flex-col font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
