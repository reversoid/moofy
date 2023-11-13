import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const helloSchema = z.object({
  someField: z.string(),
});

export class HelloDto extends createZodDto(helloSchema) {}
