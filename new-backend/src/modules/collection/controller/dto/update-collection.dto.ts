import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateCollectionDtoSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullish(),
  imageUrl: z.string().url().nullish(),
  isPrivate: z.boolean().optional(),
});

export class UpdateCollectionDto extends createZodDto(
  updateCollectionDtoSchema,
) {}
