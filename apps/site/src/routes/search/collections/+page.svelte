<script lang="ts">
	import { makeClient } from '$lib/utils';
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let collections = $state(data.collections);

	async function searchCollections(search: string) {
		const api = makeClient(fetch);

		const response = await api.collections.$get({ query: { search } });

		if (!response.ok) {
			return;
		}

		const { collections: newCollections } = await response.json();

		collections = newCollections;
	}
</script>

<CollectionsGrid
	{collections}
	onSearch={searchCollections}
	defaultEmptyDescription="Коллекций не найдено"
/>
