import { makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.profile.collections.$get({ query: { limit: '11' } });

	if (!response.ok) {
		throw error(500, 'Failed to load collections');
	}

	const { collections } = await response.json();

	return {
		collections
	};
};
