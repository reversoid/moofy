import { Review } from "../entities";
import { WatchableReview } from "../entities/watchable-review";

export abstract class IWatchedReviewRepository {
  abstract create(reviewId: Review["id"]): Promise<void>;

  abstract delete(reviewId: Review["id"]): Promise<void>;

  abstract areWatched(reviews: Review[]): Promise<boolean[]>;
}
