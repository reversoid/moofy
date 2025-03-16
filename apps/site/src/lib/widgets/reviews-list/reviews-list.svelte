<script lang="ts">
	import { ReviewCard } from '$lib/entities/review-card';
	import { EditReview } from '$lib/features/reivew';
	import LoadMoreButton from '$lib/ui/load-more-button.svelte';
	import Search from '$lib/ui/search.svelte';
	import type { ReviewDto, TagDto } from '@repo/api/dtos';
	import * as Alert from '$lib/components/ui/alert';
	import { IconPercentage0 } from '@tabler/icons-svelte';
	import { flip } from 'svelte/animate';

	interface Props {
		reviews: ReviewDto[];
		tags: TagDto[];
		cursor?: string | null;
		onSearch?: (search: string) => Promise<void>;
		onLoadMore?: (cursor: string) => Promise<void>;
		defaultEmptyDescription: string;
		canEdit?: boolean;
	}

	let {
		reviews = $bindable(),
		cursor,
		onLoadMore,
		onSearch,
		defaultEmptyDescription,
		canEdit,
		tags
	}: Props = $props();

	let isLoading = $state(false);

	async function onLoadMoreWithLoading(cursor: string) {
		isLoading = true;
		await onLoadMore?.(cursor);
		isLoading = false;
	}

	let isSearch = $state(false);
	async function handleSearch(search: string) {
		await onSearch?.(search);
		isSearch = Boolean(search);
	}

	let emptyDescription = $derived(
		`${isSearch ? 'Попробуйте изменить параметры поиска' : defaultEmptyDescription}`
	);

	function handleReviewUpdated(review: ReviewDto) {
		reviews = [review, ...reviews.filter((r) => r.id !== review.id)];
	}

	function handleReviewDeleted(reviewId: ReviewDto['id']) {
		reviews = reviews.filter((r) => r.id !== reviewId);
	}
</script>

<div class="flex flex-col gap-4">
	<Search onSearch={handleSearch} />

	{#if reviews.length === 0}
		<div>
			<Alert.Root>
				<IconPercentage0 size={20} />
				<Alert.Title>Обзоров не найдено</Alert.Title>
				<Alert.Description>{emptyDescription}</Alert.Description>
			</Alert.Root>
		</div>
	{/if}

	<div class="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
		{#each reviews as review (review.id)}
			<div animate:flip={{ duration: 350 }}>
				<ReviewCard {review}>
					{#snippet actions()}
						{#if canEdit}
							<EditReview
								{tags}
								existingReview={review}
								onReviewUpdated={handleReviewUpdated}
								onReviewDeleted={handleReviewDeleted}
							/>
						{/if}
					{/snippet}
				</ReviewCard>
			</div>
		{/each}
	</div>

	{#if cursor}
		<LoadMoreButton {cursor} {isLoading} onLoadMore={onLoadMoreWithLoading} />
	{/if}
</div>
