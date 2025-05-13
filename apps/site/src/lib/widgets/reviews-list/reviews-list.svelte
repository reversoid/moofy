<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { ReviewCard } from '$lib/entities/review-card';
	import { FilterReviews, type ReviewFilters } from '$lib/features/filter-reviews';
	import { EditReview } from '$lib/features/reivew';
	import LoadMoreButton from '$lib/shared/ui/load-more-button.svelte';
	import Search from '$lib/shared/ui/search.svelte';
	import type { CollectionDto, ReviewDto, TagDto } from '@repo/api/dtos';
	import { IconPercentage0 } from '@tabler/icons-svelte';
	import { flip } from 'svelte/animate';
	import { watch } from 'runed';

	interface Props {
		reviews: ReviewDto[];
		tags: TagDto[];
		cursor?: string | null;
		onFilters?: (props: { filters: ReviewFilters | null; search: string }) => Promise<void>;
		onLoadMore?: (cursor: string) => Promise<void>;
		defaultEmptyDescription: string;
		canEdit?: boolean;
		collection: CollectionDto;
	}

	let {
		reviews = $bindable(),
		cursor,
		onLoadMore,
		onFilters,
		defaultEmptyDescription,
		canEdit,
		tags,
		collection
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
	let areFiltersApplied = $state(false);
	let filters = $state<ReviewFilters | null>(null);
	let search = $state<string>('');

	watch(
		() => [search, filters],
		() => {
			void onFilters?.({ search, filters }).then(() => {
				isSearch = Boolean(search);
				areFiltersApplied = !Boolean(
					Object.values(filters ?? {})
						.filter(Boolean)
						.every((v) => {
							return v.length === 0;
						})
				);
			});
		},
		{ lazy: true }
	);

	async function handleSearch(newSearch: string) {
		search = newSearch;
	}

	async function handleFiltersApplied(newFilters: ReviewFilters | null) {
		filters = newFilters;
	}

	let emptyDescription = $derived(
		`${isSearch ? 'Попробуйте изменить параметры поиска' : defaultEmptyDescription}`
	);

	function handleReviewUpdated(review: ReviewDto) {
		const index = reviews.findIndex((item) => review.id === item.id);
		if (index === -1) {
			return;
		}

		reviews[index] = review;
	}

	function handleReviewDeleted(reviewId: ReviewDto['id']) {
		reviews = reviews.filter((r) => r.id !== reviewId);
	}

	function handleReviewMovedTop(id: ReviewDto['id']) {
		const index = reviews.findIndex((r) => r.id === id);

		if (index === -1) {
			return;
		}

		const [movedReview] = reviews.splice(index, 1);

		reviews.unshift(movedReview);
	}

	let emptyCollection = $derived(!isSearch && !areFiltersApplied && reviews.length === 0);
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-2">
		<Search onSearch={handleSearch} />
		{#if !emptyCollection}
			<FilterReviews
				{tags}
				{areFiltersApplied}
				onFiltersApplied={handleFiltersApplied}
				{collection}
			/>
		{/if}
	</div>

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
		{#each reviews as review, index (review.id)}
			<div animate:flip={{ duration: 350 }}>
				<ReviewCard {review}>
					{#snippet actions()}
						{#if canEdit}
							<EditReview
								{tags}
								bind:existingReview={reviews[index]}
								onReviewUpdated={handleReviewUpdated}
								onReviewDeleted={handleReviewDeleted}
								onMoveTop={handleReviewMovedTop}
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
