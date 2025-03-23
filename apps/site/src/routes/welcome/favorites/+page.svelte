<script lang="ts">
	import { makeClient } from '$lib/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	const collections = $state(data.favorites);

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const response = await api.favorites.$get({ query: { cursor } });

		if (!response.ok) {
			return;
		}

		const { collections: newCollections } = await response.json();

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

		const response = await api.favorites.$get({ query: { search } });

		if (!response.ok) {
			return;
		}

		const { collections: newCollections } = await response.json();

		collections.items = newCollections.items;
		collections.cursor = null;
	}
</script>

<CollectionsGrid
	collections={collections.items}
	cursor={collections.cursor}
	onLoadMore={loadCollections}
	onSearch={searchCollections}
	defaultEmptyDescription="Вы можете добавить коллекции в избранное, чтобы они отображались здесь"
/>
