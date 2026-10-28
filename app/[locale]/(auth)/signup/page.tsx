import { setRequestLocale } from "next-intl/server";

import { SignupForm } from "@/features/authentication";

type SignupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SignupForm />;
}
