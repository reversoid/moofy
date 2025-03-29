import { Hono } from "hono";

import { authMiddleware } from "../utils/auth-middleware";

export const preferencesRoute = new Hono()
  .get("/", authMiddleware, async (c) => {
    const session = c.get("session")!;
    const changelogService = c.get("changelogService");

    const hasNewUpdates = changelogService.hasUserSeenLatestUpdate(
      session.user.id
    );

    return c.json({ hasNewUpdates }, 200);
  })
  .patch("/", authMiddleware, async (c) => {
    const session = c.get("session")!;

    const changelogService = c.get("changelogService");

    await changelogService.viewChangelog(session.user.id);

    return c.body(null, 204);
  });
