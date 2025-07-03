import { authGuard } from '$lib/shared/utils/guards';
import { settingsSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { makeClient } from '$lib/shared/utils';
import { message } from 'sveltekit-superforms';

export const load: PageServerLoad = async ({ parent, fetch }) => {
	const { user } = await authGuard(parent);

	const client = makeClient(fetch);

	const [preferencesResponse, passkeysResponse] = await Promise.all([
		client.preferences.$get(),
		client.auth.passkeys.$get()
	]);

	if (!preferencesResponse.ok || !passkeysResponse.ok) {
		throw new Error('Could not fetch preferences or passkeys');
	}

	const [{ preferences }, { passkeys }] = await Promise.all([
		preferencesResponse.json(),
		passkeysResponse.json()
	]);

	const form = await superValidate(
		{
			username: user.username,
			description: user.description,
			imageUrl: user.imageUrl,
			notifyUpdateType: preferences.notifyUpdateType
		},
		zod(settingsSchema)
	);

	return { user, form, passkeys };
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
