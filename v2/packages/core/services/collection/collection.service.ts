import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  CollectionNotFoundError,
  NotOwnerOfCollectionError,
  NoAccessToPrivateCollectionError,
} from "./errors";
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

  async createCollection(props: {
    userId: User["id"];
    dto: CreateCollectionDto;
  }): Promise<Result<Collection, UserNotFoundError>> {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const newCollection = new Collection({
      creator: user,
      isPublic: props.dto.isPublic ?? false,
      name: props.dto.name,
      description: props.dto.description,
      imageUrl: props.dto.imageUrl,
    });

    const createdCollection =
      await this.collectionRepository.create(newCollection);
    return ok(createdCollection);
  }

  async removeCollection(props: {
    id: Collection["id"];
    by: User["id"];
  }): Promise<
    Result<null, CollectionNotFoundError | NotOwnerOfCollectionError>
  > {
    const collection = await this.collectionRepository.get(props.id);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    await this.collectionRepository.remove(props.id);
    return ok(null);
  }

  async editCollection(props: {
    id: Collection["id"];
    dto: EditCollectionDto;
    by: User["id"];
  }): Promise<
    Result<Collection, CollectionNotFoundError | NotOwnerOfCollectionError>
  > {
    const collection = await this.collectionRepository.get(props.id);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    const updatedCollection = await this.collectionRepository.update(props.id, {
      description: props.dto.description,
      imageUrl: props.dto.imageUrl,
      isPublic: props.dto.isPublic,
      name: props.dto.name,
    });

    return ok(updatedCollection);
  }

  async getUserCollections(props: {
    userId: User["id"];
    limit: number;
    by?: User["id"];
    cursor?: string | null;
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
        {
          userId: user.id,
          withPrivate: props.userId.value === props.by?.value,
        }
      );

      return ok({ cursor: null, items: collections });
    }

    const collections = await this.collectionRepository.getUserCollections(
      props.userId,
      props.limit,
      props.cursor ?? undefined,
      props.userId.value === props.by?.value
    );

    return ok(collections);
  }

  async getCollection(props: {
    id: Collection["id"];
    by?: User["id"];
  }): Promise<Result<Collection | null, NoAccessToPrivateCollectionError>> {
    const collection = await this.collectionRepository.get(props.id);
    if (!collection) {
      return ok(null);
    }

    if (
      !collection.isPublic &&
      collection.creator.id.value !== props.by?.value
    ) {
      return err(new NoAccessToPrivateCollectionError());
    }

    return ok(collection);
  }

  async searchPublicCollections(props: {
    search: string;
    limit: number;
  }): Promise<Collection[]> {
    if (!props.search) {
      return this.collectionRepository.getOldestPublicCollections(props.limit);
    }

    return this.collectionRepository.searchCollections(
      props.search,
      props.limit
    );
  }
}
