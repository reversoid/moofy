import { Hono } from "hono";

import { authMiddleware } from "../utils/auth-middleware";
import { makeChangelogDto } from "../utils/make-dto";

export const changelogRoute = new Hono()
  .get("/new", authMiddleware, async (c) => {
    const session = c.get("session")!;
    const changelogService = c.get("changelogService");

    const shouldSeeUpdates = await changelogService.shouldUserSeeUpdate(
      session.user.id
    );

    return c.json({ hasNewUpdates: shouldSeeUpdates }, 200);
  })
  .post("/views", authMiddleware, async (c) => {
    const session = c.get("session")!;

    const changelogService = c.get("changelogService");

    await changelogService.viewChangelog(session.user.id);

    return c.body(null, 204);
  })
  .get("/", async (c) => {
    const changelogService = c.get("changelogService");

    const changelogs = await changelogService.getChangelogs();

    return c.json({ changelogs: changelogs.map(makeChangelogDto) }, 200);
  });
