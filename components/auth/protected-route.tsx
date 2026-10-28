"use client";

import { useEffect } from "react";

import { useRouter } from "@/i18n/navigation";
import { useAuthReadiness } from "@/providers/auth-provider";
import { useAuthStore } from "@/store";
import type { AuthRole } from "@/store/types";

type ProtectedRouteProps = {
  allowedRoles: AuthRole[];
  children: React.ReactNode;
};

/** Client-side access guard for routes that require an authenticated role. */
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const { ready } = useAuthReadiness();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);
  const hasAccess = isAuthenticated && Boolean(role && allowedRoles.includes(role));

  useEffect(() => {
    if (ready && !hasAccess) {
      router.replace("/login");
    }
  }, [hasAccess, ready, router]);

  if (!ready || !hasAccess) {
    return <div aria-busy="true" className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
