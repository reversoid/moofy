<script lang="ts">
	import { handleResponse, makeClient } from '$lib/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let collections = $state(data.collections);

	async function searchCollections(search: string) {
		const api = makeClient(fetch);

		const response = await api.collections.$get({ query: { search } }).then(handleResponse);

		const { collections: newCollections } = response.unwrap();

		collections = newCollections;
	}
</script>

<CollectionsGrid {collections} onSearch={searchCollections} />
