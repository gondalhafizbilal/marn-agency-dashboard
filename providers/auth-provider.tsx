"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { getAccessToken } from "@/lib/token-storage";
import { useAuthStore } from "@/store";

type AuthReadiness = {
  ready: boolean;
};

const AuthReadinessContext = createContext<AuthReadiness>({ ready: false });

/** Lets route guards wait for Zustand's persisted session to hydrate. */
export function useAuthReadiness() {
  return useContext(AuthReadinessContext);
}

/**
 * Hydrates the persisted session before client-side route guards render.
 * Tokens are also checked in local storage because Axios reads them outside
 * React state; a missing token invalidates a stale persisted session.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const validateSession = () => {
      if (!useAuthStore.persist.hasHydrated()) return;

      const { accessToken, clearSession, isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && (!accessToken || !getAccessToken())) {
        clearSession();
      }

      setReady(true);
    };

    validateSession();
    const unsubscribe = useAuthStore.persist.onFinishHydration(validateSession);
    return unsubscribe;
  }, []);

  return (
    <AuthReadinessContext.Provider value={{ ready }}>{children}</AuthReadinessContext.Provider>
  );
}
