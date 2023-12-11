import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

const registerDtoSchema = z.object({
  username: z.string().min(1).max(32).regex(USERNAME_PATTERN),
  password: z.string().min(8),
});

export class RegisterDto extends createZodDto(registerDtoSchema) {}
