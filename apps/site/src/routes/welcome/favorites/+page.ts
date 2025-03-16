import { makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const collections = await api.favorites.$get({ query: { limit: '12' } });

	if (!collections.ok) {
		throw error(500, 'Failed to load favorites');
	}

	const { collections: favorites } = await collections.json();

	return {
		favorites
	};
};
