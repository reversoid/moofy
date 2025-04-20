<script lang="ts">
	import { CollectionsGrid } from '$lib/widgets/collections-grid';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

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
</script>

<CollectionsGrid
	defaultEmptyDescription=""
	onSearch={async (v) => {
		specialCollectionsSearch = v;
	}}
	collections={specialCollections}
/>
