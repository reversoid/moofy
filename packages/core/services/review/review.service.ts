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
  NoAccessToCollectionError,
} from "./errors";
import { CreateReviewDto, EditReviewDto, IReviewService } from "./interface";
import { IReviewRepository } from "../../repositories/review.repository";
import { IFilmService } from "../film/interface";
import { IFilmProvider } from "../../film-providers";
import { ICollectionService } from "../collection/interface";
import {
  NoAccessToPrivateCollectionError,
  CollectionNotFoundError,
} from "../collection";
import { User } from "../../entities";
import { IUserService, UserNotFoundError } from "../user";
import { IUserRepository } from "../../repositories";

export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly filmService: IFilmService,
    private readonly filmProvider: IFilmProvider,
    private readonly collectionService: ICollectionService,
    private readonly userRepository: IUserRepository
  ) {}

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

    const reviews = await this.reviewRepository.searchReviews(
      props.collectionId,
      props.search,
      props.limit
    );

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
      | NoAccessToCollectionError
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
        return err(new NoAccessToCollectionError());
      }

      throw error;
    }

    const collection = collectionResult.unwrap();

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== props.by.value) {
      return err(new NoAccessToCollectionError());
    }

    const reviewOnFilm = await this.reviewRepository.getReviewOnFilm(
      props.collectionId,
      props.dto.filmId
    );
    if (reviewOnFilm) {
      return err(new ReviewOnFilmExistsError());
    }

    let film = await this.filmService.getFilm(props.dto.filmId);

    if (!film) {
      const providedFilm = await this.filmProvider.getFilmByKpId(
        props.dto.filmId
      );
      if (!providedFilm) {
        return err(new FilmNotFoundError());
      }

      await this.filmService.saveFilm(providedFilm);
      film = providedFilm;
    }

    const newReview = new Review({
      score: props.dto.score ?? null,
      description: props.dto.description ?? null,
      film,
      collectionId: collection.id,
      userId: collection.creator.id,
    });

    const createdReview = await this.reviewRepository.create(newReview);
    return ok(createdReview);
  }

  async editReview(props: {
    reviewId: Review["id"];
    dto: EditReviewDto;
    by: User["id"];
  }): Promise<Result<Review, ReviewNotFoundError | NotOwnerOfReviewError>> {
    const existingReview = await this.reviewRepository.get(props.reviewId);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    if (existingReview.userId.value !== props.by.value) {
      return err(new NotOwnerOfReviewError());
    }

    const updatedReview = await this.reviewRepository.update(props.reviewId, {
      description: props.dto.description,
      score: props.dto.score,
    });

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

    await this.reviewRepository.remove(props.reviewId);
    return ok(null);
  }

  async getCollectionReviews(props: {
    collectionId: Collection["id"];
    by?: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<
    Result<
      PaginatedData<Review>,
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

    if (props.search) {
      const reviews = await this.reviewRepository.searchReviews(
        props.collectionId,
        props.search,
        props.limit
      );

      return ok({ items: reviews, cursor: null });
    }

    const reviews = await this.reviewRepository.getCollectionReviews(
      props.collectionId,
      props.limit,
      props.cursor
    );

    return ok(reviews);
  }

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

    return ok(review);
  }
}
