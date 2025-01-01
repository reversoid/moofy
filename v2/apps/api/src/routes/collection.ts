import { Hono } from "hono";

export const collectionRoute = new Hono()
  .get("/collections", (c) => {
    return c.json({ message: "Hello World" });
  })
  .get("/collections/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .post("/collections/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .delete("/collections/:id", (c) => {
    return c.json({ message: "Hello World" });
  })
  .patch("/collections/:id", (c) => {
    return c.json({ message: "Hello World" });
  });
