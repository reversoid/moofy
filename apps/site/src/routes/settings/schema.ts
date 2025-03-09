import { registerSchema } from '$lib/entities/auth/schema';
import { z } from 'zod';

export const settingsSchema = registerSchema
	.extend({
		description: z.string().max(400, 'Описание не может быть длиннее 400 символов').nullable(),
		imageUrl: z.string().nullable()
	})
	.omit({ password: true });
