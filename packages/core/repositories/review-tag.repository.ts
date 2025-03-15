import { ReviewTag } from "../entities/review-tag";
import { Id } from "../utils";
import { IBaseRepository } from "./base.repository";

export abstract class IReviewTagRepository extends IBaseRepository<ReviewTag> {
  abstract getReviewTags(reviewsId: Id[]): Promise<ReviewTag[]>;
}
