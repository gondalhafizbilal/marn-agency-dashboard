import { setRequestLocale } from "next-intl/server";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { DashboardShell } from "@/components/layout";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ProtectedRoute allowedRoles={["service_agency", "workforce_agency"]}>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
