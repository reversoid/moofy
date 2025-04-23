import { Collection } from "../entities/collection";
import { User } from "../entities/user";
import { Creatable } from "../utils";
import { PaginatedData } from "../utils/pagination";

export abstract class ICollectionRepository {
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
    cursor?: string,
    withPrivate?: boolean
  ): Promise<PaginatedData<Collection>>;

  abstract getOldestPublicCollections(limit: number): Promise<Collection[]>;

  abstract get(id: Collection["id"]): Promise<Collection | null>;

  abstract update(
    id: Collection["id"],
    value: Partial<Collection>,
    options?: { updatePosition?: boolean }
  ): Promise<Collection>;

  abstract create(value: Creatable<Collection>): Promise<Collection>;

  abstract delete(id: Collection["id"]): Promise<void>;
}
