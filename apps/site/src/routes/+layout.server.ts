import { makeClient } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	return {
		user: await api.profile.$get().then(async (res) => {
			if (!res.ok) {
				return null;
			}

			const { user } = await res.json();
			return user;
		})
	};
};
