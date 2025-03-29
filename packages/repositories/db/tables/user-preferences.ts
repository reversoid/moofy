export type UpdateType = "bugfix" | "feature" | "improvement";

export interface UserPreferencesTable {
  id: number;
  userId: number;

  notifyUpdateTypes: UpdateType[];
}
