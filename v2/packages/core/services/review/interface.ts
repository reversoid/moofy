import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Film } from "../../entities/film";
import { Review } from "../../entities/review";
import {
  CannotSeePrivateCollectionError,
  FilmNotFoundError,
  NotOwnerOfReviewError,
  ReviewNotFoundError,
  ReviewOnFilmExistsError,
} from "./errors";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import { CollectionNotFoundError } from "../collection";
import { User } from "../../entities";

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
  >;

  editReview(
    reviewId: Review["id"],
    dto: EditReviewDto,
    by: User["id"]
  ): Promise<Result<Review, ReviewNotFoundError | NotOwnerOfReviewError>>;

  removeReview(
    id: Id,
    by: User["id"]
  ): Promise<Result<null, ReviewNotFoundError | NotOwnerOfReviewError>>;

  getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string,
    by?: User["id"]
  ): Promise<
    Result<
      PaginatedData<Review>,
      | CollectionNotFoundError
      | NotOwnerOfReviewError
      | CannotSeePrivateCollectionError
    >
  >;

  searchReviews(
    search: string,
    collectionId: Collection["id"],
    limit: number,
    by?: User["id"]
  ): Promise<
    Result<Review[], CollectionNotFoundError | CannotSeePrivateCollectionError>
  >;
}
