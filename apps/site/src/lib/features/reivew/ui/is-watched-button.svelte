<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { makeClient } from '$lib/shared/utils';
	import type { ReviewDto } from '@repo/api/dtos';
	import { IconCheck } from '@tabler/icons-svelte';

	type Props = {
		reviewId: ReviewDto['id'];
		isWatched: boolean;
		onIsWatchedChange: (isWatched: boolean) => void;
	};

	const { reviewId, isWatched, onIsWatchedChange }: Props = $props();

	let isLoading = $state(false);

	async function toggleIsWatched() {
		const api = makeClient(fetch);

		isLoading = true;
		const response = await api.reviews[':reviewId'].$patch({
			param: { reviewId: reviewId.toString() },
			json: {
				isWatched: !isWatched
			}
		});
		isLoading = false;

		if (response.ok) {
			onIsWatchedChange(!isWatched);
		} else {
			const { error } = await response.json();

			if (error === 'ALREADY_WATCHED') {
				onIsWatchedChange(true);
			} else if (error === 'NOT_WATCHED') {
				onIsWatchedChange(false);
			}
		}
	}
</script>

<Button
	onclick={toggleIsWatched}
	{isLoading}
	variant={isWatched ? 'default' : 'outline'}
	size="icon"><IconCheck /></Button
>
