<script lang="ts">
	import { makeClient } from '$lib/shared/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { CollectionDto } from '@repo/api/dtos';
	import type { PageProps } from './$types';
	import Heading from '$lib/shared/ui/heading.svelte';
	import CreateCollection from '$lib/features/collection/create-collection.svelte';

	let { data }: PageProps = $props();

	const collections = $state(data.collections);

	async function loadCollections(cursor?: string) {
		const api = makeClient(fetch);

		const response = await api.profile.collections.$get({ query: { cursor } });

		if (!response.ok) {
			return;
		}

		const { collections: newCollections } = await response.json();

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

		const response = await api.profile.collections.$get({ query: { search } });

		if (!response.ok) {
			return;
		}

		const { collections: newCollections } = await response.json();

		collections.items = newCollections.items;
		collections.cursor = null;
	}

	function addCollection(collection: CollectionDto) {
		collections.items.unshift(collection);
	}
</script>

<div class="mb-6 flex items-center justify-between">
	<Heading>Мои коллекции</Heading>
	<CreateCollection onCollectionCreated={addCollection} />
</div>

<CollectionsGrid
	defaultEmptyDescription="У вас пока нет коллекций"
	onSearch={searchCollections}
	collections={collections.items}
	cursor={collections.cursor}
	onLoadMore={loadCollections}
></CollectionsGrid>
