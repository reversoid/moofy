import type { LayoutLoad } from './$types';
import { makeClient } from '$lib/shared/utils';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params, fetch }) => {
	const api = makeClient(fetch);

	const userResult = await api.users[':username'].$get({ param: { username: params.username } });

	if (!userResult.ok) {
		const { error: userError } = await userResult.json();

		if (userError === 'USER_NOT_FOUND') {
			throw error(404, 'User not found');
		}

		throw error(500, userError);
	}

	const { user, isFollowing, followersAmount, followeesAmount } = await userResult.json();

	return {
		profile: user,
		isFollowing,
		followersAmount,
		followeesAmount
	};
};
