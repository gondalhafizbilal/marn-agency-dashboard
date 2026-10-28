import { API_ENDPOINTS } from "@/constants";
import type {
  Agency,
  CreateAgencyInput,
  UpdateAgencyInput,
} from "@/features/agencies/types";
import type { ID } from "@/types";

import { api } from "../api";
import { BaseRepository } from "./base.repository";

export type { Agency, AgencyStatus } from "@/features/agencies/types";
export type CreateAgencyPayload = CreateAgencyInput;
export type UpdateAgencyPayload = UpdateAgencyInput;

class AgencyRepositoryClass extends BaseRepository<
  Agency,
  CreateAgencyPayload,
  UpdateAgencyPayload
> {
  constructor() {
    super(API_ENDPOINTS.AGENCIES.ROOT);
  }

  activate(id: ID) {
    return api.patch<Agency, UpdateAgencyPayload>(API_ENDPOINTS.AGENCIES.BY_ID(id), {
      status: "active",
    });
  }

  suspend(id: ID) {
    return api.patch<Agency, UpdateAgencyPayload>(API_ENDPOINTS.AGENCIES.BY_ID(id), {
      status: "suspended",
    });
  }
}

/** Singleton repository — import this, never instantiate in components. */
export const AgencyRepository = new AgencyRepositoryClass();
