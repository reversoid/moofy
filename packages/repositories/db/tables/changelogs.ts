import { Generated } from "kysely";

export interface ChangelogsTable {
  id: Generated<number>;

  description: string;
  releaseDate: Date;
  version: string;

  hasBugfix: boolean;
  hasFeature: boolean;
  hasImprovement: boolean;

  createdAt: Date;
}
