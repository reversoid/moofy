<script lang="ts">
	import { CreateCollectionCard } from '$lib/features/collection';
	import { handleResponse, makeClient } from '$lib/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { CollectionDto } from '@repo/api/dtos';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const collections = $state(data.collections);

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const response = await api.profile.collections.$get({ query: { cursor } }).then(handleResponse);

		const { collections: newCollections } = response.unwrap();

		if (!cursor) {
			collections.items = newCollections.items;
		} else {
			collections.items.push(...newCollections.items);
		}

		collections.cursor = newCollections.cursor;
	}

	async function searchCollections(search: string) {
		if (!search) {
			await loadCollections();
			return;
		}

		const api = makeClient(fetch);

		const response = await api.profile.collections.$get({ query: { search } }).then(handleResponse);

		const { collections: newCollections } = response.unwrap();

		collections.items = newCollections.items;
		collections.cursor = null;
	}

	function addCollection(collection: CollectionDto) {
		collections.items.unshift(collection);
	}
</script>

<CollectionsGrid onSearch={searchCollections} {collections} onLoadMore={loadCollections}>
	{#snippet firstCard()}
		<CreateCollectionCard onCollectionCreated={addCollection} />
	{/snippet}
</CollectionsGrid>
