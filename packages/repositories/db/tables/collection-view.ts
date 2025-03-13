import { Generated } from "kysely";

export interface CollectionViewsTable {
  id: Generated<number>;
  userId: number;
  collectionId: number;
  createdAt: Generated<Date>;
}
