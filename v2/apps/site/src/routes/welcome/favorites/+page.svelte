<script lang="ts">
	import { handleResponse, makeClient } from '$lib/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const collections = $state(data.favorites);

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const response = await api.favorites.$get({ query: { cursor } }).then(handleResponse);

		const { collections: newCollections } = response.unwrap();

		if (cursor) {
			collections.items.unshift(...newCollections.items);
		} else {
			collections.items = newCollections.items;
		}

		collections.cursor = newCollections.cursor;
	}

	async function searchCollections(search: string) {
		if (!search) {
			await loadCollections();
			return;
		}

		const api = makeClient(fetch);

		const response = await api.favorites.$get({ query: { search } }).then(handleResponse);

		const { collections: newCollections } = response.unwrap();

		collections.items = newCollections.items;
		collections.cursor = null;
	}
</script>

<CollectionsGrid {collections} onLoadMore={loadCollections} onSearch={searchCollections} />
