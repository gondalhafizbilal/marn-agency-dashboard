import axios, { type AxiosInstance } from "axios";

import { attachInterceptors } from "./interceptors";

/**
 * Shared Axios instance.
 * Never import this in components — use repositories instead.
 */
export const apiClient: AxiosInstance = axios.create({
  // Next.js proxies this path to the backend to avoid browser CORS coupling.
  baseURL: "/api",
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachInterceptors(apiClient);
