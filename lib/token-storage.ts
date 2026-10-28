import { TOKEN_STORAGE_KEYS } from "@/constants";

/**
 * Token storage helpers.
 * Browser-only; safe no-ops on the server.
 * Module 6 will harden this (httpOnly cookies / secure storage).
 */

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
}

export function getRefreshToken(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Stores the current access token and optionally updates the refresh token.
 * Passing `undefined` preserves an existing refresh token; passing `null`
 * explicitly removes it.
 */
export function setTokens(accessToken: string, refreshToken?: string | null) {
  if (!canUseStorage()) return;
  localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

  if (typeof refreshToken === "string") {
    localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    return;
  }

  if (refreshToken === null) {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
  }
}

export function clearTokens() {
  if (!canUseStorage()) return;
  localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
}
