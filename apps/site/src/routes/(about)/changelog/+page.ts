import type { PageLoad } from './$types';
import { makeClient } from '$lib/shared/utils';
import { parse } from 'marked';

export const load: PageLoad = async ({ fetch }) => {
	const changelogs = await makeClient(fetch).changelog.$get();

	if (!changelogs.ok) {
		throw new Error('Failed to load changelogs');
	}

	const { changelogs: changelogList } = await changelogs.json();

	const changelogsWithHtmlDescription = await Promise.all(
		changelogList.map(async (changelog) => ({
			...changelog,
			description: await parse(changelog.description)
		}))
	);

	return {
		changelogList: changelogsWithHtmlDescription
	};
};
