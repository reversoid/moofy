// TODO remove file. GetOrThrow will be done in realisation level using util function, not abstraction level.

import { Creatable, Id } from "../utils";

export class EntityNotFoundError extends Error {
  constructor() {
    super("Entity Not Found");
  }
}

export abstract class IBaseRepository<T extends { id: Id }> {
  abstract create(item: T | Creatable<T>): Promise<T>;
  abstract get(id: T["id"]): Promise<T | null>;
  abstract update(id: T["id"], value: Partial<T>): Promise<T>;
  abstract remove(id: T["id"]): Promise<void>;

  async getOrThrow(id: T["id"]): Promise<T> {
    const item = await this.get(id);

    if (!item) {
      throw new EntityNotFoundError();
    }

    return item;
  }
}
