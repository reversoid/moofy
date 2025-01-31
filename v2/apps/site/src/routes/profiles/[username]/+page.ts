import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { handleResponse, makeClient } from '$lib/utils';
import type { PaginatedData } from '$lib/utils/types';
import type { CollectionDto } from '@repo/api/dtos';

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const currentUser = (await parent()).user;

	const api = makeClient(fetch);

	const userResult = await api.users[':username']
		.$get({ param: { username: params.username } })
		.then(handleResponse);

	if (userResult.isErr()) {
		if (userResult.error.error === 'USER_NOT_FOUND') {
			throw error(404, 'User not found');
		}
	}

	const user = userResult.unwrap().user;

	const collectionsResult = await api.users[':id'].collections
		.$get({
			param: { id: String(user.id) },
			query: { limit: currentUser?.id === user.id ? '7' : '8' }
		})
		.then(handleResponse);

	const collections = collectionsResult.unwrap().collections;

	let favoriteCollections: PaginatedData<CollectionDto> | null = null;

	if (currentUser?.id === user.id) {
		const favoriteCollectionsResult = await api.favorites
			.$get({
				query: { limit: '8' }
			})
			.then(handleResponse);

		favoriteCollections = favoriteCollectionsResult.unwrap().collections;
	}

	return {
		profile: userResult.unwrap().user,
		collections,
		favoriteCollections,
		social: {
			followers: 100,
			followees: 1,
			isFollowing: false
		}
	};
};
