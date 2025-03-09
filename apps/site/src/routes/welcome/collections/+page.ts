import { handleResponse, makeClient } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.profile.collections
		.$get({ query: { limit: '11' } })
		.then(handleResponse);

	const collections = response.unwrap().collections;

	return {
		collections
	};
};
