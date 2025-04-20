import { Hono } from "hono";
import { makeRoadmapItemDto } from "../utils/make-dto";

export const roadmapRoute = new Hono().get("/", async (c) => {
  const roadmapService = c.get("roadmapService");
  const roadmapItems = await roadmapService.getRoadmap();
  return c.json({ roadmap: roadmapItems.map(makeRoadmapItemDto) }, 200);
});
