import { err, ok, Result } from "resulto";
import { Review, WatchableReview } from "../../entities";
import { Collection } from "../../entities/collection";
import { User } from "../../entities/user";
import {
  ICollectionLikeRepository,
  ICollectionRepository,
  ICollectionTagRepository,
  ICollectionViewRepository,
  IFavoriteCollectionRepository,
  IPersonalCollectionRepository,
  IReviewRepository,
  IReviewTagRepository,
  IToWatchCollectionRepository,
  IUserRepository,
  IWatchedReviewRepository,
} from "../../repositories";
import { Id } from "../../utils";
import { PaginatedData } from "../../utils/pagination";
import { TagNotFoundError } from "../tag";
import { UserNotFoundError } from "../user/errors";
import {
  AlreadyLikedCollectionError,
  CollectionNotFoundError,
  DeleteLinkedPersonalCollectionError,
  NoAccessToPrivateCollectionError,
  NotLikedCollectionError,
  NotOwnerOfCollectionError,
  PersonalCollectionExistsError,
  PersonalCollectionNotFoundError,
} from "./errors";
import {
  CreateCollectionDto,
  EditCollectionDto,
  ICollectionService,
} from "./interface";
import { checkCollectionAccess } from "../../utils/check-access";

// TODO split by CollectionService, PersonalCollectionService, ToWatch collection service
export class CollectionService implements ICollectionService {
  constructor(
    private readonly collectionRepository: ICollectionRepository,
    private readonly userRepository: IUserRepository,
    private readonly collectionLikeRepository: ICollectionLikeRepository,
    private readonly favoriteCollectionRepository: IFavoriteCollectionRepository,
    private readonly collectionViewRepository: ICollectionViewRepository,
    private readonly personalCollectionRepository: IPersonalCollectionRepository,
    private readonly reviewRepository: IReviewRepository,
    private readonly reviewTagRepository: IReviewTagRepository,
    private readonly collectionTagRepository: ICollectionTagRepository,
    private readonly toWatchCollectionRepository: IToWatchCollectionRepository,
    private readonly watchedReviewRepository: IWatchedReviewRepository
  ) {}

  async fillToWatchCollectionWithOtherCollection(props: {
    userId: Id;
    collectionId: Id;
    tagsIds: Id[];
    isWatchedCriteria: "score" | "desc" | "score_desc";
  }): Promise<
    Result<
      { conflictReviews: Review[]; addedReviews: WatchableReview[] },
      | CollectionNotFoundError
      | UserNotFoundError
      | TagNotFoundError
      | NotOwnerOfCollectionError
    >
  > {
    const toWatchCollectionResult = await this.getOrCreateToWatchCollection({
      userId: props.userId,
      by: props.userId,
    });

    if (toWatchCollectionResult.isErr()) {
      const error = toWatchCollectionResult.error;

      if (error instanceof UserNotFoundError) {
        return err(error);
      }

      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(new NotOwnerOfCollectionError());
      }
    }

    const toWatchCollection = toWatchCollectionResult.unwrap();

    const fillResult = await this.fillCollectionWithOtherCollection({
      by: props.userId,
      originCollectionId: toWatchCollection.id,
      targetCollectionId: props.collectionId,
      tagsIds: props.tagsIds,
    });

    if (fillResult.isErr()) {
      const error = fillResult.error;

      if (error instanceof CollectionNotFoundError) {
        return err(error);
      }

      if (error instanceof NotOwnerOfCollectionError) {
        return err(error);
      }
    }

    const { addedReviews, conflictReviews } = fillResult.unwrap();

    const watchedReviews = new Set<number>();

    for (const review of addedReviews) {
      if (
        (props.isWatchedCriteria === "desc" && review.description) ||
        (props.isWatchedCriteria === "score" && review.score) ||
        (props.isWatchedCriteria === "score_desc" &&
          review.description &&
          review.score)
      ) {
        await this.watchedReviewRepository.create(review.id);
        watchedReviews.add(review.id.value);
      }
    }

