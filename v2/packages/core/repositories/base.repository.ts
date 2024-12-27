import { CreatableEntity } from "../utils";
import { Id } from "../utils/id";

export class EntityNotFoundError extends Error {
  constructor() {
    super("Entity Not Found");
  }
}

export abstract class IBaseRepository<T extends { id: unknown }> {
  abstract create(item: T | CreatableEntity<T>): Promise<T>;
  abstract get(id: T["id"]): Promise<T | null>;
  abstract update(id: Id, value: Partial<T>): Promise<T>;
  abstract remove(id: Id): Promise<void>;

  async getOrThrow(id: T["id"]): Promise<T> {
    const item = await this.get(id);

    if (!item) {
      throw new EntityNotFoundError();
    }

    return item;
  }
}
