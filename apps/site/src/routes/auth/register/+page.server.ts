import { registerSchema } from '$lib/entities/auth/schema.js';
import { handleResponse, makeClient } from '$lib/utils';
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

		const response = await api.auth.register
			.$post({ json: { username, password } })
			.then(handleResponse);

		if (response.isOk()) {
			const { user } = response.value;

			return { form, user };
		}

		const error = response.unwrapErr();

		return message(form, error.error);
	}
} satisfies Actions;
