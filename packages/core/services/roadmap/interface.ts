import { RoadmapItem } from "../../entities";

export interface IRoadmapService {
  getRoadmap(): Promise<RoadmapItem[]>;

  parseRoadmap(text: string): Promise<RoadmapItem[]>;

  updateRoadmap(roadmap: RoadmapItem[]): Promise<void>;
}
