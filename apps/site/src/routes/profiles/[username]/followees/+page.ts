import type { PageLoad } from './$types';
import { handleResponse, makeClient } from '$lib/utils';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { profile } = await parent();
	const api = makeClient(fetch);

	const followeesResult = await api.users[':id'].followees
		.$get({
			param: { id: String(profile.id) },
			query: { limit: String(12) }
		})
		.then(handleResponse);

	const followees = followeesResult.unwrap().users;

	return {
		profile,
		followees
	};
};
