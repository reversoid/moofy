export type UpdateType = "bugfix" | "feature" | "improvement";

export interface UserPreferencesTable {
  id: number;
  user_id: number;

  notify_update_types: UpdateType[];
}
