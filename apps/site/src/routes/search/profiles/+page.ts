import { handleResponse, makeClient } from '$lib/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const api = makeClient(fetch);

	const response = await api.users.$get({ query: { limit: '12' } }).then(handleResponse);

	const users = response.unwrap().users;

	return {
		users
	};
};
