import { Generated } from "kysely";

export interface CollectionTagsTable {
  id: Generated<number>;
  collectionId: number;
  name: string;
  hexColor: string;
  createdAt: Generated<Date>;
}
