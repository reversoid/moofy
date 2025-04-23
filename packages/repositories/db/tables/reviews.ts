import { Generated } from "kysely";

export interface ReviewsTable {
  id: Generated<number>;
  score: number | null;
  description: string | null;
  filmId: number;
  userId: number;
  collectionId: number;
  createdAt: Generated<Date>;
  updatedAt: Date;
  searchDocument: unknown;
  reversePosition: Generated<number>;
  isHidden: Generated<boolean>;
}
