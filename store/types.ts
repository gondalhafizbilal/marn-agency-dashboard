import type { ID } from "@/types";

/**
 * Auth domain types for the Zustand store.
 * Kept in store/types to avoid circular imports with services.
 */
export type AuthUser = {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: AuthRole;
  agencyId?: ID;
  avatarUrl?: string;
};

/** Roles issued by the API across the Admin and Agency authentication flows. */
export type AuthRole =
  | "admin"
  | "super_admin"
  | "agency_owner"
  | "agency_admin"
  | "employee"
  | "client"
  | "service_agency"
  | "workforce_agency";
