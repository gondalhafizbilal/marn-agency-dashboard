import { API_ENDPOINTS } from "@/constants";
import type { BaseEntity, CreatePayload, ID, UpdatePayload } from "@/types";

import { api } from "../api";
import { BaseRepository } from "./base.repository";

export type ClientStatus = "active" | "inactive" | "prospect";

export type Client = BaseEntity & {
  name: string;
  nameAr?: string;
  email?: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  agencyId: ID;
};

export type CreateClientPayload = CreatePayload<Client>;
export type UpdateClientPayload = UpdatePayload<Client>;

class ClientRepositoryClass extends BaseRepository<
  Client,
  CreateClientPayload,
  UpdateClientPayload
> {
  constructor() {
    super(API_ENDPOINTS.CLIENTS.ROOT);
  }

  findByAgency(agencyId: ID) {
    return api.getPaginated<Client>(this.resourcePath, {
      params: { agencyId },
    });
  }
}

export const ClientRepository = new ClientRepositoryClass();
