import { Tag } from "../entities";
import { Collection } from "../entities/collection";
import { Film, FilmType } from "../entities/film";
import { Review } from "../entities/review";
import { Creatable } from "../utils";
import { PaginatedData } from "../utils/pagination";

export type Range<T> = { from?: T; to?: T };

export type Filters = {
  type?: FilmType[];
  filmLength?: Range<number>;
  year?: Range<number>;
  genres?: string[];
  tags?: Tag[];
};

export abstract class IReviewRepository {
  abstract searchReviews(props: {
    collectionId: Collection["id"];
    search: string;
    limit: number;
    showHidden: boolean;
    filters?: Filters;
  }): Promise<Review[]>;

  abstract getCollectionReviews(props: {
    collectionId: Collection["id"];
    limit: number;
    cursor?: string;
    showHidden?: boolean;
    filters?: Filters;
  }): Promise<PaginatedData<Review>>;

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
