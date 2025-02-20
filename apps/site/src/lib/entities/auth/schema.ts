import { z } from 'zod';

export const registerSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Имя пользователя должно содержать минимум 3 символа' })
		.regex(/^[a-zA-Z0-9_.]+$/, {
			message: 'Имя пользователя может содержать только латинские буквы, цифры и символы "_" и "-"'
		})
		.refine((data) => !data.startsWith('.'), {
			message: 'Имя пользователя не может начинаться с "."'
		})
		.refine((data) => !/^[._]+$/.test(data), {
			message: 'Имя пользователя не может состоять только из этих символов'
		})
		.refine((data) => !/^[\d]+$/.test(data), {
			message: 'Имя пользователя не может состоять только из цифр'
		}),

	password: z
		.string()
		.min(8, { message: 'Пароль должен содержать минимум 8 символов' })
		.refine((data) => !/\s/.test(data), {
			message: 'Пароль не может содержать пробелы'
		})
});

export const loginSchema = z.object({
	username: z.string().min(1, { message: 'Имя пользователя не может быть пустым' }),
	password: z.string().min(1, { message: 'Пароль не может быть пустым' })
});
