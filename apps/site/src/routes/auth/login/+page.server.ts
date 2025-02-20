import { loginSchema } from '$lib/entities/auth/schema.js';
import { handleResponse, makeClient } from '$lib/utils';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const api = makeClient(fetch);

		const response = await api.auth.login
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
