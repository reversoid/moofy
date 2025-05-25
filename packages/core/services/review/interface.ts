import { Result } from "resulto";
import { Collection } from "../../entities/collection";
import { Film, FilmType } from "../../entities/film";
import { Review } from "../../entities/review";
import {
  FilmAlreadyWatched,
  FilmIsNotWatched,
  FilmNotFoundError,
  NotOwnerOfReviewError,
  ReviewNotFoundError,
  ReviewOnFilmExistsError,
} from "./errors";
import { Id } from "../../utils/id";
import { PaginatedData } from "../../utils/pagination";
import {
  NoAccessToPrivateCollectionError,
  CollectionNotFoundError,
  NotOwnerOfCollectionError,
} from "../collection";
import { Tag, User, WatchableReview } from "../../entities";
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

export type Range<T> = { from: T; to: T };

export type ReviewFilters = {
  type?: FilmType[];
  genres?: string[];
  tagsIds?: Tag["id"][];

  filmLength?: Array<Range<number>>;
  score?: Array<Range<number>>;
  year?: Array<Range<number>>;
  createdAt?: Array<Range<Date>>;
  updatedAt?: Array<Range<Date>>;
};

export type ChangeWatchedStatusProps = {
  id: Review["id"];
  by: User["id"];
  isWatched: boolean;
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
      | NotOwnerOfCollectionError
    >
  >;

  editReview(props: {
    reviewId: Review["id"];
    dto: EditReviewDto;
    by: User["id"];
    updatePosition?: boolean;
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
    filters?: ReviewFilters;
  }): Promise<
    Result<
      PaginatedData<Review>,
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  >;

  getWatchableReviews(reviews: Review[]): Promise<WatchableReview[]>;

  changeWatchedStatus(
    props: ChangeWatchedStatusProps
  ): Promise<
    Result<
      WatchableReview | null,
      | ReviewNotFoundError
      | UserNotFoundError
      | NotOwnerOfReviewError
      | FilmAlreadyWatched
      | FilmIsNotWatched
    >
  >;

  getFilmTypes(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<
      FilmType[],
      CollectionNotFoundError | NoAccessToPrivateCollectionError
    >
  >;

  getFilmGenres(props: {
    collectionId: Collection["id"];
    by?: User["id"];
  }): Promise<
    Result<string[], CollectionNotFoundError | NoAccessToPrivateCollectionError>
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
