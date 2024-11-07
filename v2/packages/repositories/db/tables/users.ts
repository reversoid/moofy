import { Generated } from "kysely";

export interface UsersTable {
  id: Generated<number>;
  username: string;
  description: string | null;
  imageUrl: string | null;
  passwordHash: string;
  createdAt: Generated<Date>;
  updatedAt: Date;
  username_search_document: unknown;
}
