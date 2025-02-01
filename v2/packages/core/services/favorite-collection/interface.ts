import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import {
  CollectionNotFoundError,
  NoAccessToPrivateCollectionError,
} from "../collection/errors";
import { UserNotFoundError } from "../user/errors";
import {
  CollectionAlreadyFavoritedError,
  CollectionNotFavoritedError,
} from "./errors";

export interface IFavoriteCollectionService {
  addToFavorites(props: {
    userId: User["id"];
    collectionId: Collection["id"];
  }): Promise<
    Result<
      null,
      | UserNotFoundError
      | CollectionNotFoundError
      | CollectionAlreadyFavoritedError
      | NoAccessToPrivateCollectionError
    >
  >;

  removeFromFavorites(props: {
    userId: User["id"];
    collectionId: Collection["id"];
  }): Promise<
    Result<
      null,
      | UserNotFoundError
      | CollectionNotFoundError
      | CollectionNotFavoritedError
      | NoAccessToPrivateCollectionError
    >
  >;

  getUserFavoriteCollections(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<Result<PaginatedData<Collection>, UserNotFoundError>>;

  isCollectionFavorited(props: {
    userId: User["id"];
    collectionId: Collection["id"];
  }): Promise<boolean>;
}
