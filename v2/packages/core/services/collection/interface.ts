import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { UserNotFoundError } from "../user/errors";
import { Id } from "../../utils/id";
import { CollectionNotFoundError } from "./errors";
import { PaginatedData } from "../../utils/pagination";

export type CreateCollectionDto = {
  userId: User["id"];
  name: string;
  description?: string;
  imageUrl?: string;
};

export type EditCollectionDto = {
  name?: string;
  description?: string | null;
  imageUrl?: string | null;
};

export interface ICollectionService {
  createCollection(
    dto: CreateCollectionDto
  ): Promise<Result<Collection, UserNotFoundError>>;

  removeCollection(id: Id): Promise<Result<null, CollectionNotFoundError>>;

  editCollection(
    dto: EditCollectionDto
  ): Promise<Result<Collection, CollectionNotFoundError>>;

  getUserCollections(userId: User["id"]): Promise<PaginatedData<Collection>>;
}
