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
} from "./errors";
import { CreateReviewDto, EditReviewDto, IReviewService } from "./interface";
import { IReviewRepository } from "../../repositories/review.repository";
import { IFilmService } from "../film/interface";
import { IFilmProvider } from "../../film-providers";
import { ICollectionService } from "../collection/interface";
import {
  CannotSeePrivateCollectionError,
  CollectionNotFoundError,
} from "../collection";
import { User } from "../../entities";

export class ReviewService implements IReviewService {
  constructor(
    private readonly reviewRepository: IReviewRepository,
    private readonly filmService: IFilmService,
    private readonly filmProvider: IFilmProvider,
    private readonly collectionService: ICollectionService
  ) {}

  async searchReviews(
    search: string,
    collectionId: Collection["id"],
    limit: number,
    by: User["id"]
  ): Promise<
    Result<Review[], CollectionNotFoundError | CannotSeePrivateCollectionError>
  > {
    const collection = await this.collectionService.getCollection(collectionId);

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (!collection.isPublic && collection.creator.id.value !== by.value) {
      return err(new CannotSeePrivateCollectionError());
    }

    const reviews = await this.reviewRepository.searchReviews(search, limit);

    return ok(reviews);
  }

  async createReview(
    dto: CreateReviewDto,
    by: User["id"]
  ): Promise<
    Result<
      Review,
      | FilmNotFoundError
      | ReviewOnFilmExistsError
      | CollectionNotFoundError
      | NotOwnerOfReviewError
    >
  > {
    const collection = await this.collectionService.getCollection(
      dto.collectionId
    );

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    if (collection.creator.id.value !== by.value) {
      return err(new NotOwnerOfReviewError());
    }

    const reviewOnFilm = await this.reviewRepository.getReviewOnFilm(
      dto.collectionId,
      dto.filmId
    );
    if (reviewOnFilm) {
      return err(new ReviewOnFilmExistsError());
    }

    let film = await this.filmService.getFilm(dto.filmId);

    if (!film) {
      const providedFilm = await this.filmProvider.getFilmByKpId(dto.filmId);
      if (!providedFilm) {
        return err(new FilmNotFoundError());
      }

      await this.filmService.saveFilm(providedFilm);
      film = providedFilm;
    }

    const newReview = new Review({
      score: dto.score,
      description: dto.description,
      film,
      collectionId: collection.id,
      userId: collection.creator.id,
    });

    const createdReview = await this.reviewRepository.create(newReview);
    return ok(createdReview);
  }

  async editReview(
    reviewId: Review["id"],
    dto: EditReviewDto,
    by: User["id"]
  ): Promise<Result<Review, ReviewNotFoundError>> {
    const existingReview = await this.reviewRepository.get(reviewId);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    if (existingReview.userId.value !== by.value) {
      return err(new NotOwnerOfReviewError());
    }

    const updatedReview = await this.reviewRepository.update(reviewId, {
      description: dto.description,
      score: dto.score,
    });

    return ok(updatedReview);
  }

  async removeReview(
    id: Id,
    by: User["id"]
  ): Promise<Result<null, ReviewNotFoundError | NotOwnerOfReviewError>> {
    const existingReview = await this.reviewRepository.get(id);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    if (existingReview.userId.value !== by.value) {
      return err(new NotOwnerOfReviewError());
    }

    await this.reviewRepository.remove(id);
    return ok(null);
  }

  async getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<Review>, CollectionNotFoundError>> {
    const collection = await this.collectionService.getCollection(collectionId);
    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const reviews = await this.reviewRepository.getCollectionReviews(
      collectionId,
      limit,
      cursor
    );

    return ok(reviews);
  }

  async getReview(id: Id): Promise<Review | null> {
    const review = await this.reviewRepository.get(id);
    return review;
  }
}
