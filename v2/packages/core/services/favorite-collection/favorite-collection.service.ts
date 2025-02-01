import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { ICollectionRepository } from "../../repositories/collection.repository";
import { IFavoriteCollectionRepository } from "../../repositories";
import { IUserRepository } from "../../repositories/user.repository";
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
import { IFavoriteCollectionService } from "./interface";
import { ICollectionService } from "../collection";

export class FavoriteCollectionService implements IFavoriteCollectionService {
  constructor(
    private readonly favoriteCollectionRepository: IFavoriteCollectionRepository,
    private readonly collectionRepository: ICollectionRepository,
    private readonly userRepository: IUserRepository,
    private readonly collectionService: ICollectionService
  ) {}

  async addToFavorites(props: {
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
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.userId,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.unwrapErr();
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(error);
      }

      throw error;
    }

    const collection = collectionResult.unwrap();
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const exists = await this.favoriteCollectionRepository.exists(
      props.userId,
      props.collectionId
    );

    if (exists) {
      return err(new CollectionAlreadyFavoritedError());
    }

    await this.favoriteCollectionRepository.add(
      props.userId,
      props.collectionId
    );

    return ok(null);
  }

  async removeFromFavorites(props: {
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
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.userId,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.unwrapErr();
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(error);
      }

      throw error;
    }

    const collection = collectionResult.unwrap();
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const exists = await this.favoriteCollectionRepository.exists(
      props.userId,
      props.collectionId
    );

    if (!exists) {
      return err(new CollectionNotFavoritedError());
    }

    await this.favoriteCollectionRepository.remove(
      props.userId,
      props.collectionId
    );

    return ok(null);
  }

  async getUserFavoriteCollections(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<Result<PaginatedData<Collection>, UserNotFoundError>> {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    if (props.search) {
      const collections = await this.collectionRepository.searchCollections(
        props.search,
        props.limit,
        { favoritedBy: user.id }
      );

      return ok({ items: collections, cursor: null });
    }

    const collections =
      await this.favoriteCollectionRepository.getUserFavoriteCollections(
        props.userId,
        props.limit,
        props.cursor
      );

    return ok(collections);
  }

  async isCollectionFavorited(props: {
    userId: User["id"];
    collectionId: Collection["id"];
  }): Promise<boolean> {
    return this.favoriteCollectionRepository.exists(
      props.userId,
      props.collectionId
    );
  }
}
