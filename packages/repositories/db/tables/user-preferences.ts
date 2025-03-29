import { Generated } from "kysely";

export type UpdateType = "bugfix" | "feature" | "improvement";

export interface UserPreferencesTable {
  id: Generated<number>;
  userId: number;

  notifyUpdateTypes: UpdateType[];
}
