import { Generated } from "kysely";

export interface ReviewTagsTable {
  id: Generated<number>;
  reviewId: number;
  collectionTagId: number;
}
