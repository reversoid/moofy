import { CreatableEntity } from "../utils";
import { Id } from "../utils/id";

export interface IBaseRepository<T extends { id: unknown }> {
  create(item: T | CreatableEntity<T>): Promise<T>;
  get(id: T["id"]): Promise<T | null>;
  update(id: Id, value: Partial<T>): Promise<T>;
  remove(id: Id): Promise<void>;
}
