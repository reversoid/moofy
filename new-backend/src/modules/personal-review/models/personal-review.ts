import { filmSchema, selectFilm } from 'src/modules/film/models/film';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const personalReviewSchema = z.object({
  id: z.number().int(),
  score: z.number().int().nullable(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isHidden: z.boolean(),
  film: filmSchema,
});

export const selectPersonalReview: PrismaSelectEntity<PersonalReview> = {
  id: true,
  createdAt: true,
  description: true,
  film: { select: selectFilm },
  isHidden: true,
  score: true,
  updatedAt: true,
};

export type PersonalReview = z.infer<typeof personalReviewSchema>;
