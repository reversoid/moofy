import { Collection } from "../entities/collection";
import { Film } from "../entities/film";
import { Review } from "../entities/review";
import { PaginatedData } from "../utils/pagination";
import { IBaseRepository } from "./base.repository";

export abstract class IReviewRepository extends IBaseRepository<Review> {
  abstract searchReviews(
    collectionId: Collection["id"],
    search: string,
    limit: number
  ): Promise<Review[]>;

  abstract getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Review>>;

  abstract getReviewOnFilm(
    collectionId: Collection["id"],
    filmKpId: Film["kinopoiskId"]
  ): Promise<Review | null>;
}
