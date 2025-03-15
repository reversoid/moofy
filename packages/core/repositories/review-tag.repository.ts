import { Id } from "../utils";

export abstract class IReviewTagRepository {
  abstract linkTagToReview(tagId: Id, reviewId: Id): Promise<void>;
  abstract unlinkTagFromReview(tagId: Id, reviewId: Id): Promise<void>;
}
