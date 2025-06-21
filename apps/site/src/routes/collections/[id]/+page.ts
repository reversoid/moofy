import { makeClient } from '$lib/shared/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params: { id } }) => {
	if (!Number.isInteger(Number(id))) {
		throw error(404, 'Collection not found');
	}

	const api = makeClient(fetch);

	const [collectionResponse, reviewsResponse, socialsResponse, tagsResponse] = await Promise.all([
		api.collections[':collectionId'].$get({ param: { collectionId: id } }),

		api.collections[':collectionId'].reviews.$get({
			param: { collectionId: id },
			query: { limit: '20' }
		}),

		api.collections[':collectionId'].socials.$get({ param: { collectionId: id } }),

		api.collections[':collectionId'].tags.$get({ param: { collectionId: id } })
	]);

	if (!collectionResponse.ok) {
		const { error: collectionError } = await collectionResponse.json();

		if (collectionError === 'COLLECTION_NOT_FOUND') {
			throw error(404, 'Коллекция не найдена');
		}

		if (collectionError === 'FORBIDDEN') {
			throw error(403, 'У вас нет доступа к этой коллекции');
		}

		throw new Error(collectionError);
	}

	if (!reviewsResponse.ok || !socialsResponse.ok || !tagsResponse.ok) {
		throw new Error('Reviews, socials or tags returned error');
	}

	const [{ collection }, { reviews, watched }, { socials }, { tags }] = await Promise.all([
		collectionResponse.json(),
		reviewsResponse.json(),
		socialsResponse.json(),
		tagsResponse.json()
	]);

	return {
		collection,
		reviews,
		socials,
		tags,
		watched
	};
};
