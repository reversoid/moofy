import { Id } from "../utils/id";

export interface IBaseRepository<T> {
  create(item: T): Promise<T>;
  get(id: Id): Promise<T | null>;
  update(id: Id, value: Partial<T>): Promise<T>;
  remove(id: Id): Promise<void>;
}
