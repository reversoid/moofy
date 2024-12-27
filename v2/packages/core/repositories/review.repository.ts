import { Collection } from "../entities/collection";
import { Film } from "../entities/film";
import { Review } from "../entities/review";
import { PaginatedData } from "../utils/pagination";
import { IBaseRepository } from "./base.repository";

export interface IReviewRepository extends IBaseRepository<Review> {
  searchReviews(search: string, limit: number): Promise<Review[]>;

  getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Review>>;

  getReviewOnFilm(
    collectionId: Collection["id"],
    filmId: Film["id"]
  ): Promise<Review | null>;
}
