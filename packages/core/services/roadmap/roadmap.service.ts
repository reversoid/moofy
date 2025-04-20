import parseChangelog from "changelog-parser";
import { RoadmapItem } from "../../entities";
import { IRoadmapRepository } from "../../repositories";
import { IRoadmapService } from "./interface";
import { raise } from "../../sdk";

export class RoadmapService implements IRoadmapService {
  constructor(private readonly roadmapRepository: IRoadmapRepository) {}

  async getRoadmap(): Promise<RoadmapItem[]> {
    return this.roadmapRepository.get();
  }

  async parseRoadmap(text: string): Promise<RoadmapItem[]> {
    // It is using parseChangelog, because it is easiest way to parse markdown.
    const roadmap = await parseChangelog({ removeMarkdown: true, text });

    console.log("raw roadmap", roadmap);

    return roadmap.versions.map((cl) => {
      const title =
        Object.keys(cl.parsed)
          .filter((k) => k !== "_")
          .at(0) ?? raise("No title found...");

      return new RoadmapItem({
        title,
        description: cl.parsed[title][0] ?? raise("Description not found"),
        orderNumber:
          Number((cl.version ?? raise("No version found")).split(".").at(0)) ||
          raise("Incorrect order number"),
      });
    });
  }

  async updateRoadmap(roadmap: RoadmapItem[]): Promise<void> {
    const now = new Date();
    await this.roadmapRepository.createMany(roadmap);
    await this.roadmapRepository.deleteBefore(now);
  }
}
