import type { ID, PaginationParams } from "@/types";

import { api } from "../api";

/**
 * Base repository with standard CRUD operations.
 * Domain repositories extend this and override as needed.
 */
export abstract class BaseRepository<TEntity, TCreate = Partial<TEntity>, TUpdate = Partial<TEntity>> {
  protected constructor(protected readonly resourcePath: string) {}

  findAll(params?: PaginationParams) {
    return api.getPaginated<TEntity>(this.resourcePath, { params });
  }

  findById(id: ID) {
    return api.get<TEntity>(`${this.resourcePath}/${id}`);
  }

  create(payload: TCreate) {
    return api.post<TEntity, TCreate>(this.resourcePath, payload);
  }

  update(id: ID, payload: TUpdate) {
    return api.patch<TEntity, TUpdate>(`${this.resourcePath}/${id}`, payload);
  }

  remove(id: ID) {
    return api.delete(`${this.resourcePath}/${id}`);
  }
}
