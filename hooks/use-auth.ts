"use client";

import { useAuthStore } from "@/store";
import { useAuthReadiness } from "@/providers/auth-provider";

/**
 * Bridge between AuthProvider context and Zustand auth store.
 * Module 6 will expand this with session bootstrap / refresh.
 */
export function useAuth() {
  const { ready } = useAuthReadiness();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = useAuthStore((state) => state.hasRole);
  const belongsToAgency = useAuthStore((state) => state.belongsToAgency);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setSession = useAuthStore((state) => state.setSession);

  return {
    user,
    isAuthenticated,
    isLoading: !ready,
    hasRole,
    belongsToAgency,
    clearSession,
    setSession,
  };
}
