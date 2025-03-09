import type { PageLoad } from './$types';
import { handleResponse, makeClient } from '$lib/utils';
import type { PaginatedData } from '$lib/utils/types';
import type { CollectionDto } from '@repo/api/dtos';

export const load: PageLoad = async ({ fetch, parent }) => {
	const {
		profile,
		user: currentUser,
		followeesAmount,
		followersAmount,
		isFollowing
	} = await parent();

	const api = makeClient(fetch);

	const collectionsResult = await api.users[':id'].collections
		.$get({
			param: { id: String(profile.id) },
			query: { limit: currentUser?.id === profile.id ? '7' : '8' }
		})
		.then(handleResponse);

	const collections = collectionsResult.unwrap().collections;

	let favoriteCollections: PaginatedData<CollectionDto> | null = null;

	if (currentUser?.id === profile.id) {
		const favoriteCollectionsResult = await api.favorites
			.$get({
				query: { limit: '8' }
			})
			.then(handleResponse);

		favoriteCollections = favoriteCollectionsResult.unwrap().collections;
	}

	return {
		profile,
		collections,
		favoriteCollections,
		social: {
			followersAmount,
			followeesAmount,
			isFollowing
		}
	};
};
