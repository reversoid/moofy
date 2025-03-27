import { Generated } from "kysely";

export interface SubscriptionsTable {
  id: Generated<number>;
  fromUserId: number;
  toUserId: number;
  createdAt: Date;
}
