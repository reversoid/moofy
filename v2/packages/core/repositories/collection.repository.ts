import { Collection } from "../entities/collection";
import { User } from "../entities/user";
import { PaginatedData } from "../utils/pagination";
import { IBaseRepository } from "./base.repository";

export abstract class ICollectionRepository extends IBaseRepository<Collection> {
  abstract searchCollections(
    search: string,
    limit: number,
    filter?: {
      userId?: User["id"];
      withPrivate?: boolean;
      favoritedBy?: User["id"];
    }
  ): Promise<Collection[]>;

  abstract getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>>;

  abstract getOldestPublicCollections(limit: number): Promise<Collection[]>;
}
