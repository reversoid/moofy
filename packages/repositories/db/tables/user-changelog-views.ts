import { Generated } from "kysely";

export interface UserChangelogViewsTable {
  id: Generated<number>;
  userId: number;
  lastViewedAt: Date;
}
