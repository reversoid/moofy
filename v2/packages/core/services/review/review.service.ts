import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Review } from "../../entities/review";
import { User } from "../../entities/user";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  FilmNotFoundError,
  ReviewOnFilmExistsError,
  CollectionNotFoundError,
  ReviewNotFoundError,
} from "./errors";
import { CreateReviewDto, IReviewService } from "./interface";

// TODO
export class ReviewService implements IReviewService {
  createReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | CollectionNotFoundError
    >
  > {
    throw new Error("Method not implemented.");
  }

  editReview(
    dto: CreateReviewDto
  ): Promise<
    Result<
      Review,
      FilmNotFoundError | ReviewOnFilmExistsError | ReviewNotFoundError
    >
  > {
    throw new Error("Method not implemented.");
  }

  removeReview(id: Id): Promise<Result<null, ReviewNotFoundError>> {
    throw new Error("Method not implemented.");
  }

  getUserCollectionReviews(
    userId: User["id"],
    collectionId: Collection["id"],
    cursor?: string
  ): Promise<Result<PaginatedData<Review>, UserNotFoundError>> {
    throw new Error("Method not implemented.");
  }
}
