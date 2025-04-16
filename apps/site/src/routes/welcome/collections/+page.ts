import { makeClient } from '$lib/shared/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const [collectionsResponse, personalCollectionResponse] = await Promise.all([
		api.profile.collections.$get({ query: { limit: '11' } }),
		api.profile['personal-collection'].$get({ query: { limit: '11' } })
	]);

	if (!collectionsResponse.ok || !personalCollectionResponse.ok) {
		throw new Error();
	}

	const { collections } = await collectionsResponse.json();
	const { collection: personalCollection } = await personalCollectionResponse.json();

	return {
		collections,
		personalCollection
	};
};
