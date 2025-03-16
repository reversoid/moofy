import { makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.users.$get({ query: { limit: '12' } });

	if (!response.ok) {
		throw error(500, 'Failed to load users');
	}

	const { users } = await response.json();

	return {
		users
	};
};
