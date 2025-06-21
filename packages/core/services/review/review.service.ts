import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Review } from "../../entities/review";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import {
  FilmNotFoundError,
  ReviewOnFilmExistsError,
  ReviewNotFoundError,
  NotOwnerOfReviewError,
  FilmAlreadyWatched,
  FilmIsNotWatched,
} from "./errors";
import {
  ChangeWatchedStatusProps,
  CreateReviewDto,
  EditReviewDto,
  IReviewService,
  ReviewFilters,
} from "./interface";
import { IReviewRepository } from "../../repositories/review.repository";
import { IFilmService } from "../film/interface";
import { IFilmProvider } from "../../film-providers";
import { ICollectionService } from "../collection/interface";
import {
  NoAccessToPrivateCollectionError,
  CollectionNotFoundError,
  NotOwnerOfCollectionError,
} from "../collection";
import { FilmType, User } from "../../entities";
import { UserNotFoundError } from "../user";
import { IUserRepository, IWatchedReviewRepository } from "../../repositories";

export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly filmService: IFilmService,
    private readonly filmProvider: IFilmProvider,
    private readonly collectionService: ICollectionService,
    private readonly userRepository: IUserRepository,
    private readonly watchedReviewRepository: IWatchedReviewRepository
  ) {}

  areWatched(reviews: Review[]): Promise<boolean[]> {
    return this.watchedReviewRepository.areWatched(reviews);
  }

  async changeWatchedStatus(
    props: ChangeWatchedStatusProps
  ): Promise<
    Result<
      null,
      | ReviewNotFoundError
      | UserNotFoundError
      | NotOwnerOfReviewError
      | FilmAlreadyWatched
      | FilmIsNotWatched
    >
  > {
    // TODO make better access checks

    const reviewResult = await this.getReview({ id: props.id, by: props.by });
    if (reviewResult.isErr()) {
      const error = reviewResult.error;
      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(error);
      }
    }

    const review = reviewResult.unwrap();

    if (!review) {
      return err(new ReviewNotFoundError());
    }

    const toWatchCollectionResult =
      await this.collectionService.getOrCreateToWatchCollection({
        userId: review.userId,
        by: props.by,
      });

    if (toWatchCollectionResult.isErr()) {
      const error = toWatchCollectionResult.error;
      if (error instanceof UserNotFoundError) {
        return err(error);
      }

      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(error);
      }
    }

    const toWatchCollection = toWatchCollectionResult.unwrap();

    if (toWatchCollection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfReviewError());
    }

    const [isWatched] = await this.areWatched([review]);

    if (props.isWatched && isWatched) {
      return err(new FilmAlreadyWatched());
    } else if (!props.isWatched && !isWatched) {
      return err(new FilmIsNotWatched());
    }

    if (props.isWatched) {
      await this.watchedReviewRepository.create(review.id);
    } else {
      await this.watchedReviewRepository.delete(review.id);
    }

    return ok(null);
  }

  async getFilmTypes(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<
      FilmType[],
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.error;
      return err(error);
    }

    const collection = collectionResult.unwrap();

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const filmTypes = await this.reviewRepository.getFilmTypes({
      collectionId: props.collectionId,
    });

    return ok(filmTypes);
  }

  async getFilmGenres(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<string[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.error;
      return err(error);
    }

    const collection = collectionResult.unwrap();

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const filmGenres = await this.reviewRepository.getFilmGenres({
      collectionId: props.collectionId,
    });

    return ok(filmGenres);
  }

  async searchReviews(props: {
    search: string;
    collectionId: Collection["id"];
    limit: number;
    by?: User["id"];
  }): Promise<
    Result<Review[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
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

    const isOwnerRequest = props.by?.value === collection.creator.id.value;

    const reviews = await this.reviewRepository.searchReviews({
      collectionId: props.collectionId,
      search: props.search,
      limit: props.limit,
      showHidden: isOwnerRequest,
    });

    return ok(reviews);
  }

  async createReview(props: {
    collectionId: Collection["id"];
    dto: CreateReviewDto;
    by: User["id"];
  }): Promise<
    Result<
      Review,
      | UserNotFoundError
      | FilmNotFoundError
      | ReviewOnFilmExistsError
      | CollectionNotFoundError
      | NotOwnerOfCollectionError
    >
  > {
    const user = await this.userRepository.get(props.by);

    if (!user) {
      return err(new UserNotFoundError());
    }

    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
    });

    if (collectionResult.isErr()) {
      const error = collectionResult.unwrapErr();

      if (error instanceof NoAccessToPrivateCollectionError) {
        return err(new NotOwnerOfCollectionError());
      }

      throw error;
    }

    const collection = collectionResult.unwrap();

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NotOwnerOfCollectionError());
    }

    const reviewOnFilm = await this.reviewRepository.getReviewOnFilmByKpId(
      props.collectionId,
      props.dto.filmId
    );
    if (reviewOnFilm) {
      return err(new ReviewOnFilmExistsError());
    }

    let film = await this.filmService.getFilmByKpId(props.dto.filmId);

    if (!film) {
      const providedFilm = await this.filmProvider.getFilmByKpId(
        props.dto.filmId
      );

      if (!providedFilm) {
        return err(new FilmNotFoundError());
      }

      const savedFilmResult = await this.filmService.saveFilm(providedFilm);
      if (savedFilmResult.isErr()) {
        throw savedFilmResult.error;
      }

      film = savedFilmResult.unwrap();
    }

    const newReview = Review.create({
      score: props.dto.score ?? null,
      description: props.dto.description ?? null,
      film,
      collectionId: collection.id,
      userId: collection.creator.id,
      isHidden: props.dto.isHidden,
    });

    const createdReview = await this.reviewRepository.create(newReview);
    return ok(createdReview);
  }

  async editReview(props: {
    reviewId: Review["id"];
    dto: EditReviewDto;
    by: User["id"];
    updatePosition?: boolean;
  }): Promise<Result<Review, ReviewNotFoundError | NotOwnerOfReviewError>> {
    const existingReview = await this.reviewRepository.get(props.reviewId);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    if (existingReview.userId.value !== props.by.value) {
      return err(new NotOwnerOfReviewError());
    }

    const updatedReview = await this.reviewRepository.update(
      props.reviewId,
      {
        description: props.dto.description,
        score: props.dto.score,
        isHidden: props.dto.isHidden,
      },
      { updatePosition: props.updatePosition }
    );

    return ok(updatedReview);
  }

  async removeReview(props: {
    reviewId: Review["id"];
    by: User["id"];
  }): Promise<Result<null, ReviewNotFoundError | NotOwnerOfReviewError>> {
    const existingReview = await this.reviewRepository.get(props.reviewId);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    if (existingReview.userId.value !== props.by.value) {
      return err(new NotOwnerOfReviewError());
    }

    await this.reviewRepository.delete(props.reviewId);
    return ok(null);
  }

  async getCollectionReviews(props: {
    collectionId: Collection["id"];
    by?: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
    filters?: ReviewFilters;
  }): Promise<
    Result<
      { reviews: PaginatedData<Review>; collection: Collection },
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  > {
    const collectionResult = await this.collectionService.getCollection({
      id: props.collectionId,
      by: props.by,
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

    const isOwnerRequest = props.by?.value === collection.creator.id.value;

    if (props.search) {
      const reviews = await this.reviewRepository.searchReviews({
        collectionId: props.collectionId,
        limit: props.limit,
        search: props.search,
        showHidden: isOwnerRequest,
        filters: {
          filmLength: props.filters?.filmLength,
          genres: props.filters?.genres,
          tagsIds: props.filters?.tagsIds,
          type: props.filters?.type,
          year: props.filters?.year,
          score: props.filters?.score,
        },
      });

      return ok({
        reviews: { items: reviews, cursor: null },
        collection,
      });
    }

    const reviews = await this.reviewRepository.getCollectionReviews({
      collectionId: props.collectionId,
      limit: props.limit,
      cursor: props.cursor,
      showHidden: isOwnerRequest,
      filters: {
        filmLength: props.filters?.filmLength,
        genres: props.filters?.genres,
        tagsIds: props.filters?.tagsIds,
        type: props.filters?.type,
        year: props.filters?.year,
        createdAt: props.filters?.createdAt,
        updatedAt: props.filters?.updatedAt,
        score: props.filters?.score,
      },
    });

    return ok({ reviews, collection });
  }

  // TODO should it return "uncheckedAccess object? So we check if we really need"
  async getReview(props: {
    id: Id;
    by?: User["id"];
  }): Promise<Result<Review | null, NoAccessToPrivateCollectionError>> {
    const review = await this.reviewRepository.get(props.id);

    if (!review) {
      return ok(null);
    }

    const collectionResult = await this.collectionService.getCollection({
      id: review.collectionId,
      by: props.by,
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
      return ok(null);
    }

    if (review.isHidden && collection.creator.id.value !== props.by?.value) {
      return ok(null);
    }

    return ok(review);
  }
}
