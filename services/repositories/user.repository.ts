import { API_ENDPOINTS } from "@/constants";
import type { BaseEntity, CreatePayload, ID, UpdatePayload } from "@/types";

import { api } from "../api";
import { BaseRepository } from "./base.repository";

export type UserRole = "super_admin" | "agency_admin" | "employee" | "client";

export type UserStatus = "active" | "inactive" | "invited";

export type User = BaseEntity & {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  agencyId?: ID;
  avatarUrl?: string;
};

export type CreateUserPayload = CreatePayload<User>;
export type UpdateUserPayload = UpdatePayload<User>;

class UserRepositoryClass extends BaseRepository<User, CreateUserPayload, UpdateUserPayload> {
  constructor() {
    super(API_ENDPOINTS.USERS.ROOT);
  }

  findByAgency(agencyId: ID) {
    return api.getPaginated<User>(this.resourcePath, {
      params: { agencyId },
    });
  }
}

export const UserRepository = new UserRepositoryClass();
