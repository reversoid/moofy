import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { CollectionNotFoundError } from "../collection/errors";
import { UserNotFoundError } from "../user/errors";
import {
  CollectionAlreadyFavoritedError,
  CollectionNotFavoritedError,
} from "./errors";

export interface IFavoriteCollectionService {
  addToFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<
      Collection,
      CollectionNotFoundError | CollectionAlreadyFavoritedError
    >
  >;

  removeFromFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<Collection, CollectionNotFoundError | CollectionNotFavoritedError>
  >;

  getUserFavoriteCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<Collection>, UserNotFoundError>>;

  isCollectionFavorited(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<boolean>;
}
