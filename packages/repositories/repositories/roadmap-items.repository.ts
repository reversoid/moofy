import { RoadmapItem } from "@repo/core/entities";
import { IRoadmapRepository } from "@repo/core/repositories";
import { db } from "../db";
import { makeRoadmapItem } from "./utils/make-entity";
import { RoadmapSelects } from "./utils/selects";

export class RoadmapItemsRepository extends IRoadmapRepository {
  async createMany(items: RoadmapItem[]): Promise<RoadmapItem[]> {
    const rawData = await db
      .insertInto("roadmapItems")
      .values(
        items.map((i) => ({
          description: i.description,
          orderNumber: i.orderNumber,
          title: i.title,
        }))
      )
      .returning(RoadmapSelects.roadmapSelects)
      .execute();

    return rawData.map(makeRoadmapItem);
  }

  async deleteBefore(date: Date): Promise<void> {
    await db
      .deleteFrom("roadmapItems")
      .where("roadmapItems.createdAt", "<", date)
      .execute();
  }

  async get(): Promise<RoadmapItem[]> {
    const rawData = await db
      .selectFrom("roadmapItems")
      .orderBy("orderNumber asc")
      .select(RoadmapSelects.roadmapSelects)
      .execute();

    return rawData.map(makeRoadmapItem);
  }
}
