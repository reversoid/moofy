import { makeClient } from '$lib/shared/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const collectionsResponse = await api.profile.collections.$get({ query: { limit: '20' } });

	if (!collectionsResponse.ok) {
		throw new Error();
	}

	const { collections } = await collectionsResponse.json();

	return {
		collections
	};
};
