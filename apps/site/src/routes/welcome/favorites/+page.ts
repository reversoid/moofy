import { handleResponse, makeClient } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const collections = await api.favorites.$get({ query: { limit: '12' } }).then(handleResponse);

	const { collections: favorites } = collections.unwrap();

	return {
		favorites
	};
};
