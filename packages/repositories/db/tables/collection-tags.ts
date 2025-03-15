import { Generated } from "kysely";

export interface CollectionTagsTable {
  id: Generated<number>;
  collectionId: number;
  name: string;
  hslColor: string;
  createdAt: Generated<Date>;
}
