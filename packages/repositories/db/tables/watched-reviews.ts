import { Generated } from "kysely";

export interface WatchedReviewsTable {
  id: Generated<number>;
  reviewId: number;
  createdAt: Generated<Date>;
}
