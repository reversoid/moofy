import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import { CollectionNotFoundError, NotOwnerOfCollectionError } from "./errors";
import {
  CreateCollectionDto,
  EditCollectionDto,
  ICollectionService,
} from "./interface";
import { ICollectionRepository } from "../../repositories/collection.repository";
import { IUserRepository } from "../../repositories/user.repository";

export class CollectionService implements ICollectionService {
  constructor(
    private readonly collectionRepository: ICollectionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async createCollection(
    dto: CreateCollectionDto
  ): Promise<Result<Collection, UserNotFoundError>> {
    const user = await this.userRepository.get(dto.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const newCollection = new Collection({
      creator: user,
      isPublic: dto.isPublic ?? false,
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
    });

    const createdCollection =
      await this.collectionRepository.create(newCollection);

    return ok(createdCollection);
  }

  async removeCollection(
    id: Id,
    by: User["id"]
  ): Promise<
    Result<null, CollectionNotFoundError | NotOwnerOfCollectionError>
  > {
    const collection = await this.collectionRepository.get(id);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    await this.collectionRepository.remove(id);
    return ok(null);
  }

  async editCollection(
    id: Collection["id"],
    dto: EditCollectionDto,
    by: User["id"]
  ): Promise<
    Result<Collection, CollectionNotFoundError | NotOwnerOfCollectionError>
  > {
    const collection = await this.collectionRepository.get(id);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    const updatedCollection = await this.collectionRepository.update(id, {
      description: dto.description,
      imageUrl: dto.imageUrl,
      isPublic: dto.isPublic,
      name: dto.name,
    });

    return ok(updatedCollection);
  }

  async getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<Collection>, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collections = await this.collectionRepository.getUserCollections(
      userId,
      limit,
      cursor
    );

    return ok(collections);
  }

  async getCollection(id: Collection["id"]): Promise<Collection | null> {
    const collection = await this.collectionRepository.get(id);
    return collection;
  }

  async searchCollections(
    search: string,
    limit: number
  ): Promise<Collection[]> {
    return this.collectionRepository.searchCollections(search, limit);
  }
}
