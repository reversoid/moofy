import { Review } from "@repo/core/entities";
import { IWatchedReviewRepository } from "@repo/core/repositories";
import { db } from "../db";

export class WatchedReviewRepository extends IWatchedReviewRepository {
  async create(reviewId: Review["id"]): Promise<void> {
    await db
      .insertInto("watchedReviews")
      .values({ reviewId: reviewId.value })
      .execute();
  }

  async delete(reviewId: Review["id"]): Promise<void> {
    await db
      .deleteFrom("watchedReviews")
      .where("watchedReviews.reviewId", "=", reviewId.value)
      .execute();
  }

  async areWatched(reviews: Review[]): Promise<boolean[]> {
    if (reviews.length === 0) {
      return [];
    }

    const watched = await db
      .selectFrom("watchedReviews")
      .where(
        "watchedReviews.reviewId",
        "in",
        reviews.map((r) => r.id.value)
      )
      .select(["watchedReviews.reviewId"])
      .execute();

    const watchedSet = new Set(watched.map((w) => w.reviewId));

    return reviews.map((r) => watchedSet.has(r.id.value));
  }
}
