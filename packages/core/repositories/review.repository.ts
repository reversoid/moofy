import { Collection } from "../entities/collection";
import { Film } from "../entities/film";
import { Review } from "../entities/review";
import { Creatable } from "../utils";
import { PaginatedData } from "../utils/pagination";

export abstract class IReviewRepository {
  abstract searchReviews(
    collectionId: Collection["id"],
    search: string,
    limit: number,
    showHidden: boolean
  ): Promise<Review[]>;

  abstract getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string,
    showHidden?: boolean
  ): Promise<PaginatedData<Review>>;

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
