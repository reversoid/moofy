import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const loginDtoSchema = z.object({
  username: z.string().min(1).max(32),
  password: z.string().min(1),
});

export class LoginDto extends createZodDto(loginDtoSchema) {}
