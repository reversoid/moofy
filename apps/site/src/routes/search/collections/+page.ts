import { handleResponse, makeClient } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.collections.$get({ query: {} }).then(handleResponse);

	const { collections } = response.unwrap();

	return { collections };
};
