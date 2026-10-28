"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-client";
import { AgencyRepository } from "@/services";
import type { PaginatedResponse, PaginationParams } from "@/types";

import type { Agency } from "../types";

type AgenciesQueryOptions = Omit<
  UseQueryOptions<PaginatedResponse<Agency>, Error>,
  "queryKey" | "queryFn"
>;

/**
 * Sample feature hook — demonstrates repository + React Query pattern.
 * Full agencies feature UI lands in Module 5.
 */
export function useAgencies(params?: PaginationParams, options?: AgenciesQueryOptions) {
  return useQuery({
    queryKey: queryKeys.agencies.list(params),
    queryFn: () => AgencyRepository.findAll(params),
    ...options,
  });
}

export function useAgency(
  id: string,
  options?: Omit<UseQueryOptions<Agency, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.agencies.detail(id),
    queryFn: () => AgencyRepository.findById(id),
    enabled: Boolean(id),
    ...options,
  });
}
