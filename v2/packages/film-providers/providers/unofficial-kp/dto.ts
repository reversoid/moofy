import z from "zod";

const filmType = z.enum([
  "FILM",
  "TV_SERIES",
  "TV_SHOW",
  "MINI_SERIES",
  "VIDEO",
]);

export const filmDtoSchema = z.object({
  kinopoiskId: z.number().optional(),
  filmId: z.number().optional(),
  nameRu: z.string(),
  nameEn: z.string(),
  year: z.number(),
  posterUrl: z.string().url(),
  posterUrlPreview: z.string().url(),
  filmLength: z.string(),
  genres: z.array(
    z.object({
      genre: z.string(),
    })
  ),
  type: filmType,
});

export const filmsSearchResponseSchema = z.object({
  films: z.array(filmDtoSchema),
});
