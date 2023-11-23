import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createCommentDtoSchema = z.object({
  text: z.string().max(400),
  replyTo: z.number().int().optional(),
});

export class CreateCommentDto extends createZodDto(createCommentDtoSchema) {}
