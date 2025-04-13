import type { PageLoad } from './$types';
import { makeClient } from '$lib/shared/utils';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { profile } = await parent();
	const api = makeClient(fetch);

	const followersResult = await api.users[':id'].followers.$get({
		param: { id: String(profile.id) },
		query: { limit: String(12) }
	});

	if (!followersResult.ok) {
		throw error(500, 'Failed to load followers');
	}

	const { users: followers } = await followersResult.json();

	return {
		profile,
		followers
	};
};
