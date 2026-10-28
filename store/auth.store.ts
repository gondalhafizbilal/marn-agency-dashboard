import { create } from "zustand";
import { persist } from "zustand/middleware";

import { clearTokens, setTokens } from "@/lib/token-storage";
import type { ID } from "@/types";

import type { AuthRole, AuthUser } from "./types";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setSession: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string | null;
  }) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
  hasRole: (roles: AuthRole | AuthRole[]) => boolean;
  belongsToAgency: (agencyId: ID) => boolean;
};

/**
 * Auth store — session + role helpers. Token values are mirrored to the
 * token storage module because Axios runs outside React/Zustand.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setSession: ({ user, accessToken, refreshToken }) => {
        setTokens(accessToken, refreshToken ?? null);
        set({
          user,
          accessToken,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: Boolean(user),
        });
      },

      clearSession: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      hasRole: (roles) => {
        const { user } = get();
        if (!user) return false;
        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes(user.role);
      },

      belongsToAgency: (agencyId) => {
        const { user } = get();
        return user?.agencyId === agencyId;
      },
    }),
    {
      name: "marn-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
