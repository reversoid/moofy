import { Generated } from "kysely";

export interface ToWatchCollectionsTable {
  id: Generated<number>;
  userId: number;
  collectionId: number;
}
