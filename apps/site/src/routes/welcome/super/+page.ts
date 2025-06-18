import { makeClient } from '$lib/shared/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const [personalCollectionResponse, toWatchCollectionResponse] = await Promise.all([
		api.profile['personal-collection'].$get(),
		api.profile['to-watch-collection'].$get()
	]);

	if (!personalCollectionResponse.ok || !toWatchCollectionResponse) {
		throw new Error();
	}

	const [{ collection: personalCollection }, { collection: toWatchCollection }] = await Promise.all(
		[personalCollectionResponse.json(), toWatchCollectionResponse.json()]
	);

	return {
		personalCollection,
		toWatchCollection
	};
};
