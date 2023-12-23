import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createPersonalCollectionDtoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  uniteCollectionsIds: z.array(z.number().int()).optional(),
});

export class CreatePersonalCollectionDto extends createZodDto(
  createPersonalCollectionDtoSchema,
) {}
