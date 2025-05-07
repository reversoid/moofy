import { Tag } from "../entities";
import { Collection } from "../entities/collection";
import { Film, FilmType } from "../entities/film";
import { Review } from "../entities/review";
import { Creatable } from "../utils";
import { PaginatedData } from "../utils/pagination";

export type Range<T> = { from: T; to: T };

export type ReviewFilters = {
  type?: FilmType[];
  genres?: string[];
  tagsIds?: Tag["id"][];

  filmLength?: Array<Range<number>>;
  year?: Array<Range<number>>;
  createdAt?: Array<Range<Date>>;
  updatedAt?: Array<Range<Date>>;
};

export abstract class IReviewRepository {
  abstract searchReviews(props: {
    collectionId: Collection["id"];
    search: string;
    limit: number;
    showHidden: boolean;
    filters?: ReviewFilters;
  }): Promise<Review[]>;

  abstract getCollectionReviews(props: {
    collectionId: Collection["id"];
    limit: number;
    cursor?: string;
    showHidden?: boolean;
    filters?: ReviewFilters;
  }): Promise<PaginatedData<Review>>;

  abstract getFilmTypes(props: {
    collectionId: Collection["id"];
  }): Promise<FilmType[]>;

  abstract getFilmGenres(props: {
    collectionId: Collection["id"];
  }): Promise<string[]>;

  abstract getReviewOnFilmByKpId(
    collectionId: Collection["id"],
    filmKpId: Film["kinopoiskId"]
  ): Promise<Review | null>;

  abstract getReviewOnFilm(
    collectionId: Collection["id"],
    filmId: Film["id"]
  ): Promise<Review | null>;

  abstract update(
    id: Review["id"],
    review: Partial<Review>,
    options?: { updatePosition?: boolean }
  ): Promise<Review>;

  abstract get(id: Review["id"]): Promise<Review | null>;
  abstract create(review: Creatable<Review>): Promise<Review>;
  abstract delete(id: Review["id"]): Promise<void>;
}
