import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { UserNotFoundError } from "../user/errors";
import {
  NoAccessToPrivateCollectionError,
  CollectionNotFoundError,
  NotOwnerOfCollectionError,
  AlreadyLikedCollectionError,
  NotLikedCollectionError,
  PersonalCollectionExistsError,
  DeleteLinkedPersonalCollectionError,
} from "./errors";
import { PaginatedData } from "../../utils/pagination";
import { Id } from "../../utils";
import { Review } from "../../entities";
import { TagNotFoundError } from "../tag";

export type CreateCollectionDto = {
  name: string;
  description?: string;
  imageUrl?: string;
  isPublic?: boolean;
};

export type EditCollectionDto = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
  isPublic?: boolean;
};

export interface ICollectionService {
  viewCollection(props: {
    collectionId: Collection["id"];
    userId: User["id"];
  }): Promise<
    Result<
      null,
      | CollectionNotFoundError
      | UserNotFoundError
      | NoAccessToPrivateCollectionError
    >
  >;

  createCollection(props: {
    userId: User["id"];
    dto: CreateCollectionDto;
  }): Promise<Result<Collection, UserNotFoundError>>;

  removeCollection(props: {
    id: Collection["id"];
    by: User["id"];
  }): Promise<
    Result<
      null,
      | CollectionNotFoundError
      | NotOwnerOfCollectionError
      | DeleteLinkedPersonalCollectionError
    >
  >;

  editCollection(props: {
    id: Collection["id"];
    dto: EditCollectionDto;
    by: User["id"];
    updatePosition?: boolean;
  }): Promise<
    Result<Collection, CollectionNotFoundError | NotOwnerOfCollectionError>
  >;

  getUserCollections(props: {
    userId: User["id"];
    limit: number;
    by?: User["id"];
    cursor?: string | null;
    search?: string;
  }): Promise<Result<PaginatedData<Collection>, UserNotFoundError>>;

  getCollection(props: {
    id: Collection["id"];
    by?: User["id"];
  }): Promise<Result<Collection | null, NoAccessToPrivateCollectionError>>;

  searchPublicCollections(props: {
    search: string;
    limit: number;
  }): Promise<Collection[]>;

  getSocials(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<
      { likesAmount: number; isLiked: boolean; isFavorited: boolean },
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  >;

  likeCollection(props: {
    collectionId: Collection["id"];
    userId: User["id"];
  }): Promise<
    Result<
      null,
      | NoAccessToPrivateCollectionError
      | CollectionNotFoundError
      | UserNotFoundError
      | AlreadyLikedCollectionError
    >
  >;

  unlikeCollection(props: {
    collectionId: Collection["id"];
    userId: User["id"];
  }): Promise<
    Result<
      null,
      | NoAccessToPrivateCollectionError
      | CollectionNotFoundError
      | UserNotFoundError
      | NotLikedCollectionError
    >
  >;

  createPersonalCollection(props: {
    userId: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | PersonalCollectionExistsError>
  >;

  getOrCreatePersonalCollection(props: {
    userId: Id;
    by?: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | NoAccessToPrivateCollectionError>
  >;

  getOrCreateToWatchCollection(props: {
    userId: Id;
    by?: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | NoAccessToPrivateCollectionError>
  >;

  fillPersonalCollectionWithOtherCollection(props: {
    userId: Id;
    collectionId: Id;
    tagsIds: Id[];
  }): Promise<
    Result<
      { conflictReviews: Review[]; addedReviews: Review[] },
      | CollectionNotFoundError
      | UserNotFoundError
      | TagNotFoundError
      | NotOwnerOfCollectionError
    >
  >;

  fillToWatchCollectionWithOtherCollection(props: {
    userId: Id;
    collectionId: Id;
    tagsIds: Id[];
    isWatchedCriteria: "score" | "desc" | "score_desc";
  }): Promise<
    Result<
      { conflictReviews: Review[]; addedReviews: Review[]; watched: boolean[] },
      | CollectionNotFoundError
      | UserNotFoundError
      | TagNotFoundError
      | NotOwnerOfCollectionError
    >
  >;
}
