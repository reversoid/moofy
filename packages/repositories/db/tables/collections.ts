import { Generated } from "kysely";

export interface CollectionsTable {
  id: Generated<number>;
  name: string;
  description: string | null;
  isPublic: boolean;
  imageUrl: string | null;
  createdAt: Generated<Date>;
  updatedAt: Date;
  userId: number;
  reversePosition: Generated<number>;
  searchDocument: unknown;
}
