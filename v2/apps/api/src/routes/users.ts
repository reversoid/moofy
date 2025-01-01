import { Hono } from "hono";

export const userRoute = new Hono()
  .put("/users/:id/followers", (c) => {
    return c.json({ message: "Hello World" });
  })
  .get("/users/:id/followers", (c) => {
    return c.json({ message: "Hello World" });
  })
  .delete("/users/:id/followers", (c) => {
    return c.json({ message: "Hello World" });
  })
  .get("/users", (c) => {
    return c.json({ message: "Hello World" });
  });
