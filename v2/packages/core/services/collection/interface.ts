import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { UserNotFoundError } from "../user/errors";
import { Id } from "../../utils/id";
import { CollectionNotFoundError, NotOwnerOfCollectionError } from "./errors";
import { PaginatedData } from "../../utils/pagination";

export type CreateCollectionDto = {
  userId: User["id"];
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
  createCollection(
    dto: CreateCollectionDto
  ): Promise<Result<Collection, UserNotFoundError>>;

  removeCollection(
    id: Id,
    removeBy: User["id"]
  ): Promise<Result<null, CollectionNotFoundError | NotOwnerOfCollectionError>>;

  editCollection(
    id: Collection["id"],
    dto: EditCollectionDto,
    editBy: User["id"]
  ): Promise<
    Result<Collection, CollectionNotFoundError | NotOwnerOfCollectionError>
  >;

  getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<Collection>, UserNotFoundError>>;

  getCollection(id: Collection["id"]): Promise<Collection | null>;

  searchCollections(search: string, limit: number): Promise<Collection[]>;
}
