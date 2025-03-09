import type { PageLoad } from './$types';
import { handleResponse, makeClient } from '$lib/utils';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { profile } = await parent();
	const api = makeClient(fetch);

	const followersResult = await api.users[':id'].followers
		.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12) }
		})
		.then(handleResponse);

	const followers = followersResult.unwrap().users;

	return {
		profile,
		followers
	};
};
