import { Hono } from "hono";

export const userRoute = new Hono()
  .put("/users/:id/subscriptions", (c) => {
    return c.json({ message: "Hello World" });
  })
  .delete("/users/:id/subscriptions", (c) => {
    return c.json({ message: "Hello World" });
  })
  .get("/users", (c) => {
    return c.json({ message: "Hello World" });
  });
