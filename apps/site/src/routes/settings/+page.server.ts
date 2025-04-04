import { authGuard } from '$lib/utils/guards';
import { settingsSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { makeClient } from '$lib/utils';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const { user } = await authGuard(parent);

	const preferencesResponse = await makeClient(fetch).preferences.$get();

	if (!preferencesResponse.ok) {
		throw new Error();
	}

	const { preferences } = await preferencesResponse.json();

	const form = await superValidate(
		{
			username: user.username,
			description: user.description,
			imageUrl: user.imageUrl,
			notifyUpdateType: preferences.notifyUpdateType
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

		const [profileResponse, preferencesResponse] = await Promise.all([
			api.profile.$patch({
				json: {
					username: form.data.username,
					description: form.data.description,
					imageUrl: form.data.imageUrl
				}
			}),
			api.preferences.$patch({ json: { notifyUpdateType: form.data.notifyUpdateType } })
		]);

		if (!profileResponse.ok) {
			const { error } = await profileResponse.json();
			return message(form, error);
		}

		if (!preferencesResponse.ok) {
			return message(form, 'INTERNAL_ERROR');
		}

		const { user } = await profileResponse.json();
		const { preferences } = await preferencesResponse.json();

		return { form, user, preferences };
	}
} satisfies Actions;
