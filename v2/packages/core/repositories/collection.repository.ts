import { Collection } from "../entities/collection";
import { User } from "../entities/user";
import { PaginatedData } from "../utils/pagination";
import { IBaseRepository } from "./base.repository";

export interface ICollectionRepository extends IBaseRepository<Collection> {
  searchCollections(search: string): Promise<Collection>;

  getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>>;
}
