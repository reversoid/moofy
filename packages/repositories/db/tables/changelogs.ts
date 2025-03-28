import { Generated } from "kysely";

export interface ChangelogsTable {
  id: Generated<number>;

  description: string;
  release_date: Date;
  version: string;

  has_bugfix: boolean;
  has_feature: boolean;
  has_improvement: boolean;
}
