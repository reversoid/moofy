import { Generated } from "kysely";

export interface CollectionTagsTable {
  id: Generated<number>;
  collectionId: number;
  name: string;
  hexColor: string;
  description: string | null;
  createdAt: Generated<Date>;
}
