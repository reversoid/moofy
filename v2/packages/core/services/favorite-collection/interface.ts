import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { CollectionNotFoundError } from "../collection/errors";
import { UserNotFoundError } from "../user/errors";
import {
  CollectionAlreadyFavoritedError,
  CollectionIsPrivateError,
  CollectionNotFavoritedError,
} from "./errors";

export interface IFavoriteCollectionService {
  addToFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<
      Collection,
      | CollectionNotFoundError
      | CollectionAlreadyFavoritedError
      | CollectionIsPrivateError
    >
  >;

  removeFromFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<
      Collection,
      | CollectionNotFoundError
      | CollectionNotFavoritedError
      | CollectionIsPrivateError
    >
  >;

  getUserFavoriteCollections(
    userId: User["id"],
    limit: number,
    cursor?: string,
    search?: string
  ): Promise<Result<PaginatedData<Collection>, UserNotFoundError>>;

  isCollectionFavorited(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<boolean>;
}
