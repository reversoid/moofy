import { authGuard } from '$lib/utils/guards';
import { settingsSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { handleResponse, makeClient } from '$lib/utils';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await authGuard(parent);

	const form = await superValidate(
		{
			username: user.username,
			description: user.description,
			imageUrl: user.imageUrl
		},
		zod(settingsSchema)
	);

	return { user, form };
};

export const actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(settingsSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const api = makeClient(fetch);
		const response = await api.profile
			.$patch({
				json: {
					username: form.data.username,
					description: form.data.description,
					imageUrl: form.data.imageUrl
				}
			})
			.then(handleResponse);

		if (response.isOk()) {
			const { user } = response.value;
			return { form, user };
		}

		const error = response.unwrapErr();
		return message(form, error.error);
	}
} satisfies Actions;
