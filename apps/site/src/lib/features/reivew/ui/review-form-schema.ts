import { z } from 'zod';

export const reviewFormSchema = z.object({
	filmId: z.number(),
	description: z
		.string()
		.max(400, { message: 'Описание не может быть длиннее 400 символов' })
		.nullable(),
	score: z.number().int().max(5).nullable(),
	tags: z.array(z.string())
});

export type ReviewFormSchema = typeof reviewFormSchema;
