import { makeClient } from '$lib/shared/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const personalCollectionResponse = await api.profile['personal-collection'].$get();

	if (!personalCollectionResponse.ok) {
		throw new Error();
	}

	const { collection: personalCollection } = await personalCollectionResponse.json();

	return {
		personalCollection
	};
};
