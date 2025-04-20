import { Generated } from "kysely";

export interface RoadmapItemsTable {
  id: Generated<number>;
  title: string;
  description: string;
  orderNumber: number;
  createdAt: Generated<Date>;
}
