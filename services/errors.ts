import type { ApiError } from "@/types";

/**
 * Normalized API error thrown by repositories and interceptors.
 * Components should catch this type — never raw Axios errors.
 */
export class AppApiError extends Error {
  readonly code?: string;
  readonly statusCode?: number;
  readonly details?: unknown;

  constructor({ message, code, statusCode, details }: ApiError & { details?: unknown }) {
    super(message);
    this.name = "AppApiError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isAppApiError(error: unknown): error is AppApiError {
  return error instanceof AppApiError;
}

export function toAppApiError(error: unknown): AppApiError {
  if (isAppApiError(error)) return error;

  if (typeof error === "object" && error !== null && "isAxiosError" in error) {
    const axiosError = error as {
      response?: {
        status?: number;
        data?: { message?: string; error?: string; code?: string; errors?: unknown };
      };
      message?: string;
    };

    return new AppApiError({
      message:
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error ??
        axiosError.message ??
        "Request failed",
      code: axiosError.response?.data?.code,
      statusCode: axiosError.response?.status,
      details: axiosError.response?.data?.errors,
    });
  }

  if (error instanceof Error) {
    return new AppApiError({ message: error.message });
  }

  return new AppApiError({ message: "An unexpected error occurred" });
}
