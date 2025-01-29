<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { CollectionCard } from '$lib/entities/collection-card';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import type { PaginatedData } from '$lib/utils/types';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconSearch } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import { flip } from 'svelte/animate';
	import debounce from 'lodash.debounce';
	import type { FormEventHandler } from 'svelte/elements';

	interface Props {
		disableAutoLoad?: boolean;
		collections: PaginatedData<CollectionDto>;
		firstCard?: Snippet;
		onLoadMore?: (cursor: string) => Promise<void>;
		onSearch?: (search: string) => Promise<void>;
	}

	const { collections, firstCard, disableAutoLoad = false, onLoadMore, onSearch }: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}

	const handleInput = debounce((e: Parameters<FormEventHandler<HTMLInputElement>>[0]) => {
		onSearch?.((e.target as HTMLInputElement).value);
	}, 300);
</script>

<div class="@container flex flex-col gap-4">
	<Input placeholder="Поиск" oninput={handleInput}>
		{#snippet inputPrefix()}
			<IconSearch size={20} />
		{/snippet}
	</Input>

	<!-- TODO make responsive by min width, not max-width 
	 -->
	<div class="@5xl:grid-cols-4 @xl:grid-cols-3 @xl:gap-4 @md:grid-cols-2 grid grid-cols-1 gap-2">
		{@render firstCard?.()}

		{#each collections.items as collection (collection.id)}
			<div animate:flip={{ duration: 350 }}>
				<CollectionCard
					id={collection.id}
					name={collection.name}
					description={collection.description}
					imageUrl={collection.imageUrl}
				/>
			</div>
		{/each}
	</div>

	{#if collections.cursor}
		<LoadMoreButton
			{isLoading}
			onLoadMore={onLoadMoreWithLoading}
			cursor={collections.cursor}
			{disableAutoLoad}
		/>
	{/if}
</div>
