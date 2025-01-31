<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { ReviewCard } from '$lib/entities/review-card';
	import { EditReview } from '$lib/features/reivew';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import Search from '$lib/ui/search.svelte';
	import type { ReviewDto } from '@repo/api/dtos';

	interface Props {
		reviews: ReviewDto[];
		cursor?: string | null;
		onSearch?: (search: string) => Promise<void>;
		onLoadMore?: (cursor: string) => Promise<void>;
	}

	const { reviews, cursor, onLoadMore, onSearch }: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}
</script>

<div class="flex flex-col gap-4">
	<Search {onSearch} />

	<div class="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
		{#each reviews as review (review.id)}
			<ReviewCard {review}>
				{#snippet actions()}
					<EditReview />
				{/snippet}
			</ReviewCard>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {cursor} {isLoading} onLoadMore={onLoadMoreWithLoading} />
	{/if}
</div>
