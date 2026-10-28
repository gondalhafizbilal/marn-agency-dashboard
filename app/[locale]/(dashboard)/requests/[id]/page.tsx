import { setRequestLocale } from "next-intl/server";

import { RequestDetailPageSection } from "@/features/requests/components/request-detail-page-section";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function RequestDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex w-full flex-col items-center">
      <RequestDetailPageSection requestId={id} />
    </div>
  );
}
