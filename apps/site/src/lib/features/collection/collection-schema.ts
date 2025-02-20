import { z } from 'zod';

export const collectionSchema = z.object({
	name: z.string().min(1, { message: 'Название коллекции не может быть пустым' }),
	description: z
		.string()
		.max(400, { message: 'Описание не может быть длиннее 400 символов' })
		.nullable(),
	imageUrl: z.string().nullable(),
	isPrivate: z.boolean().default(false)
});
