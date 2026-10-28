import type { AxiosRequestConfig } from "axios";

import type { ApiPayload, PaginatedResponse } from "@/types";

import { apiClient } from "./axios";
import { toAppApiError } from "./errors";

function isEnvelope<T>(payload: ApiPayload<T>): payload is { data: T; message?: string } {
  if (!payload || typeof payload !== "object" || !("data" in payload)) return false;

  return Object.keys(payload).every((key) => key === "data" || key === "message");
}

/** Normalizes direct backend responses and `{ data, message }` envelopes. */
export function unwrapApiPayload<T>(payload: ApiPayload<T>): T {
  return isEnvelope(payload) ? payload.data : payload;
}

/**
 * Thin typed wrappers around the Axios client.
 * Repositories should use these helpers — not raw axios calls.
 */
export const api = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<ApiPayload<T>>(url, config);
      return unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },

  async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    try {
      const response = await apiClient.get<ApiPayload<PaginatedResponse<T>>>(url, config);
      return unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },

  async post<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<ApiPayload<T>>(url, body, config);
      return unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },

  async put<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<ApiPayload<T>>(url, body, config);
      return unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },

  async patch<T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.patch<ApiPayload<T>>(url, body, config);
      return unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<ApiPayload<T>>(url, config);
      return response.data === undefined ? (undefined as T) : unwrapApiPayload(response.data);
    } catch (error) {
      throw toAppApiError(error);
    }
  },
};
