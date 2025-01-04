import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Film } from "../../entities/film";
import { Review } from "../../entities/review";
import {
  FilmNotFoundError,
  ReviewNotFoundError,
  ReviewOnFilmExistsError,
} from "./errors";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import { CollectionNotFoundError } from "../collection";

export type CreateReviewDto = {
  filmId: Film["id"];
  collectionId: Collection["id"];
  description?: string | null;
  score?: number;
};

export type EditReviewDto = {
  description?: string | null;
  score?: number | null;
};

export interface IReviewService {
  getReview(id: Id): Promise<Review | null>;

  createReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | CollectionNotFoundError
    >
  >;

  editReview(
    reviewId: Review["id"],
    dto: EditReviewDto
  ): Promise<Result<Review, ReviewNotFoundError>>;

  removeReview(id: Id): Promise<Result<null, ReviewNotFoundError>>;

  getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<Review>, CollectionNotFoundError>>;

  searchReviews(
    search: string,
    collectionId: Collection["id"],
    limit: number
  ): Promise<Result<Review[], CollectionNotFoundError>>;
}
