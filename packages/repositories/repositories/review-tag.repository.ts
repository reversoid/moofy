import { IReviewTagRepository } from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { db } from "../db";

export class ReviewTagRepository extends IReviewTagRepository {
  async linkTagToReview(tagId: Id, reviewId: Id): Promise<void> {
    await db
      .insertInto("reviewTags")
      .values({
        collectionTagId: tagId.value,
        reviewId: reviewId.value,
      })
      .execute();
  }

  async unlinkTagFromReview(tagId: Id, reviewId: Id): Promise<void> {
    await db
      .deleteFrom("reviewTags")
      .where("collectionTagId", "=", tagId.value)
      .where("reviewId", "=", reviewId.value)
      .execute();
  }
}
