import { Generated } from "kysely";

export interface PersonalCollectionsTable {
  id: Generated<number>;
  userId: number;
  collectionId: number;
}
