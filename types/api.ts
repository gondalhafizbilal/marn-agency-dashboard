import type { ID, Timestamp } from "@/types";

/** Shared query / mutation parameter types for the API layer. */

export type PaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type CreatePayload<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

export type UpdatePayload<T> = Partial<CreatePayload<T>>;

export type EntityTimestamps = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type BaseEntity = {
  id: ID;
} & EntityTimestamps;
