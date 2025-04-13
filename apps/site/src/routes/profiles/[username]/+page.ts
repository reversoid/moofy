import type { PageLoad } from './$types';
import { makeClient } from '$lib/shared/utils';
import type { PaginatedData } from '$lib/shared/utils/types';
import type { CollectionDto } from '@repo/api/dtos';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, parent }) => {
	const {
		profile,
		user: currentUser,
		followeesAmount,
		followersAmount,
		isFollowing
	} = await parent();

	const api = makeClient(fetch);

	const [collectionsResponse, personalCollectionResponse] = await Promise.all([
		api.users[':id'].collections.$get({
			param: { id: String(profile.id) },
			query: { limit: currentUser?.id === profile.id ? '7' : '8' }
		}),
		api.users[':id']['personal-collection'].$get({
			param: { id: String(profile.id) }
		})
	]);

	if (!collectionsResponse.ok) {
		throw new Error();
	}

	const { collections } = await collectionsResponse.json();

	let personalCollection: CollectionDto | null = null;

	if (!personalCollectionResponse.ok) {
		const { error } = await personalCollectionResponse.json();
		if (error === 'FORBIDDEN') {
			personalCollection = null;
		} else {
			throw new Error();
		}
	} else {
		personalCollection = (await personalCollectionResponse.json()).collection;
	}

	let favoriteCollections: PaginatedData<CollectionDto> | null = null;

	if (currentUser?.id === profile.id) {
		const favoriteCollectionsResult = await api.favorites.$get({
			query: { limit: '8' }
		});

		if (!favoriteCollectionsResult.ok) {
			throw error(500, 'Failed to load favorite collections');
		}

		const { collections: newFavoriteCollections } = await favoriteCollectionsResult.json();

		favoriteCollections = newFavoriteCollections;
	}

	return {
		profile,
		collections,
		favoriteCollections,
		social: {
			followersAmount,
			followeesAmount,
			isFollowing
		},
		personalCollection
	};
};
