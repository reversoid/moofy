import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { ICollectionRepository } from "../../repositories/collection.repository";
import { IFavoriteCollectionRepository } from "../../repositories";
import { IUserRepository } from "../../repositories/user.repository";
import { PaginatedData } from "../../utils/pagination";
import { CollectionNotFoundError } from "../collection/errors";
import { UserNotFoundError } from "../user/errors";
import {
  CollectionAlreadyFavoritedError,
  CollectionIsPrivateError,
  CollectionNotFavoritedError,
} from "./errors";
import { IFavoriteCollectionService } from "./interface";

export class FavoriteCollectionService implements IFavoriteCollectionService {
  constructor(
    private readonly favoriteCollectionRepository: IFavoriteCollectionRepository,
    private readonly collectionRepository: ICollectionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async addToFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<
      Collection,
      | CollectionNotFoundError
      | CollectionAlreadyFavoritedError
      | CollectionIsPrivateError
    >
  > {
    const collection = await this.collectionRepository.get(collectionId);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (!collection.isPublic && collection.creator.id !== userId) {
      return err(new CollectionIsPrivateError());
    }

    const exists = await this.favoriteCollectionRepository.exists(
      userId,
      collectionId
    );
    if (exists) {
      return err(new CollectionAlreadyFavoritedError());
    }

    await this.favoriteCollectionRepository.add(userId, collectionId);
    return ok(collection);
  }

  async removeFromFavorites(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<
    Result<
      Collection,
      | CollectionNotFoundError
      | CollectionNotFavoritedError
      | CollectionIsPrivateError
    >
  > {
    const collection = await this.collectionRepository.get(collectionId);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (!collection.isPublic && collection.creator.id !== userId) {
      return err(new CollectionIsPrivateError());
    }

    const exists = await this.favoriteCollectionRepository.exists(
      userId,
      collectionId
    );
    if (!exists) {
      return err(new CollectionNotFavoritedError());
    }

    await this.favoriteCollectionRepository.remove(userId, collectionId);
    return ok(collection);
  }

  async getUserFavoriteCollections(
    userId: User["id"],
    limit: number,
    cursor?: string,
    search?: string
  ): Promise<Result<PaginatedData<Collection>, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    if (search) {
      const collections = await this.collectionRepository.searchCollections(
        search,
        limit,
        { favoritedBy: user.id }
      );

      return ok({ items: collections, cursor: null });
    }

    const collections =
      await this.favoriteCollectionRepository.getUserFavoriteCollections(
        userId,
        limit,
        cursor
      );

    return ok(collections);
  }

  async isCollectionFavorited(
    userId: User["id"],
    collectionId: Collection["id"]
  ): Promise<boolean> {
    return this.favoriteCollectionRepository.exists(userId, collectionId);
  }
}
