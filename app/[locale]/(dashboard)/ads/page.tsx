import { setRequestLocale } from "next-intl/server";

import { AdsPageSection } from "@/features/ads";

type AdsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdsPage({ params }: AdsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AdsPageSection />;
}
