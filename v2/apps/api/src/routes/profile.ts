import { Hono } from "hono";

export const profileRoute = new Hono()
  .get("/profile", (c) => {
    return c.json({ message: "Hello World" });
  })
  .patch("/profile", (c) => {
    return c.json({ message: "Hello World" });
  });
