import { registerSchema } from '$lib/entities/auth/schema.js';
import { makeClient } from '$lib/shared/utils';
import { type Actions } from '@sveltejs/kit';
import { superValidate, fail, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(registerSchema));
	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const api = makeClient(event.fetch);

		const response = await api.auth.register.$post({ json: { username, password } });

		if (response.ok) {
			const { user } = await response.json();

			return { form, user };
		}

		const { error } = await response.json();

		return message(form, error);
	}
} satisfies Actions;
