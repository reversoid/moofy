import { loginSchema } from '$lib/entities/auth/schema';
import { makeClient } from '$lib/shared/utils';
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

		const response = await api.auth.login.$post({ json: { username, password } });

		if (!response.ok) {
			const { error } = await response.json();
			return message(form, error);
		}

		const { user } = await response.json();

		return { form, user };
	}
} satisfies Actions;
