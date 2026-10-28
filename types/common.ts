/** Shared primitive types used across features. */

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string;

export type Timestamp = string;

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

/** Some backend controllers return `{ data, message }`, while others return
 * the resource directly. The API client supports both response shapes. */
export type ApiPayload<T> = ApiResponse<T> | T;

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
};
