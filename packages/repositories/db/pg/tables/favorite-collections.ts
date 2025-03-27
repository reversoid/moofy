import { Generated } from "kysely";

export interface FavoriteCollectionsTable {
  id: Generated<number>;
  userId: number;
  collectionId: number;
  createdAt: Date;
}
