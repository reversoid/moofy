import type { PageLoad } from './$types';
import { makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { profile } = await parent();
	const api = makeClient(fetch);

	const followeesResult = await api.users[':id'].followees.$get({
		param: { id: String(profile.id) },
		query: { limit: String(12) }
	});

	if (!followeesResult.ok) {
		throw error(500, 'Failed to load followees');
	}

	const { users: followees } = await followeesResult.json();

	return {
		profile,
		followees
	};
};
