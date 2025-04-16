import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Film } from "../../entities/film";
import { Review } from "../../entities/review";
import {
  FilmNotFoundError,
  NoAccessToCollectionError,
  NotOwnerOfReviewError,
  ReviewNotFoundError,
  ReviewOnFilmExistsError,
} from "./errors";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import {
  NoAccessToPrivateCollectionError,
  CollectionNotFoundError,
} from "../collection";
import { User } from "../../entities";
import { UserNotFoundError } from "../user";

export type CreateReviewDto = {
  filmId: Film["kinopoiskId"];
  description?: string | null;
  score?: number | null;
  isHidden?: boolean;
};

export type EditReviewDto = {
  description?: string | null;
  score?: number | null;
  isHidden?: boolean;
};

export interface IReviewService {
  getReview(props: {
    id: Id;
    by?: User["id"];
  }): Promise<Result<Review | null, NoAccessToPrivateCollectionError>>;

  createReview(props: {
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
  >;

  editReview(props: {
    reviewId: Review["id"];
    dto: EditReviewDto;
    by: User["id"];
  }): Promise<Result<Review, ReviewNotFoundError | NotOwnerOfReviewError>>;

  removeReview(props: {
    reviewId: Review["id"];
    by: User["id"];
  }): Promise<Result<null, ReviewNotFoundError | NotOwnerOfReviewError>>;

  getCollectionReviews(props: {
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
  >;

  searchReviews(props: {
    search: string;
    collectionId: Collection["id"];
    limit: number;
    by?: User["id"];
  }): Promise<
    Result<Review[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
  >;
}
