import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const FILM_TYPES = [
  'FILM',
  'TV_SERIES',
  'TV_SHOW',
  'MINI_SERIES',
  'VIDEO',
] as const;

export const filmSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number().int(),
  posterPreviewUrl: z.string().url().nullable(),
  posterUrl: z.string().url().nullable(),
  genres: z.array(z.string()),
  type: z.enum(FILM_TYPES),
});

export type Film = z.infer<typeof filmSchema>;

export const selectFilm: PrismaSelectEntity<Film> = {
  id: true,
  name: true,
  posterPreviewUrl: true,
  posterUrl: true,
  year: true,
  genres: true,
  type: true,
};
