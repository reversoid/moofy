import { makeClient } from '$lib/shared/utils';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await makeClient(fetch).roadmap.$get();

	if (!response.ok) {
		throw new Error();
	}

	const { roadmap } = await response.json();

	return { roadmap };
};
