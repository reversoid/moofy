import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { UnofficialKpProvider } from "@repo/film-providers";
import { authMiddleware } from "../utils/auth-middleware";
import { makeFilmDto } from "../utils/make-dto";

const filmProvider = new UnofficialKpProvider();

export const searchRoute = new Hono().use(authMiddleware).get(
  "/films",
  validator(
    "query",
    z.object({
      search: z.string().default(""),
      limit: z.coerce.number().default(10),
    })
  ),
  async (c) => {
    const { search, limit } = c.req.valid("query");
    const films = await filmProvider.searchFilmsByName(search, limit);
    return c.json({ films: films.map(makeFilmDto) });
  }
);
