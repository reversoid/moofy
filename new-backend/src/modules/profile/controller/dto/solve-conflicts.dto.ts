import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const resolveConflictsDtoSchema = z.object({
  reviewsIds: z.array(z.number()),
});

export class ResolveConflictsDto extends createZodDto(
  resolveConflictsDtoSchema,
) {}
