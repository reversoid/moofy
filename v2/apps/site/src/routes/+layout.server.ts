import { makeClient } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	return {
		user: await api.profile.$get()
	};
};
