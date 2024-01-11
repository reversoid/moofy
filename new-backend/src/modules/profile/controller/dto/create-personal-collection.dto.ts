import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPersonalCollectionDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  uniteCollectionsIds: z.array(z.number().int()).optional(),
  options: z.object({
    reviews: z.object({
      withScore: z.boolean().optional(),
      withDescription: z.boolean().optional(),
      strategy: z.enum(['move', 'copy']),
    }),
    removeUnitedCollections: z.boolean().or(z.enum(['emptyAfterMove'])),
  }),
});

export class CreatePersonalCollectionDto extends createZodDto(
  createPersonalCollectionDtoSchema,
) {}
