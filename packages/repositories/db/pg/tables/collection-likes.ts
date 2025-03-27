import { Generated } from "kysely";

export interface CollectionLikesTable {
  id: Generated<number>;
  collectionId: number;
  userId: number;
  createdAt: Generated<Date>;
}
