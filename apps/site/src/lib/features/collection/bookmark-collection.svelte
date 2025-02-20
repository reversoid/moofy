<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { handleResponse, makeClient } from '$lib/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconBookmark } from '@tabler/icons-svelte';

	interface Props {
		isBookmarked: boolean;
		collectionId: CollectionDto['id'];
	}

	const { isBookmarked: isInitialBookmarked, collectionId }: Props = $props();

	let isBookmarked = $state(isInitialBookmarked);
	let isLoading = $state(false);
	const api = makeClient(fetch);

	async function bookmarkCollection() {
		const result = await api.favorites[':collectionId']
			.$put({
				param: { collectionId: String(collectionId) }
			})
			.then(handleResponse);

		if (result.isErr()) {
			const err = result.unwrapErr();
			if (err.error === 'COLLECTION_ALREADY_FAVORITED') {
				isBookmarked = true;
			}
			return;
		}

		isBookmarked = true;
	}

	async function unbookmarkCollection() {
		const result = await api.favorites[':collectionId']
			.$delete({
				param: { collectionId: String(collectionId) }
			})
			.then(handleResponse);

		if (result.isErr()) {
			const err = result.unwrapErr();
			if (err.error === 'COLLECTION_NOT_FAVORITED') {
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

<Button
	{isLoading}
	class="flex-grow"
	variant={isBookmarked ? 'default' : 'outline'}
	onclick={handleClick}
>
	<IconBookmark />
</Button>
