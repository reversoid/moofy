import { Review, Collection, Film, FilmType } from "@repo/core/entities";
import { IReviewRepository } from "@repo/core/repositories";
import { PaginatedData, CreatableEntity, Id } from "@repo/core/utils";
import { Selectable } from "kysely";
import { FilmsTable, ReviewsTable } from "../db";

export class ReviewRepository implements IReviewRepository {
  searchReviews(search: string, limit: number): Promise<Review[]> {
    throw new Error("Method not implemented.");
  }
  getCollectionReviews(
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Review>> {
    throw new Error("Method not implemented.");
  }
  getReviewOnFilm(
    collectionId: Collection["id"],
    filmId: Film["id"]
  ): Promise<Review | null> {
    throw new Error("Method not implemented.");
  }
  create(item: Review | CreatableEntity<Review>): Promise<Review> {
    throw new Error("Method not implemented.");
  }
  get(id: Id): Promise<Review | null> {
    throw new Error("Method not implemented.");
  }
  update(id: Id, value: Partial<Review>): Promise<Review> {
    throw new Error("Method not implemented.");
  }
  remove(id: Id): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
