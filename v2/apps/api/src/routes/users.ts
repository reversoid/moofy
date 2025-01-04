import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { authMiddleware } from "../utils/auth-middleware";

export const userRoute = new Hono()
  .use(authMiddleware)
  // TODO: Implement
  // .put("/users/:id/followers", (c) => {
  //   return c.json({ message: "Hello World" });
  // })
  // .get("/users/:id/followers", (c) => {
  //   return c.json({ message: "Hello World" });
  // })
  // .get("/users/:id/followees", (c) => {
  //   return c.json({ message: "Hello World" });
  // })
  // .delete("/users/:id/followers", (c) => {
  //   return c.json({ message: "Hello World" });
  // })
  .get("/users/existence/:username", async (c) => {
    const { username } = c.req.param();
    const userService = c.get("userService");
    const user = await userService.getUserByUsername(username);
    return c.json({ exists: user !== null });
  })
  .get(
    "/users",
    validator(
      "query",
      z.object({
        search: z.string().default(""),
        limit: z.number().int().min(1).max(100).default(20),
      })
    ),
    async (c) => {
      const { search, limit } = c.req.valid("query");
      const userService = c.get("userService");

      const users = await userService.searchUsers(search, limit);

      return c.json({ users });
    }
  );
