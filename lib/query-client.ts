import { QueryClient, isServer } from "@tanstack/react-query";

import { DEFAULT_PAGE_SIZE } from "@/constants";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Shared QueryClient factory for App Router.
 * Server: always create a new client per request.
 * Browser: reuse a singleton to avoid re-creating on suspense.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

/** Canonical query key factory — keeps cache keys consistent across features. */
export const queryKeys = {
  agencies: {
    all: ["agencies"] as const,
    lists: () => [...queryKeys.agencies.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.agencies.lists(), params ?? {}] as const,
    details: () => [...queryKeys.agencies.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.agencies.details(), id] as const,
  },
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), params ?? {}] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },
  clients: {
    all: ["clients"] as const,
    lists: () => [...queryKeys.clients.all, "list"] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.clients.lists(), params ?? {}] as const,
    details: () => [...queryKeys.clients.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.clients.details(), id] as const,
  },
} as const;

export const QUERY_DEFAULTS = {
  pageSize: DEFAULT_PAGE_SIZE,
} as const;
