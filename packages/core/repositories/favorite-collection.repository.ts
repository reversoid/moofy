import { Collection } from "../entities/collection";
import { User } from "../entities/user";
import { PaginatedData } from "../utils/pagination";

export abstract class IFavoriteCollectionRepository {
  abstract add(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<void>;

  abstract remove(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<void>;

  abstract exists(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<boolean>;

  abstract getUserFavoriteCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>>;
}
