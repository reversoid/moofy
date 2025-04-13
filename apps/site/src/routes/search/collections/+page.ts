import { makeClient } from '$lib/shared/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.collections.$get({ query: {} });

	if (!response.ok) {
		throw error(500, 'Failed to load collections');
	}

	const { collections } = await response.json();

	return { collections };
};
