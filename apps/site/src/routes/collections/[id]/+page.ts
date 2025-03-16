import { handleResponse, makeClient } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params: { id } }) => {
	if (!Number.isInteger(Number(id))) {
		throw error(404, 'Collection not found');
	}

	const api = makeClient(fetch);

	const [collectionResponse, reviewsResponse, socialsResponse, tagsResponse] = await Promise.all([
		api.collections[':collectionId'].$get({ param: { collectionId: id } }).then(handleResponse),

		api.collections[':collectionId'].reviews
			.$get({
				param: { collectionId: id },
				query: { limit: '20' }
			})
			.then(handleResponse),

		api.collections[':collectionId'].socials
			.$get({ param: { collectionId: id } })
			.then(handleResponse),

		api.collections[':collectionId'].tags.$get({ param: { collectionId: id } }).then(handleResponse)
	]);

	if (collectionResponse.isErr()) {
		const err = collectionResponse.unwrapErr();
		if (err.error === 'COLLECTION_NOT_FOUND') {
			throw error(404, 'Коллекция не найдена');
		}

		if (err.error === 'FORBIDDEN') {
			throw error(403, 'У вас нет доступа к этой коллекции');
		}

		throw err.error;
	}

	const collection = collectionResponse.unwrap().collection;
	const reviews = reviewsResponse.unwrap().reviews;
	const socials = socialsResponse.unwrap();
	const tags = tagsResponse.unwrap().tags;

	return {
		collection,
		reviews,
		socials,
		tags
	};
};
