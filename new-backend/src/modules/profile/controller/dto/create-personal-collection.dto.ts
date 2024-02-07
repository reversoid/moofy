import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPersonalCollectionDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  mergeOptions: z
    .object({
      collectionsIds: z.array(z.number().int()),

      reviews: z.object({
        withScore: z.boolean().optional(),
        strategy: z.enum(['move', 'copy']),
      }),

      actionAfterMergingCollections: z.enum([
        'removeEmpty',
        'saveAll',
        'removeAll',
      ]),
    })
    .optional(),
});

export class CreatePersonalCollectionDto extends createZodDto(
  createPersonalCollectionDtoSchema,
) {}
