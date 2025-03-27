import { Generated } from "kysely";

export interface ReviewsTable {
  id: Generated<number>;
  score: number | null;
  description: string | null;
  filmId: string;
  userId: number;
  collectionId: number;
  createdAt: Generated<Date>;
  updatedAt: Date;
  searchDocument: unknown;
}
