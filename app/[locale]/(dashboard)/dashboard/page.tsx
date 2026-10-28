import { setRequestLocale } from "next-intl/server";

import { HeroBanner } from "@/components/layout";
import { DashboardAdsSection } from "@/features/dashboard";

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:gap-10">
      <HeroBanner />
      <DashboardAdsSection />
    </div>
  );
}
