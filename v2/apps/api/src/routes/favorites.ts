import { Hono } from "hono";

export const favoritesRoute = new Hono()
  .get("/favorites", (c) => {
    return c.json({ message: "Hello World" });
  })
  .put("/favorites", (c) => {
    return c.json({ message: "Hello World" });
  })
  .delete("/favorites/:id", (c) => {
    return c.json({ message: "Hello World" });
  });
