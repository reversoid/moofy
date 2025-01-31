import { handleResponse, makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params: { id } }) => {
	if (!Number.isInteger(Number(id))) {
		throw error(404, 'Collection not found');
	}

	const api = makeClient(fetch);

	const [collectionResponse, reviewsResponse] = await Promise.all([
		api.collections[':id'].$get({ param: { id } }).then(handleResponse),
		api.collections[':collectionId'].reviews
			.$get({
				param: { collectionId: id },
				query: { limit: '20' }
			})
			.then(handleResponse)
	]);

	if (collectionResponse.isErr() || reviewsResponse.isErr()) {
		throw error(404, 'Collection not found');
	}

	const collection = collectionResponse.unwrap().collection;
	const reviews = reviewsResponse.unwrap().reviews;

	return {
		collection,
		reviews,
		social: { likes: 0, bookmarks: 0 }
	};
};
