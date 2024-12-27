import { err, ok, Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Review } from "../../entities/review";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import {
  FilmNotFoundError,
  ReviewOnFilmExistsError,
  ReviewNotFoundError,
} from "./errors";
import { CreateReviewDto, EditReviewDto, IReviewService } from "./interface";
import { IReviewRepository } from "../../repositories/review.repository";
import { IFilmService } from "../film/interface";
import { IFilmProvider } from "../../film-providers";
import { ICollectionService } from "../collection/interface";
import { CollectionNotFoundError } from "../collection";

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
    limit: number
  ): Promise<Result<Review[], CollectionNotFoundError>> {
    const collection = await this.collectionService.getCollection(collectionId);

    if (!collection) {
      return err(new CollectionNotFoundError());
    }

    const reviews = await this.reviewRepository.searchReviews(search, limit);

    return ok(reviews);
  }

  async createReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | CollectionNotFoundError
    >
  > {
    const collection = await this.collectionService.getCollection(
      dto.collectionId
    );

    if (!collection) {
      return err(new CollectionNotFoundError());
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
    dto: EditReviewDto
  ): Promise<Result<Review, ReviewNotFoundError>> {
    const existingReview = this.reviewRepository.get(reviewId);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
    }

    const updatedReview = await this.reviewRepository.update(reviewId, {
      description: dto.description,
      score: dto.score,
    });

    return ok(updatedReview);
  }

  async removeReview(id: Id): Promise<Result<null, ReviewNotFoundError>> {
    const existingReview = this.reviewRepository.get(id);

    if (!existingReview) {
      return err(new ReviewNotFoundError());
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
}
