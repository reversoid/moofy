<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { handleResponse, makeClient } from '$lib/utils';
	import type { CollectionDto } from '@repo/api/dtos';
	import { IconHeart, IconHeartFilled } from '@tabler/icons-svelte';

	interface Props {
		likesAmount: number;
		isLiked: boolean;
		collectionId: CollectionDto['id'];
	}

	const {
		likesAmount: initialLikesAmount,
		isLiked: isInitialLiked,
		collectionId
	}: Props = $props();

	let isLiked = $state(isInitialLiked);
	let isLoading = $state(false);
	let likesAmount = $state(initialLikesAmount);

	const api = makeClient(fetch);

	async function likeCollection() {
		const result = await api.collections[':collectionId'].likes
			.$put({
				param: { collectionId: String(collectionId) }
			})
			.then(handleResponse);

		if (result.isErr()) {
			const err = result.unwrapErr();
			if (err.error === 'ALREADY_LIKED') {
				isLiked = true;
			}
			return;
		}

		likesAmount++;
		isLiked = true;
	}

	async function unlikeCollection() {
		const result = await api.collections[':collectionId'].likes
			.$delete({
				param: { collectionId: String(collectionId) }
			})
			.then(handleResponse);

		if (result.isErr()) {
			const err = result.unwrapErr();
			if (err.error === 'NOT_LIKED') {
				isLiked = false;
			}
			return;
		}

		likesAmount--;
		isLiked = false;
	}

	async function handleClick() {
		isLoading = true;
		if (isLiked) {
			await unlikeCollection();
		} else {
			await likeCollection();
		}
		isLoading = false;
	}
</script>

<Button {isLoading} variant="outline" class="flex-grow" onclick={handleClick}>
	{#if isLiked}
		<IconHeartFilled />
	{:else}
		<IconHeart />
	{/if}
	<span>{likesAmount}</span>
</Button>
