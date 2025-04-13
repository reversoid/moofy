<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { makeClient } from '$lib/shared/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-svelte';

	interface Props {
		isBookmarked: boolean;
		collectionId: CollectionDto['id'];
		disabled?: boolean;
	}

	const { isBookmarked: isInitialBookmarked, collectionId, disabled = false }: Props = $props();

	let isBookmarked = $state(isInitialBookmarked);
	let isLoading = $state(false);
	const api = makeClient(fetch);

	async function bookmarkCollection() {
		const result = await api.favorites[':collectionId'].$put({
			param: { collectionId: String(collectionId) }
		});

		if (!result.ok) {
			const { error } = await result.json();
			if (error === 'COLLECTION_ALREADY_FAVORITED') {
				isBookmarked = true;
			}
			return;
		}

		isBookmarked = true;
	}

	async function unbookmarkCollection() {
		const result = await api.favorites[':collectionId'].$delete({
			param: { collectionId: String(collectionId) }
		});

		if (!result.ok) {
			const { error } = await result.json();
			if (error === 'COLLECTION_NOT_FAVORITED') {
				isBookmarked = false;
			}
			return;
		}

		isBookmarked = false;
	}

	async function handleClick() {
		isLoading = true;
		if (isBookmarked) {
			await unbookmarkCollection();
		} else {
			await bookmarkCollection();
		}
		isLoading = false;
	}
</script>

<Button {disabled} {isLoading} variant="outline" class="flex-grow" onclick={handleClick}>
	{#if isBookmarked}
		<IconBookmarkFilled />
	{:else}
		<IconBookmark />
	{/if}
</Button>
