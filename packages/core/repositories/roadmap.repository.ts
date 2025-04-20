import { RoadmapItem } from "../entities";

export abstract class IRoadmapRepository {
  abstract createMany(items: RoadmapItem[]): Promise<RoadmapItem[]>;
  abstract deleteBefore(date: Date): Promise<void>;
  abstract get(): Promise<RoadmapItem[]>;
}
