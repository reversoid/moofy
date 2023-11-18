import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const filmSchema = z.object({
  id: z.string(),
  name: z.string(),
  year: z.number().int(),
  posterPreviewUrl: z.string().url().nullable(),
  posterUrl: z.string().url().nullable(),
});

export type Film = z.infer<typeof filmSchema>;

export const selectFilm: PrismaSelectEntity<Film> = {
  id: true,
  name: true,
  posterPreviewUrl: true,
  posterUrl: true,
  year: true,
};
