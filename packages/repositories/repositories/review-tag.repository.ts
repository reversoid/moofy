import { ReviewTag } from "@repo/core/entities";
import { IReviewTagRepository } from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { db } from "../db";
import { ReviewTagSelects } from "./utils/selects";
import { makeReviewTag } from "./utils/make-entity";

export class ReviewTagRepository extends IReviewTagRepository {
  async create(tag: ReviewTag): Promise<ReviewTag> {
    const newTag = await db
      .insertInto("reviewTags")
      .values({
        reviewId: tag.reviewId.value,
        collectionTagId: tag.collectionTagId.value,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new ReviewTag({
      id: new Id(newTag.id),
      reviewId: new Id(newTag.reviewId),
      collectionTagId: new Id(newTag.collectionTagId),
    });
  }

  async get(id: Id): Promise<ReviewTag | null> {
    const tag = await db
      .selectFrom("reviewTags")
      .select(ReviewTagSelects.reviewTagSelects)
      .where("id", "=", id.value)
      .executeTakeFirst();

    if (!tag) {
      return null;
    }

    return makeReviewTag(tag);
  }

  async update(id: Id, tag: Partial<ReviewTag>): Promise<ReviewTag> {
    const updatedTag = await db
      .updateTable("reviewTags")
      .set({
        reviewId: tag.reviewId?.value,
        collectionTagId: tag.collectionTagId?.value,
      })
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new ReviewTag({
      id: new Id(updatedTag.id),
      reviewId: new Id(updatedTag.reviewId),
      collectionTagId: new Id(updatedTag.collectionTagId),
    });
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("reviewTags").where("id", "=", id.value).execute();
  }
}
