<script lang="ts">
	import { CreateCollectionCard } from '$lib/features/collection';
	import { makeClient } from '$lib/shared/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { CollectionDto } from '@repo/api/dtos';
	import type { PageProps } from './$types';
	import Heading from '$lib/shared/ui/heading.svelte';

	let { data }: PageProps = $props();

	let specialCollectionsSearch = $state('');
	// TODO can the name be better? Is it possible to make a shared name builder for personalCollection?
	// TODO: this is just a copy from profile page, can we make it shared?
	const specialCollections = $derived(
		(data.personalCollection
			? [{ ...data.personalCollection, name: `Обзоры ${data.personalCollection.creator.username}` }]
			: []
		)
			.filter((v) => !!v)
			.filter(
				(c) =>
					c.description
						?.toLocaleLowerCase()
						?.includes(specialCollectionsSearch.toLocaleLowerCase()) ||
					c.name.toLocaleLowerCase().includes(specialCollectionsSearch.toLocaleLowerCase())
			)
	);

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

<Heading class="mb-3" type="h2">Особые коллекции</Heading>

<CollectionsGrid
	defaultEmptyDescription=""
	onSearch={async (v) => {
		specialCollectionsSearch = v;
	}}
	collections={specialCollections}
/>

<Heading class="mb-3 mt-4" type="h2">Коллекции</Heading>

<CollectionsGrid
	defaultEmptyDescription="У вас пока нет коллекций"
	onSearch={searchCollections}
	collections={collections.items}
	cursor={collections.cursor}
	onLoadMore={loadCollections}
>
	{#snippet firstCard()}
		<div class="h-full max-sm:col-span-full">
			<CreateCollectionCard onCollectionCreated={addCollection} />
		</div>
	{/snippet}
</CollectionsGrid>
