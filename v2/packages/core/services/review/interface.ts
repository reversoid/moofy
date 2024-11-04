import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Film } from "../../entities/film";
import { Review } from "../../entities/review";
import {
  CollectionNotFoundError,
  FilmNotFoundError,
  ReviewNotFoundError,
  ReviewOnFilmExistsError,
} from "./errors";
import { Id } from "../../utils/id";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";

export type CreateReviewDto = {
  filmId: Film["id"];
  collectionId: Collection["id"];
  description?: string | null;
  score?: number;
};

export type EditReviewDto = {
  reviewId: Review["id"];
  description?: string | null;
  score?: number | null;
};

export interface IReviewService {
  createReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | CollectionNotFoundError
    >
  >;

  editReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | ReviewNotFoundError
    >
  >;

  removeReview(id: Id): Promise<Result<null, ReviewNotFoundError>>;

  getUserCollectionReviews(
    userId: User["id"],
    collectionId: Collection["id"],
    cursor?: string
  ): Promise<Result<PaginatedData<Review>, UserNotFoundError>>;
}
