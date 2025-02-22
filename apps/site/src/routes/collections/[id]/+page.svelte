<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { BookmarkCollection, EditCollection, LikeCollection } from '$lib/features/collection';
	import { CreateReview } from '$lib/features/reivew';
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { handleResponse, makeClient } from '$lib/utils';
	import { ReviewsList } from '$lib/widgets/reviews-list';
	import { dayjs } from '@repo/core/sdk';
	import { IconBookmark, IconHeart } from '@tabler/icons-svelte';
	import type { PageProps } from './$types';
	import type { CollectionDto, ReviewDto } from '@repo/api/dtos';
	import { PrivateTooltip } from '$lib/entities/collection';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();

	let collection = $state(data.collection);
	let reviews = $state(data.reviews);
	let socials = $state(data.socials);

	const isOwner = $derived(collection.creator.id === data.user?.id);

	const formattedUpdatedAt = $derived(dayjs(collection.updatedAt).format('DD.MM.YYYY'));

	// TODO maybe loadMoreLogic should be in the widget?
	// loadMoreReview will just return promise with new data,
	// and we will update the state in the widget
	async function loadMoreReviews(cursor?: string) {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].reviews
			.$get({
				param: { collectionId: String(data.collection.id) },
				query: { cursor, limit: '20' }
			})
			.then(handleResponse);

		const { reviews: newReviews } = response.unwrap();
		reviews.items = [...reviews.items, ...newReviews.items];
		reviews.cursor = newReviews.cursor;
	}

	async function searchReviews(search: string) {
		if (!search) {
			await loadMoreReviews();
		}

		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].reviews
			.$get({
				param: { collectionId: String(data.collection.id) },
				query: { search, limit: '20' }
			})
			.then(handleResponse);

		const { reviews: newReviews } = response.unwrap();
		reviews = newReviews;
	}

	function handleReviewCreated(review: ReviewDto) {
		reviews.items = [review, ...reviews.items];
	}

	function handleCollectionUpdated(updatedCollection: CollectionDto) {
		collection = updatedCollection;
	}

	function handleCollectionDeleted() {
		goto('/welcome/collections');
	}
</script>

<svelte:head>
	<title>{collection.name} | Moofy</title>
</svelte:head>

<Wrapper>
	<Heading>{collection.name}</Heading>

	<div
		class="mt-6 grid grid-cols-[4fr_1fr] gap-2 max-xl:grid-cols-[3fr_1fr] max-lg:grid-cols-[2fr_1fr] max-md:grid-cols-1"
	>
		<Card.Root>
			<Card.Header>
				<Card.Title>Описание</Card.Title>
			</Card.Header>

			<Card.Content>
				<p>{collection.description || 'Описание отсутствует'}</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center justify-between">
					<Card.Title>О коллекции</Card.Title>
					{#if !collection.isPublic}
						<PrivateTooltip />
					{/if}
				</div>
			</Card.Header>

			<Card.Content>
				<ul class="flex flex-col gap-1">
					<li>
						Создатель: <Link href="/profiles/{collection.creator.username}"
							>{collection.creator.username}</Link
						>
					</li>

					<li>Обновлено: {formattedUpdatedAt}</li>
				</ul>

				<div class="mt-3 flex flex-col gap-2">
					<div class="flex gap-2">
						<LikeCollection
							likesAmount={socials.likesAmount}
							isLiked={socials.isLiked}
							collectionId={collection.id}
						/>

						<BookmarkCollection isBookmarked={socials.isFavorited} collectionId={collection.id} />
					</div>

					{#if isOwner}
						<EditCollection
							{collection}
							onCollectionUpdated={handleCollectionUpdated}
							onCollectionDeleted={handleCollectionDeleted}
						/>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="mt-6 flex items-center justify-between gap-4">
		<Heading type="h2">Обзоры</Heading>

		{#if isOwner}
			<CreateReview collectionId={collection.id} onReviewCreated={handleReviewCreated} />
		{/if}
	</div>

	<div class="mt-4">
		<ReviewsList
			bind:reviews={reviews.items}
			canEdit={isOwner}
			cursor={reviews.cursor}
			onLoadMore={loadMoreReviews}
			onSearch={searchReviews}
			defaultEmptyDescription={isOwner
				? 'Вы можете добавить обзор в эту коллекцию'
				: 'Эта коллекция пуста'}
		/>
	</div>
</Wrapper>
