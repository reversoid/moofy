import type { LayoutLoad } from './$types';
import { handleResponse, makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const api = makeClient(fetch);

	const userResult = await api.users[':username']
		.$get({ param: { username: params.username } })
		.then(handleResponse);

	if (userResult.isErr()) {
		if (userResult.error.error === 'USER_NOT_FOUND') {
			throw error(404, 'User not found');
		}
	}

	const { user, isFollowing, followersAmount, followeesAmount } = userResult.unwrap();

	return {
		profile: user,
		isFollowing,
		followersAmount,
		followeesAmount
	};
};
