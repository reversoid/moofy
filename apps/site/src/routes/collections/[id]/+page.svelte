<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import { PrivateTooltip } from '$lib/entities/collection';
	import Tag from '$lib/entities/Tag/tag.svelte';
	import { BookmarkCollection, EditCollection, LikeCollection } from '$lib/features/collection';
	import { CreateReview } from '$lib/features/reivew';
	import { globalState } from '$lib/state/state.svelte';
	import Heading from '$lib/ui/heading.svelte';
	import Link from '$lib/ui/link.svelte';
	import Wrapper from '$lib/ui/wrapper.svelte';
	import { makeClient } from '$lib/utils';
	import { ReviewsList } from '$lib/widgets/reviews-list';
	import type { CollectionDto, ReviewDto } from '@repo/api/dtos';
	import { dayjs } from '@repo/core/sdk';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let collection = $state(data.collection);
	let reviews = $state(data.reviews);
	let socials = $state(data.socials);
	let tags = $state(data.tags);

	const isOwner = $derived(collection.creator.id === data.user?.id);

	const formattedUpdatedAt = $derived(dayjs(collection.updatedAt).format('DD.MM.YYYY'));

	// TODO maybe loadMoreLogic should be in the widget?
	// loadMoreReview will just return promise with new data,
	// and we will update the state in the widget
	async function loadMoreReviews(cursor?: string) {
		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].reviews.$get({
			param: { collectionId: String(data.collection.id) },
			query: { cursor, limit: '20' }
		});

		if (!response.ok) {
			return;
		}

		const { reviews: newReviews } = await response.json();
		reviews.items = [...reviews.items, ...newReviews.items];
		reviews.cursor = newReviews.cursor;
	}

	async function searchReviews(search: string) {
		if (!search) {
			await loadMoreReviews();
		}

		const api = makeClient(fetch);
		const response = await api.collections[':collectionId'].reviews.$get({
			param: { collectionId: String(data.collection.id) },
			query: { search, limit: '20' }
		});

		if (!response.ok) {
			return;
		}

		const { reviews: newReviews } = await response.json();
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

	const currentUser = globalState.currentUser;

	onMount(() => {
		const api = makeClient(fetch);
		void api.collections[':collectionId'].views.$post({
			param: { collectionId: String(collection.id) }
		});
	});
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

			<Card.Content class="flex grow flex-col justify-between gap-4">
				{#if collection.description}
					<p>{collection.description.trim()}</p>
				{:else}
					<p class="text-muted-foreground">Описание отсутствует</p>
				{/if}

				<div class="flex items-center gap-4">
					<div class="flex flex-row gap-2">
						{#each data.tags as tag}
							<Tag {tag} />
						{/each}
					</div>
				</div>
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
							disabled={!currentUser}
							likesAmount={socials.likesAmount}
							isLiked={socials.isLiked}
							collectionId={collection.id}
						/>

						<BookmarkCollection
							disabled={!currentUser}
							isBookmarked={socials.isFavorited}
							collectionId={collection.id}
						/>
					</div>

					{#if isOwner}
						<EditCollection
							bind:tags
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
			{tags}
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
