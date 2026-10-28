import { setRequestLocale } from "next-intl/server";

import { RequestsPageSection } from "@/features/requests";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RequestsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RequestsPageSection />;
}
