<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { CollectionCard } from '$lib/entities/collection';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import Search from '$lib/ui/search.svelte';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconPercentage0 } from '@tabler/icons-svelte';
	import type { Snippet } from 'svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		disableAutoLoad?: boolean;
		collections: (CollectionDto & { isPersonal?: boolean })[];
		cursor?: string | null;
		firstCard?: Snippet;
		onLoadMore?: (cursor: string) => Promise<void>;
		onSearch?: (search: string) => Promise<void>;
		defaultEmptyDescription: string;
	}

	const {
		collections,
		firstCard,
		disableAutoLoad = false,
		onLoadMore,
		onSearch,
		cursor,
		defaultEmptyDescription
	}: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		try {
			isLoading = true;
			await onLoadMore?.(cursor);
		} finally {
			isLoading = false;
		}
	}

	let isSearch = $state(false);
	async function handleSearch(search: string) {
		await onSearch?.(search);
		isSearch = Boolean(search);
	}

	let placholderDescription = $derived(
		`${isSearch ? 'Попробуйте изменить параметры поиска' : defaultEmptyDescription}`
	);
</script>

<div class="@container flex flex-col gap-4">
	<Search onSearch={handleSearch} />

	{#if collections.length === 0}
		<div>
			<Alert.Root>
				<IconPercentage0 size={20} />
				<Alert.Title>Коллекции не найдены</Alert.Title>
				<Alert.Description>{placholderDescription}</Alert.Description>
			</Alert.Root>
		</div>
	{/if}

	<div class="@5xl:grid-cols-4 @3xl:grid-cols-3 @xl:grid-cols-2 @xl:gap-4 grid grid-cols-1 gap-2">
		{#if !isSearch}
			{@render firstCard?.()}
		{/if}

		{#each collections as collection (collection.id)}
			<div animate:flip={{ duration: 350 }}>
				<CollectionCard {collection} isPersonal={collection.isPersonal} />
			</div>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {isLoading} onLoadMore={onLoadMoreWithLoading} {cursor} {disableAutoLoad} />
	{/if}
</div>