    return ok({
      addedReviews: addedReviews.map(
        (r) =>
          new WatchableReview({
            ...r,
            isWatched: watchedReviews.has(r.id.value),
          })
      ),
      conflictReviews,
    });
  }

  async getOrCreateToWatchCollection(props: {
    userId: Id;
    by?: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | NoAccessToPrivateCollectionError>
  > {
    const toWatchCollection =
      await this.toWatchCollectionRepository.getByUserId(props.userId);

    if (!toWatchCollection) {
      const newCollectionResult = await this.createCollection({
        userId: props.userId,
        dto: { name: props.userId.value.toString() },
      });

      if (newCollectionResult.isErr()) {
        const error = newCollectionResult.error;

        if (error instanceof UserNotFoundError) {
          return err(error);
        }
      }

      const newCollection = newCollectionResult.unwrap();

      await this.toWatchCollectionRepository.create({
        userId: props.userId,
        collectionId: newCollection.id,
      });

      return ok(newCollection);
    }

    const accessResult = checkCollectionAccess({
      collection: toWatchCollection,
      type: "R",
      by: props.by,
    });

    if (accessResult.isErr()) {
      const error = accessResult.error;
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(error);
      }
    }

    const collection = accessResult.unwrap();

    return ok(collection);
  }

  async getOrCreatePersonalCollection(props: {
    userId: Id;
    by?: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | NoAccessToPrivateCollectionError>
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collection = await this.personalCollectionRepository.getByUserId(
      props.userId
    );

    if (!collection) {
      const newPersonalCollectionResult = await this.createPersonalCollection({
        userId: props.userId,
      });

      return ok(newPersonalCollectionResult.unwrap());
    }

    if (
      !collection.isPublic &&
      collection.creator.id.value !== props.by?.value
    ) {
      return err(new NoAccessToPrivateCollectionError());
    }

    return ok(collection);
  }

  async createPersonalCollection(props: {
    userId: Id;
  }): Promise<
    Result<Collection, UserNotFoundError | PersonalCollectionExistsError>
  > {
    const hasPersonalCollection =
      await this.personalCollectionRepository.getByUserId(props.userId);

    if (hasPersonalCollection) {
      return err(new PersonalCollectionExistsError());
    }

    const newCollectionResult = await this.createCollection({
      userId: props.userId,
      dto: { name: `${props.userId.value}`, isPublic: true },
    });

    if (newCollectionResult.isErr()) {
      const error = newCollectionResult.error;
      if (error instanceof UserNotFoundError) {
        return err(error);
      }
      throw error;
    }

    const newCollection = newCollectionResult.value;

    await this.personalCollectionRepository.create({
      collectionId: newCollection.id,
      userId: props.userId,
    });

    return ok(newCollection);
  }

  async fillPersonalCollectionWithOtherCollection(props: {
    userId: Id;
    collectionId: Id;
    tagsIds: Id[];
  }): Promise<
    Result<
      { conflictReviews: Review[]; addedReviews: Review[] },
      CollectionNotFoundError | UserNotFoundError | NotOwnerOfCollectionError
    >
  > {
    const personalCollectionResult = await this.getOrCreatePersonalCollection({
      userId: props.userId,
      by: props.userId,
    });

    if (personalCollectionResult.isErr()) {
      const error = personalCollectionResult.error;

      if (error instanceof UserNotFoundError) {
        return err(error);
      }

      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(new NotOwnerOfCollectionError());
      }
    }

    const personalCollection = personalCollectionResult.unwrap();

    const fillResult = await this.fillCollectionWithOtherCollection({
      by: props.userId,
      originCollectionId: personalCollection.id,
      targetCollectionId: props.collectionId,
      tagsIds: props.tagsIds,
    });

    if (fillResult.isErr()) {
      const error = fillResult.error;

      if (error instanceof CollectionNotFoundError) {
        return err(error);
      }

      if (error instanceof NotOwnerOfCollectionError) {
        return err(error);
      }
    }

    const { addedReviews, conflictReviews } = fillResult.unwrap();

    return ok({ addedReviews, conflictReviews });
  }

  // TODO optimize
  private async fillCollectionWithOtherCollection(props: {
    originCollectionId: Collection["id"];
    targetCollectionId: Collection["id"];
    tagsIds: Id[];
    by: User["id"];
  }): Promise<
    Result<
      { conflictReviews: Review[]; addedReviews: Review[] },
      CollectionNotFoundError | NotOwnerOfCollectionError
    >
  > {
    const [originCollection, targetCollection] = await Promise.all([
      this.collectionRepository.get(props.originCollectionId),
      this.collectionRepository.get(props.targetCollectionId),
    ]);

    if (!originCollection) {
      return err(new CollectionNotFoundError());
    }

    if (!targetCollection) {
      return err(new CollectionNotFoundError());
    }

    if (
      originCollection.creator.id.value !== props.by.value ||
      targetCollection.creator.id.value !== props.by.value
    ) {
      return err(new NotOwnerOfCollectionError());
    }

    const getAllReviews = async (collectionId: Id) => {
      const reviews: Review[] = [];

      let nextCursor: string | null = null;

      do {
        const { cursor, items } =
          await this.reviewRepository.getCollectionReviews({
            collectionId,
            limit: 100,
            cursor: nextCursor ?? undefined,
          });

        nextCursor = cursor;

        for (const item of items) {
          reviews.push(item);
        }
      } while (nextCursor !== null);

      return reviews;
    };

    let [existingReviews, reviewsToAdd] = await Promise.all([
      getAllReviews(originCollection.id),
      getAllReviews(targetCollection.id),
    ]);

    // TODO filter using where in db level
    reviewsToAdd = reviewsToAdd.filter(
      (r) => r.description && !r.isHidden && r.score
    );

    const existingFilms = new Set(existingReviews.map((r) => r.film.id.value));
    const filmsToAdd = new Set(reviewsToAdd.map((r) => r.film.id.value));

    const conflictingFilmsIds = existingFilms.intersection(filmsToAdd);
    const filmIdsToCopy = filmsToAdd.difference(existingFilms);

    const cloneReview = async (filmId: number) => {
      const review = await this.reviewRepository.getReviewOnFilm(
        originCollection.id,
        new Id(filmId)
      );

      if (!review) {
        return null;
      }

      return this.reviewRepository.create(
        new Review({ ...review, collectionId: originCollection.id })
      );
    };

    const addedReviews: Review[] = [];

    for (const filmId of filmIdsToCopy) {
      const newReview = await cloneReview(filmId);

      if (newReview) {
        addedReviews.push(newReview);
      }
    }

    if (props.tagsIds) {
      const tags = await Promise.all(
        props.tagsIds.map((tId) => this.collectionTagRepository.get(tId))
      );

      if (
        tags.some(
          (tag) => tag?.collectionId.value !== originCollection.id.value
        )
      ) {
        return err(new TagNotFoundError());
      }

      for (const review of addedReviews) {
        for (const tag of tags) {
          if (!tag) {
            throw new Error("There should not be null tags");
          }

          await this.reviewTagRepository.linkTagToReview(tag.id, review.id);

          review.tags.push(tag);
        }
      }
    }

    const conflictReviews: Review[] = [];
    for (const filmId of conflictingFilmsIds) {
      const review = await this.reviewRepository.getReviewOnFilm(
        originCollection.id,
        new Id(filmId)
      );

      if (!review) {
        continue;
      }

      conflictReviews.push(review);
    }

    return ok({
      conflictReviews,
      addedReviews,
    });
  }

  async viewCollection(props: {
    collectionId: Collection["id"];
    userId: User["id"];
  }): Promise<
    Result<
      null,
      | CollectionNotFoundError
      | UserNotFoundError
      | NoAccessToPrivateCollectionError
    >
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.getCollection({
      id: props.collectionId,
      by: props.userId,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.unwrapErr());
    }

    const collection = collectionResult.unwrap();
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    await this.collectionViewRepository.viewCollection(
      collection.id,
      props.userId
    );

    return ok(null);
  }

  async getSocials(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<
      { likesAmount: number; isLiked: boolean; isFavorited: boolean },
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  > {
    const collectionResult = await this.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      return err(collectionResult.unwrapErr());
    }

    const collection = collectionResult.unwrap();
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const [likesAmount, isLiked, isFavorited] = await Promise.all([
      this.collectionLikeRepository.getCollectionLikesAmount(collection.id),
      props.by
        ? this.collectionLikeRepository.isUserLiked(collection.id, props.by)
        : false,
      props.by
        ? this.favoriteCollectionRepository.exists(props.by, props.collectionId)
        : false,
    ]);

    return ok({ likesAmount, isLiked, isFavorited });
  }

  async likeCollection(props: {
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
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.getCollection({
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

    const isLiked = await this.collectionLikeRepository.isUserLiked(
      collection.id,
      props.userId
    );

    if (isLiked) {
      return err(new AlreadyLikedCollectionError());
    }

    await this.collectionLikeRepository.createUserLike(
      collection.id,
      props.userId
    );

    return ok(null);
  }

  async unlikeCollection(props: {
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
  > {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.getCollection({
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

    const isLiked = await this.collectionLikeRepository.isUserLiked(
      collection.id,
      props.userId
    );

    if (!isLiked) {
      return err(new NotLikedCollectionError());
    }

    await this.collectionLikeRepository.deleteUserLike(
      collection.id,
      props.userId
    );

    return ok(null);
  }

  async createCollection(props: {
    userId: User["id"];
    dto: CreateCollectionDto;
  }): Promise<Result<Collection, UserNotFoundError>> {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const newCollection = Collection.create({
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
    Result<
      null,
      | CollectionNotFoundError
      | NotOwnerOfCollectionError
      | DeleteLinkedPersonalCollectionError
    >
  > {
    const personalCollection =
      await this.personalCollectionRepository.getByUserId(props.by);

    if (personalCollection?.id.value === props.id.value) {
      return err(new DeleteLinkedPersonalCollectionError());
    }

    const collection = await this.collectionRepository.get(props.id);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    await this.collectionRepository.delete(props.id);
    return ok(null);
  }

  async editCollection(props: {
    id: Collection["id"];
    dto: EditCollectionDto;
    by: User["id"];
    updatePosition?: boolean;
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

    const updatedCollection = await this.collectionRepository.update(
      props.id,
      {
        description: props.dto.description,
        imageUrl: props.dto.imageUrl,
        isPublic: props.dto.isPublic,
        name: props.dto.name,
      },
      { updatePosition: props.updatePosition }
    );

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

    const isOwnerRequest = props.userId.value === props.by?.value;

    if (props.search) {
      const collections = await this.collectionRepository.searchCollections(
        props.search,
        props.limit,
        {
          userId: user.id,
          withPrivate: isOwnerRequest,
        }
      );

      return ok({ cursor: null, items: collections });
    }

    const collections = await this.collectionRepository.getUserCollections(
      props.userId,
      props.limit,
      props.cursor ?? undefined,
      isOwnerRequest
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
