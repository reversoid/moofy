<script lang="ts">
	import { CollectionCard } from '$lib/entities/collection-card';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import Search from '$lib/ui/search.svelte';
	import type { CollectionDto } from '@repo/api/dtos';
	import type { Snippet } from 'svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		disableAutoLoad?: boolean;
		collections: CollectionDto[];
		cursor?: string | null;
		firstCard?: Snippet;
		onLoadMore?: (cursor: string) => Promise<void>;
		onSearch?: (search: string) => Promise<void>;
	}

	const {
		collections,
		firstCard,
		disableAutoLoad = false,
		onLoadMore,
		onSearch,
		cursor
	}: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}
</script>

<div class="@container flex flex-col gap-4">
	<Search {onSearch} />

	<!-- TODO make responsive by min width, not max-width 
	 -->
	<div class="@5xl:grid-cols-4 @xl:grid-cols-3 @xl:gap-4 @md:grid-cols-2 grid grid-cols-1 gap-2">
		{@render firstCard?.()}

		{#each collections as collection (collection.id)}
			<div animate:flip={{ duration: 350 }}>
				<CollectionCard
					id={collection.id}
					name={collection.name}
					description={collection.description}
					imageUrl={collection.imageUrl}
				/>
			</div>
		{:else}
			<!-- TODO add empty state -->
			<div>No collections</div>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {isLoading} onLoadMore={onLoadMoreWithLoading} {cursor} {disableAutoLoad} />
	{/if}
</div>
