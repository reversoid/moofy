import { findWorkspaceDir } from "@pnpm/find-workspace-dir";
import { RoadmapService } from "@repo/core/services";
import { RoadmapItemsRepository } from "@repo/repositories";
import fs from "node:fs";
import path from "node:path";

const workspaceDir = await findWorkspaceDir(process.cwd());

if (!workspaceDir) {
  throw new Error("No workspace directory found. Something wrong happened.");
}

const roadmapItemsRepo = new RoadmapItemsRepository();

const roadmapService = new RoadmapService(roadmapItemsRepo);

const replaceRoadmap = async () => {
  const roadmapPath = path.resolve(workspaceDir, "ROADMAP.md");
  const roadmapContent = fs.readFileSync(roadmapPath, "utf-8");

  const parsedRoadmap = await roadmapService.parseRoadmap(roadmapContent);

  await roadmapService.updateRoadmap(parsedRoadmap);
};

await replaceRoadmap();
