import { setRequestLocale } from "next-intl/server";

import { ProfilePageSection } from "@/features/profile";

type ProfilePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfilePageSection />;
}
