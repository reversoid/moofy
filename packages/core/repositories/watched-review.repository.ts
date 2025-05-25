import { Review } from "../entities";

export abstract class IWatchedReviewRepository {
  abstract create(reviewId: Review["id"]): Promise<void>;

  abstract delete(reviewId: Review["id"]): Promise<void>;

  abstract areWatched(reviews: Review[]): Promise<boolean[]>;
}
